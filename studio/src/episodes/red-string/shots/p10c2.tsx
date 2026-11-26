import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p10c2 — the choice, made with hands: Alex wasn't sure what to say; then
// Maya reached out and took his hand. "But that doesn't mean we can't stay
// together." The walk to the school gate, side by side. Gate set.

const str = (gone = 1) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.4, glow: 0.3, gone,
});
const cam = [[0, 1000, 570, 1.6], [1, 995, 565, 1.65]] as [number, number, number, number][];

export const p10c2Shots: ShotMap = {
  // Alex wasn't sure what to say. Then Maya reached out and took his hand.
  P10S11: S({
    set: 'courtyard', cam: [[0, 1040, 650, 2.6], [1, 1035, 645, 2.7]],
    figs: [
      { k: 'alex', x: 920, y: 890, s: 1.4, flip: 1, exprs: [[0, 'worried'], [0.5, 'happy']], keys: [[0, { armL: { a: 40, b: -30 }, look: -0.4 }]] },
      { k: 'maya', x: 1230, y: 880, s: 1.35, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { armR: { a: 50, b: -30 }, look: 0.5 }]] },
    ],
    str: str(),
    fx: { hearts: true, burstAt: 18 },
  }),
  // "But that doesn't mean we can't stay together."
  P10S12: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy', ], [0.5, 'smug']], keys: [[0, { look: 0.6 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'shock'], [0.4, 'happy']], keys: [[0, { look: -0.5 }], [0.4, { look: -0.2 }]] },
    ],
    str: str(),
    say: [{ text: "But that doesn't mean we can't stay together.", fig: 0, at: 0.05, until: 0.9, maxW: 720, fs: 34 }],
    fx: { hearts: true },
  }),
  // Alex looked at her.
  P10S13: S({
    set: 'courtyard', cam: [[0, 1060, 580, 1.9], [1, 1055, 575, 1.95]],
    figs: [
      { k: 'alex', x: 1000, y: 878, s: 1.15, flip: 1, exprs: [[0, 'happy'], [0.5, 'worried']], keys: [[0, { look: -0.5 }]] },
      { k: 'maya', x: 1320, y: 866, s: 1.1, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: 0.6 }]] },
    ],
    str: str(),
  }),
  // "Does this mean...?"
  P10S14: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 950, y: 875, s: 1.08, flip: 1, exprs: [[0, 'happy'], [0.4, 'worried']], keys: [[0, { look: -0.4, headTilt: 4 }]] },
      { k: 'maya', x: 1250, y: 864, s: 1.05, flip: -1, exprs: [[0, 'happy'], [0.5, 'neutral']], keys: [[0, { look: 0.5, headTilt: 3 }]] },
    ],
    str: str(),
    say: [{ text: 'Does this mean...?', fig: 0, at: 0.15, until: 0.85, maxW: 400, fs: 44 }],
  }),
  // Maya tilted her head. "Does what mean?"
  P10S15: S({
    set: 'courtyard', cam: [[0, 1120, 575, 1.85], [1, 1115, 570, 1.9]],
    figs: [
      { k: 'maya', x: 1060, y: 862, s: 1.15, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { headTilt: -6, look: 0.6 }]] },
      { k: 'alex', x: 1440, y: 872, s: 1.1, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(),
    say: [{ text: 'Does what mean?', fig: 0, at: 0.15, until: 0.85, maxW: 420, fs: 42 }],
  }),
  // He laughed nervously. "Never mind."
  P10S16: S({
    set: 'courtyard', cam: [[0, 1050, 580, 1.8], [1, 1045, 575, 1.85]],
    figs: [
      { k: 'alex', x: 1000, y: 876, s: 1.12, flip: 1, exprs: [[0, 'happy'], [0.5, 'worried'], [0.7, 'happy']], keys: [[0, { headTilt: 6, look: -0.4 }]] },
      { k: 'maya', x: 1300, y: 866, s: 1.08, flip: -1, exprs: [[0, 'smug'], [0.5, 'happy']] },
    ],
    str: str(),
    say: [{ text: 'Never mind.', fig: 0, at: 0.35, until: 0.85, maxW: 360, fs: 44 }],
    fx: { hearts: true },
  }),
  // She smiled. "You're really slow, Alex."
  P10S17: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'maya', x: 1240, y: 862, s: 1.05, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: 0.6, headTilt: -4 }]] },
      { k: 'alex', x: 920, y: 872, s: 1.02, flip: 1, exprs: [[0, 'happy', ], [0.5, 'worried']] },
    ],
    str: str(),
    say: [{ text: "You're really slow, Alex.", fig: 0, at: 0.15, until: 0.9, maxW: 560, fs: 38 }],
    fx: { hearts: true },
  }),
  // And just like that, they walked toward the school gate.
  P10S18: S({
    set: 'gate', cam: [[0, 1100, 560, 1.2], [1, 1110, 555, 1.25]],
    figs: [
      { k: 'alex', x: 1000, y: 870, s: 0.95, flip: 1, walk: [800, 1050], dir: 1, exprs: [[0, 'happy']] },
      { k: 'maya', x: 1250, y: 862, s: 0.95, flip: 1, walk: [1050, 1300], dir: 1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: 0.4 }]] },
    ],
    str: str(),
    fx: { tag: 'TOWARD THE GATE' },
  }),
  // side by side, hands almost touching — golden light
  P10S19: S({
    set: 'gate', cam: [[0, 1150, 565, 1.35], [1, 1155, 560, 1.4]],
    figs: [
      { k: 'alex', x: 1080, y: 872, s: 1.0, flip: 1, exprs: [[0, 'happy']], keys: [[0, { look: 0.4 }]] },
      { k: 'maya', x: 1300, y: 864, s: 1.0, flip: -1, exprs: [[0, 'happy'], [0.5, 'smug']], keys: [[0, { look: -0.4 }]] },
    ],
    str: str(),
    fx: { hearts: true },
  }),
  // walking on — the gate ahead, warm
  P10S20: S({
    set: 'gate', cam: [[0, 1200, 555, 1.15], [1, 1210, 550, 1.2]],
    figs: [
      { k: 'alex', x: 1150, y: 875, s: 0.95, flip: 1, walk: [950, 1250], dir: 1, exprs: [[0, 'happy']] },
      { k: 'maya', x: 1400, y: 866, s: 0.95, flip: 1, walk: [1200, 1450], dir: 1, exprs: [[0, 'happy']] },
    ],
    str: str(),
    fx: { tag: 'SIDE BY SIDE' },
  }),
};
