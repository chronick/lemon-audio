export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  platform: string;
  repo: string;
  asset: string;
  controls: {
    knobs?: string[];
    cv?: string[];
    gate?: string[];
    audio?: string[];
  };
}

export interface FirmwareEntry extends CatalogEntry {
  version: string;
  tag: string;
  downloadUrl: string;
}

export async function resolveRelease(
  entry: CatalogEntry
): Promise<FirmwareEntry | null> {
  try {
    const resp = await fetch(
      `https://api.github.com/repos/${entry.repo}/releases/latest`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );
    if (!resp.ok) return null;

    const release = await resp.json();
    const tag: string = release.tag_name;
    const version = tag.replace(/^v/, "");

    const asset = release.assets.find(
      (a: { name: string }) => a.name === entry.asset
    );
    if (!asset) return null;

    return {
      ...entry,
      version,
      tag,
      downloadUrl: asset.browser_download_url,
    };
  } catch {
    return null;
  }
}

export function allControls(controls: CatalogEntry["controls"]): string[] {
  return [
    ...(controls.knobs ?? []),
    ...(controls.cv ?? []),
    ...(controls.gate ?? []),
    ...(controls.audio ?? []),
  ];
}
