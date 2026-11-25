import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c3 — one shoulder gets soaked; Emma notices, moves the umbrella, you both laugh.
// Brief: out/crush/scenes/p3c3_brief.md

const { Street, Rain, Umbrella, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 860, s: 1.0 };
const EMP = { x: 1100, y: 845, s: 0.95 };

// P3S21: one shoulder soaked — close on Pip's right shoulder, rain hitting it
export const P3S21: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s * 1.3, { yaw: 0.3, look: 0.3, armL: { a: 20, b: -12 } }) },
    { f: len * 0.5, p: { squash: 0.05 }, ease: easeOut },
    { f: len * 0.8, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(960, 640, 1.5)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={560} r={480} o={0.12} />
      <Street t={t} id="p3s" />
      <Rain t={t} n={90} o={0.6} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0} />
      {/* rain drips on the exposed shoulder */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={PIP.x + 170} y1={560 + i * 30} x2={PIP.x + 165} y2={590 + i * 30} stroke="#9FC0D6" strokeWidth={5} opacity={0.9} />
      ))}
      {/* wet dark patch */}
      <ellipse cx={PIP.x + 160} cy={PIP.y - 120} rx={40} ry={60} fill="#3A5A8C" opacity={0.5} />
      <Tag x={PIP.x + 220} y={480} t={t - 4} text="soaked" />
    </g>
  );
};

// P3S22: Emma noticed — she glances at his shoulder
export const P3S22: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.4 }) },
    { f: len * 0.5, p: { look: -0.8, headTilt: 8 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} id="p3t" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={965} y={755} s={0.55} tilt={-4} />
    </g>
  );
};

// P3S23: "You're getting wet." — Emma says it, points at shoulder
export const P3S23: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, armR: { a: 50, b: -24 } }) },
    { f: len * 0.4, p: { armR: { a: 65, b: -20 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} id="p3u" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={965} y={755} s={0.55} tilt={-4} />
      <path d={`M ${EMP.x - 80} ${EMP.y - 350} q 16 -14 34 0 M ${EMP.x - 110} ${EMP.y - 326} q 12 -10 26 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P3S24: "I'm fine." — Pip denies, maybe a little soaked anyway
export const P3S24: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3 }) },
    { f: len * 0.4, p: { armR: { a: 45, b: -20 }, headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} id="p3v" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={965} y={755} s={0.55} tilt={-4} />
    </g>
  );
};

// P3S25: she moved the umbrella toward you — the canopy slides over Pip
export const P3S25: React.FC<ShotProps> = ({ t, len }) => {
  const ux = lerp(965, 830, easeOut(clamp((t - 4) / (len * 0.5))));
  const tilt = lerp(-4, 10, easeOut(clamp((t - 4) / (len * 0.5))));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} id="p3w" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, armL: { a: 45, b: -22 }, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={ux} y={750} s={0.55} tilt={tilt} />
      {/* motion ticks of the umbrella moving */}
      <path d={`M ${ux + 60} 700 l 20 -8 M ${ux + 60} 730 l 24 -4`} stroke="#8B7BB8" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

// P3S26: "You're really bad at sharing an umbrella." — Emma teases, rain on HER now
export const P3S26: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, headTilt: -4 }) },
    { f: len * 0.4, p: { headTilt: 6, armR: { a: 50, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} id="p3x" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={750} s={0.55} tilt={10} />
      {/* rain now hitting Emma's side */}
      {[0, 1].map((i) => (
        <line key={i} x1={EMP.x - 140} y1={560 + i * 34} x2={EMP.x - 136} y2={596 + i * 34} stroke="#9FC0D6" strokeWidth={5} opacity={0.85} />
      ))}
    </g>
  );
};

// P3S27: you laughed — both laugh
export const P3S27: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -8, armR: { a: 50, b: -22 } }, ease: easeOut },
  ]);
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6 }) },
    { f: len * 0.4, p: { headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} id="p3y" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={750} s={0.55} tilt={8} />
    </g>
  );
};

// P3S28: "You're the one holding it." — Pip points out the obvious
export const P3S28: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3 }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -22 }, headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} id="p3z" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, armL: { a: 60, b: -26 }, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={750} s={0.55} tilt={8} />
    </g>
  );
};

// P3S29: "Exactly. And I'm doing a terrible job." — Emma owns it, mock-sad
export const P3S29: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, headTilt: 6 }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -26 }, armR: { a: 58, b: -28 }, headTilt: 10 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} id="p3a2" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <Umbrella x={830} y={750} s={0.55} tilt={8} />
    </g>
  );
};

// P3S30: you both laughed — the good kind; umbrella between, rain around
export const P3S30: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -8, armL: { a: 45, b: -22 } }, ease: easeOut },
  ]);
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6 }) },
    { f: len * 0.4, p: { headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Street t={t} id="p3b2" />
      <Rain t={t} n={110} o={0.55} />
      <Glow x={960} y={560} r={420} o={0.18} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={745} s={0.55} tilt={6} />
      {/* shared-laugh sparkles */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${960 + (i - 1) * 130} ${480 - i * 20} l 5 -12 l 5 12 l 12 5 l -12 5 l -5 12 l -5 -12 l -12 -5 Z`} fill="#FFE9B0" opacity={clamp(Math.sin(t * 0.3 + i) * 0.5 + 0.5)} />
      ))}
    </g>
  );
};

export const p3c3Shots: ShotMap = {
  P3S21, P3S22, P3S23, P3S24, P3S25, P3S26, P3S27, P3S28, P3S29, P3S30,
};
