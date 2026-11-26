import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p10c1 — the string slips away from their fingers. For a moment neither
// moves. Alex looks at his hand — finally free: no pulling, no distance limit,
// no mysterious force. "So... I guess we're not connected anymore."
// "Not by the string." Courtyard, golden hour, thread dissolving.

const str = (gone: number | number[], glow: number | number[] = 0.5) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.4, glow, gone, width: 4,
});
const cam = [[0, 1000, 575, 1.7], [1, 995, 570, 1.75]] as [number, number, number, number][];

export const p10c1Shots: ShotMap = {
  // The red string slipped away from their fingers.
  P10S1: S({
    set: 'courtyard', cam: [[0, 1010, 640, 2.8], [1, 1005, 635, 2.9]],
    figs: [
      { k: 'alex', x: 860, y: 888, s: 1.4, flip: 1, exprs: [[0, 'oops'], [0.5, 'shock']] },
      { k: 'maya', x: 1200, y: 880, s: 1.35, flip: -1, exprs: [[0, 'happy'], [0.5, 'shock']] },
    ],
    str: str([0, 1], [2.2, 0.4]),
    fx: { burstAt: 12 },
  }),
  // For a moment, neither of them moved.
  P10S2: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.05, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.02, flip: -1, exprs: [[0, 'shock'], [0.5, 'happy']], keys: [[0, { look: 0.5 }]] },
    ],
    str: str([1, 1], 0.3),
    fx: { dark: 0.15 },
  }),
  // Alex looked at his hand.
  P10S3: S({
    set: 'courtyard', cam: [[0, 900, 640, 3.0], [1, 895, 635, 3.1]],
    figs: [
      { k: 'alex', x: 820, y: 890, s: 1.5, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.6, armL: { a: 40, b: -30 }, headTilt: 8 }]] },
      { k: 'maya', x: 1300, y: 880, s: 1.4, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(1, 0.2),
    propsFn: (t) => <Glow x={990} y={720} r={60} kind="red" o={Math.max(0, 0.4 - t * 0.01)} />,
  }),
  // It was finally free.
  P10S4: S({
    set: 'courtyard', cam: [[0, 920, 650, 3.2], [1, 915, 645, 3.3]],
    figs: [
      { k: 'alex', x: 860, y: 895, s: 1.55, flip: 1, exprs: [[0, 'shock'], [0.5, 'happy']], keys: [[0, { look: -0.6, armL: { a: 45, b: -35 }, headTilt: 6 }], [0.5, { headTilt: 2 }]] },
      { k: 'maya', x: 1340, y: 885, s: 1.45, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(1, 0),
    fx: { burstAt: 20 },
  }),
  // No pulling.
  P10S5: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 920, y: 878, s: 1.08, flip: 1, exprs: [[0, 'happy'], [0.5, 'neutral']], keys: [[0, { look: -0.4 }]] },
      { k: 'maya', x: 1220, y: 866, s: 1.05, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(1, 0),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 30);
      return a > 0 ? <text x={1070} y={330} textAnchor="middle" fontSize={60} fill="#F4EEE0" opacity={a * 0.85}>no pulling</text> : null;
    },
    fx: { tag: 'FREE' },
  }),
  // No distance limit.
  P10S6: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 860, y: 875, s: 1.0, flip: 1, exprs: [[0, 'happy'], [0.5, 'neutral']], keys: [[0, { look: 0.4 }]] },
      { k: 'maya', x: 1400, y: 865, s: 1.0, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']] },
    ],
    str: str(1, 0),
    propsFn: (t) => {
      // they stand FAR apart now — nothing stops them
      const a = Math.max(0, 1 - t / 30);
      return a > 0 ? <text x={1130} y={330} textAnchor="middle" fontSize={56} fill="#F4EEE0" opacity={a * 0.85}>no distance limit</text> : null;
    },
    fx: { tag: '10m? WHO CARES' },
  }),
  // No mysterious force deciding where he had to go.
  P10S7: S({
    set: 'courtyard', cam: [[0, 980, 580, 1.6], [1, 975, 575, 1.65]],
    figs: [
      { k: 'alex', x: 940, y: 878, s: 1.1, flip: 1, exprs: [[0, 'happy'], [0.6, 'neutral']], keys: [[0, { look: -0.4 }]] },
      { k: 'maya', x: 1240, y: 866, s: 1.05, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(1, 0),
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 30);
      return a > 0 ? <text x={1090} y={330} textAnchor="middle" fontSize={52} fill="#F4EEE0" opacity={a * 0.85}>no mysterious force</text> : null;
    },
    fx: { tag: 'HIS OWN FEET' },
  }),
  // He looked at Maya.
  P10S8: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.05, flip: 1, exprs: [[0, 'happy'], [0.5, 'worried']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1220, y: 864, s: 1.02, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: 0.5 }]] },
    ],
    str: str(1, 0),
  }),
  // "So... I guess we're not connected anymore."
  P10S9: S({
    set: 'courtyard', cam: [[0, 1050, 580, 1.85], [1, 1045, 575, 1.9]],
    figs: [
      { k: 'alex', x: 1000, y: 878, s: 1.15, flip: 1, exprs: [[0, 'happy'], [0.5, 'worried']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1320, y: 866, s: 1.1, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(1, 0),
    say: [{ text: "So... I guess we're not connected anymore.", fig: 0, at: 0.1, until: 0.9, maxW: 720, fs: 34 }],
  }),
  // Maya smiled. "Not by the string."
  P10S10: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy', ], [0.5, 'smug']], keys: [[0, { look: 0.6, headTilt: -3 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'worried'], [0.5, 'happy']] },
    ],
    str: str(1, 0),
    say: [{ text: 'Not by the string.', fig: 0, at: 0.25, until: 0.9, maxW: 480, fs: 42 }],
    fx: { hearts: true },
  }),
};
