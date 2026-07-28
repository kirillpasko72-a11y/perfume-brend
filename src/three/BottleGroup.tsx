import { Suspense, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { BottleModel } from "./BottleModel";

interface BottleGroupProps {
  progressRef?: MutableRefObject<number>;
  autoRotate: boolean;
  pointerParallax: boolean;
  reducedMotion: boolean;
}

export function BottleGroup({
  progressRef,
  autoRotate,
  pointerParallax,
  reducedMotion,
}: BottleGroupProps) {
  const groupRef = useRef<Group>(null);
  const tiltRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const tilt = tiltRef.current;
    if (!group || !tilt) return;

    if (progressRef) {
      group.rotation.y = progressRef.current * Math.PI * 2;
    } else if (autoRotate && !reducedMotion) {
      group.rotation.y += delta * 0.18;
    }

    if (!reducedMotion) {
      group.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }

    if (pointerParallax && !reducedMotion) {
      const targetX = state.pointer.y * 0.18;
      const targetZ = -state.pointer.x * 0.18;
      tilt.rotation.x += (targetX - tilt.rotation.x) * 0.06;
      tilt.rotation.z += (targetZ - tilt.rotation.z) * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={tiltRef}>
        <Suspense fallback={null}>
          <BottleModel />
        </Suspense>
      </group>
    </group>
  );
}
