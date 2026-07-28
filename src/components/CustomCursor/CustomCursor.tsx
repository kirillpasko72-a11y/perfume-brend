import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIsTouch } from "@/hooks/useMediaQuery";
import "./CustomCursor.css";

/** Desktop-only custom cursor: a small dot plus a lagging ring that
 * expands over interactive elements. No-op on touch devices. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const isTouch = useIsTouch();

  useEffect(() => {
    if (isTouch) return;

    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const setRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      setDot(e.clientX);
      setDotY(e.clientY);
      setRing(e.clientX);
      setRingY(e.clientY);
    };

    const handleOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest("a, button, [data-cursor='link']")));
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor${hovering ? " custom-cursor--hovering" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor--ring${hovering ? " custom-cursor--hovering" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
