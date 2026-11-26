import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p4c2 — the library drag ends at the restroom door: Maya turns, Alex stops
// dead. "Wait! Where are you going?" / "Do you really need to ask?" /
// "Okay! I'll wait here!" — and for the first time the string gives them room.
// Set: library (bookshelves) then a corridor corner for the standoff.

const str = (slack: number | [number, number], glow: number | [number, number] = 0.9) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });

const cam = [[0, 960, 555, 1.3], [1, 960, 550, 1.35]] as [number, number, number, number][];

export const p4c2Shots: ShotMap = {
  // Alex dragged between the bookshelves — weaving, books blurring past
  P4S11: S({
    set: 'library', cam,
    figs: [
      { k: 'alex', x: 720, y: 838, s: 0.95, flip: 1, walk: [480, 860], dir: 1, exprs: [[0, 'dizzy']], keys: [[0, { armL: { a: -40, b: 30 }, armR: { a: -50, b: 40 }, tilt: -6 }]] },
      { k: 'maya', x: 1280, y: 828, s: 0.95, flip: -1, exprs: [[0, 'neutral'], [0.6, 'smug']] },
    ],
    str: str(0.05, 1.4),
    props: (
      <g>
        <rect x={430} y={540} width={70} height={330} fill="#33261B" />
        <rect x={1450} y={540} width={70} height={330} fill="#33261B" />
        <rect x={700} y={560} width={60} height={300} fill="#3A2D20" />
      </g>
    ),
    fx: { streaks: true },
  }),
  // Maya suddenly turns toward the restroom — string goes taut sideways
  P4S12: S({
    set: 'library', cam: [[0, 1100, 565, 1.55], [1, 1095, 560, 1.6]],
    figs: [
      { k: 'maya', x: 1050, y: 832, s: 1.0, flip: 1, exprs: [[0, 'neutral'], [0.3, 'worried']], keys: [[0, {}], [0.25, { spin: 8 }], [0.5, { spin: 0, look: 1 }]] },
      { k: 'alex', x: 700, y: 842, s: 1.0, flip: 1, exprs: [[0, 'dizzy'], [0.4, 'shock']] },
    ],
    str: str([0.3, 0.04], [0.8, 1.5]),
  }),
  // she plants her feet — done following
  P4S13: S({
    set: 'library', cam,
    figs: [
      { k: 'maya', x: 1120, y: 830, s: 1.0, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { armL: { a: 30, b: -15 } }]] },
      { k: 'alex', x: 680, y: 840, s: 1.0, flip: 1, exprs: [[0, 'shock']], keys: [[0, { x: 720 }]] },
    ],
    str: str(0.03, 1.6),
    fx: { shakeAt: 10, shakeAmp: 6 },
  }),
  // "Wait! Where are you going?"
  P4S14: S({
    set: 'library', cam: [[0, 900, 570, 1.7], [1, 895, 565, 1.75]],
    figs: [
      { k: 'alex', x: 800, y: 845, s: 1.05, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, {}], [0.3, { armR: { a: 60, b: -25 } }]] },
      { k: 'maya', x: 1160, y: 835, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.04, 1.3),
    say: [{ text: 'Wait! Where are you going?', fig: 0, at: 0.1, until: 0.9, maxW: 560, fs: 38 }],
  }),
  // Alex pointing after her, string stretched between them
  P4S15: S({
    set: 'library', cam: [[0, 960, 565, 1.55], [1, 960, 560, 1.6]],
    figs: [
      { k: 'alex', x: 780, y: 842, s: 1.02, flip: 1, exprs: [[0, 'worried']], keys: [[0, { armR: { a: 70, b: -15 }, look: 1 }]] },
      { k: 'maya', x: 1180, y: 832, s: 1.02, flip: -1, exprs: [[0, 'neutral'], [0.5, 'smug']] },
    ],
    str: str(0.06, 1.2),
    say: [{ text: 'Wait! Where are you going?', fig: 0, at: 0.05, until: 0.85, maxW: 560, fs: 38 }],
  }),
  // Maya gave him an annoyed look.
  P4S16: S({
    set: 'library', cam: [[0, 1080, 575, 1.75], [1, 1075, 570, 1.8]],
    figs: [
      { k: 'maya', x: 1040, y: 840, s: 1.1, flip: -1, exprs: [[0, 'smug'], [0.4, 'neutral']], keys: [[0, { headTilt: 6, look: -0.6 }]] },
      { k: 'alex', x: 1360, y: 850, s: 1.05, flip: -1, exprs: [[0, 'shock'], [0.5, 'worried']] },
    ],
    str: str(0.5, 0.7),
  }),
  // "Do you really need to ask?"
  P4S17: S({
    set: 'library', cam: [[0, 1080, 575, 1.75], [1, 1075, 570, 1.8]],
    figs: [
      { k: 'maya', x: 1040, y: 840, s: 1.1, flip: -1, exprs: [[0, 'smug']], keys: [[0, { headTilt: 7 }]] },
      { k: 'alex', x: 1360, y: 850, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.5, 0.7),
    say: [{ text: 'Do you really need to ask?', fig: 0, at: 0.15, until: 0.9, maxW: 560, fs: 38 }],
  }),
  // Alex stepped backward — hands up, retreating.
  P4S18: S({
    set: 'library', cam: [[0, 960, 570, 1.6], [1, 960, 565, 1.65]],
    figs: [
      { k: 'alex', x: 760, y: 845, s: 1.05, flip: 1, walk: [900, 720], dir: -1, exprs: [[0, 'oops']], keys: [[0, { armL: { a: 50, b: -30 }, armR: { a: 50, b: -30 } }]] },
      { k: 'maya', x: 1180, y: 835, s: 1.05, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str([0.15, 0.5], [1.0, 0.6]),
    fx: { shakeAt: 12, shakeAmp: 5 },
  }),
  // "Okay! I'll wait here!"
  P4S19: S({
    set: 'library', cam: [[0, 900, 575, 1.7], [1, 895, 570, 1.75]],
    figs: [
      { k: 'alex', x: 800, y: 848, s: 1.1, flip: 1, exprs: [[0, 'oops'], [0.5, 'worried']], keys: [[0, { armL: { a: 40, b: -25 }, armR: { a: 40, b: -25 } }]] },
      { k: 'maya', x: 1250, y: 838, s: 1.1, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str(0.55, 0.55),
    say: [{ text: "Okay! I'll wait here!", fig: 0, at: 0.1, until: 0.9, maxW: 560, fs: 38 }],
  }),
  // For the first time, enough room to stand apart — wide, string sagging free
  P4S20: S({
    set: 'library', cam: [[0, 960, 555, 1.05], [1, 960, 550, 1.1]],
    figs: [
      { k: 'alex', x: 640, y: 850, s: 0.92, flip: 1, exprs: [[0, 'tired'], [0.6, 'neutral']], keys: [[0, { armL: { a: 30, b: -15 }, armR: { a: 30, b: -15 } }]] },
      { k: 'maya', x: 1400, y: 835, s: 0.92, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str([0.5, 0.65], [0.5, 0.7]),
    fx: { tag: '...ROOM TO BREATHE' },
  }),
};
