import { Scene } from "../../three/Scene";
import { DonkeyModel } from "../../three/DonkeyModel";
import "./DonkeyOverlay.css";

interface Props {
  /** roast line shown under the donkey */
  caption: string;
  /** big red verdict, e.g. "НЕПРАВИЛЬНО!" */
  verdict: string;
}

/**
 * Full-screen punishment: red alarm vignette, 3D donkey firing lasers,
 * impact-font roast. Rendered while a wrong-answer state is active.
 */
export function DonkeyOverlay({ caption, verdict }: Props) {
  return (
    <div className="donkey" role="alert">
      <div className="donkey__vignette" />
      <div className="donkey__flash" />
      <div className="donkey__scene">
        <Scene fallbackEmoji="🫏⚡" cameraZ={4.2} cameraY={0.2}>
          <DonkeyModel />
        </Scene>
      </div>
      <div className="donkey__verdict meme-caption">{verdict}</div>
      <div className="donkey__caption meme-caption">{caption}</div>
    </div>
  );
}
