import { useEffect, useRef, useState } from "react";
import { LazyPerfumeBottleScene } from "@/three/LazyPerfumeBottleScene";
import { ensureGsapRegistered, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./PinnedScene.css";

interface Phase {
  index: string;
  title: string;
  text: string;
  chip: string;
}

const PHASES: Phase[] = [
  {
    index: "01 / 04",
    title: "The Opening",
    text: "Bergamot cuts through first — bright, citrus, alive. The bottle turns to catch the light.",
    chip: "Bergamot",
  },
  {
    index: "02 / 04",
    title: "The Heart",
    text: "Iris settles in, powdery and composed. The silhouette softens as the light warms.",
    chip: "Iris",
  },
  {
    index: "03 / 04",
    title: "The Base",
    text: "Cedar gives the structure its spine — dry, resinous, architectural.",
    chip: "Cedar",
  },
  {
    index: "04 / 04",
    title: "The Signature",
    text: "Amber lingers longest. What began as light closes as memory.",
    chip: "Amber",
  },
];

export function PinnedScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const lastPhaseRef = useRef(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    ensureGsapRegistered();
    if (!sectionRef.current || !viewportRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: viewportRef.current,
      scrub: 0.6,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        if (progressFillRef.current) {
          progressFillRef.current.style.width = `${self.progress * 100}%`;
        }
        const idx = Math.min(PHASES.length - 1, Math.floor(self.progress * PHASES.length));
        if (idx !== lastPhaseRef.current) {
          lastPhaseRef.current = idx;
          setPhaseIndex(idx);
        }
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  const current = PHASES[phaseIndex];

  return (
    <section
      className={`pinned${reducedMotion ? " pinned--static" : ""}`}
      ref={sectionRef}
      aria-label="The making of a NOIRÉ fragrance"
    >
      <div className="pinned__viewport" ref={viewportRef}>
        <div className="container pinned__inner">
          <div className="pinned__stage">
            <LazyPerfumeBottleScene progressRef={reducedMotion ? undefined : progressRef} />
          </div>

          <div className="pinned__copy">
            <span className="pinned__index">{current.index}</span>
            <h2 className="pinned__phase-title">{current.title}</h2>
            <p className="body-lg pinned__phase-text">{current.text}</p>

            <div className="pinned__chips" aria-live="polite">
              {PHASES.map((phase, i) => (
                <span
                  key={phase.chip}
                  className={`pinned__chip${i <= phaseIndex ? " pinned__chip--active" : ""}`}
                >
                  {phase.chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {!reducedMotion && (
          <div className="pinned__progress" aria-hidden="true">
            <div className="pinned__progress-fill" ref={progressFillRef} />
          </div>
        )}
      </div>
    </section>
  );
}
