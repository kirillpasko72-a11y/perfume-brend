import { Suspense, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BottleFallback } from "./BottleFallback";
import { BottleGroup } from "./BottleGroup";
import { SceneLights } from "./SceneLights";
import { SceneParticles } from "./SceneParticles";
import "./PerfumeBottleScene.css";

interface PerfumeBottleSceneProps {
  className?: string;
  /** 0 -> 1 scroll progress driving a full rotation and the rim-light
   * warmth. Omit for idle auto-rotate with a static warm light. */
  progressRef?: MutableRefObject<number>;
  pointerParallax?: boolean;
}

export function PerfumeBottleScene({
  className = "",
  progressRef,
  pointerParallax = true,
}: PerfumeBottleSceneProps) {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const particleCount = reducedMotion ? 0 : isMobile ? 18 : 55;

  return (
    <div className={`bottle-scene ${className}`.trim()}>
      <ErrorBoundary
        label="Perfume bottle 3D scene"
        fallback={<BottleFallback reason="GLB missing or WebGL unavailable" />}
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
            />
            <SceneParticles count={particleCount} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
