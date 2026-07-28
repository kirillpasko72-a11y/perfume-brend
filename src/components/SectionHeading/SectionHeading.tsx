import { useRef, type ReactNode } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import "./SectionHeading.css";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealOnScroll(ref, { selector: ".reveal-item", stagger: 0.15 });

  return (
    <div
      ref={ref}
      className={`section-heading${center ? " section-heading--center" : ""}`}
    >
      <div className="section-heading__eyebrow-row reveal-item">
        <span className="section-heading__rule" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display-lg reveal-item">{title}</h2>
      {description && <p className="body-lg reveal-item">{description}</p>}
    </div>
  );
}
