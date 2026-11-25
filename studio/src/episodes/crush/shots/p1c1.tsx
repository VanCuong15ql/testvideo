import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c1 — the cold open: title, 8:12 Monday, the crush across the hallway, the smile,
// the look away — then the impossible thing: her shadow waves. Brief: out/crush/scenes/p1c1_brief.md

const { HALL, Hallway, ShadowFigure, TitleCard, Tag, Glow, camT, kf, clamp, poseAt, faceAt, easeOut, YOU, EMMA, FRIEND, SIS } = K;

// blocking: Emma and her friends far down the hall; "you" (Pip) near camera
const EMMA_POS = { x: 960, y: HALL.far.y, s: HALL.far.s };
const MO_POS = { x: 700, y: 706, s: 0.74 };
const SIS_POS = { x: 1230, y: 700, s: 0.7 };
const PIP_POS = { x: 1380, y: 860, s: 1.02 };
const PIP_POS2 = { x: 560, y: 850, s: 1.0 };

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...K.basePose, x, y, scale: s, ...extra,
});

// P1S1: title over the empty hallway at dusk
export const P1S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 0.9], [len, 0.95]]))}>
    <Hallway t={t + 10} />
    <TitleCard t={t} lines={["WHAT IF YOUR CRUSH'S", 'SHADOW REVEALED HER FEELINGS?']} accent="SHADOW" accentT={30} size={84} y={170} />
  </g>
);

// P1S2: 8:12 Monday morning — Pip small in the hall, a wall clock, the morning hush
export const P1S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP_POS2.x, y: PIP_POS2.y, scale: PIP_POS2.s, yaw: 0.55, look: 0.5, armL: { a: 8, b: -6 }, armR: { a: 14, b: -8 } } },
    { f: len * 0.6, p: { look: 0.2, headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Hallway t={t + 20} />
      {/* wall clock on the back wall, hands at 8:12 */}
      <g transform="translate(1150 420)">
        <circle r={46} fill="#1B1730" stroke="#8B7BB8" strokeWidth={5} />
        <line x1={0} y1={0} x2={0} y2={-30} stroke="#F6EFE3" strokeWidth={5} strokeLinecap="round" transform="rotate(245)" />
        <line x1={0} y1={0} x2={0} y2={-24} stroke="#F6EFE3" strokeWidth={4} strokeLinecap="round" transform="rotate(72)" />
        <circle r={4} fill="#F2B33D" />
      </g>
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Tag x={330} y={220} t={t} text="8:12 — MONDAY" />
    </g>
  );
};

// P1S3: across the hall — Emma with her friends, chatting; slow push in
export const P1S3: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s, { yaw: -0.3, look: -0.4, armR: { a: 30, b: -20 }, headTilt: -2 }) },
    { f: 50, p: { armR: { a: 18, b: -12 }, look: -0.2 } },
    { f: 100, p: { armL: { a: 24, b: -16 }, headTilt: 2 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: idle(MO_POS.x, MO_POS.y, MO_POS.s, { yaw: 0.4, look: 0.5, armL: { a: 40, b: -30 } }) },
    { f: 60, p: { armL: { a: 20, b: -14 } } },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: idle(SIS_POS.x, SIS_POS.y, SIS_POS.s, { yaw: -0.4, look: -0.5, armR: { a: 36, b: -26 } }) },
    { f: 70, p: { armR: { a: 16, b: -10 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 965]]), kf(t, [[0, 590], [len, 565]]), kf(t, [[0, 1.45], [len, 1.62]]))}>
      <Hallway t={t + 40} />
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S4: you looked at her — over Pip's shoulder, Emma mid-laugh across the hall
export const P1S4: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s * 1.15, { yaw: 0.15, look: -0.5, armR: { a: 20, b: -14 } }) },
    { f: len * 0.5, p: { headTilt: 3, look: -0.3 } },
  ]);
  const pip = idle(PIP_POS.x + 120, PIP_POS.y, PIP_POS.s * 0.9, { yaw: -0.85, look: -0.8, armL: { a: 20, b: -14 }, armR: { a: 16, b: -10 } });
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1000]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Hallway t={t + 55} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.3} />
      {/* Pip from behind, right foreground */}
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// P1S5: she smiled — a quick insert on Emma's face
export const P1S5: React.FC<ShotProps> = ({ t }) => {
  const sc = 2.1;
  const pose: Pose = { ...K.basePose, x: 960, y: 640 - K.HEAD.y * sc, scale: sc, yaw: 0.1, look: -0.3, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(960, 600, 1.15)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <K.Hero look={EMMA} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={960} y={480} r={500} o={0.14} />
    </g>
  );
};

// P1S6: you immediately looked away — Pip's head snaps off, a little too fast
export const P1S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP_POS2.x, y: PIP_POS2.y, scale: PIP_POS2.s, yaw: 0.5, look: 0.6, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 8, p: { yaw: -0.55, look: -0.9, headTilt: -4 }, ease: easeOut },
    { f: 30, p: { yaw: -0.5, look: -0.7, headTilt: -2 } },
    { f: len - 10, p: { armR: { a: 55, b: -20 } } }, // a casual whistle-ish raise
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 890]]), kf(t, [[0, 620], [len, 610]]), kf(t, [[0, 1.7], [len, 1.78]]))}>
      <Hallway t={t + 70} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [12, 'smug']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P1S7: just another normal day — medium two-shot down the hall, everyone in their own lane
export const P1S7: React.FC<ShotProps> = ({ t, len }) => {
  const emma = idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s, { yaw: 0.2, look: 0.4, armL: { a: 10, b: -8 }, armR: { a: 14, b: -10 } });
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP_POS.x - 160, y: PIP_POS.y, scale: PIP_POS.s * 0.85, yaw: -0.7, look: -0.6 } },
    { f: len * 0.5, p: { x: PIP_POS.x - 120, look: -0.4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 990]]), kf(t, [[0, 610], [len, 595]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Hallway t={t + 85} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P1S8: but then — impossible. Low on the floor: Emma's shadow starts to move on its own
export const P1S8: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[0, 0], [len, -26]]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 790], [len, 775]]), kf(t, [[0, 1.6], [len, 1.85]]))}>
      <Hallway t={t + 100} />
      {/* Emma small at the top of frame, still unaware */}
      <g opacity={0.85}>
        <K.Hero look={EMMA} pose={idle(EMMA_POS.x + 60, EMMA_POS.y - 10, EMMA_POS.s * 0.9, { yaw: 0.3, look: 0.3 })} rimId="rimR" shadow={0} />
      </g>
      {/* her shadow on the floor — the dark pool first, then the figure peeling off it */}
      <ellipse cx={1020} cy={800} rx={70} ry={14} fill="#000" opacity={0.4} />
      <ShadowFigure x={1030} y={800 + lift * 0.4} s={0.42} mood={t > len * 0.55 ? 'wave' : 'idle'} t={t} opacity={0.95} />
      <Glow x={1030} y={760} r={220} o={0.08} />
    </g>
  );
};

// P1S9: her shadow was waving at you — the silhouette beside her feet, clearly separate now
export const P1S9: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t * 0.35) * 10;
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1005]]), kf(t, [[0, 800], [len, 782]]), kf(t, [[0, 1.5], [len, 1.72]]))}>
      <Hallway t={t + 115} />
      {/* Emma from the knees up, chatting on, oblivious */}
      <g>
        <K.Hero look={EMMA} pose={idle(1030, 740, 0.95, { yaw: -0.2, look: -0.4, armR: { a: 26, b: -18 } })} rimId="rimR" shadow={0} />
      </g>
      <ellipse cx={1120} cy={880} rx={80} ry={15} fill="#000" opacity={0.35} />
      <g transform={`translate(0 ${wave * 0.3})`}>
        <ShadowFigure x={1130} y={880} s={0.5} flip={-1} mood="wave" t={t} />
      </g>
      {/* Pip's shocked eyes enter frame right */}
      <g opacity={clamp((t - len * 0.55) / 12)}>
        <K.Hero look={YOU} pose={idle(1450, 880, 1.15, { yaw: -0.9, look: -0.9 })} rimId="rimR" shadow={0} />
      </g>
    </g>
  );
};

// P1S10: you blinked — a tight close-up on Pip's eyes, one slow blink
export const P1S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6;
  const pose: Pose = {
    ...K.basePose,
    x: 960,
    y: 620 - K.HEAD.y * sc,
    scale: sc,
    yaw: 0.12,
    look: -0.5,
    armL: { a: 12, b: -8 },
    armR: { a: 12, b: -8 },
    ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]),
    blink: kf(t, [[0, 0], [len * 0.45, 0], [len * 0.45 + 5, 1], [len * 0.45 + 9, 0], [len, 0]]),
  };
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1], [len, 1.05]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={560} r={480} o={0.13} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

export const p1c1Shots: ShotMap = { P1S1, P1S2, P1S3, P1S4, P1S5, P1S6, P1S7, P1S8, P1S9, P1S10 };
