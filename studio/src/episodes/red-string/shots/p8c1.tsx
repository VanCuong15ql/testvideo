import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p8c1 — next morning at the garden spot: silence, then Maya notices a tiny
// crack in the red string. Another crack. Then another. The string is breaking.
// Set: courtyard, morning. Alex+Maya facing, string between pinkies — cracks creep in.

const cam = [[0, 985, 555, 1.5], [1, 980, 550, 1.55]] as [number, number, number, number][];
const str = (crack: number | number[] = 0, glow: number | number[] = 0.8) => ({
  a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const },
  slack: 0.4, glow, crack, crackAt: 0.55, width: 4,
});

export const p8c1Shots: ShotMap = {
  // The next morning, Alex met Maya at their usual spot near the school garden.
  P8S1: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 900, y: 865, s: 1.0, flip: 1, exprs: [[0, 'tired'], [0.5, 'worried']], keys: [[0, { headTilt: 5 }]] },
      { k: 'maya', x: 1100, y: 860, s: 1.0, flip: -1, exprs: [[0, 'neutral'], [0.6, 'worried']], keys: [[0, { headTilt: 4 }]] },
    ],
    str: str(0, [0.7, 0.4]),
    fx: { tag: 'NEXT MORNING' },
  }),
  // Neither of them spoke at first — held silence, string sagging dull
  P8S2: S({
    set: 'courtyard', cam: [[0, 1000, 570, 1.7], [1, 995, 565, 1.75]],
    figs: [
      { k: 'alex', x: 940, y: 868, s: 1.05, flip: 1, exprs: [[0, 'worried']], keys: [[0, { look: -0.5, headTilt: 6 }]] },
      { k: 'maya', x: 1140, y: 862, s: 1.05, flip: -1, exprs: [[0, 'neutral'], [0.5, 'worried']], keys: [[0, { look: 0.5, headTilt: -5 }]] },
    ],
    str: str(0, [0.5, 0.35]),
    fx: { dark: 0.2 },
  }),
  // Then Maya noticed something — her eyes drop to their hands
  P8S3: S({
    set: 'courtyard', cam: [[0, 1100, 600, 2.2], [1, 1095, 595, 2.3]],
    figs: [
      { k: 'maya', x: 1080, y: 880, s: 1.3, flip: -1, exprs: [[0, 'neutral'], [0.4, 'shock']], keys: [[0, { look: -0.6, headTilt: 8 }]] },
      { k: 'alex', x: 1350, y: 885, s: 1.25, flip: -1, exprs: [[0, 'worried']], keys: [[0, { look: -0.7 }]] },
    ],
    str: str(0.15, 0.6),
    fx: { dark: 0.15 },
  }),
  // A tiny crack had appeared in the red string — macro on the break
  P8S4: S({
    set: 'courtyard', cam: [[0, 1020, 660, 3.4], [1, 1015, 655, 3.5]],
    figs: [
      { k: 'alex', x: 800, y: 900, s: 1.6, flip: 1, exprs: [[0, 'shock']], keys: [[0, { armL: { a: 40, b: -30 } }]] },
      { k: 'maya', x: 1240, y: 895, s: 1.6, flip: -1, exprs: [[0, 'shock']], keys: [[0, { armR: { a: 40, b: -30 } }]] },
    ],
    str: str([0.1, 0.5], [0.6, 0.3]),
    fx: { burstAt: 12, dark: 0.1 },
  }),
  // Alex stared at it. "What happened?"
  P8S5: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 900, y: 865, s: 1.0, flip: 1, exprs: [[0, 'shock'], [0.4, 'worried']], keys: [[0, { look: -0.5, headTilt: 5 }]] },
      { k: 'maya', x: 1120, y: 858, s: 1.0, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: str(0.3, 0.5),
    say: [{ text: 'What happened?', fig: 0, at: 0.15, until: 0.85, maxW: 420, fs: 42 }],
  }),
  // Maya shook her head. "I don't know."
  P8S6: S({
    set: 'courtyard', cam: [[0, 1050, 575, 1.8], [1, 1045, 570, 1.85]],
    figs: [
      { k: 'maya', x: 1000, y: 860, s: 1.1, flip: -1, exprs: [[0, 'worried'], [0.5, 'neutral']], keys: [[0, { headTilt: -6, spin: 0 }], [0.3, { spin: -6 }], [0.5, { spin: 0 }]] },
      { k: 'alex', x: 1340, y: 868, s: 1.05, flip: -1, exprs: [[0, 'shock']] },
    ],
    str: { a: { f: 1, side: 'R' }, b: { f: 0, side: 'L' }, slack: 0.35, glow: 0.5, crack: 0.4, crackAt: 0.55 },
    say: [{ text: "I don't know.", fig: 0, at: 0.3, until: 0.85, maxW: 380, fs: 42 }],
  }),
  // Another crack appeared.
  P8S7: S({
    set: 'courtyard', cam: [[0, 1000, 640, 2.8], [1, 995, 635, 2.9]],
    figs: [
      { k: 'alex', x: 820, y: 890, s: 1.4, flip: 1, exprs: [[0, 'shock']] },
      { k: 'maya', x: 1200, y: 885, s: 1.4, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.3, glow: 0.4, crack: [0.4, 0.7], crackAt: 0.4 },
    fx: { burstAt: 14 },
  }),
  // Then another — the string visibly fraying
  P8S8: S({
    set: 'courtyard', cam: [[0, 1000, 640, 3.0], [1, 995, 635, 3.1]],
    figs: [
      { k: 'alex', x: 820, y: 890, s: 1.4, flip: 1, exprs: [[0, 'shock'], [0.6, 'worried']] },
      { k: 'maya', x: 1200, y: 885, s: 1.4, flip: -1, exprs: [[0, 'worried'], [0.5, 'shock']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.3, glow: [0.4, 0.15], crack: 0.8, crackAt: 0.65 },
    fx: { burstAt: 12, dark: 0.2 },
  }),
  // The string was slowly breaking.
  P8S9: S({
    set: 'courtyard', cam,
    figs: [
      { k: 'alex', x: 900, y: 868, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: -0.6, headTilt: 6 }]] },
      { k: 'maya', x: 1120, y: 862, s: 1.0, flip: -1, exprs: [[0, 'worried'], [0.6, 'shock']], keys: [[0, { look: 0.5, headTilt: -5 }]] },
    ],
    str: { ...str(0.9, 0.2), crackAt: 0.7 },
    fx: { dark: 0.3 },
  }),
  // held on the frayed thread — dread wide
  P8S10: S({
    set: 'courtyard', cam: [[0, 985, 560, 1.35], [1, 980, 555, 1.4]],
    figs: [
      { k: 'alex', x: 920, y: 872, s: 0.95, flip: 1, exprs: [[0, 'worried']] },
      { k: 'maya', x: 1100, y: 866, s: 0.95, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: { ...str(1.0, 0.12), crackAt: 0.5 },
    fx: { dark: 0.4 },
  }),
};
