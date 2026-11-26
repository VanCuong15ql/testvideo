import React from 'react';
import { ShotMap } from '../../../engine';
import { S, Lunchbox, Sandwich, DrinkCup, lerp, easeIn, easeInOut } from './autoKit';
import { ShadowFigure } from './common';

// Scene p2c3 — lunch: Alex & Sam at a table, Maya pointedly chooses another table,
// the string yanks the lunchbox off and the sandwich hits the floor.
// Set: cafeteria. Tables midground; Alex/Sam left-center, Maya right.

const A = { k: 'alex' as const, x: 700, y: 800, s: 0.95, flip: 1 as const };
const SM = { k: 'sam' as const, x: 520, y: 810, s: 0.92, flip: 1 as const };
const M = { k: 'maya' as const, x: 1250, y: 800, s: 0.95, flip: -1 as const };
const cam = [[0, 960, 560, 1.4], [1, 960, 555, 1.45]] as [number, number, number, number][];
const table = (x: number) => (
  <g key={x} transform={`translate(${x} 800)`}>
    <rect x={-110} y={-70} width={220} height={16} rx={6} fill="#4A3A28" />
    <rect x={-100} y={-54} width={14} height={54} fill="#3A2D20" />
    <rect x={86} y={-54} width={14} height={54} fill="#3A2D20" />
  </g>
);

export const p2c3Shots: ShotMap = {
  // "I mean... that's not what I meant!" — Alex backpedaling
  P2S21: S({
    set: 'cafeteria', cam: [[0, 1150, 580, 1.55], [1, 1140, 575, 1.6]],
    figs: [
      { ...A, x: 1150, exprs: [[0, 'oops'], [0.6, 'worried']], keys: [[0, {}], [0.5, { armR: { a: 40, b: -18 } }]] },
      { ...M, x: 880, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.45, glow: 0.75 },
    say: [{ text: "I mean... that's not what I meant!", fig: 0, at: 0.05, until: 0.95, maxW: 640, fs: 36 }],
  }),
  // But it was too late — Maya already walking off, Alex small behind
  P2S22: S({
    set: 'cafeteria', cam,
    figs: [
      { k: 'maya', x: 1150, y: 795, s: 0.95, walk: [1250, 1050], dir: -1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 620, y: 810, s: 0.9, flip: 1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: [0.6, 0.15], glow: 0.85 },
  }),
  // The school rumor had already started — whisper crowd at tables
  P2S23: S({
    set: 'cafeteria', cam: [[0, 960, 560, 1.25], [1, 960, 555, 1.3]],
    figs: [
      { k: 'alex', x: 700, y: 810, s: 0.9, flip: 1, exprs: [[0, 'worried']] },
      { k: 'sam', x: 520, y: 815, s: 0.88, flip: 1, exprs: [[0, 'smug']] },
      { k: 'maya', x: 1250, y: 800, s: 0.92, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: 0.3, glow: 0.8 },
    props: (
      <g>
        <ShadowFigure x={420} y={720} s={0.7} flip={1} mood="whisper" t={0} opacity={0.75} />
        <ShadowFigure x={1500} y={715} s={0.72} flip={-1} mood="point" t={10} opacity={0.75} />
        <ShadowFigure x={1650} y={725} s={0.66} flip={-1} mood="whisper" t={22} opacity={0.7} />
      </g>
    ),
  }),
  // Things got worse during lunch — wide cafeteria
  P2S24: S({
    set: 'cafeteria', cam: [[0, 960, 555, 1.1], [1, 960, 550, 1.15]],
    figs: [
      { k: 'alex', x: 700, y: 810, s: 0.9, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'sam', x: 520, y: 815, s: 0.88, flip: 1, exprs: [[0, 'happy']] },
      { k: 'maya', x: 1330, y: 795, s: 0.92, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: [0.3, 0.5], glow: [0.8, 0.6] },
    props: (
      <g>
        {table(620)}{table(1400)}{table(950)}
        <Lunchbox x={640} y={726} s={1} />
        <DrinkCup x={520} y={730} s={1} color="#E9C46A" />
        <DrinkCup x={760} y={730} s={1} color="#3E8C86" />
      </g>
    ),
    fx: { tag: 'LUNCH' },
  }),
  // Alex sat with Sam, hoping for normal
  P2S25: S({
    set: 'cafeteria', cam: [[0, 820, 580, 1.5], [1, 815, 575, 1.55]],
    figs: [
      { k: 'alex', x: 700, y: 800, s: 0.98, flip: 1, exprs: [[0, 'neutral'], [0.7, 'worried']], keys: [[0, {}], [0.5, { armR: { a: 30, b: -14 } }]] },
      { k: 'sam', x: 500, y: 810, s: 0.95, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [1500, 700] }, slack: 0.8, glow: [0.5, 0.2], gone: [0, 0.4] },
    props: (
      <g>
        {table(600)}
        <Lunchbox x={650} y={726} s={1} />
        <Sandwich x={590} y={722} s={0.9} />
        <DrinkCup x={540} y={728} s={1} color="#E9C46A" />
      </g>
    ),
  }),
  // barely opened his lunchbox — Sam leans in
  P2S26: S({
    set: 'cafeteria', cam: [[0, 800, 575, 1.55], [1, 795, 570, 1.6]],
    figs: [
      { k: 'alex', x: 680, y: 800, s: 1.0, flip: 1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.4, { armR: { a: 55, b: -30 } }]] },
      { k: 'sam', x: 480, y: 810, s: 0.97, flip: 1, exprs: [[0, 'happy'], [0.6, 'neutral']], keys: [[0, {}], [0.5, { look: 0.5 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { p: [1500, 700] }, slack: 0.85, glow: [0.4, 0.15], gone: [0, 0.6] },
    props: (
      <g>
        {table(580)}
        <Lunchbox x={640} y={724} s={1} open={0.6} />
        <Sandwich x={585} y={720} s={0.9} />
      </g>
    ),
  }),
  // Maya walked toward another table — string visibly tautening
  P2S27: S({
    set: 'cafeteria', cam,
    figs: [
      { k: 'alex', x: 680, y: 800, s: 0.98, flip: 1, exprs: [[0, 'neutral'], [0.8, 'worried']] },
      { k: 'sam', x: 490, y: 808, s: 0.95, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'maya', x: 1050, y: 795, s: 0.95, walk: [1330, 1050], dir: -1, exprs: [[0, 'neutral'], [0.8, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: [0.4, 0.08], glow: [0.7, 1.2], pulse: 0.6 },
    props: (
      <g>
        {table(580)}{table(1150)}{table(1500)}
        <Lunchbox x={640} y={724} s={1} open={0.6} />
        <Sandwich x={585} y={720} s={0.9} />
      </g>
    ),
  }),
  // The string pulled tight — tension macro feel, glow max
  P2S28: S({
    set: 'cafeteria', cam: [[0, 950, 570, 1.6], [1, 940, 565, 1.7]],
    figs: [
      { k: 'alex', x: 800, y: 810, s: 1.0, flip: 1, exprs: [[0, 'shock']], keys: [[0, {}], [0.3, { x: 830 }]] },
      { k: 'maya', x: 1120, y: 800, s: 0.98, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.02, glow: [1.2, 1.6], pulse: 1.4, width: 6 },
    fx: { streaks: true },
  }),
  // Alex's lunchbox flew off the table — impact + shake
  P2S29: S({
    set: 'cafeteria', cam: [[0, 860, 575, 1.55], [1, 850, 570, 1.65]],
    figs: [
      { k: 'alex', x: 800, y: 815, s: 1.0, flip: 1, exprs: [[0, 'shock']], keys: [[0, {}], [0.3, { x: 860, armL: { a: -50, b: 30 }, armR: { a: -60, b: 40 }, tilt: -6 }]] },
      { k: 'sam', x: 560, y: 815, s: 0.95, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1150, y: 800, s: 0.98, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: [0.05, 0.4], glow: 1.2 },
    props: (
      <g>
        {table(600)}{table(1250)}
      </g>
    ),
    propsFn: (t) => {
      const p = Math.min(1, t / 22);
      const bx = lerp(640, 980, easeIn(p));
      const by = lerp(724, 905, p * p) - Math.sin(p * Math.PI) * 60;
      return (
        <g>
          <Lunchbox x={bx} y={by} s={0.9} rot={p * 340} open={0.8} />
          <Sandwich x={lerp(585, 960, easeInOut(p))} y={lerp(720, 898, p * p)} s={0.9} rot={-20 - p * 200} />
        </g>
      );
    },
    fx: { shakeAt: 12, shakeAmp: 12, burstAt: 10 },
  }),
  // His sandwich landed on the floor — sad tableau
  P2S30: S({
    set: 'cafeteria', cam: [[0, 860, 590, 1.5], [1, 855, 585, 1.55]],
    figs: [
      { k: 'alex', x: 830, y: 820, s: 1.0, flip: 1, exprs: [[0, 'worried']], keys: [[0, { armR: { a: 30, b: -15 } }]] },
      { k: 'sam', x: 580, y: 818, s: 0.95, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1180, y: 805, s: 0.98, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 2, side: 'R' }, slack: 0.5, glow: 0.8 },
    props: (
      <g>
        {table(620)}{table(1280)}
        <Lunchbox x={900} y={870} s={0.9} rot={30} open={0.8} />
        <Sandwich x={960} y={905} s={1} rot={-15} />
      </g>
    ),
    fx: { tag: 'OH NO' },
  }),
};
