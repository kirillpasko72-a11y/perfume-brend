import { Sparkles } from "@react-three/drei";

interface SceneParticlesProps {
  count: number;
}

/** Soft golden dust drifting around the bottle. Count is tuned down for
 * mobile/reduced-motion by the caller. */
export function SceneParticles({ count }: SceneParticlesProps) {
  if (count <= 0) return null;

  return (
    <Sparkles
      count={count}
      scale={[3.4, 4, 2.4]}
      size={2.2}
      speed={0.25}
      opacity={0.55}
      color="#d9b982"
      noise={1}
    />
  );
}
