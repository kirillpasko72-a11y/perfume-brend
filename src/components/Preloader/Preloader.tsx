import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./Preloader.css";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [percent, setPercent] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    tl.to(markRef.current, {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      duration: reducedMotion ? 0.3 : 1,
    });

    tl.to(
      counter,
      {
        value: 100,
        duration: reducedMotion ? 0.4 : 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(counter.value);
          setPercent(v);
          if (fillRef.current) fillRef.current.style.width = `${v}%`;
        },
      },
      reducedMotion ? "<" : "-=0.4"
    );

    tl.to(rootRef.current, {
      opacity: 0,
      filter: "blur(10px)",
      duration: reducedMotion ? 0.25 : 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // Safety net: never let the preloader hang past this ceiling.
    const maxTimeout = window.setTimeout(() => {
      if (tl.progress() < 1) tl.progress(1);
    }, 4000);

    return () => {
      tl.kill();
      window.clearTimeout(maxTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" ref={rootRef} role="status" aria-live="polite">
      <div className="preloader__inner">
        <div className="preloader__mark" ref={markRef}>
          NOIRÉ
        </div>
        <div className="preloader__bar">
          <div className="preloader__bar-fill" ref={fillRef} />
        </div>
        <span className="preloader__percent">{percent}%</span>
      </div>
    </div>
  );
}
