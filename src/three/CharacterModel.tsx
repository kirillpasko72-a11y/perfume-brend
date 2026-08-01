import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Species } from "../types";

export type Mood = "idle" | "happy" | "sad";

interface Props {
  species: Species;
  color: string;
  mood?: Mood;
  /** the goose mascot carries a knife; player avatars don't have to */
  knife?: boolean;
  scale?: number;
}

function Knife() {
  return (
    <group position={[0.62, 0.05, 0.25]} rotation={[0, 0, -0.6]}>
      <mesh position={[0, -0.14, 0]}>
        <boxGeometry args={[0.09, 0.22, 0.06]} />
        <meshStandardMaterial color="#5b3b1e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.1, 0.42, 0.02]} />
        <meshStandardMaterial color="#dfe6f2" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function Eyes({
  y,
  z,
  spread = 0.18,
  angry = false,
}: {
  y: number;
  z: number;
  spread?: number;
  angry?: boolean;
}) {
  return (
    <group>
      {[-spread, spread].map((x, i) => (
        <group key={i}>
          <mesh position={[x, y, z]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#14141f" roughness={0.3} />
          </mesh>
          {angry && (
            <mesh
              position={[x, y + 0.11, z]}
              rotation={[0, 0, i === 0 ? -0.5 : 0.5]}
            >
              <boxGeometry args={[0.18, 0.04, 0.04]} />
              <meshStandardMaterial color="#14141f" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function GooseBody({ color, knife }: { color: string; knife: boolean }) {
  return (
    <group>
      {/* body */}
      <mesh position={[0, -0.35, 0]} scale={[1, 0.82, 1.15]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 0.18, 0.18]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.18, 0.75, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* head */}
      <group position={[0, 0.62, 0.32]}>
        <mesh>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* beak */}
        <mesh position={[0, -0.02, 0.32]} rotation={[1.35, 0, 0]}>
          <coneGeometry args={[0.11, 0.3, 16]} />
          <meshStandardMaterial color="#ff8a00" roughness={0.5} />
        </mesh>
        <Eyes y={0.07} z={0.2} spread={0.13} angry />
      </group>
      {/* wings */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 0.48, -0.3, 0]}
          rotation={[0, 0, s * -0.35]}
          scale={[0.35, 0.55, 0.8]}
        >
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.75} />
        </mesh>
      ))}
      {/* feet */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, -0.85, 0.1]}>
          <boxGeometry args={[0.18, 0.06, 0.3]} />
          <meshStandardMaterial color="#ff8a00" roughness={0.6} />
        </mesh>
      ))}
      {knife && <Knife />}
    </group>
  );
}

function CatBody({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.35, 0]} scale={[0.9, 1, 0.9]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <group position={[0, 0.42, 0.05]}>
        <mesh>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.26, 0.42, 0]} rotation={[0, 0, s * -0.3]}>
              <coneGeometry args={[0.14, 0.3, 4]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* muzzle */}
        <mesh position={[0, -0.1, 0.36]} scale={[1, 0.7, 0.6]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#fff2e2" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.02, 0.45]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#ff7ba9" roughness={0.4} />
        </mesh>
        <Eyes y={0.1} z={0.36} spread={0.17} />
      </group>
      {/* tail */}
      <mesh position={[0.4, -0.5, -0.4]} rotation={[0.9, 0, -0.5]}>
        <cylinderGeometry args={[0.06, 0.09, 0.8, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function CapybaraBody({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.35, 0]} scale={[1.05, 0.85, 1.3]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <group position={[0, 0.28, 0.35]}>
        {/* boxy zen head */}
        <mesh scale={[0.85, 0.8, 1]}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        {/* blunt snout */}
        <mesh position={[0, -0.12, 0.32]}>
          <boxGeometry args={[0.34, 0.24, 0.22]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.05, 0.44]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#3d2a1a" />
        </mesh>
        {/* tiny ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.24, 0.3, -0.05]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
        ))}
        <Eyes y={0.1} z={0.32} spread={0.2} />
      </group>
      {/* legs */}
      {[
        [-0.3, 0.35],
        [0.3, 0.35],
        [-0.3, -0.4],
        [0.3, -0.4],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.85, z]}>
          <cylinderGeometry args={[0.09, 0.09, 0.25, 10]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function FrogBody({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, -0.35, 0]} scale={[1.15, 0.8, 1]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* bulgy eyes on top */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.3, 0.18, 0.15]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.03, 0.12]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.03, 0.19]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#14141f" />
          </mesh>
        </group>
      ))}
      {/* mouth line */}
      <mesh position={[0, -0.28, 0.48]} rotation={[0.3, 0, 0]} scale={[1, 0.25, 0.4]}>
        <torusGeometry args={[0.22, 0.03, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#14332a" />
      </mesh>
      {/* front legs */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.38, -0.72, 0.28]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.4, 10]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function CharacterModel({
  species,
  color,
  mood = "idle",
  knife = false,
  scale = 1,
}: Props) {
  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    if (mood === "happy") {
      g.position.y = Math.abs(Math.sin(t * 6)) * 0.28;
      g.rotation.y = Math.sin(t * 3.5) * 0.55;
      g.rotation.z = Math.sin(t * 7) * 0.08;
      g.rotation.x = 0;
    } else if (mood === "sad") {
      g.position.y = Math.sin(t * 1.2) * 0.03 - 0.12;
      g.rotation.x = 0.35 + Math.sin(t * 1.5) * 0.02;
      g.rotation.y = Math.sin(t * 0.6) * 0.1;
      g.rotation.z = 0;
    } else {
      g.position.y = Math.sin(t * 1.6) * 0.07;
      g.rotation.y = Math.sin(t * 0.7) * 0.28;
      g.rotation.x = 0;
      g.rotation.z = 0;
    }
  });

  return (
    <group ref={group} scale={scale}>
      {species === "goose" && <GooseBody color={color} knife={knife} />}
      {species === "cat" && <CatBody color={color} />}
      {species === "capybara" && <CapybaraBody color={color} />}
      {species === "frog" && <FrogBody color={color} />}
    </group>
  );
}
