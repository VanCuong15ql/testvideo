import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';
import { ShadowFigure } from './common';

// Scene p4c3 — spotted everywhere: cafeteria, library, school gate. The rumor
// hardens into "secretly dating". Then Sam corners Alex, dead serious.
// Sets rotate: cafeteria → library → gate → hallway standoff.

const Crowd: React.FC<{ pts?: [number, number, number, 1 | -1, string][] }> = ({ pts }) => (
  <g>
    {(pts ?? [
      [420, 730, 0.7, 1, 'whisper'], [560, 720, 0.66, -1, 'point'], [1500, 725, 0.7, -1, 'whisper'], [1640, 735, 0.62, -1, 'idle'],
    ] as [number, number, number, 1 | -1, string][]).map(([x, y, s, f, m], i) => (
      <ShadowFigure key={i} x={x} y={y} s={s} flip={f} mood={m as never} t={i * 17} opacity={0.72} />
    ))}
  </g>
);

const str = (slack = 0.4, glow = 0.9) => ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });

export const p4c3Shots: ShotMap = {
  // But their classmates noticed them everywhere — hallway, heads turning
  P4S21: S({
    set: 'hallway', cam: [[0, 960, 575, 1.3], [1, 960, 570, 1.35]],
    figs: [
      { k: 'alex', x: 700, y: 800, s: 0.95, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1250, y: 790, s: 0.95, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.45, 0.8),
    props: <Crowd/>,
    fx: { tag: 'THEY NOTICE' },
  }),
  // At the cafeteria.
  P4S22: S({
    set: 'cafeteria', cam: [[0, 960, 560, 1.25], [1, 960, 555, 1.3]],
    figs: [
      { k: 'alex', x: 720, y: 810, s: 0.92, flip: 1, exprs: [[0, 'tired']] },
      { k: 'maya', x: 1220, y: 800, s: 0.92, flip: -1, exprs: [[0, 'neutral']] },
      { k: 'sam', x: 500, y: 815, s: 0.9, flip: 1, exprs: [[0, 'smug']] },
    ],
    str: str(0.5, 0.7),
    props: <Crowd pts={[[380, 720, 0.68, 1, 'whisper'], [1450, 715, 0.7, -1, 'point'], [1600, 725, 0.64, -1, 'whisper']]} />,
    fx: { tag: 'CAFETERIA' },
  }),
  // In the library.
  P4S23: S({
    set: 'library', cam: [[0, 960, 555, 1.2], [1, 960, 550, 1.25]],
    figs: [
      { k: 'alex', x: 700, y: 840, s: 0.95, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1250, y: 830, s: 0.95, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.4, 0.85),
    props: (
      <g>
        <Crowd pts={[[400, 730, 0.68, 1, 'point'], [1520, 720, 0.7, -1, 'whisper'], [1660, 730, 0.62, -1, 'idle']]} />
        <rect x={480} y={540} width={60} height={330} fill="#33261B" />
        <rect x={1380} y={540} width={60} height={330} fill="#33261B" />
      </g>
    ),
    fx: { tag: 'LIBRARY' },
  }),
  // Outside the school gate.
  P4S24: S({
    set: 'gate', cam: [[0, 960, 555, 1.25], [1, 960, 550, 1.3]],
    figs: [
      { k: 'alex', x: 780, y: 870, s: 0.98, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1180, y: 865, s: 0.98, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.4, 0.85),
    props: <Crowd pts={[[500, 780, 0.7, 1, 'whisper'], [1400, 775, 0.72, -1, 'point'], [1550, 785, 0.65, -1, 'whisper']]} />,
    fx: { tag: 'SCHOOL GATE' },
  }),
  // By the end of the day, everyone was convinced they were secretly dating.
  P4S25: S({
    set: 'hallway', cam: [[0, 960, 570, 1.15], [1, 960, 565, 1.2]],
    figs: [
      { k: 'alex', x: 700, y: 805, s: 0.9, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1250, y: 795, s: 0.9, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: str(0.45, 0.75),
    props: <Crowd/>,
    fx: { dark: 0.18, tag: 'SECRETLY DATING?' },
  }),
  // the rumor has won — string feels heavier
  P4S26: S({
    set: 'cafeteria', cam: [[0, 960, 560, 1.15], [1, 960, 555, 1.2]],
    figs: [
      { k: 'alex', x: 750, y: 815, s: 0.9, flip: 1, exprs: [[0, 'tired']] },
      { k: 'maya', x: 1200, y: 805, s: 0.9, flip: -1, exprs: [[0, 'neutral']] },
      { k: 'sam', x: 520, y: 820, s: 0.88, flip: 1, exprs: [[0, 'neutral'], [0.5, 'smug']] },
    ],
    str: str(0.55, 0.6),
    props: <Crowd pts={[[1650, 720, 0.66, -1, 'whisper']]} />,
  }),
  // Sam approached Alex with a serious expression.
  P4S27: S({
    set: 'cafeteria', cam: [[0, 900, 575, 1.6], [1, 895, 570, 1.65]],
    figs: [
      { k: 'sam', x: 820, y: 815, s: 1.05, flip: 1, exprs: [[0, 'neutral'], [0.4, 'smug']], keys: [[0, {}], [0.4, { look: 1, headTilt: 3 }]] },
      { k: 'alex', x: 1120, y: 810, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.5, 0.6),
    props: (
      <g>
        <rect x={700} y={740} width={200} height={14} rx={6} fill="#4A3A28" />
        <rect x={715} y={754} width={12} height={46} fill="#3A2D20" />
        <rect x={875} y={754} width={12} height={46} fill="#3A2D20" />
      </g>
    ),
    fx: { tag: 'SERIOUS FACE' },
  }),
  // "Just tell me one thing. When were you planning to announce it?"
  P4S28: S({
    set: 'cafeteria', cam: [[0, 930, 575, 1.65], [1, 925, 570, 1.7]],
    figs: [
      { k: 'sam', x: 880, y: 818, s: 1.08, flip: 1, exprs: [[0, 'smug']], keys: [[0, {}], [0.4, { headTilt: 4 }]] },
      { k: 'alex', x: 1180, y: 812, s: 1.08, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: str(0.45, 0.65),
    say: [{ text: 'Just tell me one thing. When were you planning to announce it?', fig: 0, at: 0.05, until: 0.95, maxW: 700, fs: 34 }],
  }),
  // "Announce what?"
  P4S29: S({
    set: 'cafeteria', cam: [[0, 1050, 580, 1.7], [1, 1045, 575, 1.75]],
    figs: [
      { k: 'alex', x: 1000, y: 815, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { headTilt: -5 }]] },
      { k: 'sam', x: 1330, y: 820, s: 1.1, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.4, 0.7),
    say: [{ text: 'Announce what?', fig: 0, at: 0.2, until: 0.9, maxW: 420, fs: 42 }],
  }),
  // Sam doesn't blink.
  P4S30: S({
    set: 'cafeteria', cam: [[0, 1180, 585, 1.8], [1, 1175, 580, 1.85]],
    figs: [
      { k: 'sam', x: 1120, y: 822, s: 1.15, flip: -1, exprs: [[0, 'smug'], [0.5, 'neutral']], keys: [[0, { look: -0.5, headTilt: 3 }]] },
      { k: 'alex', x: 1450, y: 818, s: 1.1, flip: -1, exprs: [[0, 'worried'], [0.6, 'shock']] },
    ],
    str: str(0.4, 0.7),
    fx: { dark: 0.1 },
  }),
};
