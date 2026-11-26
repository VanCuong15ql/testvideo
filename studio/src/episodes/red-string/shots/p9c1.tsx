import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p9c1 — Alex finally understands: he has to choose to walk toward her
// himself. He takes a breath and starts the confession. Courtyard, morning,
// string glowing faintly back to life.

const str = (glow: number | number[] = 0.8) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.35, glow, pulse: 0.4,
});
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p9c1Shots: ShotMap = {
  // Alex finally understood what he had to do.
  P9S1: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 872, s: 1.05, flip: 1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { headTilt: 4, look: -0.5 }]] },
      { k: 'maya', x: 1220, y: 862, s: 1.02, flip: -1, exprs: [[0, 'neutral'], [0.6, 'worried']], keys: [[0, { look: 0.5 }]] },
    ],
    str: str(0.7),
    fx: { tag: 'HE KNEW' },
  }),
  // He couldn't keep relying on the string to bring Maya closer.
  P9S2: S({
    set: 'courtyard', cam: [[0, 1050, 580, 1.9], [1, 1045, 575, 1.95]],
    figs: [
      { k: 'alex', x: 1000, y: 880, s: 1.2, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.5, headTilt: 5 }]] },
      { k: 'maya', x: 1360, y: 868, s: 1.15, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str([0.7, 0.5]),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 40);
      return a > 0 ? <text x={1180} y={330} textAnchor="middle" fontSize={46} fill="#B9A8D8" opacity={a * 0.7} fontStyle="italic">not the string...</text> : null;
    },
  }),
  // He had to choose to walk toward her himself.
  P9S3: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 920, y: 872, s: 1.05, flip: 1, exprs: [[0, 'worried'], [0.6, 'happy']], keys: [[0, { look: -0.4 }], [0.5, { x: 960 }]] },
      { k: 'maya', x: 1200, y: 862, s: 1.02, flip: -1, exprs: [[0, 'neutral'], [0.6, 'happy']] },
    ],
    str: str([0.5, 1.0]),
    fx: { burstAt: 18 },
  }),
  // So he took a breath.
  P9S4: S({
    set: 'courtyard', cam: [[0, 960, 585, 2.2], [1, 955, 580, 2.25]],
    figs: [
      { k: 'alex', x: 920, y: 880, s: 1.3, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { headTilt: 5, look: -0.5, squash: 0.05 }], [0.5, { headTilt: 0, squash: -0.03 }]] },
      { k: 'maya', x: 1300, y: 868, s: 1.2, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str(0.9),
    fx: { dark: 0.1 },
  }),
  // "Maya, there's something I've wanted to tell you for a long time."
  P9S5: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.4, 'neutral']], keys: [[0, { headTilt: 4, look: -0.5 }]] },
      { k: 'maya', x: 1220, y: 864, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']] },
    ],
    str: str(1.0),
    say: [{ text: "Maya, there's something I've wanted to tell you for a long time.", fig: 0, at: 0.05, until: 0.95, maxW: 720, fs: 32 }],
  }),
  // She looked at him.
  P9S6: S({
    set: 'courtyard', cam: [[0, 1120, 575, 1.9], [1, 1115, 570, 1.95]],
    figs: [
      { k: 'maya', x: 1060, y: 866, s: 1.15, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.7, headTilt: 2 }]] },
      { k: 'alex', x: 1440, y: 876, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(1.0),
    fx: { dark: 0.15 },
  }),
  // Alex continued.
  P9S7: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 950, y: 875, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.4, 'neutral']], keys: [[0, { look: -0.4, headTilt: 3 }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(1.1),
  }),
  // gathering courage — hands find each other
  P9S8: S({
    set: 'courtyard', cam: [[0, 1050, 640, 2.6], [1, 1045, 635, 2.7]],
    figs: [
      { k: 'alex', x: 900, y: 890, s: 1.35, flip: 1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { armL: { a: 40, b: -30 }, look: -0.4 }]] },
      { k: 'maya', x: 1250, y: 880, s: 1.3, flip: -1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { armR: { a: 40, b: -30 }, look: 0.5 }]] },
    ],
    str: str([1.0, 1.4]),
    fx: { burstAt: 20 },
  }),
  // "I liked you before this string appeared..."
  P9S9: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 950, y: 875, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4, headTilt: 3 }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.05, flip: -1, exprs: [[0, 'worried'], [0.5, 'shock']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str([1.0, 1.5]),
    say: [{ text: 'I liked you before this string appeared.', fig: 0, at: 0.05, until: 0.9, maxW: 680, fs: 34 }],
    fx: { burstAt: 16 },
  }),
  // confession part 1 continues — the weight of it
  P9S10: S({
    set: 'courtyard', cam: [[0, 1060, 580, 1.85], [1, 1055, 575, 1.9]],
    figs: [
      { k: 'alex', x: 1000, y: 878, s: 1.15, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4, headTilt: 4 }]] },
      { k: 'maya', x: 1320, y: 866, s: 1.1, flip: -1, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(1.3),
    fx: { dark: 0.15 },
  }),
};
