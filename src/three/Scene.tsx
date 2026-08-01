import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

interface Props {
  children: ReactNode;
  /** emoji shown if WebGL is unavailable */
  fallbackEmoji: string;
  className?: string;
  cameraZ?: number;
  cameraY?: number;
}

/**
 * Shared Canvas wrapper: caps dpr, adds the house lighting rig and
 * degrades to a big emoji when WebGL is missing — never a blank hole.
 */
export function Scene({
  children,
  fallbackEmoji,
  className,
  cameraZ = 3.6,
  cameraY = 0.4,
}: Props) {
  const fallback = (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        fontSize: "clamp(3rem, 10vw, 6rem)",
      }}
    >
      {fallbackEmoji}
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} label="3D scene">
      <div className={className} style={{ width: "100%", height: "100%" }}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, cameraY, cameraZ], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 5]} intensity={1.3} />
          <pointLight position={[-4, 2, -2]} color="#a06bff" intensity={18} />
          <pointLight position={[4, -1, 2]} color="#3ed8ff" intensity={10} />
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}
