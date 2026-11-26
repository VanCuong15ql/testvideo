import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p8c3 — the answer: he looks directly at her. "Yes." / "Even without the
// string?" / "Especially without the string." The thread flickers — but it does
// NOT disappear. Not yet.
// Courtyard, the emotional peak. The string hangs by a thread (literally).

const str = (glow: number | number[] = 0.15, slack: number | number[] = 0.5) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack, glow, crack: 0.95, crackAt: 0.5, width: 3,
});
const cam = [[0, 1000, 575, 1.75], [1, 995, 570, 1.8]] as [number, number, number, number][];

export const p8c3Shots: ShotMap = {
  // For once, he couldn't hide behind a joke — close on Alex, honest face
  P8S21: S({
    set: 'courtyard', cam: [[0, 1000, 585, 2.1], [1, 995, 580, 2.15]],
    figs: [
      { k: 'alex', x: 960, y: 880, s: 1.25, flip: 1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: -0.6, headTilt: 3 }]] },
      { k: 'maya', x: 1300, y: 870, s: 1.2, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    fx: { dark: 0.4 },
  }),
  // He looked directly at her.
  P8S22: S({
    set: 'courtyard', cam: [[0, 1060, 580, 2.2], [1, 1055, 575, 2.25]],
    figs: [
      { k: 'alex', x: 1000, y: 878, s: 1.3, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.2, headTilt: 0 }]] },
      { k: 'maya', x: 1340, y: 868, s: 1.25, flip: -1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: 0.7 }]] },
    ],
    str: str(),
    fx: { dark: 0.35 },
  }),
  // "Yes." — simple, certain. Maya waited.
  P8S23: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.4, 'happy']], keys: [[0, { look: -0.4 }], [0.4, { look: -0.2, headTilt: 0 }]] },
      { k: 'maya', x: 1240, y: 866, s: 1.08, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(),
    say: [{ text: 'Yes.', fig: 0, at: 0.3, until: 0.85, maxW: 220, fs: 52 }],
    fx: { dark: 0.3 },
  }),
  // "Even without the string?"
  P8S24: S({
    set: 'courtyard', cam: [[0, 1120, 580, 2.0], [1, 1115, 575, 2.05]],
    figs: [
      { k: 'maya', x: 1060, y: 872, s: 1.2, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.7, headTilt: 3 }]] },
      { k: 'alex', x: 1440, y: 880, s: 1.15, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    say: [{ text: 'Even without the string?', fig: 0, at: 0.1, until: 0.9, maxW: 560, fs: 36 }],
  }),
  // Alex nodded. "Especially without the string."
  P8S25: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.4, 'happy']], keys: [[0, { headTilt: 5 }], [0.4, { headTilt: -4, look: -0.3 }]] },
      { k: 'maya', x: 1240, y: 866, s: 1.08, flip: -1, exprs: [[0, 'neutral'], [0.5, 'smug']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(),
    say: [{ text: 'Especially without the string.', fig: 0, at: 0.3, until: 0.9, maxW: 640, fs: 34 }],
    fx: { burstAt: 22 },
  }),
  // The red thread flickered.
  P8S26: S({
    set: 'courtyard', cam: [[0, 1000, 640, 3.0], [1, 995, 635, 3.1]],
    figs: [
      { k: 'alex', x: 780, y: 890, s: 1.4, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1250, y: 880, s: 1.35, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: str([0.4, 1.3], 0.45),
    propsFn: (t) => {
      const p = (t * 0.3) % 1;
      return <Glow x={1015} y={730} r={80 + p * 60} kind="red" o={0.1 + Math.sin(t * 0.8) * 0.15 + 0.2} />;
    },
    fx: { burstAt: 16 },
  }),
  // But it didn't disappear.
  P8S27: S({
    set: 'courtyard', cam: [[0, 1000, 640, 2.6], [1, 995, 635, 2.7]],
    figs: [
      { k: 'alex', x: 800, y: 885, s: 1.35, flip: 1, exprs: [[0, 'shock', ], [0.5, 'worried']] },
      { k: 'maya', x: 1230, y: 878, s: 1.3, flip: -1, exprs: [[0, 'shock'], [0.5, 'neutral']] },
    ],
    str: str([0.9, 0.5]),
    propsFn: (t) => <Glow x={1015} y={730} r={90 + Math.sin(t * 0.6) * 25} kind="red" o={0.2 + Math.sin(t * 0.9) * 0.1} />,
    fx: { dark: 0.2 },
  }),
  // Not yet. — held wide, string flickering but alive
  P8S28: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 878, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: -0.4 }]] },
      { k: 'maya', x: 1240, y: 868, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.5, 'happy']], keys: [[0, { look: 0.5 }]] },
    ],
    str: str([0.6, 1.0]),
    propsFn: (t) => <Glow x={1090} y={730} r={80 + Math.sin(t * 0.5) * 20} kind="red" o={0.15 + Math.sin(t * 0.7) * 0.08} />,
    fx: { tag: 'NOT YET' },
  }),
};
