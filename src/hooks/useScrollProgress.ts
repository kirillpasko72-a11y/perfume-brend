import { useEffect, useRef, type RefObject } from "react";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/gsap";

/**
 * Tracks scroll progress (0 -> 1) of `target` moving through the viewport.
 * Returns a ref instead of state so callers driving imperative animation
 * (three.js, GSAP timelines) can read it every frame without re-rendering.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement>,
  options?: { start?: string; end?: string }
) {
  const progress = useRef(0);

  useEffect(() => {
    ensureGsapRegistered();
    if (!target.current) return;

    const trigger = ScrollTrigger.create({
      trigger: target.current,
      start: options?.start ?? "top bottom",
      end: options?.end ?? "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return progress;
}
