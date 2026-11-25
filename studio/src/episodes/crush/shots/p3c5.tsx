import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c5 — the walk home talk: "easier to talk to than I expected," "I just thought
// you were really quiet," "I'm usually quiet around people I don't know." Brief: p3c5_brief.md

const { Street, Rain, Umbrella, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 860, s: 1.0 };
const EMP = { x: 1100, y: 845, s: 0.95 };

const pair = (t: number, k: number, extraP: Partial<Pose> = {}, extraE: Partial<Pose> = {}) => ({
  pip: { ...walkPose(lerp(PIP.x, 560, k), t * 0.5, 868, 0.98, { yaw: 0.15, look: 0.25, ...extraP }, 1), ...faceAt(t, [[0, 'neutral'] as const]) },
  emp: { ...walkPose(lerp(EMP.x, 1330, k), t * 0.5 + 3, 855, 0.93, { yaw: -0.15, look: -0.25, ...extraE }, -1), ...faceAt(t, [[0, 'neutral'] as const]) },
});

const Backdrop: React.FC<{ t: number; k?: number }> = ({ t, k = 0.3 }) => (
  <g>
    <Street t={t} id="p5u" />
    <Rain t={t} n={80} o={0.4} />
    <Glow x={1400} y={430} r={700} o={0.18 + k * 0.1} />
    <Umbrella x={lerp(830, 980, k)} y={748} s={0.55} tilt={-4} />
    <ShadowFigure x={lerp(950, 1120, k)} y={960} s={0.6} flip={-1} mood="idle" t={t} opacity={0.8} />
  </g>
);

// P3S41: "Sure." — Pip agrees, small nod while walking
export const P3S41: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.3, { headTilt: 6 }, {});
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Backdrop t={t} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S42: "You're actually easier to talk to than I expected." — Emma honest, looking ahead
export const P3S42: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.35, {}, { headTilt: -4 });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Backdrop t={t} k={0.35} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <path d={`M ${EMP.x - 80} ${EMP.y - 360} q 16 -14 34 0 M ${EMP.x - 112} ${EMP.y - 336} q 12 -10 26 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.04)} />
    </g>
  );
};

// P3S43: you looked at her — Pip turns his head
export const P3S43: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.4);
  const pipLook = poseAt(t, [
    { f: 0, p: pip },
    { f: len * 0.5, p: { ...pip, yaw: 0.6, look: 0.6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.4} />
      <K.Hero look={YOU} pose={{ ...pipLook, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S44: "Was I difficult to talk to before?" — Pip asks, half-teasing
export const P3S44: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.42, { headTilt: -4 }, {});
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.42} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S45: she laughed — Emma's laugh
export const P3S45: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.45, {}, { headTilt: -8 });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.45} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.45} />
      {/* her shadow bouncing too */}
      <ShadowFigure x={lerp(950, 1120, 0.45)} y={950} s={0.6} flip={-1} mood="laugh" t={t * 1.5} opacity={0.8} />
    </g>
  );
};

// P3S46: "No. I just thought you were really quiet." — Emma honest, softer
export const P3S46: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.48, {}, { headTilt: 4 });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.48} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S47: you shrugged — Pip's shoulder shimmy
export const P3S47: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.5);
  const shrug = Math.sin(clamp((t - 3) / 8) * Math.PI);
  const pipShrug = { ...pip, sway: (pip.sway ?? 0) + shrug * 8, armL: { a: (pip.armL?.a ?? 10) + shrug * 20, b: (pip.armL?.b ?? -8) + shrug * 12 }, armR: { a: (pip.armR?.a ?? 10) + shrug * 18, b: (pip.armR?.b ?? -8) + shrug * 10 } };
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.5} />
      <K.Hero look={YOU} pose={{ ...pipShrug, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S48: "I'm usually quiet around people I don't know very well." — Pip admits
export const P3S48: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.52, { headTilt: 6 }, {});
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Backdrop t={t} k={0.52} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P3S49: "And now?" — Emma presses, curious
export const P3S49: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pair(t, 0.55, {}, { headTilt: -6 });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Backdrop t={t} k={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Tag x={960} y={380} t={t - 2} text="and now?" />
    </g>
  );
};

// P3S50: you looked at her — the moment hangs; close two-shot
export const P3S50: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s * 1.15, yaw: 0.5, look: 0.5 } },
    { f: len * 0.5, p: { look: 0.6 }, ease: easeOut },
  ]);
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 60, y: EMP.y, scale: EMP.s * 1.1, yaw: -0.5, look: -0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 600], [len, 588]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={520} o={0.14} />
      <Rain t={t} n={70} o={0.4} slant={-0.3} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* umbrella above both, small */}
      <Umbrella x={960} y={330} s={0.7} tilt={-3} />
      {/* heartbeat tick between them */}
      <path d={`M 960 620 l 0 -18 M 960 640 l 14 -20 l 10 26 l 16 -34 l 10 30`} stroke="#E86A92" strokeWidth={5} fill="none" strokeLinecap="round" opacity={clamp(t / 10) * 0.8} />
    </g>
  );
};

export const p3c5Shots: ShotMap = {
  P3S41, P3S42, P3S43, P3S44, P3S45, P3S46, P3S47, P3S48, P3S49, P3S50,
};
