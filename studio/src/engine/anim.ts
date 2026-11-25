// Tiny animation helpers shared by the whole engine. Every shot is a pure function of its own clock t
// (frames), so nothing here keeps state: the same t always draws the same frame, which is what lets the
// engine play any shot backwards.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** Piecewise value from [frame, value] keys with an ease between neighbours. */
export const kf = (f: number, keys: [number, number][], ease = easeInOut) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i];
    const [f1, v1] = keys[i + 1];
    if (f <= f1) return lerp(v0, v1, ease((f - f0) / Math.max(1e-6, f1 - f0)));
  }
  return keys[keys.length - 1][1];
};
/** A repeatable pseudo-random number in 0..1 for (seed, i): sets scatter books, stars and dust with it. */
export const rnd = (seed: number, i: number) => Math.abs(Math.sin(seed * 31.7 + i * 12.9898) * 43758.5453) % 1;
/** A wobble that dies away: for things that land, get hit or get knocked. */
export const settle = (t: number, amp: number, speed = 1.4, decay = 8) => (t > 0 ? Math.sin(t * speed) * amp * Math.exp(-t / decay) : 0);
/** Damped-harmonic 0→1 pop — the spring() feel without Remotion's <Spring>: use for anything that
 *  enters with weight (a panel slamming, a character landing, a card stamping). t in frames.
 *  damping ~12 / stiffness ~100 is the genre default: a soft overshoot then rest.
 *  Lower damping = more bounce, higher stiffness = faster. */
export const spring = (t: number, { damping = 12, stiffness = 100, mass = 1 }: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  if (t <= 0) return 0;
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const s = t / 30;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * s) * (Math.cos(wd * s) + (zeta * w0 / wd) * Math.sin(wd * s));
  }
  return 1 - Math.exp(-w0 * s) * (1 + w0 * s);
};

/** The camera: centre the world point (cx, cy) on screen at zoom s (1920 x 1080 frame). */
export const camT = (cx: number, cy: number, s: number) => `translate(960 540) scale(${s}) translate(${-cx} ${-cy})`;
/** A short, decaying camera shake for a hit inside a shot (the engine has its own for cue-driven shakes). */
export const shake = (t: number, from: number, len = 8, amp = 10) =>
  t >= from && t < from + len ? { x: Math.sin(t * 2.9) * amp * (1 - (t - from) / len), y: Math.cos(t * 3.7) * amp * 0.7 * (1 - (t - from) / len) } : { x: 0, y: 0 };
