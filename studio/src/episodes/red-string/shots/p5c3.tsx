import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p5c3 — the realization: Alex looks down at the string glowing bright red,
// understands it reacts to EMOTIONS — but whose? His? Maya's? Or both?
// Set: classroom, drifting to a moody close-up. The string is the subject.

const str = (slack: number | number[], glow: number | number[] = 1.3, pulse = 0) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow, pulse });

const ALEX = { k: 'alex' as const, x: 780, y: 832, s: 1.0, flip: 1 as const };
const MAYA = { k: 'maya' as const, x: 1240, y: 826, s: 1.0, flip: -1 as const };

export const p5c3Shots: ShotMap = {
  // "Are you sure?" — Maya's question hanging
  P5S21: S({
    set: 'classroom', cam: [[0, 1120, 575, 1.8], [1, 1115, 570, 1.85]],
    figs: [
      { ...MAYA, x: 1060, y: 830, s: 1.15, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: -0.7 }]] },
      { k: 'alex', x: 1420, y: 838, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.2, glow: 1.4 },
    say: [{ text: 'Are you sure?', fig: 0, at: 0.1, until: 0.8, maxW: 400, fs: 42 }],
  }),
  // Alex looked down.
  P5S22: S({
    set: 'classroom', cam: [[0, 900, 580, 1.9], [1, 895, 575, 1.95]],
    figs: [
      { ...ALEX, x: 860, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.4, headTilt: 8 }]] },
      { ...MAYA, x: 1300, exprs: [[0, 'neutral']] },
    ],
    str: str(0.18, 1.5),
  }),
  // The string was glowing bright red — macro on the thread between their hands
  P5S23: S({
    set: 'classroom', cam: [[0, 980, 660, 3.2], [1, 980, 655, 3.4]],
    figs: [
      { k: 'alex', x: 700, y: 900, s: 1.6, flip: 1, exprs: [[0, 'shock']], keys: [[0, { armL: { a: 40, b: -30 }, look: -0.5 }]] },
      { k: 'maya', x: 1250, y: 895, s: 1.6, flip: -1, exprs: [[0, 'neutral']], keys: [[0, { armR: { a: 40, b: -30 } }]] },
    ],
    str: str(0.12, [1.5, 2.0], 0.8),
    fx: { burstAt: 16 },
    propsFn: (t) => <Glow x={975} y={700} r={120 + Math.sin(t * 0.2) * 30} kind="red" o={0.2} />,
  }),
  // He finally understood something.
  P5S24: S({
    set: 'classroom', cam: [[0, 900, 575, 1.8], [1, 895, 570, 1.85]],
    figs: [
      { ...ALEX, x: 850, exprs: [[0, 'shock'], [0.7, 'worried']], keys: [[0, { look: -0.5, headTilt: 6 }], [0.7, { headTilt: 3 }]] },
      { ...MAYA, x: 1280, exprs: [[0, 'neutral'], [0.6, 'smug']] },
    ],
    str: str(0.15, 1.6, 0.6),
    fx: { dark: 0.12 },
  }),
  // The string wasn't just reacting to distance.
  P5S25: S({
    set: 'classroom', cam: [[0, 960, 565, 1.45], [1, 960, 560, 1.5]],
    figs: [
      { ...ALEX, x: 760, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: -0.5 }]] },
      { ...MAYA, x: 1220, exprs: [[0, 'smug']] },
    ],
    str: str([0.3, 0.1], 1.4),
    propsFn: (t) => {
      // distance ticks fading — no longer the point
      const a = Math.max(0, 1 - t / 40);
      return a > 0 ? <text x={960} y={300} textAnchor="middle" fontSize={60} fill="#8B7BB8" opacity={a * 0.6} fontStyle="italic">not distance...</text> : null;
    },
  }),
  // It was reacting to emotions.
  P5S26: S({
    set: 'classroom', cam: [[0, 980, 640, 2.6], [1, 980, 635, 2.8]],
    figs: [
      { k: 'alex', x: 760, y: 890, s: 1.5, flip: 1, exprs: [[0, 'shock']], keys: [[0, { armL: { a: 40, b: -30 } }]] },
      { k: 'maya', x: 1200, y: 885, s: 1.5, flip: -1, exprs: [[0, 'neutral']], keys: [[0, { armR: { a: 40, b: -30 } }]] },
    ],
    str: str(0.1, [1.4, 2.1], 1.2),
    fx: { burstAt: 20 },
  }),
  // But whose emotions? His?
  P5S27: S({
    set: 'classroom', cam: [[0, 800, 580, 1.9], [1, 795, 575, 1.95]],
    figs: [
      { ...ALEX, x: 780, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.4, headTilt: 7 }]] },
      { ...MAYA, x: 1300, exprs: [[0, 'neutral']] },
    ],
    str: str(0.15, 1.5, 0.7),
    fx: { tag: 'HIS?' },
  }),
  // Maya's?
  P5S28: S({
    set: 'classroom', cam: [[0, 1150, 580, 1.9], [1, 1145, 575, 1.95]],
    figs: [
      { ...MAYA, x: 1120, y: 830, s: 1.1, flip: -1, exprs: [[0, 'neutral'], [0.5, 'smug']], keys: [[0, { headTilt: 5, look: -0.6 }]] },
      { k: 'alex', x: 800, y: 838, s: 1.05, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'L' }, b: { f: 0, side: 'R' }, slack: 0.15, glow: 1.5, pulse: 0.7 },
    fx: { tag: "MAYA'S?" },
  }),
  // Or both?
  P5S29: S({
    set: 'classroom', cam: [[0, 980, 570, 1.7], [1, 980, 565, 1.75]],
    figs: [
      { ...ALEX, x: 780, y: 835, s: 1.05, flip: 1, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: 0.3, headTilt: 4 }]] },
      { ...MAYA, x: 1200, y: 828, s: 1.05, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: -0.5 }]] },
    ],
    str: str(0.12, [1.5, 2.0], 1.0),
    fx: { tag: 'OR BOTH?', dark: 0.15 },
  }),
};
