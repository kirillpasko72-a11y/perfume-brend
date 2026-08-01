import { useState } from "react";
import { Scene } from "../../three/Scene";
import { CharacterModel, type Mood } from "../../three/CharacterModel";
import { t } from "../../i18n";
import { randomFrom } from "../../data/memes";
import type { Profile, Species, UiLang } from "../../types";
import type { SoundName } from "../../hooks/useSound";
import "./CharacterCreator.css";

interface Props {
  lang: UiLang;
  onDone: (profile: Profile) => void;
  onSound: (name: SoundName) => void;
}

const COLORS = [
  "#ffffff",
  "#8ef02e",
  "#ff4fd8",
  "#3ed8ff",
  "#ffb020",
  "#a06bff",
  "#ff6b4a",
  "#7a5230",
];

const FUNNY_NAMES: Record<UiLang, string[]> = {
  ru: [
    "Гусеслав",
    "Квакентий",
    "Капибарон",
    "Котлета",
    "Лингвозавр",
    "Мемослав Третий",
    "Профессор Кряк",
    "Бублик",
  ],
  en: [
    "Goosezilla",
    "Sir Quacksalot",
    "Baron Capybaron",
    "Captain Croak",
    "Memelord",
    "Wordinator 3000",
    "Professor Honk",
    "Bagel",
  ],
};

const SPECIES: { id: Species; emoji: string }[] = [
  { id: "goose", emoji: "🪿" },
  { id: "cat", emoji: "🐱" },
  { id: "capybara", emoji: "🦫" },
  { id: "frog", emoji: "🐸" },
];

const speciesKey = {
  goose: "speciesGoose",
  cat: "speciesCat",
  capybara: "speciesCapybara",
  frog: "speciesFrog",
} as const;

export function CharacterCreator({ lang, onDone, onSound }: Props) {
  const [species, setSpecies] = useState<Species>("goose");
  const [color, setColor] = useState(COLORS[0]);
  const [name, setName] = useState("");
  const [mood, setMood] = useState<Mood>("idle");

  const poke = () => {
    onSound("correct");
    setMood("happy");
    window.setTimeout(() => setMood("idle"), 1600);
  };

  const finish = () => {
    const finalName = name.trim() || randomFrom(FUNNY_NAMES[lang]);
    onDone({ name: finalName, species, color });
  };

  return (
    <div className="creator">
      <h1 className="creator__title">{t(lang, "createHero")}</h1>

      <div className="creator__layout">
        <button
          className="creator__preview"
          onClick={poke}
          title="?"
          type="button"
        >
          <Scene fallbackEmoji={SPECIES.find((s) => s.id === species)!.emoji}>
            <CharacterModel species={species} color={color} mood={mood} scale={1.3} />
          </Scene>
        </button>

        <div className="creator__panel card">
          <h2 className="creator__label">{t(lang, "species")}</h2>
          <div className="creator__species">
            {SPECIES.map((s) => (
              <button
                key={s.id}
                className={`creator__species-btn ${species === s.id ? "creator__species-btn--active" : ""}`}
                onClick={() => {
                  onSound("click");
                  setSpecies(s.id);
                }}
              >
                <span className="creator__species-emoji">{s.emoji}</span>
                {t(lang, speciesKey[s.id])}
              </button>
            ))}
          </div>

          <h2 className="creator__label">{t(lang, "color")}</h2>
          <div className="creator__colors">
            {COLORS.map((c) => (
              <button
                key={c}
                aria-label={c}
                className={`creator__swatch ${color === c ? "creator__swatch--active" : ""}`}
                style={{ background: c }}
                onClick={() => {
                  onSound("click");
                  setColor(c);
                }}
              />
            ))}
          </div>

          <h2 className="creator__label">{t(lang, "yourName")}</h2>
          <div className="creator__name-row">
            <input
              className="creator__input"
              value={name}
              maxLength={24}
              placeholder={t(lang, "namePlaceholder")}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="btn btn--ghost creator__dice"
              onClick={() => {
                onSound("click");
                setName(randomFrom(FUNNY_NAMES[lang]));
              }}
            >
              {t(lang, "randomName")}
            </button>
          </div>

          <button className="btn creator__done" onClick={finish}>
            {t(lang, "done")} ✅
          </button>
        </div>
      </div>
    </div>
  );
}
