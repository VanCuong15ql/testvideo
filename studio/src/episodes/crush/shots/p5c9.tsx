import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c9 — "does that mean we can go out sometime?" / "maybe my answer is
// yes" / then Emma looks down — at YOUR shadow. Brief: p5c9_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'g9a' }) => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.28} />
    <circle cx={1560} cy={430} r={140} fill="#F2B06E" opacity={0.55} />
    <Glow x={1560} y={430} r={420} o={0.35} />
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
  </g>
);

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], zoom = 1.4, pipShadow = true) => (
  <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, zoom], [len, zoom * 1.05]]))}>
    <DuskWalk t={t} id={`g9${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={pipShadow ? 0.45 : 0} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S81: "So… does that mean we can go out sometime?" — Pip asks, hopeful
export const P5S81: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 6, armL: { a: 35, b: -16 } },
    { headTilt: -4 },
    [[0, 'happy'], [len * 0.5, 'worried']], [[0, 'happy']], 1.5);

// P5S82: Emma laughed — she can't keep a straight face
export const P5S82: React.FC<ShotProps> = ({ t, len }) => {
  const bend = Math.sin(clamp((t - 4) / 12) * Math.PI) * 10;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1020]]), kf(t, [[0, 590], [len, 596]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <DuskWalk t={t} id="g9b" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y + bend, EMP.s, { yaw: -0.45, look: -0.55, headTilt: -14, armL: { a: 55, b: -26 }, armR: { a: 55, b: -26 }, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P5S83: "Are you asking me out?" — Emma teases, eyebrow up
export const P5S83: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -4 },
    { headTilt: -8, armR: { a: 40, b: -18 } },
    [[0, 'smug']], [[0, 'smug'], [len * 0.6, 'happy']], 1.5);

// P5S84: "Maybe." — Pip's cheeky non-answer
export const P5S84: React.FC<ShotProps> = ({ t, len }) => {
  const smug = easeOut(clamp((t - 5) / 12));
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 1010]]), kf(t, [[0, 585], [len, 590]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <DuskWalk t={t} id="g9c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: -6 * smug, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: -6, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P5S85: she smiled — Emma's warm, deciding smile
export const P5S85: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 1010]]), kf(t, [[0, 585], [len, 590]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
    <DuskWalk t={t} id="g9d" />
    <Glow x={EMP.x} y={EMP.y - 190} r={240 + easeOut(clamp(t / 15)) * 120} o={0.2} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: -5, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S86: "Then maybe my answer is yes." — the payoff line, wider emotional frame
export const P5S86: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
    <DuskWalk t={t} id="g9e" />
    <Glow x={960} y={480} r={520} o={0.28} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: -4, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'happy'], [len * 0.8, 'smug']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.5, look: -0.6, headTilt: -5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    <Tag x={960} y={270} t={t - 4} text="then maybe my answer is yes" />
    {/* her shadow celebrating behind her */}
    <ShadowFigure x={1300} y={910} s={0.55} flip={-1} mood="cheer" t={t} opacity={0.8} />
  </g>
);

// P5S87: you both laughed — shared joy
export const P5S87: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -12, armL: { a: 60, b: -28 }, armR: { a: 60, b: -28 } },
    { headTilt: -12, armL: { a: 60, b: -28 }, armR: { a: 60, b: -28 } },
    [[0, 'happy'], [len * 0.4, 'oops']], [[0, 'happy'], [len * 0.4, 'oops']], 1.3);

// P5S88: the day couldn't get stranger — Emma suddenly looks down at the pavement
export const P5S88: React.FC<ShotProps> = ({ t, len }) => {
  const lookDown = easeOut(clamp((t - 4) / 12));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 555], [len, 540]]), kf(t, [[0, 1.15], [len, 1.35]]))}>
      <DuskWalk t={t} id="g9h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, headTilt: 6 + lookDown * 16, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'neutral'], [len * 0.8, 'shock']]) })} rimId="rimR" shadow={0.4} />
      {/* her eyeline drops to the ground */}
      <path d={`M ${EMP.x + 40} ${EMP.y - 260} L ${PIP.x - 40} ${PIP.y - 40}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.5 * lookDown} />
      <Glow x={960} y={700} r={380} o={0.15 * lookDown} />
    </g>
  );
};

// P5S89: not at her own shadow — beat: camera hints, her shadow stays put
export const P5S89: React.FC<ShotProps> = ({ t, len }) => {
  const lookDown = 1;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), kf(t, [[0, 590], [len, 560]]), kf(t, [[0, 1.6], [len, 1.9]]))}>
      <DuskWalk t={t} id="g9i" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.3, headTilt: 22, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'shock']]) })} rimId="rimR" shadow={0.35} />
      {/* HER OWN shadow — standing normally beside her, ignored */}
      <ShadowFigure x={1050} y={915} s={0.5} flip={-1} mood="idle" t={t} opacity={0.55} />
      <Tag x={960} y={300} t={t - 3} text="not her shadow…" />
    </g>
  );
};

// P5S90: at yours — THE twist: camera drops to Pip's shadow, mid-nervous-fidget
export const P5S90: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = easeOut(clamp((t - 3) / 10));
  const fidget = Math.sin(t * 3) * 6;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.3], [len, 1.7]]))}>
      <DuskWalk t={t} id="g9j" />
      {/* Pip's shadow on the pavement — bigger than life, fidgeting nervously */}
      <g transform={`translate(${PIP.x - 20} ${PIP.y + 90}) scale(0.75 -0.75)`} opacity={reveal}>
        <path d="M -30 -160 Q 0 -172 30 -160 L 32 -70 Q 0 -58 -32 -70 Z" fill="#100C1C" />
        <circle cx={0} cy={-196} r={25} fill="#100C1C" />
        {/* nervous arms: one scratching head, one wringing */}
        <path d={`M -22 -150 Q -40 -180 -34 -208`} stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
        <path d={`M 22 -150 Q 44 -160 ${38 + fidget} -130`} stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
        {/* sweat drop */}
        <path d={`M 30 ${-215 - Math.sin(t * 4) * 4} q 7 11 0 18 q -7 -7 0 -18`} fill="#8FD3FF" opacity={0.8} />
      </g>
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, headTilt: 4, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.35, look: -0.35, headTilt: 20, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock'], [len * 0.9, 'happy']]) })} rimId="rimR" shadow={0.3} />
      <Glow x={PIP.x} y={PIP.y + 40} r={280} o={0.2 * reveal} />
      <Tag x={960} y={280} t={t - 4} text="…at yours." />
    </g>
  );
};

export const p5c9Shots: ShotMap = {
  P5S81, P5S82, P5S83, P5S84, P5S85, P5S86, P5S87, P5S88, P5S89, P5S90,
};
