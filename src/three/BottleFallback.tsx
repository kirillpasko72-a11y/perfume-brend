import { useEffect, useRef, type MutableRefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./BottleFallback.css";

interface BottleFallbackProps {
  reason?: string;
  /** When provided (0 -> 1), rotation is driven directly from scroll
   * progress instead of the idle CSS spin — mirrors the real 3D scene's
   * scroll-linked rotation in the pinned section. */
  progressRef?: MutableRefObject<number>;
}

/**
 * Pure CSS/HTML stand-in for the 3D bottle: a true 4-face box (front, back,
 * left, right) rather than a flat card, so the silhouette reads at every
 * rotation angle instead of thinning to a line edge-on. Rendered whenever
 * WebGL is unavailable or the GLB model fails to load, so the hero and
 * pinned sections never show a blank canvas.
 */
export function BottleFallback({ reason, progressRef }: BottleFallbackProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        `[NOIRÉ] Rendering CSS bottle fallback${reason ? `: ${reason}` : ""}. ` +
          "Add public/models/perfume-bottle.glb to see the real 3D scene."
      );
    }
  }, [reason]);

  useEffect(() => {
    if (!progressRef || reducedMotion) return;
    let raf: number;
    const tick = () => {
      if (stageRef.current) {
        stageRef.current.style.transform = `rotateY(${progressRef.current * 360}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, reducedMotion]);

  const stageClass = `bottle-fallback__stage${progressRef ? " bottle-fallback__stage--driven" : ""}`;

  return (
    <div className="bottle-fallback">
      <div className="bottle-fallback__glow" aria-hidden="true" />
      <div className="bottle-fallback__float">
        <div className={stageClass} ref={stageRef} role="img" aria-label="NOIRÉ perfume bottle">
          <div className="bottle-fallback__cap">
            <span className="bottle-fallback__cap-face bottle-fallback__cap-face--back" />
            <span className="bottle-fallback__cap-face bottle-fallback__cap-face--left" />
            <span className="bottle-fallback__cap-face bottle-fallback__cap-face--right" />
            <span className="bottle-fallback__cap-face bottle-fallback__cap-face--front" />
          </div>
          <div className="bottle-fallback__neck" />
          <div className="bottle-fallback__body">
            <div className="bottle-fallback__face bottle-fallback__face--back" />
            <div className="bottle-fallback__face bottle-fallback__face--left" />
            <div className="bottle-fallback__face bottle-fallback__face--right" />
            <div className="bottle-fallback__face bottle-fallback__face--front">
              <div className="bottle-fallback__liquid" />
              <div className="bottle-fallback__sheen" />
              <span className="bottle-fallback__label">NOIRÉ</span>
            </div>
          </div>
        </div>
        <div className="bottle-fallback__shadow" />
      </div>
      {import.meta.env.DEV && (
        <span className="bottle-fallback__notice">3D fallback active (dev only)</span>
      )}
    </div>
  );
}
