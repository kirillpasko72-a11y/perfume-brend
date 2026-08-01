import { useRef, useState } from "react";
import { Scene } from "../../three/Scene";
import { CharacterModel, type Mood } from "../../three/CharacterModel";
import { lessonId } from "../../data/course";
import { LESSONS_PER_UNIT, UNITS } from "../../data/vocab";
import { memeOfTheDay } from "../../data/memes";
import { t } from "../../i18n";
import type { LessonRef, Profile, Progress, UiLang } from "../../types";
import type { SoundName } from "../../hooks/useSound";
import "./Dashboard.css";

interface Props {
  lang: UiLang;
  profile: Profile;
  progress: Progress;
  onStartLesson: (ref: LessonRef) => void;
  onStartExam: () => void;
  onReset: () => void;
  onSound: (name: SoundName) => void;
  onSkipPrank: () => void;
}

const RANKS: Record<UiLang, [number, string][]> = {
  ru: [
    [0, "Личинка полиглота"],
    [100, "Держатель словаря"],
    [250, "Гроза голубей"],
    [500, "Мемный магистр"],
    [1000, "Сенсей гуся"],
  ],
  en: [
    [0, "Polyglot larva"],
    [100, "Dictionary holder"],
    [250, "Pigeon menace"],
    [500, "Meme magister"],
    [1000, "Goose sensei"],
  ],
};

function rankFor(lang: UiLang, xp: number): string {
  const list = RANKS[lang];
  let current = list[0][1];
  for (const [threshold, title] of list) {
    if (xp >= threshold) current = title;
  }
  return current;
}

export function Dashboard({
  lang,
  profile,
  progress,
  onStartLesson,
  onStartExam,
  onReset,
  onSound,
  onSkipPrank,
}: Props) {
  const meme = memeOfTheDay(lang);
  const [mood, setMood] = useState<Mood>("idle");
  const [skipOffset, setSkipOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const skipTries = useRef(0);

  const totalLessons = UNITS.length * LESSONS_PER_UNIT;
  const doneCount = Object.keys(progress.completed).length;
  const allDone = doneCount >= totalLessons;

  const isDone = (u: number, l: number) =>
    progress.completed[lessonId(u, l)] !== undefined;
  const isUnlocked = (u: number, l: number) => {
    if (u === 0 && l === 0) return true;
    const prev = l === 0 ? { u: u - 1, l: LESSONS_PER_UNIT - 1 } : { u, l: l - 1 };
    return isDone(prev.u, prev.l);
  };

  const runAway = () => {
    skipTries.current += 1;
    onSound("click");
    if (skipTries.current >= 3) {
      skipTries.current = 0;
      setSkipOffset({ x: 0, y: 0 });
      onSkipPrank();
      return;
    }
    setSkipOffset({
      x: Math.round((Math.random() - 0.5) * 220),
      y: Math.round((Math.random() - 0.5) * 90),
    });
  };

  const poke = () => {
    onSound("correct");
    setMood("happy");
    window.setTimeout(() => setMood("idle"), 1600);
  };

  return (
    <div className="dash">
      <div className="dash__grid">
        {/* left column: player card + meme of the day */}
        <aside className="dash__side">
          <div className="card dash__player">
            <button className="dash__player-scene" onClick={poke} type="button">
              <Scene fallbackEmoji="🪿" cameraZ={3.2}>
                <CharacterModel
                  species={profile.species}
                  color={profile.color}
                  mood={mood}
                  scale={1.15}
                />
              </Scene>
            </button>
            <div className="dash__player-name">{profile.name}</div>
            <div className="dash__player-rank">{rankFor(lang, progress.xp)}</div>
          </div>

          <div className="card dash__meme">
            <div className="dash__meme-title">{t(lang, "memeOfDay")}</div>
            <div className="dash__meme-emoji">{meme.emoji}</div>
            <div className="meme-caption dash__meme-top">{meme.top}</div>
            <div className="meme-caption dash__meme-bottom">{meme.bottom}</div>
          </div>

          <div className="dash__prank">
            <button
              className="btn btn--ghost dash__skip"
              style={{ transform: `translate(${skipOffset.x}px, ${skipOffset.y}px)` }}
              onMouseEnter={runAway}
              onClick={runAway}
            >
              {t(lang, "skip")} 🏃
            </button>
          </div>
        </aside>

        {/* right column: the path */}
        <main className="dash__path-col">
          <h1 className="dash__title">{t(lang, "yourPath")}</h1>
          <p className="dash__subtitle">{t(lang, "progressSaved")}</p>

          {UNITS.map((unit, u) => (
            <section key={unit.id} className="dash__unit">
              <div className="dash__unit-header">
                <span className="dash__unit-icon">{unit.icon}</span>
                <div>
                  <div className="dash__unit-kicker">
                    {t(lang, "unit")} {u + 1}
                  </div>
                  <div className="dash__unit-name">{unit.title[lang]}</div>
                </div>
                <div className="dash__unit-progress">
                  {Array.from({ length: LESSONS_PER_UNIT }).filter((_, l) =>
                    isDone(u, l)
                  ).length}
                  /{LESSONS_PER_UNIT}
                </div>
              </div>

              <div className="dash__nodes">
                {Array.from({ length: LESSONS_PER_UNIT }).map((_, l) => {
                  const done = isDone(u, l);
                  const unlocked = isUnlocked(u, l);
                  const current = unlocked && !done;
                  return (
                    <div className="dash__node-row" key={l} data-side={l % 2}>
                      <button
                        className={[
                          "dash__node",
                          done && "dash__node--done",
                          current && "dash__node--current",
                          !unlocked && "dash__node--locked",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        disabled={!unlocked}
                        onClick={() => onStartLesson({ unitIndex: u, lessonIndex: l })}
                      >
                        {done ? "⭐" : unlocked ? unit.icon : "🔒"}
                      </button>
                      <span className="dash__node-label">
                        {t(lang, "lesson")} {l + 1}
                        {done && (
                          <em> · {progress.completed[lessonId(u, l)]}%</em>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* exam node */}
          <section className="dash__exam card">
            <div className="dash__exam-emoji">{progress.examPassed ? "🏆" : "💀"}</div>
            <div className="dash__exam-copy">
              <div className="dash__exam-title">{t(lang, "exam")}</div>
              <p className="dash__exam-text">
                {allDone ? t(lang, "examWarning") : t(lang, "examLocked")}
              </p>
            </div>
            <button
              className="btn btn--red dash__exam-btn"
              disabled={!allDone}
              onClick={onStartExam}
            >
              {t(lang, "examTake")} ⚡
            </button>
          </section>

          <footer className="dash__footer">
            <p>{t(lang, "footerJoke")}</p>
            <button
              className="dash__reset"
              onClick={() => {
                if (window.confirm(t(lang, "resetConfirm"))) onReset();
              }}
            >
              {t(lang, "reset")}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
