import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Lunchbox, DrinkCup } from './autoKit';

// Scene p2c4 — Sam stares at Alex over the lunch table: "Bro... are you sure you're
// not dating her?" / "I wish I knew." Close two-shot, sandwich still on the floor.

const cam = [[0, 820, 575, 1.55], [1, 815, 570, 1.6]] as [number, number, number, number][];
const props = (
  <g>
    <rect x={480} y={730} width={230} height={16} rx={6} fill="#4A3A28" />
    <rect x={495} y={746} width={14} height={54} fill="#3A2D20" />
    <rect x={680} y={746} width={14} height={54} fill="#3A2D20" />
    <Lunchbox x={560} y={700} s={0.9} rot={20} open={0.8} />
    <DrinkCup x={660} y={704} s={0.9} color="#E9C46A" />
    {/* sandwich still on the floor */}
    <ellipse cx={980} cy={950} rx={60} ry={14} fill="#000" opacity={0.15} />
  </g>
);
const str = { a: { f: 0, side: 'L' as const }, b: { p: [1500, 700] as [number, number] }, slack: 0.6, glow: [0.7, 0.4] };

export const p2c4Shots: ShotMap = {
  // Sam stared at him.
  P2S31: S({
    set: 'cafeteria', cam,
    figs: [
      { k: 'sam', x: 500, y: 810, s: 0.97, flip: 1, exprs: [[0, 'neutral'], [0.3, 'smug']], keys: [[0, {}], [0.4, { look: 0.4 }]] },
      { k: 'alex', x: 760, y: 805, s: 1.0, flip: 1, exprs: [[0, 'worried']] },
    ],
    str, props,
    say: [{ text: "Bro... are you sure you're not dating her?", fig: 0, at: 0.25, until: 0.95, maxW: 620, fs: 36 }],
  }),
  // "Bro... are you sure you're not dating her?" — Alex can't meet his eyes
  P2S32: S({
    set: 'cafeteria', cam: [[0, 850, 580, 1.6], [1, 845, 575, 1.65]],
    figs: [
      { k: 'sam', x: 520, y: 812, s: 0.98, flip: 1, exprs: [[0, 'smug']], keys: [[0, {}], [0.5, { headTilt: 5 }]] },
      { k: 'alex', x: 790, y: 808, s: 1.0, flip: 1, exprs: [[0, 'worried']], keys: [[0, {}], [0.6, { look: -0.3, headTilt: 6 }]] },
    ],
    str, props,
    say: [{ text: "Bro... are you sure you're not dating her?", fig: 0, at: 0.05, until: 0.9, maxW: 620, fs: 36 }],
  }),
  // Alex sighed — shoulders drop, breath out
  P2S33: S({
    set: 'cafeteria', cam,
    figs: [
      { k: 'sam', x: 500, y: 810, s: 0.97, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 760, y: 805, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, {}], [0.4, { headTilt: 8, armL: { a: 10, b: -5 } }]] },
    ],
    str: { ...str, glow: [0.7, 0.3] }, props,
    fx: { dark: 0.15 },
  }),
  // "I wish I knew."
  P2S34: S({
    set: 'cafeteria', cam: [[0, 960, 580, 1.35], [1, 960, 575, 1.4]],
    figs: [
      { k: 'sam', x: 560, y: 810, s: 0.95, flip: 1, exprs: [[0, 'neutral'], [0.5, 'shock']] },
      { k: 'alex', x: 800, y: 805, s: 1.0, flip: 1, exprs: [[0, 'tired']] },
      { k: 'maya', x: 1250, y: 800, s: 0.95, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: 0.5, glow: 0.6 },
    props,
    say: [{ text: 'I wish I knew.', fig: 0, at: 0.2, until: 0.95, maxW: 420, fs: 40 }],
  }),
};
