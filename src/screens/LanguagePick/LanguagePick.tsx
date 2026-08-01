import { useState } from "react";
import { Logo } from "../../components/Logo/Logo";
import { Scene } from "../../three/Scene";
import { CharacterModel } from "../../three/CharacterModel";
import { LANG_META } from "../../data/vocab";
import { memes } from "../../data/memes";
import { t } from "../../i18n";
import type { Course, LangCode, UiLang } from "../../types";
import "./LanguagePick.css";

interface Props {
  onPick: (course: Course) => void;
  onSound: (name: "click") => void;
}

const COURSES: Record<UiLang, LangCode[]> = {
  ru: ["en", "es", "de"],
  en: ["ru", "es", "de"],
};

export function LanguagePick({ onPick, onSound }: Props) {
  const [from, setFrom] = useState<UiLang>("ru");
  const [to, setTo] = useState<LangCode | null>(null);
  const threats = memes(from).threats;

  return (
    <div className="langpick">
      <header className="langpick__header">
        <Logo />
      </header>

      <div className="langpick__hero">
        <div className="langpick__hero-copy">
          <h1 className="langpick__title">
            Lingo<span>Goose</span>
          </h1>
          <p className="langpick__tagline">{t(from, "tagline")}</p>

          <section className="langpick__block">
            <h2 className="langpick__label">{t(from, "iSpeak")}</h2>
            <p className="langpick__hint">{t(from, "uiHint")}</p>
            <div className="langpick__chips">
              {(["ru", "en"] as UiLang[]).map((lang) => (
                <button
                  key={lang}
                  className={`langpick__chip ${from === lang ? "langpick__chip--active" : ""}`}
                  onClick={() => {
                    onSound("click");
                    setFrom(lang);
                    setTo(null);
                  }}
                >
                  <span className="langpick__flag">{LANG_META[lang].flag}</span>
                  {LANG_META[lang].name[lang]}
                </button>
              ))}
            </div>
          </section>

          <section className="langpick__block">
            <h2 className="langpick__label">{t(from, "iLearn")}</h2>
            <div className="langpick__courses">
              {COURSES[from].map((lang) => (
                <button
                  key={lang}
                  className={`langpick__course ${to === lang ? "langpick__course--active" : ""}`}
                  onClick={() => {
                    onSound("click");
                    setTo(lang);
                  }}
                >
                  <span className="langpick__course-flag">
                    {LANG_META[lang].flag}
                  </span>
                  <span className="langpick__course-name">
                    {LANG_META[lang].name[from]}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <button
            className="btn langpick__start"
            disabled={to === null}
            onClick={() => to !== null && onPick({ from, to })}
          >
            {to === null ? t(from, "pickCourseFirst") : `${t(from, "start")} 🚀`}
          </button>
        </div>

        <div className="langpick__hero-goose">
          <Scene fallbackEmoji="🪿" cameraZ={3.4} cameraY={0.3}>
            <CharacterModel species="goose" color="#ffffff" knife scale={1.25} />
          </Scene>
        </div>
      </div>

      <div className="langpick__marquee" aria-hidden>
        <div className="langpick__marquee-track">
          {[...threats, ...threats].map((threat, i) => (
            <span key={i} className="langpick__marquee-item">
              🔪 {threat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
