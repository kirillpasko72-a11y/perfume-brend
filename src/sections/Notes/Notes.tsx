import { useEffect, useRef, useState } from "react";
import { Citrus, Flower2, TreePine, Droplet } from "lucide-react";
import { scentNotes } from "@/data/notes";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import type { ScentNote } from "@/types";
import "./Notes.css";

const ICONS: Record<ScentNote["icon"], typeof Citrus> = {
  bergamot: Citrus,
  iris: Flower2,
  cedar: TreePine,
  amber: Droplet,
};

const LINE_X = [12.5, 37.5, 62.5, 87.5];

export function Notes() {
  const gridRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const [linesDrawn, setLinesDrawn] = useState(false);

  useRevealOnScroll(gridRef, { selector: ".note-card", stagger: 0.12 });

  useEffect(() => {
    const el = linesRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLinesDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="notes" className="notes section-pad">
      <div className="container">
        <div className="notes__head">
          <SectionHeading
            eyebrow="Composition"
            title="The architecture of scent"
            description="Four notes, one signature. Every NOIRÉ fragrance is built from the same quiet vocabulary."
            center
          />
        </div>

        <div className="notes__constellation">
          <div className="notes__hub" aria-hidden="true">
            <Droplet size={24} />
          </div>

          <div className="notes__lines" ref={linesRef} aria-hidden="true">
            <svg viewBox="0 0 100 140" preserveAspectRatio="none" width="100%" height="100%">
              {LINE_X.map((x) => (
                <path
                  key={x}
                  d={`M50,0 L${x},140`}
                  className={linesDrawn ? "notes__lines--drawn" : ""}
                />
              ))}
            </svg>
          </div>

          <div className="notes__grid" ref={gridRef}>
            {scentNotes.map((note) => {
              const Icon = ICONS[note.icon];
              return (
                <article className="note-card" key={note.id}>
                  <span className="note-card__index">0{scentNotes.indexOf(note) + 1}</span>
                  <div className="note-card__icon">
                    <Icon size={30} strokeWidth={1.4} />
                  </div>
                  <h3 className="note-card__name">{note.name}</h3>
                  <p className="note-card__desc body-md">{note.description}</p>
                  <span className="gold-rule note-card__rule" />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
