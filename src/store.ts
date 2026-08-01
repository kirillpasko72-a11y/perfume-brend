import { MAX_HEARTS, type SaveState } from "./types";

const KEY = "lingogoose:v1";

export function defaultState(): SaveState {
  return {
    course: null,
    profile: null,
    progress: {
      xp: 0,
      hearts: MAX_HEARTS,
      streak: 0,
      lastDay: null,
      completed: {},
      examPassed: false,
    },
    settings: { sound: true },
  };
}

export function loadState(): SaveState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<SaveState>;
    const base = defaultState();
    return {
      course: parsed.course ?? base.course,
      profile: parsed.profile ?? base.profile,
      progress: { ...base.progress, ...parsed.progress },
      settings: { ...base.settings, ...parsed.settings },
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state: SaveState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full/blocked — the goose forgives, the session continues
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterday(): string {
  return new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
}
