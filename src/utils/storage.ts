import type { StoredStats } from "../types/quiz";

export const STORAGE_KEY = "accent-quiz-stats-v1";

export function loadStoredStats(): StoredStats {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed as StoredStats : {};
  } catch {
    return {};
  }
}

export function saveStoredStats(stats: StoredStats): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // localStorage может быть недоступен в приватном режиме — квиз всё равно работает.
  }
}
