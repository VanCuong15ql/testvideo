import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c6 — "Now I'm getting used to you." Emma smiles; her shadow starts jumping;
// you pretend to watch the road. Brief: out/crush/scenes/p3c6_brief.md

const { Street, Rain, Umbrella, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 860, s: 1.0 };
const EMP = { x: 1100, y: 845, s: 0.95 };

const Backdrop: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Street t={t} id="p6u" />
    <Rain t={t} n={80} o={0.4} />
    <Glow x={1400} y={430} r={700} o={0.22} />
    <Umbrella x={900} y={748} s={0.55} tilt={-4} />
  </g>
);

// P3S51: "Now I'm getting used to you." — Pip says it, almost shy
export const P3S51: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.5, headTilt: 4 }) },
    { f: len * 0.5, p: { headTilt: 0 }, ease: easeOut },
  ]);
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.45} />
      <ShadowFigure x={980} y={960} s={0.6} flip={-1} mood="idle" t={t} opacity={0.8} />
    </g>
  );
};

// P3S52: Emma smiled — warm close on her
export const P3S52: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 40, y: EMP.y, scale: EMP.s * 1.2, yaw: -0.4, look: -0.5, headTilt: -4 } },
    { f: len * 0.5, p: { headTilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 570, 1.5)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={520} r={500} o={0.15} />
      <Rain t={t} n={70} o={0.45} slant={-0.3} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0} />
      <Umbrella x={1100} y={330} s={0.65} tilt={-3} />
    </g>
  );
};

// P3S53: her shadow immediately started jumping — the shadow hops for joy
export const P3S53: React.FC<ShotProps> = ({ t, len }) => {
  const jump = Math.abs(Math.sin(t * 0.9));
  const hopY = 960 - jump * 90;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 640], [len, 625]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Street t={t} id="p6v" />
      <Rain t={t} n={90} o={0.5} />
      {/* Emma below, still smiling, unaware */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* shadow bouncing between hops */}
      <ShadowFigure x={980} y={hopY} s={0.6} flip={-1} mood="cheer" t={t * 1.6} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${940 + i * 40} ${980 - jump * 40} l -16 ${20 + i * 6}`} stroke="#8B7BB8" strokeWidth={4} strokeLinecap="round" opacity={0.5 * (1 - jump * 0.4)} />
      ))}
      <Glow x={980} y={hopY - 160} r={240} o={0.15} />
    </g>
  );
};

// P3S54: you pretended to focus on the road — Pip stares ahead, deadpan, shadow behind
export const P3S54: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.9, look: 0.9, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: 3 }, ease: easeOut },
  ]);
  const jump = Math.abs(Math.sin(t * 0.9));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Street t={t} id="p6w" />
      <Rain t={t} n={90} o={0.45} />
      {/* Pip profile, staring at the road ahead (right of frame) */}
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Umbrella x={900} y={748} s={0.55} tilt={-4} />
      {/* the shadow still hopping behind them */}
      <ShadowFigure x={1080} y={960 - jump * 70} s={0.58} flip={-1} mood="cheer" t={t * 1.5} opacity={0.85} />
      {/* road ahead: dashed lane line rushing past */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={1400 + i * 160} y={980} width={80} height={10} rx={5} fill="#E9C46A" opacity={0.5} transform={`skewX(-20)`} />
      ))}
      <Tag x={960} y={360} t={t - 5} text="the road. very interesting road." />
    </g>
  );
};

export const p3c6Shots: ShotMap = { P3S51, P3S52, P3S53, P3S54 };
