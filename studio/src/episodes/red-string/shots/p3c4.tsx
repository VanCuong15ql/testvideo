import React from 'react';
import { ShotMap } from '../../../engine';
import { S } from './autoKit';

// Scene p3c4 — one-shot button: "Maybe being connected to her wasn't completely
// terrible." Warm two-shot in the courtyard, string glowing softly, leaves settled.

const Leaves2: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1.4 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.9}>
    {Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      const r = 26 + (i % 3) * 18;
      return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.45} rx={13 + (i % 3) * 4} ry={6} fill={['#C97B2D', '#E09A3E', '#A85A20'][i % 3]} transform={`rotate(${i * 47} ${Math.cos(a) * r} ${Math.sin(a) * r * 0.45})`} />;
    })}
  </g>
);

export const p3c4Shots: ShotMap = {
  P3S31: S({
    set: 'courtyard', cam: [[0, 985, 560, 1.5], [1, 975, 552, 1.6]],
    figs: [
      { k: 'alex', x: 910, y: 872, s: 1.0, flip: 1, exprs: [[0, 'worried'], [0.4, 'happy']], keys: [[0, { headTilt: 5 }], [0.4, { headTilt: 0, look: 0.3 }]] },
      { k: 'maya', x: 1060, y: 868, s: 1.0, flip: -1, exprs: [[0, 'smug'], [0.5, 'happy']], keys: [[0, { headTilt: -4 }]] },
    ],
    str: { a: { f: 0, side: 'L' }, b: { f: 1, side: 'R' }, slack: 0.4, glow: [0.9, 1.5], pulse: 0.4 },
    props: <Leaves2 x={985} y={930} />,
    fx: { hearts: true, tag: '...NOT TERRIBLE' },
  }),
};
