import { lazy, Suspense, type MutableRefObject } from "react";
import type { BottleTone } from "@/types";

const PerfumeBottleScene = lazy(() =>
  import("./PerfumeBottleScene").then((m) => ({ default: m.PerfumeBottleScene }))
);

interface LazyPerfumeBottleSceneProps {
  className?: string;
  progressRef?: MutableRefObject<number>;
  pointerParallax?: boolean;
  scale?: number;
  tone?: BottleTone;
  compact?: boolean;
}

/** Code-splits the three.js/R3F/drei bundle out of the main chunk. While it
 * streams in, an empty (transparent) placeholder holds the layout — it's a
 * near-instant swap on any real connection, so no loading UI is needed. */
export function LazyPerfumeBottleScene(props: LazyPerfumeBottleSceneProps) {
  return (
    <Suspense fallback={<div className={props.className} />}>
      <PerfumeBottleScene {...props} />
    </Suspense>
  );
}
