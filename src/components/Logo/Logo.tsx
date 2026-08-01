import { useRef, useState } from "react";
import "./Logo.css";

interface Props {
  size?: number;
  withWordmark?: boolean;
  /** clicking the goose 5 times makes it spin — tiny easter egg */
  onEasterEgg?: () => void;
}

export function Logo({ size = 44, withWordmark = true, onEasterEgg }: Props) {
  const clicks = useRef(0);
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    clicks.current += 1;
    if (clicks.current >= 5) {
      clicks.current = 0;
      setSpinning(true);
      onEasterEgg?.();
      window.setTimeout(() => setSpinning(false), 1200);
    }
  };

  return (
    <span className="logo" onClick={handleClick} title="Honk.">
      <svg
        className={`logo__icon ${spinning ? "logo__icon--spin" : ""}`}
        width={size}
        height={size}
        viewBox="0 0 64 64"
        aria-hidden
      >
        <rect width="64" height="64" rx="14" fill="#8ef02e" />
        <ellipse cx="30" cy="26" rx="14" ry="13" fill="#ffffff" />
        <rect x="24" y="34" width="12" height="16" rx="6" fill="#ffffff" />
        <path d="M42 24 L56 28 L42 33 Z" fill="#ff8a00" />
        <circle cx="34" cy="23" r="3.4" fill="#10101f" />
        <rect
          x="27"
          y="16"
          width="13"
          height="3.4"
          rx="1.7"
          fill="#10101f"
          transform="rotate(14 33 18)"
        />
        <g transform="rotate(-28 18 48)">
          <rect x="15" y="44" width="6" height="9" rx="1.6" fill="#5b3b1e" />
          <path d="M15 44 L21 44 L21 26 Q18 22 15 26 Z" fill="#dfe6f2" />
        </g>
      </svg>
      {withWordmark && (
        <span className="logo__word">
          Lingo<span className="logo__word-accent">Goose</span>
        </span>
      )}
    </span>
  );
}
