import "./ThreatToast.css";

interface Props {
  text: string;
}

/** Passive-aggressive motivation, LingoGoose style. */
export function ThreatToast({ text }: Props) {
  return (
    <div className="threat-toast" role="status">
      <span className="threat-toast__goose" aria-hidden>
        🪿
      </span>
      <div>
        <div className="threat-toast__title">LingoGoose</div>
        <div className="threat-toast__text">{text}</div>
      </div>
      <span className="threat-toast__knife" aria-hidden>
        🔪
      </span>
    </div>
  );
}
