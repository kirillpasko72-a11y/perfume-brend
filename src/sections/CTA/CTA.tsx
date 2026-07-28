import { useRef } from "react";
import { MagneticButton } from "@/components/MagneticButton/MagneticButton";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import "./CTA.css";

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  useRevealOnScroll(sectionRef, { selector: ".reveal-item", stagger: 0.15, y: 30 });

  return (
    <section className="cta section-pad" ref={sectionRef}>
      <div className="ambient-glow cta__glow" aria-hidden="true" />
      <div className="container cta__inner">
        <h2 className="display-lg cta__title reveal-item">
          Your scent is waiting to become a memory.
        </h2>
        <p className="body-lg cta__text reveal-item">
          Order a discovery set of all three, or commit to the one that
          already feels like yours.
        </p>
        <div className="cta__ring reveal-item">
          <MagneticButton variant="primary" href="#collection">
            Discover the Collection
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
