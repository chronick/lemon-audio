/**
 * Preset encode/decode for shareable drop URLs.
 *
 * Each drop's snapshot is JSON-stringified, URL-safe base64 encoded,
 * and stored in `window.location.hash` after the route as `?p=<encoded>`.
 *
 * Format: `#<dropId>?p=<urlsafe-base64-json>`
 */

/** Strip the `?p=...` query portion from a hash to get just the route. */
export function stripPresetQuery(hash: string): string {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  const q = h.indexOf("?");
  return q === -1 ? h : h.slice(0, q);
}

/** Read the preset payload from a URL hash, if present. */
export function readPresetFromHash<T = unknown>(hash: string = window.location.hash): T | null {
  const h = hash.startsWith("#") ? hash.slice(1) : hash;
  const q = h.indexOf("?");
  if (q === -1) return null;

  const params = new URLSearchParams(h.slice(q + 1));
  const raw = params.get("p");
  if (!raw) return null;

  try {
    return JSON.parse(b64UrlDecode(raw)) as T;
  } catch {
    return null;
  }
}

/**
 * Build a fully-qualified shareable URL for a given drop + snapshot.
 * Runtime fields (e.g. currentStep, playing) should be stripped by the
 * caller before passing the snapshot in.
 */
export function buildShareUrl(dropId: string, snapshot: unknown, base: URL = new URL(window.location.href)): string {
  const encoded = b64UrlEncode(JSON.stringify(snapshot));
  const url = new URL(base.toString());
  url.hash = `${dropId}?p=${encoded}`;
  return url.toString();
}

// ── URL-safe base64 ──────────────────────────────────────

function b64UrlEncode(input: string): string {
  // btoa expects Latin-1; encode UTF-8 first
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
