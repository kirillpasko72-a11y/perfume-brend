import { useEffect, useRef, useState } from "react";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./Story.css";

const TITLE_LINES = ["A ritual,", "not a routine."];

const PARAGRAPH_ROWS = [
  "NOIRÉ began as a private formula, mixed in small batches for people who",
  "noticed things — the light at dusk, the smell of rain on stone.",
  "We still make it that way: slowly, in small runs, for the same reason.",
];

export function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const visualBgRef = useRef<HTMLDivElement>(null);
  const [visualRevealed, setVisualRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    ensureGsapRegistered();
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const titleLines = section.querySelectorAll(".story__title-line");
      const rows = section.querySelectorAll(".story__row span");

      gsap.set(titleLines, { y: reducedMotion ? 0 : "100%", opacity: reducedMotion ? 1 : 0 });
      gsap.set(rows, { y: reducedMotion ? 0 : "60%", opacity: reducedMotion ? 1 : 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(titleLines, {
            y: "0%",
            opacity: 1,
            duration: reducedMotion ? 0.3 : 1,
            stagger: 0.12,
            ease: "power4.out",
          });
          gsap.to(rows, {
            y: "0%",
            opacity: 1,
            duration: reducedMotion ? 0.3 : 0.9,
            stagger: 0.1,
            ease: "power3.out",
            delay: reducedMotion ? 0 : 0.2,
          });
          setVisualRevealed(true);
        },
      });

      if (!reducedMotion) {
        gsap.to(visualBgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <section id="story" className="story section-pad" ref={sectionRef}>
      <div className="container story__grid">
        <div className="story__copy">
          <span className="story__index" aria-hidden="true">01</span>
          <span className="eyebrow">Since 2018</span>
          <h2 className="display-lg story__title">
            {TITLE_LINES.map((line) => (
              <span className="story__title-line" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="body-lg story__paragraph">
            {PARAGRAPH_ROWS.map((row) => (
              <span className="story__row" key={row}>
                <span>{row}</span>
              </span>
            ))}
          </p>
        </div>

        <div
          className={`story__visual${visualRevealed ? " story__visual--revealed" : ""}`}
          ref={visualRef}
        >
          <div className="story__visual-bg" ref={visualBgRef} />
          <div className="story__visual-frame" aria-hidden="true" />
          <span className="story__visual-year">EST. 2018 — PARIS</span>
          <span className="story__visual-mark">NOIRÉ</span>
        </div>
      </div>
    </section>
  );
}
