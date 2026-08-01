import { useEffect, useState } from "react";
import { Logo } from "../Logo/Logo";
import { memes } from "../../data/memes";
import type { UiLang } from "../../types";
import "./Preloader.css";

interface Props {
  lang: UiLang;
  onDone: () => void;
}

const DURATION = 2600;

export function Preloader({ lang, onDone }: Props) {
  const [lineIndex, setLineIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const lines = memes(lang).loading;

  useEffect(() => {
    const lineTimer = window.setInterval(
      () => setLineIndex((i) => (i + 1) % lines.length),
      450
    );
    const exitTimer = window.setTimeout(() => setLeaving(true), DURATION);
    const doneTimer = window.setTimeout(onDone, DURATION + 450);
    return () => {
      window.clearInterval(lineTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [lines.length, onDone]);

  return (
    <div className={`preloader ${leaving ? "preloader--leaving" : ""}`}>
      <div className="preloader__inner">
        <div className="preloader__logo">
          <Logo size={84} withWordmark={false} />
        </div>
        <div className="preloader__word">
          Lingo<span>Goose</span>
        </div>
        <div className="preloader__bar">
          <div className="preloader__bar-fill" />
        </div>
        <p className="preloader__line" aria-live="polite">
          {lines[lineIndex]}
        </p>
      </div>
    </div>
  );
}
