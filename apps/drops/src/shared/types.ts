/** Metadata for a single Lemon Drop */
export interface DropMeta {
  id: string;
  number: number;
  title: string;
  genre: string;
  description: string;
  color: string; // primary accent hex
  date: string; // YYYY-MM-DD
}

/** Interface every drop module must export */
export interface Drop {
  meta: DropMeta;
  /** Mount the drop UI into the given container */
  mount(container: HTMLElement): void;
  /** Clean up audio nodes, animation frames, event listeners */
  destroy(): void;
}
