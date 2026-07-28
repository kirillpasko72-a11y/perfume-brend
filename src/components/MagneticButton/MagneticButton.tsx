import { useRef, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouch } from "@/hooks/useMediaQuery";
import "./MagneticButton.css";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useMagnetic(ref as React.RefObject<HTMLElement>, {
    disabled: reducedMotion || isTouch,
    strength: 0.3,
  });

  const classes = `magnetic-btn magnetic-btn--${variant} ${className}`.trim();

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        data-cursor="link"
        onClick={onClick}
      >
        <span className="magnetic-btn__label">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classes}
      data-cursor="link"
    >
      <span className="magnetic-btn__label">{children}</span>
    </button>
  );
}
