export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

export function splitWords(text: string): string[] {
  return text.split(" ").filter(Boolean);
}
