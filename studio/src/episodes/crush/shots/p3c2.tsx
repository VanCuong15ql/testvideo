import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c2 — "Want to share?" / "Unless you want to swim home." The umbrella is tiny;
// you both squeeze under it and try to keep your distance. Brief: p3c2_brief.md

const { Street, Rain, Umbrella, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 860, s: 1.0 };
const EMP = { x: 1120, y: 845, s: 0.95 };

// walking pair under one tiny umbrella, mid-stride
const pairPose = (px: number, ex: number, t: number, extraP: Partial<Pose> = {}, extraE: Partial<Pose> = {}) => ({
  pip: { ...walkPose(px, t * 0.5, 870, 0.98, { yaw: 0.15, look: 0.3, ...extraP }, 1), ...faceAt(t, [[0, 'neutral'] as const]) },
  emp: { ...walkPose(ex, t * 0.5 + 3, 858, 0.93, { yaw: -0.15, look: -0.3, ...extraE }, -1), ...faceAt(t, [[0, 'happy'] as const]) },
});

// P3S11: you looked at the umbrella — insert: the tiny canopy vs the rain
export const P3S11: React.FC<ShotProps> = ({ t, len }) => {
  const tilt = Math.sin(t * 0.15) * 5;
  return (
    <g transform={camT(960, 480, 1.6)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={420} r={500} o={0.13} />
      <Rain t={t} n={80} o={0.55} slant={-0.3} />
      {/* the umbrella, absurdly small, held high */}
      <Umbrella x={960} y={330} s={0.9} tilt={tilt} />
      {/* rain bouncing off / missing it */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={700 + i * 180} cy={560 + (i % 2) * 60} r={4 + (i % 3) * 2} fill="#9FC0D6" opacity={0.7} />
      ))}
      <Tag x={960} y={180} t={t - 4} text="it is SO small" />
    </g>
  );
};

// P3S12: then at Emma — her hopeful face
export const P3S12: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s * 1.2, { yaw: 0.45, look: 0.3, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 560, 1.4)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={520} r={480} o={0.13} />
      <Rain t={t} n={70} o={0.45} slant={-0.3} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0} />
      <Umbrella x={EMP.x + 60} y={EMP.y - 330} s={0.6} tilt={-6} />
    </g>
  );
};

// P3S13: "Are you sure?" — Pip skeptical
export const P3S13: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.4 }) },
    { f: len * 0.4, p: { headTilt: -6, armR: { a: 40, b: -18 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} />
      <Rain t={t} n={100} o={0.5} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.55} tilt={-6} />
    </g>
  );
};

// P3S14: "Unless you want to swim home." — Emma's smirk, water joke
export const P3S14: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, headTilt: 4 }) },
    { f: len * 0.4, p: { headTilt: -3, armL: { a: 45, b: -20 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.4, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.5} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.55} tilt={-6} />
      {/* tiny swim doodle */}
      <g opacity={clamp((t - 4) / 8)} transform={`translate(${PIP.x - 120} ${PIP.y - 340})`}>
        <path d="M -30 0 q 15 -12 30 0 q 15 12 30 0" stroke="#8FD3FF" strokeWidth={5} fill="none" />
        <path d="M 30 0 q 10 -8 20 0" stroke="#8FD3FF" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

// P3S15: you laughed — Pip's laugh, umbrella tilts
export const P3S15: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.4, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -10, armR: { a: 50, b: -22 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.55} tilt={-10} />
    </g>
  );
};

// P3S16: "Okay. Fair enough." — agreement, walk begins
export const P3S16: React.FC<ShotProps> = ({ t, len }) => {
  const pip = walkPose(kf(t, [[0, PIP.x], [len, PIP.x + 140]]), t * 0.5, 865, 0.98, { yaw: 0.15, look: 0.3 }, 1);
  const emp = walkPose(kf(t, [[0, EMP.x], [len, EMP.x - 130]]), t * 0.5 + 3, 852, 0.93, { yaw: -0.15, look: -0.3 }, -1);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      {/* one umbrella between them, centered */}
      <Umbrella x={lerp(EMP.x, PIP.x, 0.5) + 10} y={760} s={0.55} tilt={-4} />
    </g>
  );
};

// P3S17: the umbrella was small — close-up: canopy barely covers two heads
export const P3S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, 1.7)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <Glow x={960} y={560} r={500} o={0.13} />
    <Rain t={t} n={80} o={0.5} slant={-0.3} />
    {/* two heads under a tiny dome */}
    <K.Hero look={YOU} pose={idle(820, 780, 0.85, { yaw: 0.1, look: 0.2 })} rimId="rimR" shadow={0} />
    <K.Hero look={EMMA} pose={idle(1100, 775, 0.82, { yaw: -0.1, look: -0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0} />
    <Umbrella x={960} y={430} s={0.75} tilt={-2} />
    {/* rain reaching their shoulders */}
    {[0, 1, 2].map((i) => (
      <line key={i} x1={700 + i * 260} y1={600} x2={680 + i * 260} y2={660} stroke="#9FC0D6" strokeWidth={4} opacity={0.8} />
    ))}
    <Tag x={960} y={220} t={t - 3} text="small." />
  </g>
);

// P3S18: very small. — the same, tighter; canopy edge vs shoulders
export const P3S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 680, 2.1)}>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <Glow x={960} y={600} r={480} o={0.13} />
    <Rain t={t} n={70} o={0.5} slant={-0.3} />
    <K.Hero look={YOU} pose={idle(850, 800, 0.7, { yaw: 0.1, look: 0.2 })} rimId="rimR" shadow={0} />
    <K.Hero look={EMMA} pose={idle(1070, 795, 0.68, { yaw: -0.1, look: -0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0} />
    <Umbrella x={960} y={480} s={0.62} tilt={-3} />
    {/* measurement ticks showing the canopy is barely wider than their heads */}
    <path d="M 830 560 L 1090 560 M 830 548 L 830 572 M 1090 548 L 1090 572" stroke="#E9C46A" strokeWidth={4} opacity={0.7} />
    <Tag x={960} y={320} t={t - 2} text="very small." />
  </g>
);

// P3S19: walk close together — medium two-shot, shoulders almost touching
export const P3S19: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = pairPose(kf(t, [[0, PIP.x], [len, PIP.x + 160]]), kf(t, [[0, EMP.x], [len, EMP.x - 150]]), t, {}, {});
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 170} y={758} s={0.55} tilt={-3} />
    </g>
  );
};

// P3S20: at first you tried to leave space — Pip leans away, gap highlighted
export const P3S20: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const pip = walkPose(PIP.x - k * 60, t * 0.5, 868, 0.98, { yaw: 0.3, look: 0.2 }, 1);
  const emp = walkPose(EMP.x + k * 60, t * 0.5 + 3, 855, 0.93, { yaw: -0.3, look: -0.2 }, -1);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={960} y={755} s={0.55} tilt={-4} />
      {/* the gap between them, marked */}
      <path d={`M ${PIP.x + 90} 800 L ${EMP.x - 110} 800`} stroke="#E86A92" strokeWidth={5} strokeDasharray="12 10" opacity={0.6} />
      <Tag x={880} y={740} t={t - 4} text="gap" />
    </g>
  );
};

export const p3c2Shots: ShotMap = {
  P3S11, P3S12, P3S13, P3S14, P3S15, P3S16, P3S17, P3S18, P3S19, P3S20,
};
