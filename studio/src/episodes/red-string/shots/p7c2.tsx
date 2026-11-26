import React from 'react';
import { ShotMap } from '../../../engine';
import { S, bedSit, BedDuvet, LaptopScreen, Glow } from './autoKit';

// Scene p7c2 — the memories flood back: every time he reached for the words he
// changed the subject; every time she smiled he looked away. Then the legend's
// second verse: the string disappears when BOTH finally understand.
// Flashbacks in classroom (memory-graded), returns to the bedroom.

const SIT = bedSit(0.16);
const ALEX_BED = { k: 'alex' as const, x: SIT.x, y: SIT.y, s: SIT.scale, flip: 1 as const };
const bedCam = [[0, 1020, 600, 2.0], [1, 1015, 595, 2.1]] as [number, number, number, number][];

const memory = (inner: any) => inner; // readability helper — specs stay inline

export const p7c2Shots: ShotMap = {
  // Every time he wanted to talk to her, he changed the subject.
  P7S11: S({
    set: 'classroom', cam: [[0, 960, 570, 1.4], [1, 960, 565, 1.45]],
    figs: [
      { k: 'alex', x: 800, y: 832, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.4, 'happy'], [0.7, 'neutral']], keys: [[0, { armR: { a: 40, b: -20 } }], [0.45, { armR: { a: 10, b: -5 }, look: 0.8 }]] },
      { k: 'maya', x: 1200, y: 826, s: 1.0, flip: -1, exprs: [[0, 'happy'], [0.5, 'neutral'], [0.8, 'worried']], keys: [[0, { look: -0.6 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.5, glow: [0.9, 0.6] },
    fx: { dark: 0.45, tag: 'MEMORY' },
  }),
  // he swerved away mid-sentence — hand waving it off
  P7S12: S({
    set: 'classroom', cam: [[0, 900, 575, 1.6], [1, 895, 570, 1.65]],
    figs: [
      { k: 'alex', x: 860, y: 838, s: 1.05, flip: 1, exprs: [[0, 'happy'], [0.5, 'oops']], keys: [[0, { armR: { a: 55, b: -20 } }], [0.5, { armR: { a: 80, b: -40 }, look: 1 }]] },
      { k: 'maya', x: 1240, y: 830, s: 1.02, flip: -1, exprs: [[0, 'happy'], [0.6, 'worried']], keys: [[0, { look: -0.7 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: [1.0, 0.7] },
    fx: { dark: 0.5 },
  }),
  // Every time she smiled at him, he looked away.
  P7S13: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.7], [1, 1095, 570, 1.75]],
    figs: [
      { k: 'maya', x: 1040, y: 830, s: 1.1, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: -0.7 }]] },
      { k: 'alex', x: 1420, y: 838, s: 1.08, flip: -1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { look: -0.8, headTilt: 6 }]] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.4, glow: [0.8, 0.5] },
    fx: { dark: 0.5, tag: 'MEMORY' },
  }),
  // he stared at the window instead — classic dodge
  P7S14: S({
    set: 'classroom', cam: [[0, 1050, 580, 1.8], [1, 1045, 575, 1.85]],
    figs: [
      { k: 'alex', x: 980, y: 842, s: 1.12, flip: 1, exprs: [[0, 'tired']], keys: [[0, { look: 1.2, headTilt: 8 }]] },
      { k: 'maya', x: 1330, y: 830, s: 1.05, flip: -1, exprs: [[0, 'happy'], [0.6, 'worried']], keys: [[0, { look: -0.8 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.45, glow: 0.6 },
    fx: { dark: 0.5 },
  }),
  // back to the bedroom — Maybe the string wasn't forcing them to become a couple.
  P7S15: S({
    set: 'bedroom', cam: bedCam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: -0.5, headTilt: 5 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1080} y={660} s={1.6} rot={6} query="" results={['maybe not a couple', 'maybe something else']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.4 },
  }),
  // Maybe it was giving them one chance to stop avoiding the truth.
  P7S16: S({
    set: 'bedroom', cam: [[0, 1060, 640, 2.8], [1, 1055, 635, 2.9]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.7, 'shock']], keys: [[0, { look: -0.6, headTilt: 6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1100} y={630} s={1.9} rot={5} query="" results={['one chance', 'to stop avoiding', 'the truth']} t={0} cursor={0} />
        <Glow x={1100} y={640} r={140} kind="red" o={0.2} />
      </g>
    ),
    fx: { dark: 0.45 },
  }),
  // But there was another detail.
  P7S17: S({
    set: 'bedroom', cam: bedCam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried']], keys: [[0, { look: -0.5, headTilt: 4 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1080} y={665} s={1.6} rot={6} query="" results={['...one more verse']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.4 },
  }),
  // The legend said the string would disappear when both people finally understood why.
  P7S18: S({
    set: 'bedroom', cam: [[0, 1080, 650, 3.0], [1, 1075, 645, 3.1]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: -0.5, headTilt: 6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1120} y={610} s={2.0} rot={4} query="" results={['the thread fades', 'when both understand', 'why they were bound']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.5 },
  }),
  // held on the verse — the stakes land
  P7S19: S({
    set: 'bedroom', cam: [[0, 1060, 640, 2.8], [1, 1055, 635, 2.9]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.7, 'tired']], keys: [[0, { look: -0.6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1100} y={625} s={1.9} rot={5} query="" results={['the thread fades', 'when both understand']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.5 },
  }),
  // Alex stared at the screen.
  P7S20: S({
    set: 'bedroom', cam: bedCam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.7, 'tired']], keys: [[0, { look: -0.6, headTilt: 7 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1050} y={700} s={1.1} rot={10} query="" results={['...']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.55 },
  }),
};

void memory;
