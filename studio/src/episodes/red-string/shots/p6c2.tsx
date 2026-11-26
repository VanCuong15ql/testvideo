import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p6c2 — the hurt underneath: "So being connected to me is that terrible?"
// / "No! That's not what I said." / "Then what did you mean?" — Alex can't find
// the words; what he wants to say vs what he says. Classroom, intimate two-shot.

const str = (slack: number | number[], glow: number | number[] = 0.8) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p6c2Shots: ShotMap = {
  // "Because this isn't normal..." lands — Maya looks down at their hands.
  P6S11: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 920, y: 842, s: 1.08, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.4, headTilt: 6 }]] },
      { k: 'maya', x: 1180, y: 830, s: 1.08, flip: -1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { headTilt: 6 }]] },
    ],
    str: str(0.35, 0.5),
    say: [{ text: "Because this isn't normal. We can't stay connected forever.", fig: 0, at: 0.05, until: 0.9, maxW: 720, fs: 32 }],
  }),
  // Maya looked down at their hands.
  P6S12: S({
    set: 'classroom', cam: [[0, 1050, 640, 2.4], [1, 1045, 635, 2.5]],
    figs: [
      { k: 'maya', x: 1000, y: 880, s: 1.5, flip: -1, exprs: [[0, 'worried']], keys: [[0, { look: -0.6, headTilt: 8, armL: { a: 30, b: -15 } }]] },
      { k: 'alex', x: 1350, y: 890, s: 1.45, flip: -1, exprs: [[0, 'worried']], keys: [[0, { look: -0.7 }]] },
    ],
    str: str(0.3, 0.5),
    fx: { dark: 0.15 },
  }),
  // "So being connected to me is that terrible?"
  P6S13: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.8], [1, 1095, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1040, y: 830, s: 1.15, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { headTilt: 6, look: -0.6 }]] },
      { k: 'alex', x: 1420, y: 840, s: 1.1, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.35, glow: [0.7, 0.4] },
    say: [{ text: 'So being connected to me is that terrible?', fig: 0, at: 0.1, until: 0.95, maxW: 700, fs: 34 }],
  }),
  // "No! That's not what I said."
  P6S14: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 920, y: 842, s: 1.08, flip: 1, exprs: [[0, 'oops'], [0.4, 'worried']], keys: [[0, { armR: { a: 50, b: -25 } }], [0.4, { armR: { a: 25, b: -12 } }]] },
      { k: 'maya', x: 1180, y: 830, s: 1.08, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.35, [0.6, 0.9]),
    say: [{ text: "No! That's not what I said.", fig: 0, at: 0.1, until: 0.85, maxW: 560, fs: 38 }],
  }),
  // "Then what did you mean?"
  P6S15: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.8], [1, 1095, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1040, y: 830, s: 1.15, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { headTilt: 5, look: -0.7 }]] },
      { k: 'alex', x: 1420, y: 840, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.35, glow: 0.7 },
    say: [{ text: 'Then what did you mean?', fig: 0, at: 0.2, until: 0.9, maxW: 460, fs: 40 }],
  }),
  // Alex struggled to find the right words.
  P6S16: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 920, y: 845, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { headTilt: 6, look: -0.4, armR: { a: 20, b: -10 } }], [0.5, { headTilt: 9 }]] },
      { k: 'maya', x: 1180, y: 832, s: 1.08, flip: -1, exprs: [[0, 'worried'], [0.6, 'neutral']] },
    ],
    str: str(0.4, [0.6, 0.4]),
    fx: { dark: 0.15 },
  }),
  // He wanted to tell her that he was scared.
  P6S17: S({
    set: 'classroom', cam: [[0, 900, 580, 1.9], [1, 895, 575, 1.95]],
    figs: [
      { k: 'alex', x: 860, y: 845, s: 1.15, flip: 1, exprs: [[0, 'worried'], [0.6, 'tired']], keys: [[0, { headTilt: 8, look: -0.5 }]] },
      { k: 'maya', x: 1300, y: 832, s: 1.1, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str(0.4, 0.5),
    fx: { dark: 0.2 },
  }),
  // Not because he disliked being with her.
  P6S18: S({
    set: 'classroom', cam: [[0, 900, 580, 1.9], [1, 895, 575, 1.95]],
    figs: [
      { k: 'alex', x: 860, y: 845, s: 1.15, flip: 1, exprs: [[0, 'worried'], [0.6, 'happy']], keys: [[0, { headTilt: 7 }], [0.6, { headTilt: 3 }]] },
      { k: 'maya', x: 1300, y: 832, s: 1.1, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str(0.4, [0.5, 0.8]),
    fx: { dark: 0.15 },
  }),
  // But because he didn't know whether she actually wanted to be there.
  P6S19: S({
    set: 'classroom', cam: [[0, 1000, 575, 1.75], [1, 995, 570, 1.8]],
    figs: [
      { k: 'alex', x: 920, y: 845, s: 1.12, flip: 1, exprs: [[0, 'worried'], [0.6, 'tired']], keys: [[0, { headTilt: 8, look: -0.5 }]] },
      { k: 'maya', x: 1240, y: 832, s: 1.08, flip: -1, exprs: [[0, 'neutral'], [0.6, 'worried']] },
    ],
    str: str(0.4, 0.5),
    fx: { dark: 0.2 },
  }),
  // Instead, he said the worst possible thing.
  P6S20: S({
    set: 'classroom', cam: [[0, 1050, 575, 1.7], [1, 1045, 570, 1.75]],
    figs: [
      { k: 'alex', x: 940, y: 845, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.5, 'oops']], keys: [[0, { headTilt: 6 }]] },
      { k: 'maya', x: 1220, y: 832, s: 1.08, flip: -1, exprs: [[0, 'neutral'], [0.5, 'shock']], keys: [[0, { headTilt: -4 }]] },
    ],
    str: str(0.4, [0.5, 0.2]),
    fx: { dark: 0.3 },
  }),
};
