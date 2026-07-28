import { useEffect, useRef } from "react";
import { LazyPerfumeBottleScene } from "@/three/LazyPerfumeBottleScene";
import { MagneticButton } from "@/components/MagneticButton/MagneticButton";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsTouch } from "@/hooks/useMediaQuery";
import "./Hero.css";

function KineticLine({
  text,
  goldWord,
  className = "",
}: {
  text: string;
  goldWord?: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={`line-reveal ${className}`}>
      <span className="hero__line-inner">
        {words.map((word, wi) => (
          <span
            className={`hero__word${word === goldWord ? " hero__word--gold" : ""}`}
            key={`${word}-${wi}`}
          >
            {word.split("").map((ch, ci) => (
              <span className="hero__letter" key={ci}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    ensureGsapRegistered();
    const letters = titleRef.current?.querySelectorAll(".hero__letter") ?? [];

    const ctx = gsap.context(() => {
      gsap.set(letters, { yPercent: reducedMotion ? 0 : 115, opacity: reducedMotion ? 1 : 0 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(markRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        duration: reducedMotion ? 0.3 : 0.9,
      });

      tl.to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          duration: reducedMotion ? 0.3 : 1,
          stagger: reducedMotion ? 0.01 : 0.022,
        },
        reducedMotion ? "<" : "-=0.5"
      );

      tl.to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: reducedMotion ? 0.3 : 0.9 },
        "-=0.55"
      );

      tl.to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: reducedMotion ? 0.3 : 0.8 },
        "-=0.5"
      );

      tl.fromTo(
        stageRef.current,
        { opacity: 0, y: reducedMotion ? 0 : 50, scale: reducedMotion ? 1 : 0.86 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: reducedMotion ? 0.4 : 1.3,
          ease: "power3.out",
          onComplete: () => {
            sheenRef.current?.classList.add("hero__sheen--play");
          },
        },
        "-=0.9"
      );
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Scroll parallax: background drifts slower, copy drifts up & fades as the
  // hero leaves the viewport.
  useEffect(() => {
    if (reducedMotion) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(copyRef.current, {
        yPercent: -12,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Subtle pointer-driven glow parallax, desktop only.
  useEffect(() => {
    if (reducedMotion || isTouch) return;
    const bg = bgRef.current;
    if (!bg) return;

    const setX = gsap.quickTo(bg, "x", { duration: 0.8, ease: "power3.out" });
    const setY = gsap.quickTo(bg, "y", { duration: 0.8, ease: "power3.out" });

    const handleMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      setX(nx * 30);
      setY(ny * 20);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion, isTouch]);

  return (
    <section id="top" className="hero" ref={sectionRef}>
      <div className="hero__bg" ref={bgRef} aria-hidden="true">
        <div className="ambient-glow hero__glow hero__glow--gold" />
        <div className="ambient-glow hero__glow hero__glow--cream" />
      </div>

      <div className="hero__lines" aria-hidden="true">
        <span className="gold-rule hero__line--1" />
        <span className="gold-rule--vertical hero__line--2" />
      </div>

      <div className="container hero__inner">
        <div className="hero__copy" ref={copyRef}>
          <span className="eyebrow hero__mark" ref={markRef}>
            NOIRÉ — Maison de Parfum
          </span>

          <h1 className="hero__title" ref={titleRef}>
            <KineticLine text="SCENT IS A" />
            <KineticLine text="MEMORY" goldWord="MEMORY" />
          </h1>

          <p className="body-lg hero__subtitle" ref={subtitleRef}>
            A quiet, modern maison built around three fragrances and one
            conviction: the truest luxury is a scent that becomes a memory.
          </p>

          <div className="hero__cta" ref={ctaRef}>
            <MagneticButton variant="primary" href="#notes">
              Discover
            </MagneticButton>
            <MagneticButton variant="ghost" href="#collection">
              Explore Collection
            </MagneticButton>
          </div>
        </div>

        <div className="hero__stage" ref={stageRef}>
          <LazyPerfumeBottleScene />
          <div className="hero__sheen" ref={sheenRef} aria-hidden="true" />
        </div>
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
