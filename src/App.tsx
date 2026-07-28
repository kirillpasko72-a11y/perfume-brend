import { useEffect, useState } from "react";
import { Preloader } from "@/components/Preloader/Preloader";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { NoiseOverlay } from "@/components/NoiseOverlay/NoiseOverlay";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/sections/Hero/Hero";
import { Notes } from "@/sections/Notes/Notes";
import { PinnedScene } from "@/sections/PinnedScene/PinnedScene";
import { Story } from "@/sections/Story/Story";
import { Collection } from "@/sections/Collection/Collection";
import { CTA } from "@/sections/CTA/CTA";
import { Footer } from "@/sections/Footer/Footer";
import { ScrollTrigger } from "@/lib/gsap";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden";
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <NoiseOverlay />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Notes />
        <PinnedScene />
        <Story />
        <Collection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
