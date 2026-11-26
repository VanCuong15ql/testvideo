import React from 'react';
import { ShotMap } from '../../../engine';
import { S, NotebookProp, DrinkCup, FloatLabel } from './autoKit';
import { ShadowFigure } from './common';

// Scene p4c1 — morning: the string connects their SCHEDULES. Maya buys a notebook,
// Alex follows; Maya wants a drink, Alex ends up in line; Maya hits the library,
// Alex is dragged between the shelves. Sets: kiosk, cafeteria-line, library.

const cam = [[0, 960, 555, 1.4], [1, 960, 550, 1.45]] as [number, number, number, number][];
const str = (slack: number | [number, number], glow: number | [number, number] = 0.9) =>
  ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack, glow });

export const p4c1Shots: ShotMap = {
  // The next morning — Alex wakes to the string already taut toward the door
  P4S1: S({
    set: 'dawn', cam: [[0, 900, 560, 1.5], [1, 895, 555, 1.55]],
    figs: [
      { k: 'alex', x: 860, y: 840, s: 1.0, flip: 1, exprs: [[0, 'tired'], [0.6, 'shock']], keys: [[0, { headTilt: 6 }]] },
      { k: 'maya', x: 1250, y: 800, s: 0.95, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { a: { p: [980, 700] }, b: { f: 1, side: 'R' }, slack: [0.5, 0.15], glow: [0.8, 1.3] },
    fx: { tag: 'NEXT MORNING' },
  }),
  // it didn't just connect their hands — it connects their schedules
  P4S2: S({
    set: 'kiosk', cam: [[0, 960, 555, 1.4], [1, 960, 550, 1.45]],
    figs: [
      { k: 'maya', x: 900, y: 840, s: 1.0, flip: 1, walk: [1100, 900], dir: -1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 700, y: 845, s: 1.0, flip: 1, walk: [500, 700], dir: 1, exprs: [[0, 'worried']] },
    ],
    str: str([0.4, 0.1], [0.9, 1.4]),
  }),
  // Whenever one of them went somewhere, the other had to follow.
  P4S3: S({
    set: 'kiosk', cam: [[0, 960, 555, 1.45], [1, 960, 550, 1.5]],
    figs: [
      { k: 'maya', x: 1000, y: 840, s: 1.0, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 800, y: 845, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.7, 'tired']], keys: [[0, {}], [0.5, { headTilt: 7 }]] },
    ],
    str: str(0.12, 1.2),
    props: <ShadowFigure x={1400} y={760} s={0.7} flip={-1} mood="idle" t={0} opacity={0.5} />,
  }),
  // Maya needed to buy a notebook.
  P4S4: S({
    set: 'kiosk', cam: [[0, 1050, 570, 1.7], [1, 1045, 565, 1.75]],
    figs: [
      { k: 'maya', x: 980, y: 845, s: 1.05, flip: -1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.5, { armR: { a: 50, b: -25 } }]] },
      { k: 'alex', x: 1330, y: 850, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.1, 1.1),
    props: <NotebookProp x={1010} y={720} s={1} />,
  }),
  // Alex had to go with her.
  P4S5: S({
    set: 'kiosk', cam,
    figs: [
      { k: 'maya', x: 950, y: 840, s: 1.0, flip: 1, exprs: [[0, 'smug']] },
      { k: 'alex', x: 760, y: 845, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.6, 'tired']], keys: [[0, { armL: { a: 20, b: -10 } }]] },
    ],
    str: str(0.15, 1.0),
    props: <NotebookProp x={990} y={700} s={1} />,
  }),
  // Maya wanted a drink.
  P4S6: S({
    set: 'cafeteria', cam: [[0, 1050, 570, 1.6], [1, 1045, 565, 1.65]],
    figs: [
      { k: 'maya', x: 1000, y: 840, s: 1.05, flip: -1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.5, { armR: { a: 55, b: -22 } }]] },
      { k: 'alex', x: 1250, y: 845, s: 1.0, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.1, 1.1),
    props: <DrinkCup x={1030} y={715} s={1} color="#3E8C86" />,
  }),
  // Alex ended up standing in line.
  P4S7: S({
    set: 'cafeteria', cam: [[0, 960, 560, 1.3], [1, 960, 555, 1.35]],
    figs: [
      { k: 'alex', x: 760, y: 830, s: 0.95, flip: 1, exprs: [[0, 'worried'], [0.7, 'tired']] },
      { k: 'maya', x: 1150, y: 825, s: 0.95, flip: -1, exprs: [[0, 'smug']] },
      { k: 'sam', x: 560, y: 835, s: 0.92, flip: 1, exprs: [[0, 'happy']] },
    ],
    str: str(0.2, 0.9),
    props: (
      <g>
        <ShadowFigure x={420} y={740} s={0.68} flip={1} mood="idle" t={0} opacity={0.6} />
        <ShadowFigure x={300} y={745} s={0.65} flip={1} mood="idle" t={20} opacity={0.55} />
        <DrinkCup x={790} y={710} s={1} color="#E86A92" />
      </g>
    ),
    fx: { tag: 'THE LINE' },
  }),
  // Maya went to the library.
  P4S8: S({
    set: 'library', cam: [[0, 1150, 560, 1.5], [1, 1145, 555, 1.55]],
    figs: [
      { k: 'maya', x: 1080, y: 830, s: 1.0, flip: -1, walk: [1300, 1080], dir: -1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 1330, y: 840, s: 1.0, flip: -1, exprs: [[0, 'worried']], keys: [[0, { armL: { a: 30, b: -15 } }]] },
    ],
    str: str([0.4, 0.1], [0.8, 1.3]),
    fx: { tag: 'LIBRARY' },
  }),
  // Alex was dragged between the bookshelves.
  P4S9: S({
    set: 'library', cam: [[0, 960, 555, 1.2], [1, 960, 550, 1.25]],
    figs: [
      { k: 'alex', x: 700, y: 835, s: 0.95, flip: 1, walk: [500, 900], dir: 1, exprs: [[0, 'dizzy'], [0.8, 'worried']], keys: [[0, { armL: { a: -30, b: 20 }, armR: { a: -40, b: 30 } }]] },
      { k: 'maya', x: 1250, y: 825, s: 0.95, flip: -1, exprs: [[0, 'neutral']], keys: [[0, {}], [0.6, { look: -0.5 }]] },
    ],
    str: str(0.08, 1.4),
    fx: { streaks: true, shakeAt: 15, shakeAmp: 5 },
  }),
  // bookshelves whipping past — Alex buffeted
  P4S10: S({
    set: 'library', cam: [[0, 860, 560, 1.6], [1, 855, 555, 1.65]],
    figs: [
      { k: 'alex', x: 800, y: 840, s: 1.0, flip: 1, exprs: [[0, 'dizzy']], keys: [[0, { tilt: -8, armL: { a: -50, b: 35 }, armR: { a: -60, b: 45 } }], [0.5, { tilt: 6 }]] },
      { k: 'maya', x: 1180, y: 830, s: 1.0, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: str(0.05, 1.5),
    props: (
      <g>
        <rect x={500} y={560} width={60} height={300} fill="#3A2D20" />
        <rect x={1240} y={560} width={60} height={300} fill="#3A2D20" />
      </g>
    ),
    fx: { streaks: true },
  }),
};
