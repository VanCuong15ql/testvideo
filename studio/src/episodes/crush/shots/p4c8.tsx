import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c8 — Emma explains Daniel was just carrying drinks; "did you think
// something else?" "No." "Okay." Brief: out/crush/scenes/p4c8_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA, DANIEL } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f8a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

const EMP = { x: 1150, y: 815, s: 0.9 };
const DAN = { x: 1340, y: 800, s: 0.85 };
const PIP = { x: 640, y: 850, s: 0.95 };

// P4S71: then she glanced at Daniel — Emma looks over her shoulder
export const P4S71: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55 }) },
    { f: len * 0.5, p: { yaw: -0.3, look: -0.4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Fest t={t} id="f8b" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* eyeline Emma→Daniel */}
      <path d={`M ${EMP.x + 60} ${EMP.y - 280} L ${DAN.x - 60} ${DAN.y - 260}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
    </g>
  );
};

// P4S72: "He was just helping me carry the drinks." — Emma explains, gestures at booth
export const P4S72: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.2, look: 0.4, armR: { a: 40, b: -18 } }) },
    { f: len * 0.5, p: { armR: { a: 65, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f8c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* empty drink crates at the booth — the evidence */}
      <g transform="translate(700 700)">
        <rect x={-60} y={-30} width={120} height={60} rx={6} fill="#8A6452" stroke="#0D0A14" strokeWidth={3} />
        <text x={0} y={12} textAnchor="middle" fontSize={20} fill="#F4EEE0">drinks</text>
      </g>
      <Tag x={960} y={340} t={t - 5} text="carrying drinks" />
    </g>
  );
};

// P4S73: you felt slightly embarrassed — Pip shrinks a bit
export const P4S73: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: 10, squash: 0.06 }, ease: easeOut },
    { f: len * 0.8, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Fest t={t} id="f8d" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'oops']]) }} rimId="rimR" shadow={0.5} />
      {/* embarrassed sweat */}
      <path d={`M ${PIP.x + 110} ${PIP.y - 310 - Math.sin(t * 0.2) * 6} q 8 12 0 20 q -8 -8 0 -20`} fill="#8FD3FF" opacity={clamp((t - len * 0.4) / 8)} />
    </g>
  );
};

// P4S74: "Oh. I see." — small reply, deflated
export const P4S74: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 6 }) },
    { f: len * 0.5, p: { headTilt: 2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Fest t={t} id="f8e" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P4S75: Emma looked at you — she turns back, studying
export const P4S75: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.2, look: 0.4 }) },
    { f: len * 0.5, p: { yaw: 0.55, look: 0.55, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Fest t={t} id="f8f" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P4S76: "Did you think something else?" — the direct question lands
export const P4S76: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, armL: { a: 40, b: -18 } }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f8g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      <Tag x={960} y={340} t={t - 3} text="did you think…?" />
    </g>
  );
};

// P4S77: you quickly shook your head — rapid no
export const P4S77: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t * 2.2) * 10 * clamp(t / 6) * clamp((len - t) / 6);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: shake * 0.4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Fest t={t} id="f8h" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'worried'], [len * 0.7, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* motion lines on the shake */}
      <path d={`M ${PIP.x + 100} ${PIP.y - 330} l 18 -10 M ${PIP.x + 118} ${PIP.y - 340} l 18 -4`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

// P4S78: "No." — flat denial, too fast
export const P4S78: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Fest t={t} id="f8i" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      <Tag x={960} y={340} t={t - 2} text="no." />
    </g>
  );
};

// P4S79: she smiled — Emma's careful, testing smile
export const P4S79: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Fest t={t} id="f8j" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy'], [len * 0.8, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <Glow x={EMP.x} y={EMP.y - 200} r={220} o={0.14} />
    </g>
  );
};

// P4S80: "Okay." — she accepts, but the shadow behind her facepalms
export const P4S80: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.55, look: 0.55 }) },
    { f: len * 0.5, p: { headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f8k" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* her shadow: hand on forehead, facepalm — preview of p4c9 */}
      <ShadowFigure x={1050} y={915} s={0.58} flip={-1} mood="think" t={t} opacity={0.8} />
      <g transform="translate(1050 915) scale(0.58 -0.58)">
        <path d="M 30 -215 q 40 -20 60 10" stroke="#100C1C" strokeWidth={12} fill="none" strokeLinecap="round" />
        <circle cx={95} cy={-200} r={10} fill="#100C1C" />
      </g>
    </g>
  );
};

export const p4c8Shots: ShotMap = {
  P4S71, P4S72, P4S73, P4S74, P4S75, P4S76, P4S77, P4S78, P4S79, P4S80,
};
