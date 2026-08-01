import { useCallback, useEffect, useRef, useState } from "react";
import { Preloader } from "./components/Preloader/Preloader";
import { Hud } from "./components/Hud/Hud";
import { ThreatToast } from "./components/ThreatToast/ThreatToast";
import { GameOverModal } from "./components/GameOverModal/GameOverModal";
import { LanguagePick } from "./screens/LanguagePick/LanguagePick";
import { CharacterCreator } from "./screens/CharacterCreator/CharacterCreator";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import { LessonScreen } from "./screens/Lesson/LessonScreen";
import { lessonId } from "./data/course";
import { memes, randomFrom } from "./data/memes";
import { useSound } from "./hooks/useSound";
import { t } from "./i18n";
import { clearState, defaultState, loadState, saveState, today, yesterday } from "./store";
import { MAX_HEARTS, type Course, type LessonRef, type Profile, type SaveState } from "./types";
import "./App.css";

type Screen =
  | { name: "lang" }
  | { name: "avatar" }
  | { name: "home" }
  | { name: "lesson"; ref: LessonRef }
  | { name: "exam" };

export default function App() {
  const [save, setSave] = useState<SaveState>(loadState);
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState<Screen>(() => {
    const s = loadState();
    if (!s.course) return { name: "lang" };
    if (!s.profile) return { name: "avatar" };
    return { name: "home" };
  });
  const [shaking, setShaking] = useState(false);
  const [threat, setThreat] = useState<string | null>(null);
  const shakeTimer = useRef(0);

  const uiLang = save.course?.from ?? "ru";
  const play = useSound(save.settings.sound);

  // persist everything
  useEffect(() => {
    saveState(save);
  }, [save]);

  // passive-aggressive tab title when the user leaves
  useEffect(() => {
    const original = document.title;
    const onVisibility = () => {
      document.title = document.hidden ? t(uiLang, "comeBackTitle") : original;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, [uiLang]);

  // random threats while chilling on the dashboard
  useEffect(() => {
    if (screen.name !== "home") return;
    let hideTimer = 0;
    const show = () => {
      setThreat(randomFrom(memes(uiLang).threats));
      hideTimer = window.setTimeout(() => setThreat(null), 6500);
    };
    const first = window.setTimeout(show, 9000);
    const loop = window.setInterval(show, 42000);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hideTimer);
      window.clearInterval(loop);
      setThreat(null);
    };
  }, [screen.name, uiLang]);

  const toast = useCallback((text: string, ms = 4000) => {
    setThreat(text);
    window.setTimeout(() => setThreat(null), ms);
  }, []);

  const shake = useCallback(() => {
    setShaking(false);
    window.clearTimeout(shakeTimer.current);
    // restart the CSS animation on consecutive hits
    requestAnimationFrame(() => {
      setShaking(true);
      shakeTimer.current = window.setTimeout(() => setShaking(false), 600);
    });
  }, []);

  const pickCourse = (course: Course) => {
    play("fanfare");
    setSave((s) => ({ ...s, course }));
    setScreen(save.profile ? { name: "home" } : { name: "avatar" });
  };

  const profileDone = (profile: Profile) => {
    play("fanfare");
    setSave((s) => ({ ...s, profile }));
    setScreen({ name: "home" });
  };

  const onWrong = useCallback(() => {
    shake();
    setSave((s) => ({
      ...s,
      progress: { ...s.progress, hearts: Math.max(0, s.progress.hearts - 1) },
    }));
  }, [shake]);

  const onFinish = useCallback(
    (info: { mode: "lesson" | "exam"; correct: number; total: number; xp: number; passed: boolean }) => {
      setSave((s) => {
        const day = today();
        const streak =
          s.progress.lastDay === day
            ? s.progress.streak
            : s.progress.lastDay === yesterday()
              ? s.progress.streak + 1
              : 1;
        const completed = { ...s.progress.completed };
        if (info.mode === "lesson" && screen.name === "lesson") {
          const id = lessonId(screen.ref.unitIndex, screen.ref.lessonIndex);
          const score = Math.round((info.correct / info.total) * 100);
          completed[id] = Math.max(completed[id] ?? 0, score);
        }
        return {
          ...s,
          progress: {
            ...s.progress,
            xp: s.progress.xp + info.xp,
            streak,
            lastDay: day,
            completed,
            examPassed: s.progress.examPassed || (info.mode === "exam" && info.passed),
          },
        };
      });
    },
    [screen]
  );

  const mercy = () => {
    play("fanfare");
    setSave((s) => ({
      ...s,
      progress: { ...s.progress, hearts: MAX_HEARTS },
    }));
    toast(t(uiLang, "mercyGranted"));
  };

  const reset = () => {
    clearState();
    setSave(defaultState());
    setScreen({ name: "lang" });
  };

  if (booting) {
    return <Preloader lang={uiLang} onDone={() => setBooting(false)} />;
  }

  return (
    <div className={`app ${shaking ? "app-shake" : ""}`}>
      {screen.name === "lang" && (
        <LanguagePick onPick={pickCourse} onSound={play} />
      )}

      {screen.name === "avatar" && (
        <CharacterCreator lang={uiLang} onDone={profileDone} onSound={play} />
      )}

      {screen.name === "home" && save.course && save.profile && (
        <>
          <Hud
            lang={uiLang}
            course={save.course}
            profile={save.profile}
            progress={save.progress}
            soundOn={save.settings.sound}
            onToggleSound={() =>
              setSave((s) => ({ ...s, settings: { sound: !s.settings.sound } }))
            }
            onChangeCourse={() => setScreen({ name: "lang" })}
            onEasterEgg={() => {
              play("laser");
              toast("HONK HONK HONK 🪿🔪", 2500);
            }}
          />
          <Dashboard
            lang={uiLang}
            profile={save.profile}
            progress={save.progress}
            onStartLesson={(ref) => {
              play("click");
              setScreen({ name: "lesson", ref });
            }}
            onStartExam={() => {
              play("gameover");
              setScreen({ name: "exam" });
            }}
            onReset={reset}
            onSound={play}
            onSkipPrank={() => toast(t(uiLang, "skipNope"))}
          />
        </>
      )}

      {(screen.name === "lesson" || screen.name === "exam") && save.course && (
        <LessonScreen
          course={save.course}
          mode={screen.name === "lesson" ? "lesson" : "exam"}
          lessonRef={screen.name === "lesson" ? screen.ref : undefined}
          hearts={save.progress.hearts}
          onWrong={onWrong}
          onFinish={onFinish}
          onExit={() => setScreen({ name: "home" })}
          onSound={play}
        />
      )}

      {save.progress.hearts <= 0 && <GameOverModal lang={uiLang} onMercy={mercy} />}

      {threat && <ThreatToast text={threat} />}
    </div>
  );
}
