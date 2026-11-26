import React from 'react';
import { ShotMap } from '../../../engine';
import { S, bedSit, BedDuvet, LaptopScreen, Glow } from './autoKit';

// Scene p7c1 — that evening: Alex digs through old stories about the red thread.
// The legend: two people whose lives were destined to cross — BUT the part most
// people overlook: sometimes it connects people with something important UNSAID.
// Set: bedroom at night, laptop glow, Alex in bed.

const SIT = bedSit(0.16);
const ALEX_BED = { k: 'alex' as const, x: SIT.x, y: SIT.y, s: SIT.scale, flip: 1 as const };
const cam = [[0, 1000, 560, 1.45], [1, 995, 555, 1.5]] as [number, number, number, number][];

export const p7c1Shots: ShotMap = {
  // That evening, Alex searched through old stories about the mysterious red thread.
  P7S1: S({
    set: 'bedroom', cam,
    figs: [
      { ...ALEX_BED, exprs: [[0, 'tired'], [0.5, 'worried']], keys: [[0, {}], [0.5, { look: -0.3, headTilt: 5 }]] },
    ],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1050} y={700} s={1.1} rot={10} query="red thread legend" results={['an old tale', 'destined to cross', 'one chance']} t={0} cursor={1} />
      </g>
    ),
    fx: { tag: 'THAT EVENING', dark: 0.3 },
  }),
  // He found a legend.
  P7S2: S({
    set: 'bedroom', cam: [[0, 1050, 600, 2.2], [1, 1045, 595, 2.3]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.5 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1080} y={690} s={1.5} rot={8} query="" results={['THE RED THREAD', '— an old legend —']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.3 },
  }),
  // an invisible red string connected two people whose lives were destined to cross
  P7S3: S({
    set: 'bedroom', cam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried']], keys: [[0, { look: -0.4 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1050} y={695} s={1.2} rot={8} query="" results={['two souls', 'destined to cross', 'bound by thread']} t={0} cursor={0} />
        {/* two silhouettes joined by a thread — the legend image */}
        <g transform="translate(1050 560)" opacity={0.8}>
          <circle cx={-30} cy={0} r={14} fill="#F4EEE0" />
          <circle cx={30} cy={0} r={14} fill="#F4EEE0" />
          <path d="M -30 14 Q 0 40 30 14" stroke="#E23B3B" strokeWidth={4} fill="none" />
        </g>
      </g>
    ),
    fx: { dark: 0.3 },
  }),
  // the legend illustration holds — two figures, red thread arc
  P7S4: S({
    set: 'bedroom', cam: [[0, 1080, 590, 2.6], [1, 1075, 585, 2.7]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried']], keys: [[0, { look: -0.5 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1100} y={680} s={1.6} rot={6} query="" results={['destined to cross']} t={0} cursor={0} />
        <g transform="translate(1120 540)">
          <circle cx={-34} cy={0} r={16} fill="#F4EEE0" />
          <circle cx={34} cy={0} r={16} fill="#F4EEE0" />
          <path d="M -34 16 Q 0 48 34 16" stroke="#E23B3B" strokeWidth={5} fill="none" />
          <path d="M -34 16 Q 0 48 34 16" stroke="#FF6A5A" strokeWidth={9} fill="none" opacity={0.3} />
        </g>
      </g>
    ),
    fx: { dark: 0.3 },
  }),
  // But the legend contained something most people overlooked.
  P7S5: S({
    set: 'bedroom', cam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.5, headTilt: 5 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1050} y={695} s={1.2} rot={8} query="" results={['...but most overlook', 'the second verse']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.35 },
  }),
  // The string didn't always connect two people meant to fall in love.
  P7S6: S({
    set: 'bedroom', cam: [[0, 1050, 620, 2.8], [1, 1045, 615, 2.9]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'shock']] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1100} y={660} s={1.7} rot={6} query="" results={['not always love', 'sometimes...'] } t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.4 },
  }),
  // Sometimes, it connected two people who had something important left unsaid.
  P7S7: S({
    set: 'bedroom', cam: [[0, 1080, 640, 3.0], [1, 1075, 635, 3.1]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'shock'], [0.7, 'worried']], keys: [[0, { look: -0.5, headTilt: 6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1120} y={640} s={1.9} rot={5} query="" results={['something important', 'left UNSAID']} t={0} cursor={1} />
      </g>
    ),
    fx: { dark: 0.45, burstAt: 20 },
  }),
  // Alex read the sentence again.
  P7S8: S({
    set: 'bedroom', cam: [[0, 1020, 610, 2.5], [1, 1015, 605, 2.6]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.6, headTilt: 6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1080} y={660} s={1.6} rot={6} query="" results={['something important', 'left unsaid']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.4 },
  }),
  // Something important left unsaid. — the words glow on screen
  P7S9: S({
    set: 'bedroom', cam: [[0, 1060, 640, 3.4], [1, 1055, 635, 3.5]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried']] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1120} y={630} s={2.0} rot={4} query="" results={['something important', 'left unsaid']} t={0} cursor={0} />
        <Glow x={1120} y={640} r={160} kind="red" o={0.25} />
      </g>
    ),
    fx: { dark: 0.45 },
  }),
  // Suddenly, he remembered all the moments he had avoided telling Maya how he felt.
  P7S10: S({
    set: 'bedroom', cam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.7, 'tired']], keys: [[0, { look: -0.6, headTilt: 7 }]] }],
    props: (
      <g>
        <BedDuvet />
        <LaptopScreen x={1050} y={700} s={1.1} rot={10} query="" results={['...']} t={0} cursor={0} />
      </g>
    ),
    fx: { dark: 0.5 },
  }),
};
