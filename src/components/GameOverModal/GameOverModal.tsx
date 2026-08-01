import { Scene } from "../../three/Scene";
import { CharacterModel } from "../../three/CharacterModel";
import { t } from "../../i18n";
import type { UiLang } from "../../types";
import "./GameOverModal.css";

interface Props {
  lang: UiLang;
  onMercy: () => void;
}

/** Hearts hit zero: the goose arrives. There is only one way out. */
export function GameOverModal({ lang, onMercy }: Props) {
  return (
    <div className="gameover" role="alertdialog" aria-modal="true">
      <div className="gameover__card card">
        <div className="gameover__scene">
          <Scene fallbackEmoji="🪿🔪" cameraZ={3.2} cameraY={0.3}>
            <CharacterModel species="goose" color="#ffffff" knife mood="sad" scale={1.3} />
          </Scene>
        </div>
        <h1 className="gameover__title meme-caption">{t(lang, "noHeartsTitle")}</h1>
        <p className="gameover__text">{t(lang, "noHeartsText")}</p>
        <button className="btn btn--gold gameover__btn" onClick={onMercy}>
          {t(lang, "begMercy")}
        </button>
      </div>
    </div>
  );
}
