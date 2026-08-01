import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, PointLight } from "three";

/**
 * The Punishment Donkey™ — appears when you answer wrong
 * and fires lasers from his eyes. Fully procedural.
 */
export function DonkeyModel() {
  const group = useRef<Group>(null);
  const beamL = useRef<Mesh>(null);
  const beamR = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const g = group.current;
    if (g) {
      // menacing hover + slow head sweep so the lasers rake the screen
      g.position.y = Math.sin(t * 2.2) * 0.08;
      g.rotation.y = Math.sin(t * 1.4) * 0.35;
      g.rotation.z = Math.sin(t * 5) * 0.02;
    }
    const pulse = 0.75 + Math.abs(Math.sin(t * 14)) * 0.45;
    [beamL.current, beamR.current].forEach((b) => {
      if (b) b.scale.set(pulse, 1, pulse);
    });
    if (light.current) light.current.intensity = 4 + Math.sin(t * 18) * 2.5;
  });

  const beam = (x: number, ref: React.RefObject<Mesh>) => (
    <group position={[x, 0.16, 0.35]} rotation={[Math.PI / 2 - 0.12, 0, 0]}>
      <mesh ref={ref} position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.045, 0.13, 7, 12, 1, true]} />
        <meshBasicMaterial color="#ff2222" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.12, 0.3, 7, 12, 1, true]} />
        <meshBasicMaterial color="#ff5555" transparent opacity={0.22} />
      </mesh>
    </group>
  );

  return (
    <group ref={group}>
      {/* body */}
      <mesh position={[0, -0.75, -0.5]} scale={[1, 0.85, 1.4]}>
        <sphereGeometry args={[0.62, 24, 24]} />
        <meshStandardMaterial color="#8a8a99" roughness={0.9} />
      </mesh>
      {/* neck */}
      <mesh position={[0, -0.25, -0.1]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 0.7, 14]} />
        <meshStandardMaterial color="#8a8a99" roughness={0.9} />
      </mesh>
      {/* head */}
      <group position={[0, 0.15, 0.15]} rotation={[0.15, 0, 0]}>
        <mesh scale={[0.8, 0.9, 1.15]}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial color="#8a8a99" roughness={0.9} />
        </mesh>
        {/* muzzle */}
        <mesh position={[0, -0.18, 0.38]} scale={[0.75, 0.6, 0.8]}>
          <sphereGeometry args={[0.32, 20, 20]} />
          <meshStandardMaterial color="#c9c9d6" roughness={0.9} />
        </mesh>
        {/* nostrils */}
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, -0.16, 0.62]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#3a3a48" />
          </mesh>
        ))}
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            position={[s * 0.28, 0.52, -0.08]}
            rotation={[0, 0, s * -0.35]}
            scale={[0.5, 1, 0.3]}
          >
            <coneGeometry args={[0.22, 0.65, 12]} />
            <meshStandardMaterial color="#8a8a99" roughness={0.9} />
          </mesh>
        ))}
        {/* mane tuft */}
        <mesh position={[0, 0.42, -0.15]} scale={[0.5, 0.35, 0.6]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#4c4c5e" roughness={1} />
        </mesh>
        {/* glowing eyes */}
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.16, 0.35]}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial
              color="#ff2222"
              emissive="#ff0000"
              emissiveIntensity={3.5}
              toneMapped={false}
            />
          </mesh>
        ))}
        {/* angry brows */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            position={[s * 0.18, 0.3, 0.36]}
            rotation={[0, 0, s * -0.55]}
          >
            <boxGeometry args={[0.24, 0.05, 0.05]} />
            <meshStandardMaterial color="#2c2c38" />
          </mesh>
        ))}
        {/* LASERS */}
        {beam(-0.17, beamL)}
        {beam(0.17, beamR)}
        <pointLight
          ref={light}
          position={[0, 0.16, 0.8]}
          color="#ff2a2a"
          intensity={5}
          distance={8}
        />
      </group>
      {/* legs */}
      {[
        [-0.3, -0.1],
        [0.3, -0.1],
        [-0.3, -0.95],
        [0.3, -0.95],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.45, z]}>
          <cylinderGeometry args={[0.09, 0.07, 0.6, 10]} />
          <meshStandardMaterial color="#6f6f80" roughness={0.9} />
        </mesh>
      ))}
      {/* tail */}
      <mesh position={[0, -0.55, -1.25]} rotation={[0.7, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 8]} />
        <meshStandardMaterial color="#6f6f80" roughness={0.9} />
      </mesh>
    </group>
  );
}
