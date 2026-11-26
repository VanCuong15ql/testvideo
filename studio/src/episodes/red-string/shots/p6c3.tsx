import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p6c3 — the worst line lands: "I just want things to go back to normal."
// Maya goes quiet, turns away: "Fine. Me too." The string loses its glow —
// bright red fades to dark, almost black. For the first time, something is
// seriously wrong. Classroom, drained of color.

const str = (slack: number | number[], glow: number | number[] = 0.5) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p6c3Shots: ShotMap = {
  // "I just want things to go back to normal."
  P6S21: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 920, y: 845, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.5, 'oops']], keys: [[0, { headTilt: 5, look: -0.4 }]] },
      { k: 'maya', x: 1220, y: 832, s: 1.08, flip: -1, exprs: [[0, 'neutral'], [0.4, 'shock']] },
    ],
    str: str(0.4, [0.6, 0.3]),
    say: [{ text: 'I just want things to go back to normal.', fig: 0, at: 0.05, until: 0.9, maxW: 680, fs: 34 }],
    fx: { dark: 0.2 },
  }),
  // Maya went quiet.
  P6S22: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.8], [1, 1095, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1040, y: 832, s: 1.15, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { headTilt: 4, look: -0.5 }]] },
      { k: 'alex', x: 1420, y: 842, s: 1.1, flip: -1, exprs: [[0, 'oops']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.4, glow: [0.5, 0.3] },
    fx: { dark: 0.25 },
  }),
  // Then she turned away. "Fine. Me too."
  P6S23: S({
    set: 'classroom', cam: [[0, 960, 575, 1.5], [1, 960, 570, 1.55]],
    figs: [
      { k: 'maya', x: 1250, y: 828, s: 1.05, flip: -1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { headTilt: 4 }], [0.5, { spin: 12, look: 0.8 }]] },
      { k: 'alex', x: 860, y: 842, s: 1.05, flip: 1, exprs: [[0, 'oops'], [0.5, 'shock']], keys: [[0, { look: -0.5 }]] },
    ],
    str: str(0.45, [0.4, 0.2]),
    say: [{ text: 'Fine. Me too.', fig: 0, at: 0.35, until: 0.9, maxW: 360, fs: 42 }],
    fx: { dark: 0.3 },
  }),
  // The string suddenly lost its glow.
  P6S24: S({
    set: 'classroom', cam: [[0, 980, 660, 3.0], [1, 980, 655, 3.2]],
    figs: [
      { k: 'alex', x: 760, y: 900, s: 1.5, flip: 1, exprs: [[0, 'shock']], keys: [[0, { armL: { a: 40, b: -30 } }]] },
      { k: 'maya', x: 1250, y: 895, s: 1.5, flip: -1, exprs: [[0, 'tired'], [0.5, 'neutral']] },
    ],
    str: str(0.15, [1.4, 0.15]),
    fx: { dark: 0.3 },
  }),
  // Its bright red color faded into a dark, almost black shade.
  P6S25: S({
    set: 'classroom', cam: [[0, 980, 660, 3.2], [1, 980, 655, 3.4]],
    figs: [
      { k: 'alex', x: 760, y: 900, s: 1.5, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1250, y: 895, s: 1.5, flip: -1, exprs: [[0, 'tired']] },
    ],
    str: str(0.15, [0.3, 0.05], ),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 45);
      return a > 0 ? <Glow x={1005} y={730} r={100} kind="red" o={a * 0.3} /> : null;
    },
    fx: { dark: 0.45 },
  }),
  // the dead thread hanging — held beat
  P6S26: S({
    set: 'classroom', cam: [[0, 1000, 600, 2.4], [1, 995, 595, 2.5]],
    figs: [
      { k: 'alex', x: 820, y: 870, s: 1.3, flip: 1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.5, headTilt: 6 }]] },
      { k: 'maya', x: 1220, y: 860, s: 1.3, flip: -1, exprs: [[0, 'tired']] },
    ],
    str: str(0.5, 0.08),
    fx: { dark: 0.5 },
  }),
  // For the first time, Alex felt that something was seriously wrong.
  P6S27: S({
    set: 'classroom', cam: [[0, 950, 575, 1.7], [1, 945, 570, 1.75]],
    figs: [
      { k: 'alex', x: 900, y: 845, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { headTilt: 8, look: -0.6 }]] },
      { k: 'maya', x: 1200, y: 832, s: 1.08, flip: -1, exprs: [[0, 'tired'], [0.6, 'neutral']] },
    ],
    str: str(0.5, 0.1),
    fx: { dark: 0.4 },
  }),
  // held on the darkened string between them — dread
  P6S28: S({
    set: 'classroom', cam: [[0, 980, 600, 2.0], [1, 980, 595, 2.1]],
    figs: [
      { k: 'alex', x: 780, y: 880, s: 1.4, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1200, y: 870, s: 1.4, flip: -1, exprs: [[0, 'tired']] },
    ],
    str: str(0.55, 0.06),
    fx: { dark: 0.55 },
  }),
};
