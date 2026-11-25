import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c9 — the shadow's verdict: an exaggerated facepalm behind Emma.
// "You almost laughed. Even her shadow thought you were being ridiculous."
// Brief: out/crush/scenes/p4c9_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA, DANIEL } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f9a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

const EMP = { x: 1150, y: 815, s: 0.9 };
const DAN = { x: 1340, y: 800, s: 0.85 };
const PIP = { x: 640, y: 850, s: 0.95 };
const SH = { x: 1050, y: 920 };

// P4S81: shadow behind her, exaggerated facepalm — the money shot
export const P4S81: React.FC<ShotProps> = ({ t, len }) => {
  const facepalm = easeOut(clamp((t - 3) / 10));
  const slump = Math.sin(clamp(t / len) * Math.PI) * 8;
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Fest t={t} id="f9b" />
      {/* Emma, Pip, Daniel all small below — none of them see it */}
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* THE SHADOW: huge, behind Emma, hand slapped on forehead, body slumped */}
      <g transform={`translate(${SH.x} ${SH.y + slump}) scale(1.1 -1.1)`} opacity={facepalm}>
        {/* body slumped forward */}
        <path d="M -34 -170 Q 0 -185 34 -170 L 38 -60 Q 0 -48 -38 -60 Z" fill="#100C1C" />
        <circle cx={0} cy={-205} r={28} fill="#100C1C" />
        {/* legs */}
        <path d="M -16 -60 L -20 0 M 16 -60 L 20 0" stroke="#100C1C" strokeWidth={14} strokeLinecap="round" />
        {/* left arm hanging, right arm SLAPPED on forehead */}
        <path d="M -26 -160 Q -40 -100 -30 -60" stroke="#100C1C" strokeWidth={13} fill="none" strokeLinecap="round" />
        <path d="M 26 -160 Q 55 -190 40 -225" stroke="#100C1C" strokeWidth={13} fill="none" strokeLinecap="round" />
        <circle cx={42} cy={-232} r={11} fill="#100C1C" />
      </g>
      {/* facepalm impact ticks */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${SH.x + 90 + i * 22} ${SH.y - 420 - i * 14} l 14 -16`} stroke="#E86A92" strokeWidth={5} strokeLinecap="round" opacity={0.7 * facepalm} />
      ))}
      <Glow x={SH.x} y={SH.y - 180} r={300} o={0.16 * facepalm} />
      <Tag x={SH.x + 160} y={300} t={t - 6} text="facepalm" />
    </g>
  );
};

// P4S82: you almost laughed — Pip's lips twitch, hand over mouth
export const P4S82: React.FC<ShotProps> = ({ t, len }) => {
  const twitch = Math.sin(t * 1.3) * 3 * clamp(t / 5);
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, x: PIP.x + twitch * 0.3 }) },
    { f: len * 0.5, p: { armR: { a: 65, b: -45 }, headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={530} r={480} o={0.14} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'happy'], [len * 0.7, 'oops']]) }} rimId="rimR" shadow={0} />
      {/* suppressed laugh ticks */}
      <path d={`M ${PIP.x + 130} ${PIP.y - 310} q 12 -12 26 0 M ${PIP.x + 150} ${PIP.y - 290} q 10 -9 22 0`} stroke="#E9C46A" strokeWidth={4} fill="none" opacity={0.7} />
    </g>
  );
};

// P4S83: even her shadow thought you were ridiculous — wide: everyone oblivious, shadow judging
export const P4S83: React.FC<ShotProps> = ({ t, len }) => {
  const facepalm = easeOut(clamp((t - 4) / 10));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 965]]), kf(t, [[0, 575], [len, 555]]), kf(t, [[0, 1.5], [len, 1.75]]))}>
      <Fest t={t} id="f9c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      {/* the shadow, still mid-facepalm, bigger now */}
      <g transform={`translate(${SH.x} ${SH.y}) scale(1.15 -1.15)`} opacity={facepalm}>
        <path d="M -34 -170 Q 0 -185 34 -170 L 38 -60 Q 0 -48 -38 -60 Z" fill="#100C1C" />
        <circle cx={0} cy={-205} r={28} fill="#100C1C" />
        <path d="M -16 -60 L -20 0 M 16 -60 L 20 0" stroke="#100C1C" strokeWidth={14} strokeLinecap="round" />
        <path d="M -26 -160 Q -40 -100 -30 -60" stroke="#100C1C" strokeWidth={13} fill="none" strokeLinecap="round" />
        <path d="M 26 -160 Q 55 -190 40 -225" stroke="#100C1C" strokeWidth={13} fill="none" strokeLinecap="round" />
        <circle cx={42} cy={-232} r={11} fill="#100C1C" />
      </g>
      <Glow x={SH.x} y={SH.y - 200} r={320} o={0.18 * facepalm} />
      <Tag x={960} y={300} t={t - 6} text="even the shadow judges you" />
      {/* Pip and shadow eye-contact */}
      <path d={`M ${PIP.x + 60} ${PIP.y - 300} L ${SH.x - 60} ${SH.y - 260}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.4 * facepalm} />
    </g>
  );
};

export const p4c9Shots: ShotMap = { P4S81, P4S82, P4S83 };
