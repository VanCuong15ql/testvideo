import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Glow } from './autoKit';

// Scene p10c4 — the button: he points at his finger. The thread stretches into
// the distance — and somewhere at the other end, someone is holding it.
// TO BE CONTINUED...? Gate, dusk. The thread runs off-frame to a warm glow.

const strThread = (glow: number | number[] = 1.4) => ({
  a: { f: 1, side: 'L' as const }, b: { p: [2500, 460] as [number, number] },
  slack: 0.04, glow, pulse: 0.9, width: 3.5,
});
const cam = [[0, 1150, 570, 1.6], [1, 1160, 565, 1.7]] as [number, number, number, number][];

export const p10c4Shots: ShotMap = {
  // She turned around. He pointed at his finger.
  P10S31: S({
    set: 'gate', cam: [[0, 1150, 585, 1.9], [1, 1145, 580, 1.95]],
    figs: [
      { k: 'maya', x: 1060, y: 870, s: 1.15, flip: 1, exprs: [[0, 'worried'], [0.4, 'neutral']], keys: [[0, { look: -0.6 }]] },
      { k: 'alex', x: 1400, y: 878, s: 1.1, flip: -1, exprs: [[0, 'worried'], [0.4, 'shock']], keys: [[0, { look: -0.7, armL: { a: 55, b: -35 } }]] },
    ],
    str: strThread(1.4),
    fx: { dark: 0.2 },
  }),
  // The thread stretched into the distance.
  P10S32: S({
    set: 'gate', cam,
    figs: [
      { k: 'alex', x: 1100, y: 878, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { look: -0.7, armL: { a: 55, b: -35 }, headTilt: 5 }]] },
      { k: 'maya', x: 1420, y: 868, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.5 }]] },
    ],
    str: strThread([1.4, 1.9]),
    propsFn: (t) => <Glow x={2400} y={470} r={70 + Math.sin(t * 0.5) * 25} kind="red" o={0.2 + Math.sin(t * 0.7) * 0.1} />,
    fx: { streaks: true },
  }),
  // And somewhere at the other end...
  P10S33: S({
    set: 'gate', cam: [[0, 1400, 560, 1.3], [1, 1450, 555, 1.45]],
    figs: [
      { k: 'alex', x: 900, y: 875, s: 0.85, flip: 1, exprs: [[0, 'worried'], [0.5, 'shock']] },
      { k: 'maya', x: 1250, y: 865, s: 0.85, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']] },
    ],
    str: strThread(1.9),
    propsFn: (t) => {
      // the far end: a warm figure silhouette holding the thread at the horizon
      const k = Math.min(1, Math.max(0, (t - 15) / 30));
      return (
        <g opacity={k}>
          <circle cx={2250} cy={430} r={34} fill="#E23B3B" opacity={0.9} />
          <path d="M 2250 464 L 2250 540 M 2216 500 L 2250 486 L 2284 500 M 2216 540 L 2250 524 L 2284 540" stroke="#E23B3B" strokeWidth={10} fill="none" strokeLinecap="round" />
          <Glow x={2250} y={470} r={90} kind="red" o={0.35} />
        </g>
      );
    },
    fx: { dark: 0.25 },
  }),
  // Someone was holding it. TO BE CONTINUED...?
  P10S34: S({
    set: 'gate', cam: [[0, 1500, 555, 1.5], [1, 1550, 548, 1.7]],
    figs: [
      { k: 'alex', x: 800, y: 878, s: 0.8, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1180, y: 866, s: 0.8, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: strThread([1.9, 2.2]),
    propsFn: (t) => {
      const k = Math.min(1, Math.max(0, (t - 8) / 25));
      return (
        <g opacity={k}>
          <circle cx={2250} cy={430} r={34} fill="#E23B3B" opacity={0.95} />
          <path d="M 2250 464 L 2250 540 M 2216 500 L 2250 486 L 2284 500 M 2216 540 L 2250 524 L 2284 540" stroke="#E23B3B" strokeWidth={10} fill="none" strokeLinecap="round" />
          <Glow x={2250} y={470} r={100} kind="red" o={0.4} />
        </g>
      );
    },
    fx: { tag: 'TO BE CONTINUED...?', dark: 0.3 },
  }),
};
