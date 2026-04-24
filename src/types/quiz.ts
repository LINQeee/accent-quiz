export type Page = "quiz" | "stats";

export interface PreparedWord {
  raw: string;
  text: string;
  chars: string[];
  vowelPositions: number[];
  stressCharIndex: number;
}

export interface Answer {
  word: string;
  ok: boolean;
}

export interface WordStats {
  attempts: number;
  correct: number;
  wrong: number;
}

export type StoredStats = Record<string, WordStats>;
