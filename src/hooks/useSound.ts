import { useCallback, useRef } from "react";

export type SoundName =
  | "click"
  | "correct"
  | "wrong"
  | "laser"
  | "fanfare"
  | "gameover";

/**
 * Tiny WebAudio synth — no audio files, everything is generated.
 * Each call is fire-and-forget; the AudioContext is created lazily
 * on the first user interaction so autoplay policies stay happy.
 */
export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      try {
        if (!ctxRef.current) {
          const AC =
            window.AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext;
          if (!AC) return;
          ctxRef.current = new AC();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();
        const t0 = ctx.currentTime;

        const tone = (
          freq: number,
          start: number,
          dur: number,
          type: OscillatorType = "sine",
          vol = 0.15,
          slideTo?: number
        ) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, t0 + start);
          if (slideTo !== undefined) {
            osc.frequency.exponentialRampToValueAtTime(
              Math.max(slideTo, 1),
              t0 + start + dur
            );
          }
          gain.gain.setValueAtTime(0, t0 + start);
          gain.gain.linearRampToValueAtTime(vol, t0 + start + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t0 + start + dur);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t0 + start);
          osc.stop(t0 + start + dur + 0.05);
        };

        switch (name) {
          case "click":
            tone(660, 0, 0.08, "triangle", 0.1);
            break;
          case "correct":
            tone(660, 0, 0.12, "triangle", 0.18);
            tone(880, 0.09, 0.16, "triangle", 0.18);
            tone(1320, 0.18, 0.22, "sine", 0.12);
            break;
          case "wrong":
            tone(220, 0, 0.25, "sawtooth", 0.14, 110);
            tone(160, 0.08, 0.3, "square", 0.08, 70);
            break;
          case "laser":
            tone(1800, 0, 0.3, "square", 0.08, 120);
            tone(2400, 0.05, 0.35, "sawtooth", 0.05, 90);
            break;
          case "fanfare":
            [523, 659, 784, 1047].forEach((f, i) =>
              tone(f, i * 0.12, 0.3, "triangle", 0.16)
            );
            tone(1319, 0.5, 0.5, "sine", 0.12);
            break;
          case "gameover":
            [392, 370, 349, 330].forEach((f, i) =>
              tone(f, i * 0.22, 0.3, "sawtooth", 0.1)
            );
            break;
        }
      } catch {
        // audio is a joke feature anyway — never crash over it
      }
    },
    [enabled]
  );

  return play;
}
