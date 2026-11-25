import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c10 — finale: Emma stares at Pip's fidgeting shadow, bursts out
// laughing: "Your shadow is really nervous right now." Brief: p5c10_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'gA0' }) => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.28} />
    <circle cx={1560} cy={430} r={140} fill="#F2B06E" opacity={0.55} />
    <Glow x={1560} y={430} r={420} o={0.35} />
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
  </g>
);

// Pip's fidgeting shadow — shared across the scene
const PipShadow: React.FC<{ t: number; x?: number; y?: number; s?: number }> = ({ t, x = PIP.x - 20, y = PIP.y + 90, s = 0.75 }) => {
  const fidget = Math.sin(t * 3) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} -${s})`}>
      <path d="M -30 -160 Q 0 -172 30 -160 L 32 -70 Q 0 -58 -32 -70 Z" fill="#100C1C" />
      <circle cx={0} cy={-196} r={25} fill="#100C1C" />
      <path d={`M -22 -150 Q -40 -180 -34 -208`} stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={`M 22 -150 Q 44 -160 ${38 + fidget} -130`} stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={`M 30 ${-215 - Math.sin(t * 4) * 4} q 7 11 0 18 q -7 -7 0 -18`} fill="#8FD3FF" opacity={0.8} />
    </g>
  );
};

// P5S91: she stared at it for a few seconds — Emma's gaze locked on the shadow
export const P5S91: React.FC<ShotProps> = ({ t, len }) => {
  const stare = easeOut(clamp((t - 2) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), kf(t, [[0, 590], [len, 570]]), kf(t, [[0, 1.6], [len, 1.85]]))}>
      <DuskWalk t={t} id="gA1" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, headTilt: 4, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.35, look: -0.35, headTilt: 22, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) })} rimId="rimR" shadow={0.35} />
      <PipShadow t={t} />
      <Glow x={PIP.x} y={PIP.y + 40} r={280} o={0.2 * stare} />
      {/* stare lines from Emma's eyes to the shadow */}
      <path d={`M ${EMP.x - 20} ${EMP.y - 250} L ${PIP.x + 60} ${PIP.y - 20} M ${EMP.x + 30} ${EMP.y - 255} L ${PIP.x + 80} ${PIP.y - 30}`} stroke="#E9C46A" strokeWidth={3} opacity={0.4 * stare} />
    </g>
  );
};

// P5S92: then she started laughing — Emma breaks, doubled over
export const P5S92: React.FC<ShotProps> = ({ t, len }) => {
  const bend = easeOut(clamp((t - 3) / 10));
  const shake = Math.sin(t * 10) * 4 * bend;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 595], [len, 600]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <DuskWalk t={t} id="gA2" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy'], [len * 0.8, 'oops']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x + shake, EMP.y + bend * 34, EMP.s * (1 - bend * 0.1), { yaw: -0.4, look: -0.4, headTilt: -20, armL: { a: 60, b: -28 }, armR: { a: 60, b: -28 }, ...faceAt(t, [[0, 'smug'], [len * 0.4, 'happy'], [len * 0.7, 'oops']]) })} rimId="rimR" shadow={0.35} />
      <PipShadow t={t} />
      {/* laugh lines */}
      <path d={`M ${EMP.x - 130} ${EMP.y - 310} q -16 -14 -30 0 M ${EMP.x - 150} ${EMP.y - 282} q -12 -10 -24 0 M ${EMP.x + 90} ${EMP.y - 300} q 16 -14 30 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={0.7 * bend} />
    </g>
  );
};

// P5S93: "Your shadow is really nervous right now." — the punchline, Tag + both laughing
export const P5S93: React.FC<ShotProps> = ({ t, len }) => {
  const laugh = easeOut(clamp((t - 3) / 10));
  const bobE = Math.sin(t * 8) * 5 * laugh;
  const bobP = Math.sin(t * 7 + 1) * 4 * laugh;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 545], [len, 535]]), kf(t, [[0, 1.25], [len, 1.45]]))}>
      <DuskWalk t={t} id="gA3" />
      <Glow x={960} y={480} r={540} o={0.3} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y + bobP, PIP.s, { yaw: 0.5, look: 0.55, headTilt: -8, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'happy'], [len * 0.8, 'oops']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y + bobE, EMP.s * (1 - laugh * 0.08), { yaw: -0.4, look: -0.45, headTilt: -18, armL: { a: 65, b: -28 }, armR: { a: 65, b: -28 }, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.35} />
      {/* Pip's shadow, still fidgeting — the joke lands on it */}
      <PipShadow t={t} s={0.85} />
      <Glow x={PIP.x} y={PIP.y + 30} r={300} o={0.25} />
      <Tag x={960} y={260} t={t - 5} text="your shadow is really nervous right now" />
      {/* heart between them finally */}
      <ShadowFigure x={970} y={920} s={0.55} mood="heart" t={t} opacity={0.8 * laugh} />
    </g>
  );
};

export const p5c10Shots: ShotMap = { P5S91, P5S92, P5S93 };
