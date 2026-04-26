import type { Drop } from "../shared/types.ts";

/** Lazy-loaded drop registry. Add new drops here. */
const registry: Record<string, () => Promise<Drop>> = {
  "001-acid-techno": () =>
    import("./001-acid-techno/index.ts").then((m) => m.default),
};

export function getDropIds(): string[] {
  return Object.keys(registry);
}

export async function loadDrop(id: string): Promise<Drop> {
  const loader = registry[id];
  if (!loader) throw new Error(`Unknown drop: ${id}`);
  return loader();
}
