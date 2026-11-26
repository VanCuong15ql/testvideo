import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p5c2 — the test: Alex deliberately chats up another girl. The string
// tightens, yanks him backward, chair SCRAPES. "What was that?" "Nothing!"
// Maya narrowed her eyes. "Are you sure?"
// Set: classroom. Alex+girl left, Maya right.

const cam = [[0, 960, 555, 1.35], [1, 960, 550, 1.4]] as [number, number, number, number][];
const str = (slack: number | number[], glow: number | number[] = 0.9) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 2, side: 'R' as const }, slack, glow });
const ALEX = { k: 'alex' as const, x: 700, y: 830, s: 0.98, flip: 1 as const };
const MAYA = { k: 'maya' as const, x: 1250, y: 825, s: 0.98, flip: -1 as const };

export const p5c2Shots: ShotMap = {
  // The next day, he deliberately started talking to another girl in class.
  P5S11: S({
    set: 'classroom', cam,
    figs: [
      { ...ALEX, exprs: [[0, 'neutral'], [0.5, 'happy']], keys: [[0, {}], [0.5, { armR: { a: 40, b: -20 }, look: -0.3 }]] },
      { k: 'girl', x: 920, y: 832, s: 0.95, flip: -1, exprs: [[0, 'happy']], keys: [[0, { look: -0.4 }]] },
      { ...MAYA, exprs: [[0, 'neutral'], [0.6, 'worried']], keys: [[0, { look: -0.6 }]] },
    ],
    str: str([0.5, 0.2], [0.8, 1.1]),
  }),
  // He wasn't trying to make anyone jealous.
  P5S12: S({
    set: 'classroom', cam: [[0, 830, 565, 1.55], [1, 825, 560, 1.6]],
    figs: [
      { ...ALEX, x: 760, exprs: [[0, 'neutral']], keys: [[0, { armR: { a: 35, b: -18 } }]] },
      { k: 'girl', x: 980, y: 834, s: 0.97, flip: -1, exprs: [[0, 'happy']] },
      { ...MAYA, x: 1300, exprs: [[0, 'worried'], [0.5, 'smug']] },
    ],
    str: str([0.35, 0.15], 1.0),
  }),
  // He simply wanted to see whether the string would react.
  P5S13: S({
    set: 'classroom', cam,
    figs: [
      { ...ALEX, exprs: [[0, 'neutral'], [0.7, 'worried']], keys: [[0, { look: -0.3, armR: { a: 30, b: -15 } }]] },
      { k: 'girl', x: 920, y: 832, s: 0.95, flip: -1, exprs: [[0, 'happy']] },
      { ...MAYA, exprs: [[0, 'neutral'], [0.7, 'smug']], keys: [[0, { look: -0.7, headTilt: 4 }]] },
    ],
    str: str(0.1, [1.0, 1.5]),
    fx: { streaks: true },
  }),
  // But the moment Maya noticed them talking, the string tightened.
  P5S14: S({
    set: 'classroom', cam: [[0, 970, 560, 1.45], [1, 965, 555, 1.5]],
    figs: [
      { ...ALEX, exprs: [[0, 'shock']], keys: [[0, { x: 700, armL: { a: 20, b: -10 } }], [0.3, { x: 740 }]] },
      { k: 'girl', x: 920, y: 832, s: 0.95, flip: -1, exprs: [[0, 'shock']] },
      { ...MAYA, exprs: [[0, 'smug'], [0.4, 'shock']], keys: [[0, { headTilt: 6, look: -0.8 }]] },
    ],
    str: str(0.02, 1.6),
    fx: { shakeAt: 10, shakeAmp: 8, streaks: true },
  }),
  // Alex was pulled backward — chair scraping across the floor.
  P5S15: S({
    set: 'classroom', cam: [[0, 900, 565, 1.5], [1, 890, 560, 1.55]],
    figs: [
      { k: 'alex', x: 700, y: 835, s: 0.98, flip: 1, walk: [560, 700], dir: -1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: -8, armL: { a: -30, b: 20 }, armR: { a: -40, b: 30 } }]] },
      { k: 'girl', x: 950, y: 834, s: 0.95, flip: -1, exprs: [[0, 'shock']] },
      { ...MAYA, exprs: [[0, 'smug']] },
    ],
    str: str([0.02, 0.25], [1.5, 0.9]),
    fx: { streaks: true },
    propsFn: (t) => {
      const p = Math.min(1, t / 25);
      return (
        <g>
          <rect x={lerpN(640, 780, p)} y={880} width={70} height={10} rx={4} fill="#2A2438" opacity={0.8} />
          {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={lerpN(660, 790, p) - i * 18} cy={892} r={3} fill="#F4EEE0" opacity={0.4 * (1 - p)} />)}
        </g>
      );
    },
  }),
  // His chair scraped across the floor — squeak moment, dust puff
  P5S16: S({
    set: 'classroom', cam: [[0, 880, 570, 1.55], [1, 875, 565, 1.6]],
    figs: [
      { k: 'alex', x: 720, y: 838, s: 0.98, flip: 1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: -6 }]] },
      { k: 'girl', x: 960, y: 834, s: 0.95, flip: -1, exprs: [[0, 'worried']] },
      { ...MAYA, exprs: [[0, 'smug']], keys: [[0, { look: -0.8, headTilt: 6 }]] },
    ],
    str: str(0.2, 1.2),
    fx: { shakeAt: 12, shakeAmp: 5 },
  }),
  // Maya stared at him. "What was that?"
  P5S17: S({
    set: 'classroom', cam: [[0, 1050, 570, 1.65], [1, 1045, 565, 1.7]],
    figs: [
      { ...MAYA, x: 1000, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: -0.7, headTilt: 5 }]] },
      { k: 'alex', x: 720, y: 838, s: 0.98, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.25, glow: 1.3 },
    say: [{ text: 'What was that?', fig: 0, at: 0.15, until: 0.85, maxW: 460, fs: 40 }],
  }),
  // Alex quickly stood up. "Nothing!"
  P5S18: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 740, y: 828, s: 1.0, flip: 1, exprs: [[0, 'oops'], [0.4, 'worried']], keys: [[0, { armR: { a: 30, b: -15 } }], [0.4, { y: 824 }]] },
      { k: 'girl', x: 960, y: 832, s: 0.95, flip: -1, exprs: [[0, 'worried']] },
      { ...MAYA, exprs: [[0, 'smug']] },
    ],
    str: str(0.2, 1.2),
    say: [{ text: 'Nothing!', fig: 0, at: 0.15, until: 0.8, maxW: 340, fs: 44 }],
  }),
  // Maya narrowed her eyes.
  P5S19: S({
    set: 'classroom', cam: [[0, 1120, 575, 1.8], [1, 1115, 570, 1.85]],
    figs: [
      { ...MAYA, x: 1060, y: 830, s: 1.15, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: -0.6, headTilt: 7 }]] },
      { k: 'alex', x: 1420, y: 838, s: 1.1, flip: -1, exprs: [[0, 'worried'], [0.5, 'shock']] },
      { k: 'girl', x: 800, y: 840, s: 1.0, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 2, side: 'L' }, slack: 0.2, glow: 1.4 },
  }),
  // "Are you sure?"
  P5S20: S({
    set: 'classroom', cam: [[0, 1120, 575, 1.8], [1, 1115, 570, 1.85]],
    figs: [
      { ...MAYA, x: 1060, y: 830, s: 1.15, flip: -1, exprs: [[0, 'smug']], keys: [[0, { look: -0.7, headTilt: 6 }]] },
      { k: 'alex', x: 1420, y: 838, s: 1.1, flip: -1, exprs: [[0, 'shock'], [0.5, 'worried']] },
      { k: 'girl', x: 800, y: 840, s: 1.0, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 2, side: 'L' }, slack: 0.2, glow: 1.4 },
    say: [{ text: 'Are you sure?', fig: 0, at: 0.15, until: 0.85, maxW: 400, fs: 42 }],
  }),
};

const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;
