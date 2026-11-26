import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p8c2 — Alex's spiral: if it disappears, strangers again? Maya stops
// talking? Everything back to before? Then Maya looks at him and asks the
// question that matters. Courtyard, overcast, string nearly dead.

const str = (crack: number | number[] = 0.8, glow: number | number[] = 0.15) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.45, glow, crack, crackAt: 0.6, width: 3.5,
});
const cam = [[0, 985, 560, 1.5], [1, 980, 555, 1.55]] as [number, number, number, number][];

export const p8c2Shots: ShotMap = {
  // Alex suddenly felt nervous.
  P8S11: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 900, y: 868, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.5, 'shock']], keys: [[0, { headTilt: 7, look: -0.6 }]] },
      { k: 'maya', x: 1120, y: 862, s: 1.0, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    fx: { dark: 0.4 },
  }),
  // If it disappeared, would they go back to being strangers?
  P8S12: S({
    set: 'courtyard', cam: [[0, 960, 580, 1.9], [1, 955, 575, 1.95]],
    figs: [
      { k: 'alex', x: 880, y: 880, s: 1.15, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { headTilt: 8, look: -0.6 }]] },
      { k: 'maya', x: 1200, y: 872, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 50);
      return a > 0 ? <text x={960} y={320} textAnchor="middle" fontSize={56} fill="#B9A8D8" opacity={a * 0.8} fontStyle="italic">strangers again?</text> : null;
    },
    fx: { dark: 0.45 },
  }),
  // the thought visualized — two silhouettes drifting apart, thread snapping
  P8S13: S({
    set: 'courtyard', cam: [[0, 960, 600, 2.4], [1, 955, 595, 2.5]],
    figs: [
      { k: 'alex', x: 780, y: 890, s: 1.3, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.6 }]] },
      { k: 'maya', x: 1260, y: 880, s: 1.25, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { ...str(), gone: [0, 0.5] },
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 45);
      return a > 0 ? <text x={1020} y={330} textAnchor="middle" fontSize={50} fill="#B9A8D8" opacity={a * 0.75} fontStyle="italic">would Maya stop...</text> : null;
    },
    fx: { dark: 0.5 },
  }),
  // Would Maya stop talking to him?
  P8S14: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 920, y: 872, s: 0.98, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { headTilt: 7 }]] },
      { k: 'maya', x: 1100, y: 866, s: 0.98, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    fx: { dark: 0.45 },
  }),
  // Would everything return to the way it was before?
  P8S15: S({
    set: 'courtyard', cam: [[0, 960, 600, 2.2], [1, 955, 595, 2.3]],
    figs: [
      { k: 'alex', x: 880, y: 885, s: 1.2, flip: 1, exprs: [[0, 'tired'], [0.5, 'worried']], keys: [[0, { headTilt: 9, look: -0.6 }]] },
      { k: 'maya', x: 1180, y: 875, s: 1.15, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 45);
      return a > 0 ? <text x={1030} y={330} textAnchor="middle" fontSize={48} fill="#B9A8D8" opacity={a * 0.75} fontStyle="italic">...the way it was?</text> : null;
    },
    fx: { dark: 0.5 },
  }),
  // Maya looked at him. "Alex, can I ask you something?"
  P8S16: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1100, y: 862, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.4, 'worried']], keys: [[0, { look: 0.6, headTilt: 3 }]] },
      { k: 'alex', x: 900, y: 868, s: 1.0, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: str(0.9, 0.12),
    say: [{ text: 'Alex, can I ask you something?', fig: 0, at: 0.1, until: 0.9, maxW: 620, fs: 36 }],
  }),
  // "Yeah?" — Alex braced.
  P8S17: S({
    set: 'courtyard', cam: [[0, 1000, 575, 1.75], [1, 995, 570, 1.8]],
    figs: [
      { k: 'alex', x: 940, y: 872, s: 1.08, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.5, headTilt: 4 }]] },
      { k: 'maya', x: 1180, y: 862, s: 1.08, flip: -1, exprs: [[0, 'neutral'], [0.6, 'smug']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(0.9, 0.12),
    say: [{ text: 'Yeah?', fig: 0, at: 0.4, until: 0.85, maxW: 240, fs: 44 }],
  }),
  // "If this string disappeared today... would you still want to spend time with me?"
  P8S18: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1120, y: 862, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.6, headTilt: 3 }]] },
      { k: 'alex', x: 900, y: 868, s: 1.0, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.6 }]] },
    ],
    str: str(0.9, 0.1),
    say: [{ text: 'If this string disappeared today... would you still want to spend time with me?', fig: 0, at: 0.05, until: 0.95, maxW: 760, fs: 32 }],
    fx: { dark: 0.3 },
  }),
  // the question lands — string flickers
  P8S19: S({
    set: 'courtyard', cam: [[0, 1040, 580, 1.9], [1, 1035, 575, 1.95]],
    figs: [
      { k: 'maya', x: 980, y: 875, s: 1.15, flip: -1, exprs: [[0, 'worried']], keys: [[0, { look: 0.7, headTilt: 4 }]] },
      { k: 'alex', x: 1360, y: 880, s: 1.1, flip: -1, exprs: [[0, 'shock'], [0.5, 'worried']] },
    ],
    str: str([0.9, 1.0], [0.1, 0.4]),
    fx: { dark: 0.4 },
  }),
  // Alex froze. For once, he couldn't hide behind a joke.
  P8S20: S({
    set: 'courtyard', cam: [[0, 1000, 580, 1.8], [1, 995, 575, 1.85]],
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { headTilt: 3, look: -0.6 }]] },
      { k: 'maya', x: 1200, y: 866, s: 1.08, flip: -1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(0.95, 0.15),
    fx: { dark: 0.45 },
  }),
};
