import { useEffect } from "react";
import "./BottleFallback.css";

interface BottleFallbackProps {
  reason?: string;
}

/**
 * Pure CSS/HTML stand-in for the 3D bottle. Rendered whenever WebGL is
 * unavailable or the GLB model fails to load, so the hero and pinned
 * sections never show a blank canvas.
 */
export function BottleFallback({ reason }: BottleFallbackProps) {
  useEffect(() => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(
        `[NOIRÉ] Rendering CSS bottle fallback${reason ? `: ${reason}` : ""}. ` +
          "Add public/models/perfume-bottle.glb to see the real 3D scene."
      );
    }
  }, [reason]);

  return (
    <div className="bottle-fallback">
      <div className="bottle-fallback__glow" aria-hidden="true" />
      <div className="bottle-fallback__float">
        <div className="bottle-fallback__stage" role="img" aria-label="NOIRÉ perfume bottle">
          <div className="bottle-fallback__cap" />
          <div className="bottle-fallback__neck" />
          <div className="bottle-fallback__body">
            <div className="bottle-fallback__sheen" />
            <span className="bottle-fallback__label">NOIRÉ</span>
          </div>
        </div>
        <div className="bottle-fallback__shadow" />
      </div>
      {import.meta.env.DEV && (
        <span className="bottle-fallback__notice">3D fallback (dev only notice)</span>
      )}
    </div>
  );
}
