import React from 'react';
import { ShotMap } from '../../../engine';
import { S, FONT, lerp, easeIn, easeInOut, easeOut, clamp } from './autoKit';
import { ShadowFigure } from './common';

// Scene p3c3 — the payoff: "stuck together?" / courtyard experiment / 9…9.5…10m /
// WHOOOSH — dragged together into a pile of leaves / "Your fault." / Maya laughs.
// Set: courtyard. The string does the comedy.

const Dist: React.FC<{ x: number; y: number; text: string; size?: number; color?: string }> = ({ x, y, text, size = 72, color = '#F4EEE0' }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#1A1230" strokeWidth={6} paintOrder="stroke">{text}</text>
);

const Leaves: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const r = 30 + (i % 4) * 16;
      return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.45} rx={14 + (i % 3) * 5} ry={7} fill={['#C97B2D', '#A85A20', '#E09A3E', '#8F4A1E'][i % 4]} opacity={0.95} transform={`rotate(${a * 57 + i * 30} ${Math.cos(a) * r} ${Math.sin(a) * r * 0.45})`} />;
    })}
    <ellipse cx={0} cy={6} rx={90} ry={20} fill="#7A3E14" opacity={0.5} />
  </g>
);

const camWide = [[0, 960, 545, 1.35], [1, 960, 540, 1.4]] as [number, number, number, number][];

export const p3c3Shots: ShotMap = {
  // "So we're basically stuck together?" — dazed two-shot, string slack between
  P3S21: S({
    set: 'courtyard', cam: camWide,
    figs: [
      { k: 'alex', x: 880, y: 865, s: 1.0, flip: 1, exprs: [[0, 'dizzy']], keys: [[0, {}], [0.4, { headTilt: 6 }]] },
      { k: 'maya', x: 1060, y: 860, s: 1.0, flip: -1, exprs: [[0, 'dizzy']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.35, glow: 1.0 },
    say: [{ text: "So we're basically stuck together?", fig: 1, at: 0.05, until: 0.9, maxW: 640, fs: 36 }],
  }),
  // "Looks like it."
  P3S22: S({
    set: 'courtyard', cam: camWide,
    figs: [
      { k: 'alex', x: 880, y: 865, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, {}], [0.5, { headTilt: 8 }]] },
      { k: 'maya', x: 1060, y: 860, s: 1.0, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: 0.9 },
    say: [{ text: "Looks like it.", fig: 0, at: 0.3, until: 0.9, maxW: 380, fs: 40 }],
  }),
  // "Forever?" — Maya presses; Alex swallows: "Let's not use that word yet."
  P3S23: S({
    set: 'courtyard', cam: [[0, 1000, 560, 1.6], [1, 995, 555, 1.65]],
    figs: [
      { k: 'maya', x: 1060, y: 860, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.4, 'smug']], keys: [[0, {}], [0.5, { headTilt: 5 }]] },
      { k: 'alex', x: 870, y: 865, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.7, 'oops']], keys: [[0, {}], [0.6, { look: -0.3, headTilt: 6 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: 0.9 },
    say: [
      { text: 'Forever?', fig: 0, at: 0.05, until: 0.4, maxW: 320, fs: 44 },
      { text: "Let's not use that word yet.", fig: 1, at: 0.5, until: 0.95, maxW: 560, fs: 34 },
    ],
  }),
  // final experiment — courtyard, they take opposite sides
  P3S24: S({
    set: 'courtyard', cam: [[0, 960, 545, 1.15], [1, 960, 540, 1.2]],
    figs: [
      { k: 'alex', x: 700, y: 870, s: 0.92, flip: 1, walk: [900, 700], dir: -1, exprs: [[0, 'neutral']] },
      { k: 'maya', x: 1250, y: 870, s: 0.92, flip: -1, walk: [1050, 1250], dir: 1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.5, 0.3], glow: 0.85 },
    propsFn: (t) => <Dist x={960} y={270} text={`${(6 + 3 * Math.min(1, t / 50)).toFixed(1)} m`} size={76} color="#F4EEE0" />,
  }),
  // nine meters — string tightens, glow rises
  P3S25: S({
    set: 'courtyard', cam: [[0, 960, 545, 1.18], [1, 960, 540, 1.23]],
    figs: [
      { k: 'alex', x: 480, y: 875, s: 0.9, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1440, y: 875, s: 0.9, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.2, 0.08], glow: [1.0, 1.4], pulse: 0.6 },
    propsFn: (t) => <Dist x={960} y={270} text={`${(8.6 + 0.9 * Math.min(1, t / 45)).toFixed(1)} m`} size={80} color="#FF6A5A" />,
    fx: { streaks: true },
  }),
  // nine and a half — vibration, both lean into the pull
  P3S26: S({
    set: 'courtyard', cam: [[0, 960, 548, 1.22], [1, 960, 543, 1.28]],
    figs: [
      { k: 'alex', x: 380, y: 878, s: 0.9, flip: 1, exprs: [[0, 'shock']], keys: [[0, {}], [0.5, { tilt: -4, look: 1 }]] },
      { k: 'maya', x: 1540, y: 878, s: 0.9, flip: -1, exprs: [[0, 'shock']], keys: [[0, {}], [0.5, { tilt: 4, look: -1 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.03, glow: [1.4, 1.8], pulse: 1.2, width: 6 },
    propsFn: (t) => <Dist x={960} y={270} text={`${(9.5 + 0.4 * Math.min(1, t / 40)).toFixed(1)} m`} size={84} color="#FF6A5A" />,
  }),
  // ten — string ignites
  P3S27: S({
    set: 'courtyard', cam: [[0, 960, 550, 1.25], [1, 960, 545, 1.32]],
    figs: [
      { k: 'alex', x: 300, y: 880, s: 0.9, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1620, y: 880, s: 0.9, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.02, glow: [1.7, 2.1], pulse: 1.5, width: 7 },
    propsFn: () => <Dist x={960} y={270} text="10.0 m" size={96} color="#FF6A5A" />,
    fx: { streaks: true, burstAt: 18 },
  }),
  // WHOOOSH — the string SLAMS them together, motion streaks
  P3S28: S({
    set: 'courtyard', cam: [[0, 960, 550, 1.4], [1, 960, 545, 1.6]],
    figs: [
      { k: 'alex', x: 660, y: 860, s: 1.0, flip: 1, walk: [340, 700], dir: 1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: 10, armL: { a: -40, b: 30 } }]] },
      { k: 'maya', x: 1260, y: 860, s: 1.0, flip: -1, walk: [1580, 1220], dir: -1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: -10, armR: { a: -40, b: 30 } }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.02, 0.3], glow: [2.0, 1.2], pulse: 1.5, width: 7 },
    fx: { streaks: true, shakeAt: 20, shakeAmp: 10 },
  }),
  // they stumble into a pile of fallen leaves — impact burst
  P3S29: S({
    set: 'courtyard', cam: [[0, 985, 570, 1.8], [1, 975, 565, 1.9]],
    figs: [
      { k: 'alex', x: 930, y: 890, s: 1.05, flip: 1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: 14, squash: 0.1 }]] },
      { k: 'maya', x: 1050, y: 885, s: 1.05, flip: -1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: -14, squash: 0.1 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.3, glow: 1.1 },
    props: <Leaves x={990} y={930} s={1.4} />,
    propsFn: (t) => {
      const p = clamp((t - 8) / 20);
      if (p <= 0 || p >= 1) return null;
      // leaves scattering outward
      return (
        <g>
          {Array.from({ length: 10 }, (_, i) => {
            const a = -Math.PI / 2 + (i - 4.5) * 0.35;
            const d = easeOut(p) * (120 + (i % 3) * 50);
            return <ellipse key={i} cx={990 + Math.cos(a) * d} cy={930 + Math.sin(a) * d * 0.6 + p * p * 160} rx={10} ry={5} fill={['#C97B2D', '#E09A3E', '#A85A20'][i % 3]} opacity={1 - p} transform={`rotate(${i * 40 + p * 200} ${990 + Math.cos(a) * d} ${930})`} />;
          })}
        </g>
      );
    },
    fx: { shakeAt: 8, shakeAmp: 16, burstAt: 8 },
  }),
  // "Your fault." / "MY fault? You're the one who kept walking!" — then Maya laughs
  P3S30: S({
    set: 'courtyard', cam: [[0, 985, 565, 1.7], [1, 980, 560, 1.75]],
    figs: [
      { k: 'maya', x: 1040, y: 875, s: 1.0, flip: -1, exprs: [[0, 'worried'], [0.45, 'happy'], [0.7, 'happy']], keys: [[0, { headTilt: 8 }], [0.45, { headTilt: -4 }]] },
      { k: 'alex', x: 920, y: 880, s: 1.0, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried'], [0.7, 'happy']], keys: [[0, { headTilt: -8 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.45, glow: [1.0, 1.4], pulse: 0.5 },
    props: <Leaves x={980} y={935} s={1.6} />,
    say: [
      { text: 'Your fault.', fig: 0, at: 0.05, until: 0.35, maxW: 320, fs: 44 },
      { text: "MY fault? You're the one who kept walking!", fig: 1, at: 0.4, until: 0.9, maxW: 640, fs: 34 },
    ],
    fx: { hearts: true },
  }),
};
