import React from 'react';
import { ShotMap } from '../../../engine';
import { S, LaptopScreen, Glow } from './autoKit';

// Scene p6c1 — later that afternoon: Maya catches Alex searching for ways to
// remove the string. "How to break a mysterious red string?" / "Maya! I can
// explain!" / "Why are you trying so hard to get rid of it?"
// Set: classroom corner / study table. Alex seated-ish, Maya behind him.

const cam = [[0, 960, 560, 1.4], [1, 960, 555, 1.45]] as [number, number, number, number][];
const str = { a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack: 0.4, glow: [0.8, 1.2] };

export const p6c1Shots: ShotMap = {
  // Later that afternoon, Maya discovered Alex searching online.
  P6S1: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 800, y: 835, s: 1.0, flip: 1, exprs: [[0, 'neutral'], [0.6, 'worried']], keys: [[0, { look: -0.4, armR: { a: 30, b: -15 } }]] },
      { k: 'maya', x: 1250, y: 825, s: 0.98, flip: -1, exprs: [[0, 'neutral']], keys: [[0, { look: -0.8 }]] },
    ],
    str,
    props: (
      <g>
        <rect x={680} y={760} width={260} height={14} rx={6} fill="#4A3A28" />
        <rect x={700} y={774} width={12} height={60} fill="#3A2D20" />
        <rect x={900} y={774} width={12} height={60} fill="#3A2D20" />
      </g>
    ),
    fx: { tag: 'LATER THAT AFTERNOON' },
  }),
  // she stands behind him, reading over his shoulder
  P6S2: S({
    set: 'classroom', cam: [[0, 960, 565, 1.5], [1, 960, 560, 1.55]],
    figs: [
      { k: 'alex', x: 840, y: 838, s: 1.02, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1180, y: 828, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.5, 'shock']], keys: [[0, { look: -0.9, headTilt: 4 }]] },
    ],
    str: { ...str, glow: 1.0 },
    props: (
      <g>
        <rect x={720} y={762} width={260} height={14} rx={6} fill="#4A3A28" />
        <rect x={740} y={776} width={12} height={58} fill="#3A2D20" />
        <rect x={940} y={776} width={12} height={58} fill="#3A2D20" />
        <LaptopScreen x={840} y={720} s={1.1} rot={-8} query="how to remove red string" results={['cut the thread', 'burn it?', 'move 10km away', 'ignore it']} t={0} cursor={2} />
      </g>
    ),
  }),
  // She stood behind him and read the screen.
  P6S3: S({
    set: 'classroom', cam: [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]],
    figs: [
      { k: 'alex', x: 880, y: 842, s: 1.05, flip: 1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1140, y: 830, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.4, 'smug']], keys: [[0, { look: -0.9, headTilt: 5 }]] },
    ],
    str: { ...str, glow: 1.1 },
    props: <LaptopScreen x={900} y={724} s={1.15} rot={-8} query="how to break a mysterious red string?" results={['ask a wizard', 'never works', 'the string knows'] } t={0} cursor={1} />,
  }),
  // "How to break a mysterious red string?"
  P6S4: S({
    set: 'classroom', cam: [[0, 1050, 575, 1.75], [1, 1045, 570, 1.8]],
    figs: [
      { k: 'alex', x: 900, y: 845, s: 1.1, flip: 1, exprs: [[0, 'shock']], keys: [[0, { look: -0.6, headTilt: -6 }]] },
      { k: 'maya', x: 1120, y: 832, s: 1.1, flip: -1, exprs: [[0, 'smug']], keys: [[0, { look: -0.9, headTilt: 4 }]] },
    ],
    str: { ...str, glow: [1.0, 1.5] },
    props: <LaptopScreen x={940} y={728} s={1.2} rot={-8} query="how to break a mysterious red string?" results={['10,000+ results', 'none of them work']} t={0} cursor={0} />,
    say: [{ text: 'How to break a mysterious red string?', fig: 0, at: 0.1, until: 0.9, maxW: 700, fs: 32 }],
  }),
  // Alex quickly closed the laptop — SNAP shut, lid slams
  P6S5: S({
    set: 'classroom', cam: [[0, 1000, 575, 1.7], [1, 995, 570, 1.75]],
    figs: [
      { k: 'alex', x: 900, y: 845, s: 1.1, flip: 1, exprs: [[0, 'shock'], [0.4, 'oops']], keys: [[0, { armR: { a: 60, b: -30 } }], [0.4, { armR: { a: 20, b: -10 } }]] },
      { k: 'maya', x: 1140, y: 832, s: 1.1, flip: -1, exprs: [[0, 'smug'], [0.4, 'worried']] },
    ],
    str: { ...str, glow: 1.3 },
    propsFn: (t) => {
      const p = Math.min(1, t / 12);
      return <LaptopScreen x={940} y={728 - p * 40} s={1.2} rot={-8 - p * 40} query="" results={[]} t={0} cursor={0} />;
    },
    fx: { shakeAt: 12, shakeAmp: 8 },
  }),
  // "Maya! I can explain!"
  P6S6: S({
    set: 'classroom', cam,
    figs: [
      { k: 'alex', x: 860, y: 838, s: 1.05, flip: 1, exprs: [[0, 'oops'], [0.4, 'worried']], keys: [[0, { armR: { a: 60, b: -25 } }], [0.4, { armR: { a: 30, b: -15 } }]] },
      { k: 'maya', x: 1200, y: 828, s: 1.05, flip: -1, exprs: [[0, 'worried'], [0.5, 'smug']], keys: [[0, { headTilt: 5 }]] },
    ],
    str: { ...str, glow: 1.2 },
    say: [{ text: 'Maya! I can explain!', fig: 0, at: 0.1, until: 0.85, maxW: 560, fs: 38 }],
  }),
  // She looked disappointed.
  P6S7: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.8], [1, 1095, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1040, y: 830, s: 1.15, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { headTilt: 6, look: -0.6 }]] },
      { k: 'alex', x: 1420, y: 840, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.35, glow: [1.2, 0.6] },
    fx: { dark: 0.1 },
  }),
  // "Why are you trying so hard to get rid of it?"
  P6S8: S({
    set: 'classroom', cam: [[0, 1100, 575, 1.8], [1, 1095, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1040, y: 830, s: 1.15, flip: -1, exprs: [[0, 'worried']], keys: [[0, { headTilt: 5, look: -0.7 }]] },
      { k: 'alex', x: 1420, y: 840, s: 1.1, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.35, glow: 0.8 },
    say: [{ text: 'Why are you trying so hard to get rid of it?', fig: 0, at: 0.05, until: 0.95, maxW: 680, fs: 32 }],
  }),
  // Alex hesitated.
  P6S9: S({
    set: 'classroom', cam: [[0, 960, 570, 1.6], [1, 960, 565, 1.65]],
    figs: [
      { k: 'alex', x: 880, y: 838, s: 1.05, flip: 1, exprs: [[0, 'worried'], [0.6, 'tired']], keys: [[0, { look: -0.4, headTilt: 6 }]] },
      { k: 'maya', x: 1200, y: 828, s: 1.05, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']] },
    ],
    str: { ...str, glow: [0.8, 0.5] },
    fx: { dark: 0.15 },
  }),
  // "Because this isn't normal. We can't stay connected forever."
  P6S10: S({
    set: 'classroom', cam: [[0, 990, 575, 1.7], [1, 985, 570, 1.75]],
    figs: [
      { k: 'alex', x: 900, y: 842, s: 1.1, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.4, headTilt: 5 }]] },
      { k: 'maya', x: 1180, y: 830, s: 1.1, flip: -1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { headTilt: 5 }]] },
    ],
    str: { ...str, glow: [0.7, 0.4], width: 3 },
    say: [{ text: "Because this isn't normal. We can't stay connected forever.", fig: 0, at: 0.05, until: 0.95, maxW: 720, fs: 32 }],
  }),
};
