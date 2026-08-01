import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildExam, buildLesson } from "../../data/course";
import { EXAM_PASS, EXAM_SECONDS } from "../../data/vocab";
import { memes, randomFrom } from "../../data/memes";
import { t } from "../../i18n";
import { Confetti } from "../../components/Confetti/Confetti";
import { DonkeyOverlay } from "../../components/DonkeyOverlay/DonkeyOverlay";
import type { Course, LessonRef, Question } from "../../types";
import type { SoundName } from "../../hooks/useSound";
import "./LessonScreen.css";

type Phase = "answering" | "correct" | "wrong" | "result";

interface FinishInfo {
  mode: "lesson" | "exam";
  correct: number;
  total: number;
  xp: number;
  passed: boolean;
}

interface Props {
  course: Course;
  mode: "lesson" | "exam";
  lessonRef?: LessonRef;
  hearts: number;
  onWrong: () => void;
  onFinish: (info: FinishInfo) => void;
  onExit: () => void;
  onSound: (name: SoundName) => void;
}

const DONKEY_MS = 2600;

export function LessonScreen({
  course,
  mode,
  lessonRef,
  hearts,
  onWrong,
  onFinish,
  onExit,
  onSound,
}: Props) {
  const lang = course.from;
  const pack = memes(lang);

  const build = useCallback(
    (): Question[] =>
      mode === "exam"
        ? buildExam(course)
        : buildLesson(course, lessonRef?.unitIndex ?? 0, lessonRef?.lessonIndex ?? 0),
    [course, mode, lessonRef]
  );

  const [questions, setQuestions] = useState<Question[]>(build);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [praise, setPraise] = useState("");
  const [roast, setRoast] = useState("");
  const [donkey, setDonkey] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
  const committed = useRef(false);

  const question = questions[index];
  const total = questions.length;

  const handleWrong = useCallback(
    (choice: number | null, timeout = false) => {
      setSelected(choice);
      setTimedOut(timeout);
      setRoast(randomFrom(pack.roast));
      setPhase("wrong");
      setDonkey(true);
      setCombo(0);
      onSound("wrong");
      onSound("laser");
      onWrong();
      window.setTimeout(() => setDonkey(false), DONKEY_MS);
    },
    [onSound, onWrong, pack.roast]
  );

  const handleAnswer = (i: number) => {
    if (phase !== "answering") return;
    if (i === question.correctIndex) {
      setSelected(i);
      setPraise(randomFrom(pack.praise));
      setPhase("correct");
      setCorrectCount((c) => c + 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      setXp((x) => x + 10 + (newCombo >= 3 ? 5 : 0));
      setBurstId((b) => b + 1);
      onSound("correct");
    } else {
      handleWrong(i);
    }
  };

  // exam countdown
  useEffect(() => {
    if (mode !== "exam" || phase !== "answering") return;
    setTimeLeft(EXAM_SECONDS);
    const timer = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timer);
          handleWrong(null, true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mode, phase, index, handleWrong]);

  const advance = () => {
    onSound("click");
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setSelected(null);
      setTimedOut(false);
      setPhase("answering");
      return;
    }
    // finished — commit once, then show the result screen
    const passed = mode === "exam" ? correctCount >= EXAM_PASS : true;
    const bonus = mode === "exam" ? (passed ? 100 : 0) : 20;
    const totalXp = xp + bonus;
    if (!committed.current) {
      committed.current = true;
      onFinish({ mode, correct: correctCount, total, xp: totalXp, passed });
      if (passed) {
        onSound("fanfare");
        setBurstId((b) => b + 1);
      } else {
        onSound("gameover");
      }
    }
    setPhase("result");
  };

  const restart = () => {
    committed.current = false;
    setQuestions(build());
    setIndex(0);
    setSelected(null);
    setPhase("answering");
    setCorrectCount(0);
    setCombo(0);
    setXp(0);
    setTimedOut(false);
  };

  // ---------- result screen ----------
  if (phase === "result") {
    const passed = mode === "exam" ? correctCount >= EXAM_PASS : true;
    const accuracy = Math.round((correctCount / total) * 100);
    const line = passed
      ? mode === "exam"
        ? randomFrom(pack.examPass)
        : randomFrom(pack.praise)
      : randomFrom(pack.examFail);
    return (
      <div className="lesson lesson--result">
        <Confetti burstId={burstId} />
        <div className={`lesson__result card ${passed ? "" : "lesson__result--fail"}`}>
          <div className="lesson__result-emoji">{passed ? "🏆" : "💀"}</div>
          <h1 className="lesson__result-title">
            {mode === "exam"
              ? t(lang, passed ? "examPassTitle" : "examFailTitle")
              : t(lang, "lessonDone")}
          </h1>
          <p className="lesson__result-meme meme-caption">{line}</p>
          <div className="lesson__result-stats">
            <div className="lesson__result-stat">
              <span>{t(lang, "lessonScore")}</span>
              <b>{accuracy}%</b>
            </div>
            <div className="lesson__result-stat">
              <span>{t(lang, "xpEarned")}</span>
              <b>+{xp + (mode === "exam" ? (passed ? 100 : 0) : 20)} ⚡</b>
            </div>
          </div>
          <div className="lesson__result-actions">
            <button className="btn" onClick={onExit}>
              {t(lang, "backHome")} 🏠
            </button>
            <button className="btn btn--ghost" onClick={restart}>
              {t(lang, "onceMore")} 🔁
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- question screen ----------
  const promptTitle =
    question.kind === "emoji"
      ? t(lang, "whatIsThis")
      : `${t(lang, "translateWord")}:`;

  return (
    <div className="lesson">
      <Confetti burstId={burstId} />
      {donkey && (
        <DonkeyOverlay
          verdict={timedOut ? t(lang, "timeout") : t(lang, "wrong")}
          caption={roast}
        />
      )}

      <header className="lesson__top">
        <button className="lesson__quit" onClick={onExit} aria-label="exit">
          ✕
        </button>
        <div className="lesson__progress">
          <div
            className="lesson__progress-fill"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>
        <span className="lesson__hearts">❤️ {hearts}</span>
      </header>

      {mode === "exam" && (
        <div className="lesson__timer">
          <span className="lesson__timer-label">
            ⏱ {t(lang, "timeLeft")}: {timeLeft}s
          </span>
          <div className="lesson__timer-bar">
            <div
              className={`lesson__timer-fill ${timeLeft <= 5 ? "lesson__timer-fill--panic" : ""}`}
              style={{ width: `${(timeLeft / EXAM_SECONDS) * 100}%` }}
            />
          </div>
        </div>
      )}

      <main className="lesson__body">
        <div className="lesson__kicker">
          {mode === "exam" ? `☠️ ${t(lang, "exam")}` : t(lang, "chooseTranslation")}{" "}
          · {t(lang, "question")} {index + 1}/{total}
          {combo >= 2 && (
            <span className="lesson__combo">
              🔥 {t(lang, "combo")} x{combo}
            </span>
          )}
        </div>

        <div className="lesson__prompt card" key={index}>
          <div className="lesson__prompt-title">{promptTitle}</div>
          <div
            className={`lesson__prompt-word ${question.kind === "emoji" ? "lesson__prompt-word--emoji" : ""}`}
          >
            {question.kind !== "emoji" && question.promptEmoji && (
              <span className="lesson__prompt-hint">{question.promptEmoji}</span>
            )}
            {question.prompt}
          </div>
        </div>

        <div className="lesson__options">
          {question.options.map((option, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = i === selected;
            const revealed = phase !== "answering";
            return (
              <button
                key={`${index}-${i}`}
                className={[
                  "lesson__option",
                  revealed && isCorrect && "lesson__option--correct",
                  revealed && isSelected && !isCorrect && "lesson__option--wrong",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={revealed}
                onClick={() => handleAnswer(i)}
              >
                <span className="lesson__option-index">{i + 1}</span>
                {option}
              </button>
            );
          })}
        </div>

        {phase === "correct" && (
          <div className="lesson__feedback lesson__feedback--good">
            <span className="lesson__feedback-title">✅ {t(lang, "correct")}</span>
            <span className="lesson__feedback-line">{praise}</span>
            <button className="btn lesson__continue" onClick={advance}>
              {t(lang, "continueBtn")} →
            </button>
          </div>
        )}

        {phase === "wrong" && !donkey && (
          <div className="lesson__feedback lesson__feedback--bad">
            <span className="lesson__feedback-title">❌ {t(lang, "wrong")}</span>
            <span className="lesson__feedback-line">{roast}</span>
            <button className="btn btn--red lesson__continue" onClick={advance}>
              {t(lang, "continueBtn")} →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
