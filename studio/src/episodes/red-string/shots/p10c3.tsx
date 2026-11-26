import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p10c3 — side by side, no string, no rules — just two people choosing to
// stay close. Then Alex glances at his little finger: a tiny red thread is still
// there — not tied to Maya anymore, but stretching toward something beyond the
// gate. He stops. "Maya..."

const strGone = { a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack: 0.4, glow: 0, gone: 1 };
const camWide = [[0, 1180, 560, 1.2], [1, 1190, 555, 1.25]] as [number, number, number, number][];

export const p10c3Shots: ShotMap = {
  // Side by side. No invisible string.
  P10S21: S({
    set: 'gate', cam: camWide,
    figs: [
      { k: 'alex', x: 1150, y: 875, s: 0.95, flip: 1, walk: [1050, 1250], dir: 1, exprs: [[0, 'happy']] },
      { k: 'maya', x: 1380, y: 866, s: 0.95, flip: 1, walk: [1280, 1480], dir: 1, exprs: [[0, 'happy', ], [0.5, 'smug']] },
    ],
    str: strGone,
    fx: { tag: 'SIDE BY SIDE' },
  }),
  // No supernatural rules.
  P10S22: S({
    set: 'gate', cam: [[0, 1180, 555, 1.15], [1, 1190, 550, 1.2]],
    figs: [
      { k: 'alex', x: 1120, y: 872, s: 0.92, flip: 1, exprs: [[0, 'happy']] },
      { k: 'maya', x: 1340, y: 864, s: 0.92, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: strGone,
    propsFn: (t) => {
      const a = Math.max(0, 1 - t / 35);
      return a > 0 ? <text x={1230} y={300} textAnchor="middle" fontSize={54} fill="#F4EEE0" opacity={a * 0.8} fontStyle="italic">no rules</text> : null;
    },
  }),
  // Just two people choosing to stay close.
  P10S23: S({
    set: 'gate', cam: [[0, 1200, 570, 1.5], [1, 1195, 565, 1.55]],
    figs: [
      { k: 'alex', x: 1120, y: 878, s: 1.02, flip: 1, exprs: [[0, 'happy', ], [0.5, 'neutral']], keys: [[0, { look: 0.4 }]] },
      { k: 'maya', x: 1340, y: 868, s: 1.0, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: -0.4 }]] },
    ],
    str: strGone,
    fx: { hearts: true },
  }),
  // But as Alex glanced down at his little finger...
  P10S24: S({
    set: 'gate', cam: [[0, 1120, 640, 3.0], [1, 1115, 635, 3.1]],
    figs: [
      { k: 'alex', x: 1080, y: 900, s: 1.5, flip: 1, exprs: [[0, 'happy'], [0.5, 'shock']], keys: [[0, { look: -0.7, headTilt: 8, armL: { a: 50, b: -35 } }]] },
      { k: 'maya', x: 1500, y: 890, s: 1.4, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: strGone,
  }),
  // he noticed something.
  P10S25: S({
    set: 'gate', cam: [[0, 1060, 660, 3.6], [1, 1055, 655, 3.7]],
    figs: [
      { k: 'alex', x: 1020, y: 910, s: 1.7, flip: 1, exprs: [[0, 'shock']], keys: [[0, { look: -0.8, armL: { a: 55, b: -40 }, headTilt: 9 }]] },
      { k: 'maya', x: 1560, y: 898, s: 1.55, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: strGone,
    fx: { burstAt: 14 },
  }),
  // A tiny red thread was still there.
  P10S26: S({
    set: 'gate', cam: [[0, 1120, 660, 3.2], [1, 1115, 655, 3.3]],
    figs: [
      { k: 'alex', x: 1000, y: 905, s: 1.55, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.7, armL: { a: 50, b: -35 } }]] },
      { k: 'maya', x: 1500, y: 895, s: 1.45, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [2400, 560] }, slack: 0.1, glow: 1.4, pulse: 0.8, width: 3 },
    fx: { burstAt: 10 },
  }),
  // It wasn't connected to Maya anymore.
  P10S27: S({
    set: 'gate', cam: [[0, 1150, 620, 2.4], [1, 1145, 615, 2.5]],
    figs: [
      { k: 'alex', x: 1050, y: 890, s: 1.4, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.6, armL: { a: 50, b: -35 } }]] },
      { k: 'maya', x: 1450, y: 878, s: 1.35, flip: 1, exprs: [[0, 'happy'], [0.6, 'neutral']], keys: [[0, { look: -0.5 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [2500, 540] }, slack: 0.08, glow: 1.2, pulse: 0.7, width: 3 },
  }),
  // It was connected to something beyond the school gate.
  P10S28: S({
    set: 'gate', cam: [[0, 1250, 570, 1.6], [1, 1260, 565, 1.7]],
    figs: [
      { k: 'alex', x: 1100, y: 880, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.7, armL: { a: 45, b: -30 }, headTilt: 6 }]] },
      { k: 'maya', x: 1500, y: 868, s: 1.05, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [2600, 480] }, slack: 0.05, glow: [1.2, 1.8], pulse: 1.0, width: 3.5 },
    propsFn: (t) => {
      const p = (t * 0.15) % 1;
      return <Glow x={2300} y={470} r={60 + p * 80} kind="red" o={0.15 + p * 0.2} />;
    },
    fx: { streaks: true },
  }),
  // Alex stopped walking.
  P10S29: S({
    set: 'gate', cam: [[0, 1150, 580, 1.9], [1, 1145, 575, 1.95]],
    figs: [
      { k: 'alex', x: 1050, y: 878, s: 1.15, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.7, armL: { a: 45, b: -30 }, headTilt: 5 }]] },
      { k: 'maya', x: 1350, y: 868, s: 1.1, flip: -1, exprs: [[0, 'happy'], [0.6, 'neutral']], keys: [[0, { look: 0.5 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [2500, 500] }, slack: 0.05, glow: 1.5, pulse: 0.9, width: 3.5 },
    fx: { shakeAt: 10, shakeAmp: 5 },
  }),
  // "Maya..." — she turned around.
  P10S30: S({
    set: 'gate', cam: camWide,
    figs: [
      { k: 'maya', x: 1330, y: 866, s: 1.05, flip: 1, exprs: [[0, 'neutral'], [0.4, 'worried']], keys: [[0, { spin: 0, look: -0.6 }], [0.4, { spin: -10 }], [0.6, { spin: 0 }]] },
      { k: 'alex', x: 1050, y: 876, s: 1.05, flip: 1, exprs: [[0, 'worried'], [0.5, 'shock']], keys: [[0, { look: -0.7, armL: { a: 45, b: -30 } }]] },
    ],
    str: { a: { f: 1, side: 'L' }, b: { p: [2500, 500] }, slack: 0.05, glow: 1.5, pulse: 1.0, width: 3.5 },
    say: [{ text: 'Maya...', fig: 1, at: 0.15, until: 0.85, maxW: 280, fs: 46 }],
    fx: { burstAt: 22 },
  }),
};

