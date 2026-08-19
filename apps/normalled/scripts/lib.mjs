// Shared helpers: JSON loading, patch-library discovery, and a small
// JSON Schema (draft 2020-12 subset) validator. Node stdlib only.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const REPO_DIR = resolve(APP_DIR, "..", "..");
export const SCHEMA_PATH = join(APP_DIR, "schema", "normalled.schema.json");
export const RECORDS_DIR = join(APP_DIR, "records");
export const MODULES_JSON = join(APP_DIR, "modules.json");

export const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

export function recordFiles() {
  return readdirSync(RECORDS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(RECORDS_DIR, f));
}

/**
 * Locate the chronick/patch-library checkout holding modules/<slug>/manual.pdf.
 * Never hardcodes a data dir: env var first, then sibling checkouts.
 */
export function findPatchLibrary() {
  const candidates = [
    process.env.NORMALLED_PATCH_LIBRARY,
    join(REPO_DIR, "..", "patch-library"),
    join(REPO_DIR, "..", "..", "patch-library"),
  ].filter(Boolean);
  for (const c of candidates) {
    if (existsSync(join(c, "modules"))) return resolve(c);
  }
  return null;
}

// ---------------------------------------------------------------- validator

function typeOk(value, type) {
  const types = Array.isArray(type) ? type : [type];
  return types.some((t) => {
    if (t === "array") return Array.isArray(value);
    if (t === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
    if (t === "null") return value === null;
    if (t === "integer") return Number.isInteger(value);
    if (t === "number") return typeof value === "number";
    return typeof value === t;
  });
}

function deref(schema, root) {
  if (!schema || !schema.$ref) return schema;
  const ref = schema.$ref;
  if (ref === "#") return root;
  if (!ref.startsWith("#/")) throw new Error(`unsupported $ref: ${ref}`);
  let node = root;
  for (const part of ref.slice(2).split("/")) node = node[part];
  return node;
}

/** Returns an array of human-readable error strings ([] means valid). */
export function validate(value, schema, root = schema, path = "$") {
  const s = deref(schema, root);
  const errors = [];
  const fail = (msg) => errors.push(`${path}: ${msg}`);

  if (s.const !== undefined && value !== s.const) fail(`expected const ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.includes(value)) fail(`expected one of ${s.enum.join(", ")}, got ${JSON.stringify(value)}`);
  if (s.type && !typeOk(value, s.type)) {
    fail(`expected type ${Array.isArray(s.type) ? s.type.join("|") : s.type}`);
    return errors;
  }

  if (typeof value === "string") {
    if (s.pattern && !new RegExp(s.pattern).test(value)) fail(`does not match /${s.pattern}/`);
    if (s.maxLength !== undefined && value.length > s.maxLength) fail(`longer than ${s.maxLength} chars`);
    if (s.minLength !== undefined && value.length < s.minLength) fail(`shorter than ${s.minLength} chars`);
  }
  if (typeof value === "number") {
    if (s.minimum !== undefined && value < s.minimum) fail(`below minimum ${s.minimum}`);
    if (s.maximum !== undefined && value > s.maximum) fail(`above maximum ${s.maximum}`);
  }
  if (Array.isArray(value)) {
    if (s.minItems !== undefined && value.length < s.minItems) fail(`fewer than ${s.minItems} items`);
    if (s.items) value.forEach((v, i) => errors.push(...validate(v, s.items, root, `${path}[${i}]`)));
  }
  if (typeOk(value, "object")) {
    for (const key of s.required || []) {
      if (!(key in value)) fail(`missing required property "${key}"`);
    }
    for (const [key, v] of Object.entries(value)) {
      const sub = s.properties && s.properties[key];
      if (sub) errors.push(...validate(v, sub, root, `${path}.${key}`));
      else if (s.additionalProperties === false) fail(`unexpected property "${key}"`);
    }
  }
  return errors;
}
