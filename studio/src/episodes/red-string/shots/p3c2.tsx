import React from 'react';
import { ShotMap } from '../../../engine';
import { S, FONT } from './autoKit';

// Scene p3c2 — the ten-meter limit, measured. Montage of them walking apart while a
// distance readout climbs; the string visibly shortens its slack and starts to glow.
// Set: courtyard, wide. Alex left, Maya right.

const Dist: React.FC<{ x: number; y: number; text: string; size?: number; color?: string }> = ({ x, y, text, size = 72, color = '#F4EEE0' }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#1A1230" strokeWidth={6} paintOrder="stroke">{text}</text>
);

// per-shot distance ramp helpers: each shot covers ~1m of the 5→10 climb
const mk = (d0: number, d1: number, extra: Partial<Parameters<typeof S>[0]> = {}) => S({
  set: 'courtyard',
  cam: [[0, 960, 545, 1.15], [1, 960, 540, 1.2]],
  figs: [
    { k: 'alex', x: lerpX(d0), y: 875, s: 0.9, flip: 1, exprs: [[0, 'neutral'], [0.8, 'worried']] },
    { k: 'maya', x: 1920 - lerpX(d0) - 40, y: 875, s: 0.9, flip: -1, exprs: [[0, 'neutral'], [0.8, 'worried']] },
  ],
  str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.4 - d0 * 0.03, 0.35 - d1 * 0.03], glow: [0.7 + d0 * 0.08, 0.75 + d1 * 0.08], pulse: 0.3 },
  propsFn: (t) => <Dist x={960} y={270} text={`${(d0 + (d1 - d0) * Math.min(1, t / 45)).toFixed(1)} m`} size={80} color={d1 >= 9.5 ? '#FF6A5A' : '#F4EEE0'} />,
  ...extra,
});
const lerpX = (d: number) => 960 - 60 * d; // ~60 world px per "meter" for readability

export const p3c2Shots: ShotMap = {
  P3S11: mk(5, 5.6, { cam: [[0, 960, 545, 1.3], [1, 960, 540, 1.35]] }),
  P3S12: mk(5.6, 6.2, { cam: [[0, 960, 545, 1.28], [1, 960, 540, 1.33]] }),
  P3S13: mk(6.2, 6.8, { cam: [[0, 960, 545, 1.25], [1, 960, 540, 1.3]] }),
  P3S14: mk(6.8, 7.4, { cam: [[0, 960, 545, 1.22], [1, 960, 540, 1.27]] }),
  P3S15: mk(7.4, 8.0, { cam: [[0, 960, 545, 1.2], [1, 960, 540, 1.25]] }),
  P3S16: mk(8.0, 8.6, { cam: [[0, 960, 545, 1.18], [1, 960, 540, 1.23]] }),
  P3S17: mk(8.6, 9.2, { cam: [[0, 960, 545, 1.15], [1, 960, 540, 1.2]], fx: { streaks: true } }),
  P3S18: mk(9.2, 9.7, { cam: [[0, 960, 545, 1.12], [1, 960, 540, 1.18]], fx: { dark: 0.1 } }),
  P3S19: mk(9.7, 10.0, {
    cam: [[0, 960, 550, 1.15], [1, 960, 545, 1.22]],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.02, glow: [1.4, 1.9], pulse: 1.4, width: 7 },
    fx: { streaks: true, burstAt: 20 },
  }),
  // 10.0 — the limit: string humming, both frozen, readout blinks
  P3S20: S({
    set: 'courtyard', cam: [[0, 960, 550, 1.2], [1, 960, 545, 1.25]],
    figs: [
      { k: 'alex', x: 300, y: 875, s: 0.9, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1620, y: 875, s: 0.9, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.02, glow: [1.6, 2.0], pulse: 1.6, width: 7 },
    propsFn: (t) => <Dist x={960} y={270} text="10.0 m" size={96} color="#FF6A5A" />,
    fx: { streaks: true, burstAt: 15 },
  }),
};
