import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p9c3 — the reveal: "I already knew you liked me." / "What?" / Maya
// laughs: "You're not exactly good at hiding it." Alex covers his face. The
// string shines like a tiny red star — then, slowly... it loosened.
// Courtyard, golden hour. The string becomes the star of the shot.

const str = (glow: number | number[] = 2.0) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: [0.3, 0.15], glow, pulse: 0.6, width: 5,
});
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p9c3Shots: ShotMap = {
  // He looked up. "I already knew you liked me."
  P9S21: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { look: -0.3, headTilt: 4 }]] },
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(2.0),
    say: [{ text: 'I already knew you liked me.', fig: 1, at: 0.1, until: 0.9, maxW: 680, fs: 34 }],
    fx: { hearts: true },
  }),
  // Alex blinked. "What?"
  P9S22: S({
    set: 'courtyard', cam: [[0, 1060, 580, 1.9], [1, 1055, 575, 1.95]],
    figs: [
      { k: 'alex', x: 1000, y: 880, s: 1.15, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { look: -0.5, headTilt: 3 }]] },
      { k: 'maya', x: 1320, y: 868, s: 1.1, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str(2.0),
    say: [{ text: 'What?', fig: 0, at: 0.4, until: 0.85, maxW: 220, fs: 48 }],
  }),
  // Maya laughed.
  P9S23: S({
    set: 'courtyard', cam: [[0, 1120, 575, 1.85], [1, 1115, 570, 1.9]],
    figs: [
      { k: 'maya', x: 1060, y: 862, s: 1.15, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { headTilt: -8, spin: 0 }], [0.3, { spin: -8 }], [0.5, { spin: 0 }]] },
      { k: 'alex', x: 1440, y: 872, s: 1.1, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: str(2.0),
    fx: { hearts: true },
  }),
  // "You're not exactly good at hiding it."
  P9S24: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy'], [0.6, 'smug']], keys: [[0, { look: 0.6, headTilt: -4 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'shock'], [0.5, 'oops']], keys: [[0, { look: -0.6 }]] },
    ],
    str: str(2.1),
    say: [{ text: "You're not exactly good at hiding it.", fig: 0, at: 0.1, until: 0.9, maxW: 680, fs: 34 }],
  }),
  // Alex covered his face.
  P9S25: S({
    set: 'courtyard', cam: [[0, 960, 585, 2.4], [1, 955, 580, 2.45]],
    figs: [
      { k: 'alex', x: 880, y: 880, s: 1.4, flip: 1, exprs: [[0, 'oops'], [0.5, 'happy']], keys: [[0, { armR: { a: 120, b: -60 }, armL: { a: 120, b: 60 }, headTilt: 10 }]] },
      { k: 'maya', x: 1330, y: 868, s: 1.3, flip: -1, exprs: [[0, 'happy', ], [0.5, 'smug']] },
    ],
    str: str(2.0),
    fx: { hearts: true },
  }),
  // The string began to shine like a tiny red star.
  P9S26: S({
    set: 'courtyard', cam: [[0, 1020, 640, 3.2], [1, 1015, 635, 3.3]],
    figs: [
      { k: 'alex', x: 800, y: 895, s: 1.5, flip: 1, exprs: [[0, 'oops']] },
      { k: 'maya', x: 1250, y: 885, s: 1.45, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str([2.0, 2.6]),
    propsFn: (t) => {
      const tw = 0.6 + Math.sin(t * 0.8) * 0.4;
      return (
        <g transform="translate(1025 730)">
          <Glow x={0} y={0} r={90 + tw * 60} kind="red" o={0.3 + tw * 0.3} />
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i / 4) * Math.PI * 2 + t * 0.05;
            return <line key={i} x1={Math.cos(a) * 30} y1={Math.sin(a) * 30} x2={Math.cos(a) * (70 + tw * 40)} y2={Math.sin(a) * (70 + tw * 40)} stroke="#FFB0A0" strokeWidth={4} opacity={0.5 * tw} strokeLinecap="round" />;
          })}
        </g>
      );
    },
    fx: { burstAt: 18 },
  }),
  // Then, slowly...
  P9S27: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 940, y: 875, s: 1.05, flip: 1, exprs: [[0, 'oops'], [0.5, 'happy']], keys: [[0, { armR: { a: 110, b: -55 } }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.02, flip: -1, exprs: [[0, 'happy', ], [0.5, 'smug']] },
    ],
    str: str([2.4, 1.2]),
    fx: { hearts: true },
  }),
  // It loosened.
  P9S28: S({
    set: 'courtyard', cam: [[0, 1020, 640, 3.0], [1, 1015, 635, 3.1]],
    figs: [
      { k: 'alex', x: 820, y: 888, s: 1.4, flip: 1, exprs: [[0, 'oops']] },
      { k: 'maya', x: 1230, y: 878, s: 1.35, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: str([1.4, 0.8]),
    propsFn: (t) => {
      const k = Math.min(1, t / 40);
      return <Glow x={1025} y={730} r={80 + k * 60} kind="red" o={0.35 * (1 - k * 0.5)} />;
    },
    fx: { burstAt: 20 },
  }),
};
