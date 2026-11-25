import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c7 — Emma notices you hovering: "Hey! Where did you go?" "I'm fine."
// "You've been quiet." "Just a little tired." Emma nods. Brief: p4c7_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA, DANIEL } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f7a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

const EMP = { x: 1150, y: 815, s: 0.9 };
const DAN = { x: 1340, y: 800, s: 0.85 };
const PIP = { x: 640, y: 850, s: 0.95 };

// P4S61: before you could decide — Emma spots you; she waves him over
export const P4S61: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5 }) },
    { f: len * 0.4, p: { yaw: 0.5, look: 0.5, armR: { a: 70, b: -20 } }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.7, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Fest t={t} id="f7b" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* wave arc Emma→Pip */}
      <path d={`M ${EMP.x - 80} ${EMP.y - 300} Q ${(EMP.x + PIP.x) / 2} ${Math.min(EMP.y, PIP.y) - 260} ${PIP.x + 100} ${PIP.y - 240}`} stroke="#E9C46A" strokeWidth={4} strokeDasharray="10 8" opacity={clamp((t - 4) / 8) * 0.7} />
      <ShadowFigure x={1000} y={920} s={0.6} flip={-1} mood="idle" t={t} opacity={0.7} />
    </g>
  );
};

// P4S62: "Hey! Where did you go?" — Emma calls out, concerned
export const P4S62: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5, armR: { a: 70, b: -20 } }) },
    { f: len * 0.4, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f7c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.7, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      <path d={`M ${EMP.x - 110} ${EMP.y - 340} q 18 -16 38 0 M ${EMP.x - 150} ${EMP.y - 316} q 14 -12 30 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P4S63: "Nowhere. I was just getting some water." — Pip lies, holds cup
export const P4S63: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, armR: { a: 55, b: -30 } }) },
    { f: len * 0.4, p: { headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Fest t={t} id="f7d" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.8, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      {/* fake water cup in hand */}
      <g transform={`translate(${PIP.x + 80} ${PIP.y - 190})`}>
        <rect x={-16} y={-24} width={32} height={48} rx={6} fill="#9FC0D6" stroke="#0D0A14" strokeWidth={3} />
        <rect x={-11} y={-34} width={22} height={12} rx={3} fill="#3E8E5A" />
      </g>
    </g>
  );
};

// P4S64: she looked at you for a moment — Emma studies his face
export const P4S64: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: 6, look: 0.6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Fest t={t} id="f7e" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) })} rimId="rimR" shadow={0.5} />
      {/* scrutiny lines */}
      <path d={`M ${EMP.x - 130} ${EMP.y - 330} l 26 -8 M ${EMP.x - 140} ${EMP.y - 308} l 30 -4`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

// P4S65: "Are you okay?" — direct question
export const P4S65: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, armL: { a: 40, b: -18 } }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f7f" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      <Tag x={960} y={340} t={t - 3} text="are you okay?" />
    </g>
  );
};

// P4S66: "Yeah. Why?" — Pip deflects
export const P4S66: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 3 }) },
    { f: len * 0.4, p: { headTilt: -2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Fest t={t} id="f7g" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P4S67: "You've been quiet." — Emma observes, soft
export const P4S67: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, headTilt: 4 }) },
    { f: len * 0.5, p: { headTilt: -2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f7h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      <Tag x={960} y={340} t={t - 3} text="you've been quiet" />
    </g>
  );
};

// P4S68: you shrugged — Pip's little shoulder lift
export const P4S68: React.FC<ShotProps> = ({ t, len }) => {
  const shrug = Math.sin(clamp((t - 3) / 8) * Math.PI);
  const pip = { ...idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55 }), sway: shrug * 7, armL: { a: 25 + shrug * 20, b: -14 }, armR: { a: 25 + shrug * 18, b: -13 } };
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Fest t={t} id="f7i" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P4S69: "Just a little tired." — Pip sells it
export const P4S69: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: 6 }) },
    { f: len * 0.4, p: { headTilt: 2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Fest t={t} id="f7j" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P4S70: Emma nodded — she accepts, but her eyes linger
export const P4S70: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.55, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: 8 }, ease: easeOut },
    { f: len * 0.7, p: { headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f7k" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* her shadow behind: arms crossed, still watching Pip */}
      <ShadowFigure x={1050} y={915} s={0.58} flip={-1} mood="think" t={t} opacity={0.75} />
    </g>
  );
};

export const p4c7Shots: ShotMap = {
  P4S61, P4S62, P4S63, P4S64, P4S65, P4S66, P4S67, P4S68, P4S69, P4S70,
};
