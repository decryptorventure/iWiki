// localStorage persistence for app state

const STORAGE_KEY = 'iwiki_state';

/** Load persisted state slice from localStorage */
export function loadState<T extends object>(): Partial<T> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Partial<T>;
  } catch {
    // ignore parse errors
  }
  return {};
}

/** Persist selected state fields to localStorage on every state change */
export function saveState(state: object): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
