import { Logo } from "../Logo/Logo";
import { LANG_META } from "../../data/vocab";
import { t } from "../../i18n";
import type { Course, Profile, Progress, UiLang } from "../../types";
import "./Hud.css";

interface Props {
  lang: UiLang;
  course: Course;
  profile: Profile;
  progress: Progress;
  soundOn: boolean;
  onToggleSound: () => void;
  onChangeCourse: () => void;
  onEasterEgg: () => void;
}

const SPECIES_EMOJI = { goose: "🪿", cat: "🐱", capybara: "🦫", frog: "🐸" };

export function Hud({
  lang,
  course,
  profile,
  progress,
  soundOn,
  onToggleSound,
  onChangeCourse,
  onEasterEgg,
}: Props) {
  return (
    <header className="hud">
      <Logo size={38} onEasterEgg={onEasterEgg} />

      <div className="hud__stats">
        <button
          className="hud__stat hud__stat--flag"
          onClick={onChangeCourse}
          title={t(lang, "changeCourse")}
        >
          {LANG_META[course.to].flag}
        </button>
        <span className="hud__stat" title={t(lang, "streakDays")}>
          🔥 <b>{progress.streak}</b>
        </span>
        <span className="hud__stat" title={t(lang, "hearts")}>
          ❤️ <b>{progress.hearts}</b>
        </span>
        <span className="hud__stat" title={t(lang, "xp")}>
          ⚡ <b>{progress.xp}</b>
        </span>
        <button
          className="hud__stat hud__stat--btn"
          onClick={onToggleSound}
          title={soundOn ? t(lang, "soundOn") : t(lang, "soundOff")}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
        <span
          className="hud__avatar"
          style={{ borderColor: profile.color }}
          title={profile.name}
        >
          {SPECIES_EMOJI[profile.species]}
        </span>
      </div>
    </header>
  );
}
