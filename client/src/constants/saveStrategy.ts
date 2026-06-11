
export interface SaveStrategy {
  readonly immediateTriggers: ReadonlyArray<string>;
  readonly debounceMs: number;
  shouldSaveImmediately: (value: string) => boolean;
}

export const DEFAULT_SAVE_STRATEGY: SaveStrategy = {
  immediateTriggers: [' ', '\n', '.', ',', ';', '(', '{', '['],
  debounceMs: 800,

  shouldSaveImmediately(value: string): boolean {
    const lastChar = value.slice(-1);
    return this.immediateTriggers.includes(lastChar);
  },
};
