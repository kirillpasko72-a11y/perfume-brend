import { useRef, useState, type PointerEvent } from "react";
import { Check, Plus } from "lucide-react";
import { fragrances } from "@/data/fragrances";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { LazyPerfumeBottleScene } from "@/three/LazyPerfumeBottleScene";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouch } from "@/hooks/useMediaQuery";
import { useInView } from "@/hooks/useInView";
import type { Fragrance } from "@/types";
import "./Collection.css";

function FragranceCard({
  fragrance,
  selected,
  onToggle,
  tiltDisabled,
}: {
  fragrance: Fragrance;
  selected: boolean;
  onToggle: () => void;
  tiltDisabled: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { ref: vesselRef, inView } = useInView<HTMLDivElement>();

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (tiltDisabled) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tiltY", `${px * 10}deg`);
    card.style.setProperty("--tiltX", `${-py * 10}deg`);
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tiltX", "0deg");
    card.style.setProperty("--tiltY", "0deg");
  };

  return (
    <article
      className="fragrance-card reveal-item"
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="fragrance-card__glow" aria-hidden="true" />
      <div className="fragrance-card__vessel" ref={vesselRef}>
        {inView && <LazyPerfumeBottleScene tone={fragrance.tone} compact />}
      </div>

      <span className="fragrance-card__code">{fragrance.code}</span>
      <h3 className="fragrance-card__name">{fragrance.name}</h3>
      <p className="body-md fragrance-card__desc">{fragrance.description}</p>

      <div className="fragrance-card__footer">
        <span className="fragrance-card__price">{fragrance.price}</span>
        <button
          type="button"
          className={`fragrance-card__btn${selected ? " fragrance-card__btn--active" : ""}`}
          onClick={onToggle}
          aria-pressed={selected}
        >
          {selected ? (
            <>
              <Check size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              Selected
            </>
          ) : (
            <>
              <Plus size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
              Add to Selection
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export function Collection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useRevealOnScroll(gridRef, { selector: ".fragrance-card", stagger: 0.14 });

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="collection" className="collection section-pad">
      <div className="container">
        <div className="collection__head">
          <SectionHeading
            eyebrow="The Collection"
            title="Three fragrances, one signature"
            description="Each bottle is a complete statement. Wear one, or let all three speak in turn."
          />
        </div>

        <div className="collection__grid" ref={gridRef}>
          {fragrances.map((fragrance) => (
            <FragranceCard
              key={fragrance.id}
              fragrance={fragrance}
              selected={selected.has(fragrance.id)}
              onToggle={() => toggle(fragrance.id)}
              tiltDisabled={reducedMotion || isTouch}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
