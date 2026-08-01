import type { Course, Question } from "../types";
import {
  EXAM_QUESTIONS,
  LESSONS_PER_UNIT,
  QUESTIONS_PER_LESSON,
  UNITS,
  type VocabEntry,
} from "./vocab";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

/** Words a given lesson teaches: a rolling window over the unit's entries. */
function lessonEntries(unitIndex: number, lessonIndex: number): VocabEntry[] {
  const all = UNITS[unitIndex].entries;
  const perLesson = Math.ceil(all.length / LESSONS_PER_UNIT);
  const fresh = all.slice(lessonIndex * perLesson, (lessonIndex + 1) * perLesson);
  // sprinkle in review words from earlier lessons of the unit
  const review = lessonIndex > 0 ? pick(all.slice(0, lessonIndex * perLesson), 2) : [];
  return [...fresh, ...review];
}

function buildQuestion(
  entry: VocabEntry,
  poolSource: VocabEntry[],
  course: Course
): Question {
  const kinds: Question["kind"][] = ["toSource", "toTarget", "emoji"];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];

  const distractors = pick(
    poolSource.filter((e) => e.id !== entry.id),
    3
  );

  // answer language: source for "toSource", target otherwise
  const answerLang = kind === "toSource" ? course.from : course.to;
  const options = shuffle([
    entry.words[answerLang],
    ...distractors.map((d) => d.words[answerLang]),
  ]);

  return {
    kind,
    prompt:
      kind === "emoji"
        ? entry.emoji
        : kind === "toSource"
          ? entry.words[course.to]
          : entry.words[course.from],
    promptEmoji: kind === "emoji" ? undefined : entry.emoji,
    options,
    correctIndex: options.indexOf(entry.words[answerLang]),
  };
}

export function buildLesson(
  course: Course,
  unitIndex: number,
  lessonIndex: number
): Question[] {
  const entries = lessonEntries(unitIndex, lessonIndex);
  const pool = UNITS[unitIndex].entries;
  // cycle through the lesson's words (reshuffled each pass) until the
  // lesson is full — early lessons have fewer words than questions
  const picks: VocabEntry[] = [];
  while (picks.length < QUESTIONS_PER_LESSON) {
    picks.push(
      ...pick(entries, Math.min(entries.length, QUESTIONS_PER_LESSON - picks.length))
    );
  }
  return picks.map((e) => buildQuestion(e, pool, course));
}

export function buildExam(course: Course): Question[] {
  const all = UNITS.flatMap((u) => u.entries);
  return pick(all, EXAM_QUESTIONS).map((e) => buildQuestion(e, all, course));
}

export function lessonId(unitIndex: number, lessonIndex: number): string {
  return `${unitIndex}-${lessonIndex}`;
}
