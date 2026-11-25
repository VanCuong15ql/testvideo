import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c3 — "I think I messed something up" / forgot the tickets /
// "everyone is depending on me" / "then let's fix it". Brief: p5c3_brief.md

const { Street, Booth, Glow, Tag, camT, kf, clamp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Corner: React.FC<{ t: number; id?: string }> = ({ t, id = 'g3a' }) => (
  <g>
    <Street t={t} id={id} />
    <rect x={1350} y={120} width={420} height={480} rx={14} fill="#2A2340" stroke="#0D0A14" strokeWidth={5} />
    <rect x={1370} y={140} width={380} height={440} rx={10} fill="#E9C46A" opacity={0.14} />
    <g transform="translate(1150 800) scale(0.9)">
      <rect x={-55} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={41} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-130} width={110} height={44} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-92} width={110} height={10} fill="#8A6E52" />
    </g>
    <g transform="translate(1330 790) scale(0.85)">
      <rect x={-55} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={41} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-130} width={110} height={44} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-92} width={110} height={10} fill="#8A6E52" />
    </g>
  </g>
);

const EMP = { x: 1310, y: 770, s: 0.8 };
const PIP = { x: 1120, y: 780, s: 0.8 };

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'worried']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'worried']]) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1005]]), kf(t, [[0, 575], [len, 580]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
    <Corner t={t} id={`g3${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.4} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.35} />
  </g>
);

// P5S21: "I think I messed something up." — Emma confesses, hands twist
export const P5S21: React.FC<ShotProps> = ({ t, len }) => {
  const twist = Math.sin(t * 1.8) * 6 * clamp(t / 8) * clamp((len - t) / 8);
  return pair(t, len,
    { yaw: 0.5, look: 0.55 },
    { headTilt: 8, armL: { a: 30, b: -16 }, armR: { a: 30, b: -14 }, sway: twist },
    [[0, 'worried']], [[0, 'worried'], [len * 0.6, 'tired']]);
};

// P5S22: "What happened?" — Pip leans in
export const P5S22: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 6, armL: { a: 40, b: -18 } },
    { headTilt: 6 },
    [[0, 'worried']], [[0, 'worried']]);

// P5S23: the tickets confession — flashback insert: empty ticket roll at booth
export const P5S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 995]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
    <Corner t={t} id="g3c" />
    {/* empty ticket holder — the mistake */}
    <g transform="translate(1215 640) rotate(-6)">
      <rect x={-70} y={-40} width={140} height={80} rx={8} fill="#3A2E4A" stroke="#8FD3FF" strokeWidth={3} strokeDasharray="8 6" opacity={0.9} />
      <text x={0} y={14} textAnchor="middle" fontSize={30} fill="#8FD3FF">0 tickets</text>
    </g>
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: 10, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'tired']]) })} rimId="rimR" shadow={0.35} />
    <Glow x={1215} y={640} r={220} o={0.2} />
  </g>
);

// P5S24: you looked at her — held look, Pip studying her face
export const P5S24: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 4, look: 0.6 },
    { headTilt: 4, look: -0.5 },
    [[0, 'neutral'], [len * 0.6, 'worried']], [[0, 'worried']]);

// P5S25: "Is that all?" — Pip's quiet question
export const P5S25: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armL: { a: 35, b: -16 }, headTilt: -2 },
    {},
    [[0, 'worried']], [[0, 'worried']]);

// P5S26: she nodded — small, heavy nod
export const P5S26: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    {},
    { headTilt: 0 },
    [[0, 'worried']], [[0, 'worried'], [len * 0.4, 'neutral']]);

// P5S27: "everyone is depending on me" — Emma's weight shows
export const P5S27: React.FC<ShotProps> = ({ t, len }) => {
  const slump = Math.sin(clamp((t - 3) / (len - 6)) * Math.PI) * 10;
  return pair(t, len,
    { headTilt: 4 },
    { headTilt: 12, squash: slump * 0.4, armL: { a: 35, b: -18 }, armR: { a: 35, b: -16 } },
    [[0, 'worried']], [[0, 'worried'], [len * 0.7, 'tired']]);
};

// P5S28: you smiled — the turn
export const P5S28: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -4 },
    {},
    [[0, 'worried'], [len * 0.4, 'happy']], [[0, 'worried']]);

// P5S29: "Then let's fix it." — Pip's decisive line, Tag
export const P5S29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1005]]), kf(t, [[0, 575], [len, 580]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
    <Corner t={t} id="g3i" />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, armR: { a: 45, b: -20 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) })} rimId="rimR" shadow={0.35} />
    <Glow x={1215} y={600} r={300} o={0.18} />
    <Tag x={960} y={300} t={t - 3} text="then let's fix it" />
  </g>
);

// P5S30: she looked surprised — Emma's eyebrows up
export const P5S30: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -2 },
    { headTilt: -6 },
    [[0, 'happy']], [[0, 'shock'], [len * 0.7, 'worried']]);

export const p5c3Shots: ShotMap = {
  P5S21, P5S22, P5S23, P5S24, P5S25, P5S26, P5S27, P5S28, P5S29, P5S30,
};
