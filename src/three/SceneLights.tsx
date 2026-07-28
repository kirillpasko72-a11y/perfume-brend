import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import type { PointLight, Color } from "three";
import * as THREE from "three";

interface SceneLightsProps {
  /** Scroll progress (0 -> 1) driving the rim light from cool to warm gold.
   * Omit for a static, idle-scene warmth (used in the hero). */
  progressRef?: MutableRefObject<number>;
  contactShadow: boolean;
}

const COOL = new THREE.Color("#aaa19a");
const WARM = new THREE.Color("#d9b982");
const IDLE_WARMTH = 0.2;

/** Procedural studio lighting (no external HDR fetch) plus a rim light that
 * shifts from cool to warm gold as the pinned scroll section progresses. */
export function SceneLights({ progressRef, contactShadow }: SceneLightsProps) {
  const rimRef = useRef<PointLight>(null);

  useFrame(() => {
    const rim = rimRef.current;
    if (!rim) return;
    const warmth = progressRef ? progressRef.current : IDLE_WARMTH;
    (rim.color as Color).lerpColors(COOL, WARM, warmth);
    rim.intensity = 1.4 + warmth * 1.6;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={1.1}
        color="#f4eee5"
        castShadow={contactShadow}
      />
      <pointLight ref={rimRef} position={[-2.2, 1.2, -2]} intensity={1.4} color="#aaa19a" />

      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#f4eee5"
          position={[0, 3, 2]}
          scale={[4, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#d9b982"
          position={[-3, 0.5, 1.5]}
          scale={[2, 4, 1]}
          rotation={[0, Math.PI / 3, 0]}
        />
        <Lightformer
          form="ring"
          intensity={2}
          color="#8c6a39"
          position={[2.5, -1, -2]}
          scale={2}
        />
      </Environment>

      {contactShadow && (
        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.55}
          scale={7}
          blur={2.6}
          far={2.2}
          color="#000000"
        />
      )}
    </>
  );
}
