import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p4c4 — "Your relationship." / Alex nearly chokes / "There is no relationship!"
// / "Then why does she look happier than you?" / she looks away — and his heart
// beats faster. Cafeteria two-shot tightening into a three-shot.

const str = (slack = 0.4, glow = 0.75) => ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });
const cam = [[0, 960, 575, 1.5], [1, 960, 570, 1.55]] as [number, number, number, number][];

export const p4c4Shots: ShotMap = {
  // "Your relationship."
  P4S31: S({
    set: 'cafeteria', cam: [[0, 1100, 580, 1.65], [1, 1095, 575, 1.7]],
    figs: [
      { k: 'sam', x: 1020, y: 818, s: 1.1, flip: -1, exprs: [[0, 'smug']], keys: [[0, { headTilt: 4 }]] },
      { k: 'alex', x: 1330, y: 812, s: 1.1, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: str(0.4, 0.7),
    say: [{ text: 'Your relationship.', fig: 0, at: 0.1, until: 0.85, maxW: 460, fs: 42 }],
  }),
  // Alex nearly choked.
  P4S32: S({
    set: 'cafeteria', cam: [[0, 1250, 585, 1.75], [1, 1245, 580, 1.8]],
    figs: [
      { k: 'alex', x: 1180, y: 815, s: 1.15, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { headTilt: -8, armR: { a: 40, b: -20 } }]] },
      { k: 'sam', x: 1520, y: 822, s: 1.15, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.4, 0.7),
    fx: { shakeAt: 8, shakeAmp: 4 },
  }),
  // "There is no relationship!"
  P4S33: S({
    set: 'cafeteria', cam,
    figs: [
      { k: 'alex', x: 900, y: 812, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.3, 'shock']], keys: [[0, { armR: { a: 70, b: -20 } }], [0.4, { armR: { a: 20, b: -10 } }]] },
      { k: 'sam', x: 1250, y: 818, s: 1.1, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.4, 0.7),
    say: [{ text: 'There is no relationship!', fig: 0, at: 0.15, until: 0.9, maxW: 640, fs: 38 }],
  }),
  // Sam looked at Maya, who was standing beside him.
  P4S34: S({
    set: 'cafeteria', cam: [[0, 1050, 575, 1.5], [1, 1045, 570, 1.55]],
    figs: [
      { k: 'sam', x: 980, y: 815, s: 1.05, flip: 1, exprs: [[0, 'smug']], keys: [[0, { look: 0.6 }]] },
      { k: 'maya', x: 850, y: 810, s: 1.0, flip: 1, exprs: [[0, 'neutral'], [0.5, 'smug']], keys: [[0, {}]] },
      { k: 'alex', x: 1350, y: 815, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 2, side: 'L' }, b: { f: 0, side: 'R' }, slack: 0.4, glow: 0.7 },
    props: <rect x={800} y={745} width={330} height={14} rx={6} fill="#4A3A28" />,
  }),
  // "Then why does she look happier than you?"
  P4S35: S({
    set: 'cafeteria', cam: [[0, 1050, 575, 1.55], [1, 1045, 570, 1.6]],
    figs: [
      { k: 'sam', x: 980, y: 815, s: 1.05, flip: 1, exprs: [[0, 'smug']], keys: [[0, { look: 0.6 }]] },
      { k: 'maya', x: 850, y: 810, s: 1.0, flip: 1, exprs: [[0, 'happy']] },
      { k: 'alex', x: 1350, y: 815, s: 1.05, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 2, side: 'L' }, b: { f: 0, side: 'R' }, slack: 0.4, glow: 0.7 },
    say: [{ text: 'Then why does she look happier than you?', fig: 0, at: 0.1, until: 0.9, maxW: 640, fs: 34 }],
  }),
  // Alex turned toward Maya.
  P4S36: S({
    set: 'cafeteria', cam: [[0, 1150, 580, 1.65], [1, 1145, 575, 1.7]],
    figs: [
      { k: 'alex', x: 1050, y: 812, s: 1.1, flip: 1, exprs: [[0, 'worried'], [0.5, 'shock']], keys: [[0, { look: -0.8, headTilt: 5 }]] },
      { k: 'maya', x: 1350, y: 808, s: 1.05, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: 0.5 }]] },
      { k: 'sam', x: 700, y: 818, s: 1.05, flip: 1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 1, side: 'L' }, b: { f: 0, side: 'R' }, slack: 0.4, glow: 0.75 },
  }),
  // She quickly looked away.
  P4S37: S({
    set: 'cafeteria', cam: [[0, 1150, 580, 1.7], [1, 1145, 575, 1.75]],
    figs: [
      { k: 'alex', x: 1050, y: 812, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: -0.7 }]] },
      { k: 'maya', x: 1350, y: 808, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.4, 'smug']], keys: [[0, { look: -0.6, headTilt: 5 }]] },
      { k: 'sam', x: 720, y: 818, s: 1.05, flip: 1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 1, side: 'L' }, b: { f: 0, side: 'R' }, slack: 0.35, glow: [0.8, 1.3], pulse: 0.9 },
    fx: { burstAt: 14 },
  }),
  // And for some reason, that made his heart beat faster.
  P4S38: S({
    set: 'cafeteria', cam: [[0, 1100, 575, 1.6], [1, 1095, 570, 1.65]],
    figs: [
      { k: 'alex', x: 1020, y: 812, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.7, 'worried']], keys: [[0, { look: -0.7, headTilt: 4 }]] },
      { k: 'maya', x: 1330, y: 808, s: 1.05, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.3, glow: [1.2, 1.6], pulse: 1.3, width: 6 },
    props: (
      <g transform="translate(1020 730)">
        <path d="M 0 12 C -22 -8 -34 8 -18 20 C -8 28 0 34 0 34 C 0 34 8 28 18 20 C 34 8 22 -8 0 12 Z" fill="#E86A92" opacity={0.9} transform="scale(1.4)" />
      </g>
    ),
    fx: { hearts: true },
  }),
};
