import { useEffect, useState } from "react";

export type AssetAvailability = "checking" | "available" | "missing";

const cache = new Map<string, AssetAvailability>();

/**
 * Lightweight existence check for a static asset (e.g. a GLB in /public)
 * via a HEAD request. Lets callers avoid ever invoking a loader (and its
 * noisy console.error on 404) for a file that plainly isn't there, while
 * still being wrapped in an ErrorBoundary as a safety net for genuine
 * parse failures on files that do exist.
 *
 * A plain `res.ok` check isn't enough: Vite's dev server (and many static
 * hosts' SPA fallback) answer an unmatched path with `200 text/html`
 * (index.html) rather than a 404, which would otherwise be mistaken for a
 * real file. A genuine static asset is never served as `text/html`, so
 * that content-type is treated as "missing" too.
 */
export function useAssetAvailable(url: string): AssetAvailability {
  const [status, setStatus] = useState<AssetAvailability>(() => cache.get(url) ?? "checking");

  useEffect(() => {
    if (cache.has(url)) {
      setStatus(cache.get(url)!);
      return;
    }

    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const contentType = res.headers.get("content-type") ?? "";
        const next: AssetAvailability =
          res.ok && !contentType.includes("text/html") ? "available" : "missing";
        cache.set(url, next);
        if (!cancelled) setStatus(next);
      })
      .catch(() => {
        cache.set(url, "missing");
        if (!cancelled) setStatus("missing");
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return status;
}
