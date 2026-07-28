import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export const MODEL_PATH = "/models/perfume-bottle.glb";
const GOLD_NAME_RE = /cap|lid|top|gold|metal|cork/i;
const TARGET_HEIGHT = 2.4;

/**
 * Loads the local perfume bottle GLB and normalises it: centers the mesh at
 * the origin, scales it to a consistent on-screen size regardless of the
 * source model's original units, and assigns glass/gold materials by mesh
 * name heuristics. Throws (via useGLTF's suspense loader) when the file is
 * missing or fails to parse — the caller wraps this in an ErrorBoundary.
 */
export function BottleModel({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF(MODEL_PATH);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (GOLD_NAME_RE.test(mesh.name)) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#d9b982",
          metalness: 1,
          roughness: 0.28,
          envMapIntensity: 1.4,
        });
      } else {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: "#f4eee5",
          transmission: 0.94,
          thickness: 1.3,
          roughness: 0.04,
          metalness: 0,
          ior: 1.5,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.3,
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    clone.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const autoScale = TARGET_HEIGHT / maxDim;

    const group = new THREE.Group();
    clone.scale.setScalar(autoScale);
    group.add(clone);

    return group;
  }, [scene]);

  return <primitive object={prepared} scale={scale} />;
}
