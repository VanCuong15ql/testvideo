import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p9c2 — the confession lands: "I liked talking to you. I liked seeing you
// every morning... terrified that things would become awkward." Maya doesn't
// answer. Alex lowers his eyes: "I don't want to hide behind this..." The string
// glows brighter. Maya looks at their connected hands — and smiles.
// Courtyard, the string burning warm.

const str = (glow: number | number[] = 1.3) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.3, glow, pulse: 0.5,
});
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p9c2Shots: ShotMap = {
  // "I liked you before this string appeared. I liked talking to you..."
  P9S11: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 950, y: 875, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4 }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.05, flip: -1, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(1.4),
    say: [{ text: 'I liked you before this string appeared. I liked talking to you. I liked seeing you every morning.', fig: 0, at: 0.05, until: 0.9, maxW: 780, fs: 32 }],
  }),
  // "...And honestly, I was terrified that if I told you, things would become awkward."
  P9S12: S({
    set: 'courtyard', cam: [[0, 1060, 580, 1.85], [1, 1055, 575, 1.9]],
    figs: [
      { k: 'alex', x: 1000, y: 880, s: 1.15, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { look: -0.5, headTilt: 5 }]] },
      { k: 'maya', x: 1320, y: 868, s: 1.1, flip: -1, exprs: [[0, 'worried'], [0.6, 'neutral']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(1.4),
    say: [{ text: 'And honestly, I was terrified that if I told you, things would become awkward between us.', fig: 0, at: 0.05, until: 0.95, maxW: 800, fs: 32 }],
    fx: { dark: 0.15 },
  }),
  // Maya didn't answer immediately.
  P9S13: S({
    set: 'courtyard', cam: [[0, 1120, 580, 1.9], [1, 1115, 575, 1.95]],
    figs: [
      { k: 'maya', x: 1060, y: 868, s: 1.15, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.6, headTilt: 2 }]] },
      { k: 'alex', x: 1440, y: 878, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(1.5),
    fx: { dark: 0.2 },
  }),
  // Alex lowered his eyes.
  P9S14: S({
    set: 'courtyard', cam: [[0, 960, 585, 2.3], [1, 955, 580, 2.35]],
    figs: [
      { k: 'alex', x: 920, y: 885, s: 1.35, flip: 1, exprs: [[0, 'worried'], [0.5, 'tired']], keys: [[0, { look: -0.4, headTilt: 9 }]] },
      { k: 'maya', x: 1320, y: 872, s: 1.25, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(1.4),
    fx: { dark: 0.2 },
  }),
  // "But I don't want to hide behind this strange thing anymore..."
  P9S15: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 950, y: 875, s: 1.08, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4, headTilt: 4 }]] },
      { k: 'maya', x: 1240, y: 864, s: 1.05, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str([1.4, 1.8]),
    say: [{ text: "But I don't want to hide behind this strange thing anymore.", fig: 0, at: 0.05, until: 0.85, maxW: 720, fs: 33 }],
  }),
  // "...I don't want you to stay with me because we're forced to."
  P9S16: S({
    set: 'courtyard', cam: [[0, 1040, 580, 1.8], [1, 1035, 575, 1.85]],
    figs: [
      { k: 'alex', x: 980, y: 878, s: 1.12, flip: 1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4, headTilt: 3 }]] },
      { k: 'maya', x: 1280, y: 866, s: 1.08, flip: -1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str([1.6, 2.0]),
    say: [{ text: "I don't want you to stay with me because we're forced to.", fig: 0, at: 0.05, until: 0.9, maxW: 760, fs: 32 }],
    fx: { burstAt: 24 },
  }),
  // The string began glowing brighter.
  P9S17: S({
    set: 'courtyard', cam: [[0, 1010, 640, 3.0], [1, 1005, 635, 3.1]],
    figs: [
      { k: 'alex', x: 800, y: 890, s: 1.45, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1250, y: 880, s: 1.4, flip: -1, exprs: [[0, 'shock', ], [0.5, 'worried']] },
    ],
    str: str([1.6, 2.2], ),
    fx: { burstAt: 12 },
  }),
  // Maya looked at their connected hands.
  P9S18: S({
    set: 'courtyard', cam: [[0, 1060, 650, 2.8], [1, 1055, 645, 2.9]],
    figs: [
      { k: 'maya', x: 1000, y: 890, s: 1.45, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { look: -0.4, headTilt: 6, armL: { a: 40, b: -30 } }]] },
      { k: 'alex', x: 1380, y: 895, s: 1.4, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(2.0),
    fx: { burstAt: 16 },
  }),
  // Then she smiled.
  P9S19: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'worried'], [0.4, 'happy']], keys: [[0, { look: 0.6, headTilt: -4 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'worried'], [0.5, 'shock']] },
    ],
    str: str(2.0),
    fx: { hearts: true, burstAt: 14 },
  }),
  // "Alex... there's something I haven't told you either."
  P9S20: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy']], keys: [[0, { look: 0.6 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'shock'], [0.5, 'worried']], keys: [[0, { look: -0.6 }]] },
    ],
    str: str(2.1),
    say: [{ text: "Alex... there's something I haven't told you either.", fig: 0, at: 0.1, until: 0.9, maxW: 720, fs: 34 }],
    fx: { hearts: true },
  }),
};
