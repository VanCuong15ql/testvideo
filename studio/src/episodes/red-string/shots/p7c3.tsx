import React from 'react';
import { ShotMap } from '../../../engine';
import { S, bedSit, BedDuvet, PhoneMsg } from './autoKit';

// Scene p7c3 — the turn: a message from Maya. "Can we talk tomorrow?"
// Bedroom, night. Phone buzzes on the nightstand; Alex stares at it.

const SIT = bedSit(0.16);
const ALEX_BED = { k: 'alex' as const, x: SIT.x, y: SIT.y, s: SIT.scale, flip: 1 as const };
const cam = [[0, 1020, 600, 2.0], [1, 1015, 595, 2.1]] as [number, number, number, number][];

export const p7c3Shots: ShotMap = {
  // Then he received a message from Maya.
  P7S21: S({
    set: 'bedroom', cam,
    figs: [{ ...ALEX_BED, exprs: [[0, 'worried'], [0.5, 'shock']], keys: [[0, { look: -0.6 }]] }],
    props: (
      <g>
        <BedDuvet />
        <rect x={1150} y={760} width={90} height={16} rx={4} fill="#3A3446" />
        <PhoneMsg x={1195} y={720} s={1.4} text="Can we talk tomorrow?" t={0} from="maya" />
      </g>
    ),
    propsFn: (t) => {
      const buzz = Math.sin(t * 1.1) * 2 * Math.max(0, 1 - t / 30);
      return <g transform={`translate(${buzz} 0)`} opacity={0} />;
    },
    fx: { dark: 0.4, burstAt: 15 },
  }),
  // "Can we talk tomorrow?" — held on Alex's face, hope and fear
  P7S22: S({
    set: 'bedroom', cam: [[0, 1050, 610, 2.4], [1, 1045, 605, 2.5]],
    figs: [{ ...ALEX_BED, exprs: [[0, 'shock'], [0.6, 'worried']], keys: [[0, { look: -0.7, headTilt: 4 }]] }],
    props: (
      <g>
        <BedDuvet />
        <PhoneMsg x={1150} y={720} s={1.3} text="Can we talk tomorrow?" t={0} from="maya" />
      </g>
    ),
    fx: { dark: 0.35 },
  }),
};
