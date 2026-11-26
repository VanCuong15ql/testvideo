import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';
import { ShadowFigure } from './common';

// Scene p2c2 — the argument draws a crowd: whispers, "are they dating?",
// Alex's too-fast denial, Maya's flat "Wow. Thanks.", and the rumor taking root.
// Set: hallway. Alex near-right, Maya mid-left, silhouettes crowding the far doors.

const A = { k: 'alex' as const, x: 1230, y: 800, s: 0.95, flip: -1 as const };
const M = { k: 'maya' as const, x: 760, y: 780, s: 0.9, flip: 1 as const };
const cam = [[0, 980, 580, 1.45], [1, 975, 575, 1.5]] as [number, number, number, number][];
const strAW = { a: { f: 0, side: 'L' as const }, b: { f: 1, side: 'R' as const }, slack: [0.5, 0.3], glow: [0.7, 0.9] };

// crowd silhouettes that sway/whisper — t comes from the shot clock via closure
const WhisperCrowd: React.FC = () => {
  // Auto renders props inside the cam group without t; approximate with a fixed drift
  return (
    <g>
      <ShadowFigure x={620} y={700} s={0.8} flip={-1} mood="whisper" t={0} opacity={0.8} />
      <ShadowFigure x={740} y={692} s={0.74} flip={1} mood="whisper" t={15} opacity={0.78} />
      <ShadowFigure x={860} y={696} s={0.76} flip={-1} mood="point" t={8} opacity={0.78} />
      <ShadowFigure x={990} y={702} s={0.7} flip={1} mood="idle" t={30} opacity={0.72} />
    </g>
  );
};

export const p2c2Shots: ShotMap = {
  // "Maybe you should stop following me!"
  P2S11: S({
    set: 'hallway', cam, figs: [M, A], str: strAW,
    say: [{ text: 'Maybe you should stop following me!', fig: 0, at: 0.05, until: 0.95, maxW: 620, fs: 38 }],
  }),
  // "I'm not following you! You're literally attached to me!"
  P2S12: S({
    set: 'hallway', cam, figs: [
      { ...A, keys: [[0, {}], [0.5, { armR: { a: 40, b: -20 } }]] },
      { ...M, keys: [[0, {}], [0.5, { headTilt: 6 }]] },
    ], str: strAW,
    say: [{ text: "I'm not following you! You're literally attached to me!", fig: 1, at: 0.05, until: 0.95, maxW: 640, fs: 36 }],
  }),
  // Their argument attracted everyone's attention — wide, crowd gathering
  P2S13: S({
    set: 'hallway', cam: [[0, 960, 570, 1.15], [1, 960, 565, 1.25]],
    figs: [
      { k: 'maya', x: 700, y: 790, s: 0.9, flip: 1, exprs: [[0, 'smug']] },
      { k: 'alex', x: 1220, y: 800, s: 0.95, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: strAW,
    props: <WhisperCrowd/>,
  }),
  // A few students started whispering
  P2S14: S({
    set: 'hallway', cam: [[0, 960, 580, 1.3], [1, 955, 575, 1.35]],
    figs: [
      { k: 'maya', x: 720, y: 785, s: 0.9, flip: 1, exprs: [[0, 'smug']] },
      { k: 'alex', x: 1200, y: 795, s: 0.95, flip: -1, exprs: [[0, 'worried']] },
    ],
    str: strAW,
    props: <WhisperCrowd/>,
  }),
  // One of them even said, "Are they dating?"
  P2S15: S({
    set: 'hallway', cam: [[0, 960, 580, 1.3], [1, 960, 575, 1.4]],
    figs: [
      { k: 'maya', x: 740, y: 785, s: 0.9, flip: 1, exprs: [[0, 'neutral']] },
      { k: 'alex', x: 1180, y: 795, s: 0.95, flip: -1, exprs: [[0, 'shock']] },
      { k: 'sam', x: 880, y: 700, s: 0.78, flip: -1, exprs: [[0, 'smug']], keys: [[0, {}], [0.4, { armR: { a: 50, b: -20 } }]] },
    ],
    str: strAW,
    say: [{ text: 'Are they dating?', fig: 2, at: 0.1, until: 0.95, maxW: 420, fs: 36 }],
  }),
  // reaction beat on the whisper
  P2S16: S({
    set: 'hallway', cam: [[0, 960, 580, 1.3], [1, 960, 575, 1.4]],
    figs: [
      { k: 'maya', x: 740, y: 785, s: 0.9, flip: 1, exprs: [[0, 'smug'], [0.6, 'neutral']] },
      { k: 'alex', x: 1180, y: 795, s: 0.95, flip: -1, exprs: [[0, 'shock'], [0.5, 'worried']] },
      { k: 'sam', x: 880, y: 700, s: 0.78, flip: -1, exprs: [[0, 'smug']] },
      { k: 'girl', x: 1020, y: 705, s: 0.76, flip: -1, exprs: [[0, 'happy']] },
    ],
    str: strAW,
    props: <WhisperCrowd/>,
  }),
  // Alex immediately shook his head. "No! Absolutely not!"
  P2S17: S({
    set: 'hallway', cam: [[0, 1150, 590, 1.6], [1, 1140, 585, 1.7]],
    figs: [
      { ...A, x: 1180, exprs: [[0, 'shock'], [0.3, 'worried']], keys: [[0, {}], [0.15, { headTilt: -8 }], [0.3, { headTilt: 8 }], [0.45, { headTilt: -8 }], [0.6, { headTilt: 4 }]] },
      { ...M, x: 900, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: 0.8 },
    say: [{ text: 'No! Absolutely not!', fig: 0, at: 0.05, until: 0.9, maxW: 560, fs: 40 }],
  }),
  // "No! Absolutely not!" — Maya looked at him.
  P2S18: S({
    set: 'hallway', cam: [[0, 1000, 585, 1.55], [1, 995, 580, 1.6]],
    figs: [
      { ...A, x: 1150, exprs: [[0, 'worried']], keys: [[0, {}], [0.5, { headTilt: 5 }]] },
      { ...M, x: 880, exprs: [[0, 'neutral'], [0.7, 'smug']], keys: [[0, {}], [0.4, { look: -0.5, headTilt: 4 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: 0.8 },
    props: <WhisperCrowd/>,
  }),
  // "Wow. Thanks."
  P2S19: S({
    set: 'hallway', cam: [[0, 990, 580, 1.55], [1, 990, 578, 1.6]],
    figs: [
      { ...A, x: 1150, exprs: [[0, 'oops']] },
      { ...M, x: 880, exprs: [[0, 'smug']], keys: [[0, {}], [0.4, { headTilt: 7 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.45, glow: 0.7 },
    say: [{ text: 'Wow. Thanks.', fig: 1, at: 0.15, until: 0.9, maxW: 380, fs: 42 }],
  }),
  // Alex realized how that sounded.
  P2S20: S({
    set: 'hallway', cam: [[0, 1130, 590, 1.6], [1, 1120, 585, 1.65]],
    figs: [
      { ...A, x: 1180, exprs: [[0, 'oops'], [0.6, 'worried']], keys: [[0, {}], [0.5, { look: -0.4, headTilt: 6 }]] },
      { ...M, x: 920, exprs: [[0, 'smug']] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.45, glow: 0.75 },
    fx: { dark: 0.12 },
  }),
};
