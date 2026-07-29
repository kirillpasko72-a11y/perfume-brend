import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Reports once an element has scrolled near the viewport, then stops
 * observing. Used to defer mounting expensive content (e.g. a WebGL canvas)
 * until it's actually about to be seen, so several instances on one page
 * don't all initialise at load.
 */
export function useInView<T extends HTMLElement>(
  rootMargin = "300px"
): { ref: RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
