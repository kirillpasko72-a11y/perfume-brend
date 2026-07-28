import { useEffect, type RefObject } from "react";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealOptions {
  /** CSS selector for the children to stagger-reveal, relative to the container. */
  selector: string;
  y?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  once?: boolean;
}

/**
 * Reveals matching children of `containerRef` with a stagger as the
 * container scrolls into view. Respects prefers-reduced-motion by
 * shortening/removing the motion while still ending in the visible state.
 */
export function useRevealOnScroll(
  containerRef: RefObject<HTMLElement>,
  {
    selector,
    y = 48,
    stagger = 0.12,
    duration = 0.9,
    start = "top 80%",
    once = true,
  }: RevealOptions
) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    ensureGsapRegistered();
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, {
        opacity: 0,
        y: reducedMotion ? 0 : y,
        filter: reducedMotion ? "none" : "blur(6px)",
      });

      ScrollTrigger.create({
        trigger: container,
        start,
        once,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: reducedMotion ? 0.4 : duration,
            stagger: reducedMotion ? 0.04 : stagger,
            ease: "power3.out",
          });
        },
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, reducedMotion]);
}
