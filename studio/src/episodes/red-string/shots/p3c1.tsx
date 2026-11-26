import React from 'react';
import { ShotMap } from '../../../engine';
import { S, FONT } from './autoKit';

const Dist: React.FC<{ x: number; y: number; text: string; size?: number; color?: string }> = ({ x, y, text, size = 72, color = '#F4EEE0' }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#1A1230" strokeWidth={6} paintOrder="stroke">{text}</text>
);


// Scene p3c1 — after school, the courtyard: they decide to investigate the string.
// Tests: pulling, twisting, hiding under sleeves — nothing works. Then they notice
// the string has a maximum distance. Set: courtyard, golden late-afternoon.

const cam = [[0, 960, 545, 1.5], [1, 960, 540, 1.55]] as [number, number, number, number][];
const A0 = { k: 'alex' as const, x: 800, y: 860, s: 1.0, flip: 1 as const };
const M0 = { k: 'maya' as const, x: 1150, y: 860, s: 1.0, flip: -1 as const };
const str01 = { a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack: [0.4, 0.5], glow: 0.8 };

export const p3c1Shots: ShotMap = {
  // After school — Alex and Maya face each other in the courtyard, string between
  P3S1: S({
    set: 'courtyard', cam,
    figs: [
      { ...A0, exprs: [[0, 'neutral'], [0.5, 'smug']] },
      { ...M0, exprs: [[0, 'neutral']] },
    ],
    str: str01,
    fx: { tag: 'AFTER SCHOOL' },
  }),
  // "They tested everything. Pulling it." — Alex hauls on the thread
  P3S2: S({
    set: 'courtyard', cam: [[0, 900, 560, 1.7], [1, 890, 555, 1.75]],
    figs: [
      { k: 'alex', x: 760, y: 870, s: 1.1, flip: 1, exprs: [[0, 'neutral'], [0.7, 'worried']], keys: [[0, {}], [0.3, { armL: { a: 60, b: -40 } }], [0.7, { armL: { a: 70, b: -45 } }]] },
      { k: 'maya', x: 1160, y: 865, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.3, 0.12], glow: [0.8, 1.3], pulse: 0.8 },
    fx: { shakeAt: 20, shakeAmp: 6 },
  }),
  // "Twisting it." — both grab and twist, string corkscrews
  P3S3: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 800, y: 865, s: 1.05, flip: 1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.5, { armR: { a: 40, b: -90 }, spin: 10 }]] },
      { k: 'maya', x: 1140, y: 860, s: 1.05, flip: -1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.5, { armL: { a: 40, b: -90 }, spin: -10 }]] },
    ],
    str: { a: { f: 0, side: 'R' }, b: { f: 1, side: 'L' }, slack: 0.5, glow: 0.9, pulse: 0.4 },
  }),
  // "Trying to hide it under their sleeves." — close on arms
  P3S4: S({
    set: 'courtyard', cam: [[0, 700, 640, 2.6], [1, 700, 635, 2.7]],
    figs: [
      { k: 'alex', x: 640, y: 900, s: 1.4, flip: 1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.6, { armL: { a: 80, b: -60 } }]] },
      { k: 'maya', x: 980, y: 900, s: 1.4, flip: -1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.6, { armR: { a: 80, b: -60 } }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.5, glow: 0.85 },
    fx: { tag: 'STILL THERE' },
  }),
  // "Nothing worked." — they drop their hands, string still glowing
  P3S5: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 800, y: 865, s: 1.0, flip: 1, exprs: [[0, 'neutral'], [0.5, 'tired']] },
      { k: 'maya', x: 1150, y: 860, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']] },
    ],
    str: { ...str01, glow: [0.8, 1.1] },
    fx: { dark: 0.1 },
  }),
  // "Then they discovered something even stranger." — string shimmer macro
  P3S6: S({
    set: 'courtyard', cam: [[0, 975, 600, 2.2], [1, 975, 595, 2.4]],
    figs: [
      { k: 'alex', x: 760, y: 880, s: 1.2, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1190, y: 875, s: 1.2, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.3, glow: [0.9, 1.5], pulse: 1.2, width: 5 },
    fx: { burstAt: 15 },
  }),
  // "The string had a maximum distance." — wide, they start apart
  P3S7: S({
    set: 'courtyard', cam: [[0, 960, 540, 1.0], [1, 960, 535, 1.05]],
    figs: [
      { k: 'alex', x: 560, y: 870, s: 0.9, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'maya', x: 1360, y: 870, s: 0.9, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.55, glow: 0.7 },
    props: <Dist x={960} y={300} text="maximum distance?" size={52} color="#FF6A5A" />,
  }),
  // they step apart — distance counter begins
  P3S8: S({
    set: 'courtyard', cam: [[0, 960, 545, 1.1], [1, 960, 540, 1.15]],
    figs: [
      { k: 'alex', x: 460, y: 875, s: 0.9, flip: 1, walk: [700, 460], dir: -1, exprs: [[0, 'neutral']] },
      { k: 'maya', x: 1460, y: 875, s: 0.9, flip: -1, walk: [1220, 1460], dir: 1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.5, 0.3], glow: [0.7, 0.9] },
    propsFn: (t) => {
      const m = Math.round(lerpN(t, 5, 8));
      return <Dist x={960} y={280} text={`${m} m`} size={72} color="#F4EEE0" />;
    },
  }),
  // further — string starts to hum, glow up
  P3S9: S({
    set: 'courtyard', cam: [[0, 960, 545, 1.15], [1, 960, 540, 1.2]],
    figs: [
      { k: 'alex', x: 380, y: 875, s: 0.9, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1540, y: 875, s: 0.9, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: [0.3, 0.12], glow: [0.9, 1.3], pulse: 0.7 },
    propsFn: (t) => <Dist x={960} y={280} text={`${Math.round(lerpN(t, 8, 9.4))} m`} size={72} color="#FF6A5A" />,
  }),
  // at the edge — both freeze, string vibrating
  P3S10: S({
    set: 'courtyard', cam: [[0, 960, 550, 1.2], [1, 960, 545, 1.25]],
    figs: [
      { k: 'alex', x: 330, y: 875, s: 0.9, flip: 1, exprs: [[0, 'shock']], keys: [[0, {}], [0.5, { look: 1 }]] },
      { k: 'maya', x: 1590, y: 875, s: 0.9, flip: -1, exprs: [[0, 'shock']], keys: [[0, {}], [0.5, { look: -1 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.05, glow: [1.3, 1.7], pulse: 1.2, width: 6 },
    propsFn: (t) => <Dist x={960} y={280} text={`${(9.4 + lerpN(t, 0, 0.6)).toFixed(1)} m`} size={72} color="#FF6A5A" />,
    fx: { streaks: true },
  }),
};

const lerpN = (t: number, a: number, b: number) => a + (b - a) * Math.min(1, t / 40);


