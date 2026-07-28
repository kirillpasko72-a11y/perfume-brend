import { Suspense, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useIsMobile, useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAssetAvailable } from "@/hooks/useAssetAvailable";
import { BottleFallback } from "./BottleFallback";
import { BottleGroup } from "./BottleGroup";
import { MODEL_PATH } from "./BottleModel";
import { SceneLights } from "./SceneLights";
import { SceneParticles } from "./SceneParticles";
import "./PerfumeBottleScene.css";

interface PerfumeBottleSceneProps {
  className?: string;
  /** 0 -> 1 scroll progress driving a full rotation and the rim-light
   * warmth. Omit for idle auto-rotate with a static warm light. */
  progressRef?: MutableRefObject<number>;
  pointerParallax?: boolean;
  /** Apparent size multiplier for the 3D model. Use >1 when the bottle is
   * meant to dominate the frame rather than sit as a supporting object. */
  scale?: number;
}

export function PerfumeBottleScene({
  className = "",
  progressRef,
  pointerParallax = true,
  scale = 1,
}: PerfumeBottleSceneProps) {
  const isMobile = useIsMobile();
  // The Hero's full-bleed "large" treatment only has room at the same
  // 1024px breakpoint its own layout switches at — using the (narrower)
  // isMobile threshold here would leave a tablet-width gap where the
  // container goes back to a normal contained box but the bottle still
  // renders at full "large" size and overflows it.
  const isCompact = useMediaQuery("(max-width: 1024px)");
  const reducedMotion = useReducedMotion();
  const particleCount = reducedMotion ? 0 : isMobile ? 18 : 55;

  // Check the GLB actually exists before ever touching the GLTFLoader —
  // a missing file degrades straight to the CSS fallback with a clean
  // console instead of a loader-logged 404 + thrown/caught error.
  const modelAvailability = useAssetAvailable(MODEL_PATH);

  if (modelAvailability !== "available") {
    return (
      <div className={`bottle-scene ${className}`.trim()}>
        <BottleFallback
          progressRef={progressRef}
          large={scale > 1 && !isCompact}
          reason={modelAvailability === "missing" ? "public/models/perfume-bottle.glb not found" : undefined}
        />
      </div>
    );
  }

  return (
    <div className={`bottle-scene ${className}`.trim()}>
      <ErrorBoundary
        label="Perfume bottle 3D scene"
        fallback={
          <BottleFallback progressRef={progressRef} large={scale > 1 && !isCompact} reason="GLB failed to parse or WebGL unavailable" />
        }
      >
        <Canvas
          dpr={[1, isMobile ? 1.5 : 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0.3, 4.4], fov: 30 }}
          shadows={!isMobile}
        >
          <Suspense fallback={null}>
            <SceneLights progressRef={progressRef} contactShadow={!isMobile} />
            <BottleGroup
              progressRef={progressRef}
              autoRotate={!progressRef}
              pointerParallax={pointerParallax && !isMobile}
              reducedMotion={reducedMotion}
              scale={isCompact ? 1 : scale}
            />
            <SceneParticles count={particleCount} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
