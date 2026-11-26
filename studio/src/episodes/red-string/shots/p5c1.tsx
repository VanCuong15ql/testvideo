import React from 'react';
import { ShotMap } from '../../../engine';
import { S, bedSit, BedDuvet, Glow } from './autoKit';

// Scene p5c1 — that night: the string glows ONLY when Maya is near. Laugh → brighter,
// upset → dark red, eye contact → heartbeat pulse. Alex decides to test it.
// Set: bedroom, 23:47, lamp low. Alex in bed (bedSit), Maya at the door/right.

const SIT = bedSit(0.16);
const ALEX_BED = { k: 'alex' as const, x: SIT.x, y: SIT.y, s: SIT.scale, flip: 1 as const };
const cam = [[0, 1000, 560, 1.45], [1, 995, 555, 1.5]] as [number, number, number, number][];
const strTo = (mayaX: number) => ({ a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack: 0.45 });

export const p5c1Shots: ShotMap = {
  // That night, Alex noticed another strange detail.
  P5S1: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'tired'], [0.6, 'shock']], keys: [[0, {}], [0.5, { look: 1 }]] },
      { k: 'maya', x: 1350, y: 830, s: 0.95, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { ...strTo(1350), glow: [0.3, 0.9] },
    props: <BedDuvet />,
    fx: { dark: 0.25 },
  }),
  // The string was glowing.
  P5S2: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'shock'], [0.7, 'worried']], keys: [[0, { look: 1 }]] },
      { k: 'maya', x: 1330, y: 830, s: 0.95, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { ...strTo(1330), glow: [0.9, 1.4], pulse: 0.3 },
    props: <BedDuvet />,
    fx: { burstAt: 14 },
  }),
  // Not constantly.
  P5S3: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1330, y: 830, s: 0.95, flip: -1, exprs: [[0, 'neutral']] },
    ],
    str: { ...strTo(1330), glow: [1.2, 0.35], pulse: 0 },
    props: <BedDuvet />,
  }),
  // Only when Maya was nearby — she steps into the lamplight
  P5S4: S({
    set: 'bedroom', cam: [[0, 1050, 560, 1.4], [1, 1040, 555, 1.45]],
    figs: [
      { ...ALEX_BED, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: 1 }]] },
      { k: 'maya', x: 1290, y: 835, s: 0.98, flip: -1, walk: [1450, 1290], dir: -1, exprs: [[0, 'neutral']] },
    ],
    str: { ...strTo(1290), glow: [0.4, 1.3], pulse: 0.4 },
    props: <BedDuvet />,
    fx: { burstAt: 16 },
  }),
  // When she laughed, it became brighter.
  P5S5: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'shock'], [0.6, 'happy']], keys: [[0, { look: 1 }]] },
      { k: 'maya', x: 1280, y: 830, s: 1.0, flip: -1, exprs: [[0, 'happy']], keys: [[0, { headTilt: -6 }], [0.5, { headTilt: 4 }]] },
    ],
    str: { ...strTo(1280), glow: [1.0, 1.8], pulse: 0.5 },
    props: <BedDuvet />,
  }),
  // When she was upset, it turned dark red.
  P5S6: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'worried'], [0.7, 'neutral']], keys: [[0, { look: 1, headTilt: 4 }]] },
      { k: 'maya', x: 1280, y: 832, s: 1.0, flip: -1, exprs: [[0, 'worried']], keys: [[0, { headTilt: 6 }]] },
    ],
    str: { ...strTo(1280), glow: [1.6, 0.45], pulse: 0 },
    props: <BedDuvet />,
    fx: { dark: 0.15 },
  }),
  // upset held — the glow sinks low and heavy
  P5S7: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1280, y: 832, s: 1.0, flip: -1, exprs: [[0, 'worried'], [0.7, 'neutral']], keys: [[0, { headTilt: 5 }]] },
    ],
    str: { ...strTo(1280), glow: [0.5, 0.6], pulse: 0.2, width: 3 },
    props: <BedDuvet />,
  }),
  // And when she looked directly at Alex...
  P5S8: S({
    set: 'bedroom', cam: [[0, 1050, 565, 1.55], [1, 1045, 560, 1.6]],
    figs: [
      { ...ALEX_BED, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: 1, headTilt: -3 }]] },
      { k: 'maya', x: 1240, y: 828, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.5, 'smug']], keys: [[0, { look: -0.9, headTilt: 3 }]] },
    ],
    str: { ...strTo(1240), glow: [0.8, 1.4], pulse: 0.8 },
    props: <BedDuvet />,
  }),
  // It pulsed like a tiny heartbeat.
  P5S9: S({
    set: 'bedroom', cam: [[0, 1100, 570, 1.7], [1, 1095, 565, 1.75]],
    figs: [
      { ...ALEX_BED, exprs: [[0, 'shock']], keys: [[0, { look: 1 }]] },
      { k: 'maya', x: 1300, y: 835, s: 1.1, flip: -1, exprs: [[0, 'smug']], keys: [[0, { look: -0.9 }]] },
    ],
    str: { ...strTo(1300), glow: [1.2, 1.9], pulse: 1.8, width: 5 },
    props: (
      <g>
        <BedDuvet />
        <g transform="translate(1150 700)">
          <Glow x={0} y={0} r={60 + Math.sin(0) * 0} kind="red" o={0} />
        </g>
      </g>
    ),
    propsFn: (t) => {
      const beat = Math.pow(Math.max(0, Math.sin(t * 0.35)), 6);
      return <Glow x={1150} y={700} r={50 + beat * 60} kind="red" o={0.15 + beat * 0.35} />;
    },
  }),
  // Alex decided to test something.
  P5S10: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { headTilt: 6 }], [0.6, { headTilt: 0, look: 0.6 }]] },
      { k: 'maya', x: 1300, y: 832, s: 1.0, flip: -1, exprs: [[0, 'smug']] },
    ],
    str: { ...strTo(1300), glow: 1.0, pulse: 0.5 },
    props: <BedDuvet />,
    fx: { tag: 'TEST...' },
  }),
};
