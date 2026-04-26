export async function resolveRelease(entry) {
    try {
        const resp = await fetch(`https://api.github.com/repos/${entry.repo}/releases/latest`, { headers: { Accept: "application/vnd.github.v3+json" } });
        if (!resp.ok)
            return null;
        const release = await resp.json();
        const tag = release.tag_name;
        const version = tag.replace(/^v/, "");
        const asset = release.assets.find((a) => a.name === entry.asset);
        if (!asset)
            return null;
        return {
            ...entry,
            version,
            tag,
            downloadUrl: asset.browser_download_url,
        };
    }
    catch {
        return null;
    }
}
export function allControls(controls) {
    return [
        ...(controls.knobs ?? []),
        ...(controls.cv ?? []),
        ...(controls.gate ?? []),
        ...(controls.audio ?? []),
    ];
}
