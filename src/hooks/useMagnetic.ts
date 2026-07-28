import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Magnetic hover effect: the element eases toward the pointer while hovered
 * and springs back to rest on leave. Desktop-only, disabled for touch and
 * reduced-motion users by the caller.
 */
export function useMagnetic(
  ref: RefObject<HTMLElement>,
  { strength = 0.35, disabled = false }: { strength?: number; disabled?: boolean } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: relX * strength,
        y: relY * strength,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, disabled]);
}
