/** Languages the UI can speak (source languages). */
export type UiLang = "ru" | "en";

/** All languages that exist in the vocab bank. */
export type LangCode = "ru" | "en" | "es" | "de";

export interface Course {
  /** language the user speaks — the whole UI runs in it */
  from: UiLang;
  /** language the user is learning */
  to: LangCode;
}

export type Species = "goose" | "cat" | "capybara" | "frog";

export interface Profile {
  name: string;
  species: Species;
  color: string;
}

export interface Progress {
  xp: number;
  hearts: number;
  streak: number;
  /** yyyy-mm-dd of the last day a lesson was finished */
  lastDay: string | null;
  /** lessonId -> best score in percent */
  completed: Record<string, number>;
  examPassed: boolean;
}

export interface Settings {
  sound: boolean;
}

export interface SaveState {
  course: Course | null;
  profile: Profile | null;
  progress: Progress;
  settings: Settings;
}

export type QuestionKind = "toSource" | "toTarget" | "emoji";

export interface Question {
  kind: QuestionKind;
  /** what is shown in the prompt (word or emoji) */
  prompt: string;
  /** emoji hint shown next to word prompts */
  promptEmoji?: string;
  options: string[];
  correctIndex: number;
}

export interface LessonRef {
  unitIndex: number;
  lessonIndex: number;
}

export const MAX_HEARTS = 5;
