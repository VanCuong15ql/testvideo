import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c2 — the shadow's small treasons: it isn't waving, it's holding books; then it points,
// makes a heart, and Pip almost drops his backpack. Brief: out/crush/scenes/p1c2_brief.md

const { HALL, Hallway, ShadowFigure, Notebook, Backpack, Tag, Glow, camT, kf, clamp, lerp, poseAt, faceAt, joints, toWorld, easeOut, YOU, EMMA, FRIEND, SIS } = K;

const EMP = { x: 960, y: HALL.far.y, s: HALL.far.s };
const MO = { x: 700, y: 706, s: 0.74 };
const SISP = { x: 1230, y: 700, s: 0.7 };
const PIP = { x: 1380, y: 860, s: 1.02 };

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

// the floor spot where Emma's shadow lives
const SH_X = 1060;
const SH_Y = 812;

// P1S11: she wasn't waving — medium on Emma, her shadow standing quiet at her feet
export const P1S11: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.25, look: 0.4, armL: { a: 20, b: -30 }, armR: { a: 22, b: -28 } }) },
    { f: len * 0.5, p: { armL: { a: 14, b: -20 }, armR: { a: 16, b: -22 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Hallway t={t + 130} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <ellipse cx={SH_X} cy={SH_Y} rx={64} ry={12} fill="#000" opacity={0.35} />
      <ShadowFigure x={SH_X} y={SH_Y} s={0.44} mood="idle" t={t} />
    </g>
  );
};

// P1S12: insert — both her hands are still holding her books
export const P1S12: React.FC<ShotProps> = ({ t }) => {
  const pose: Pose = { ...K.basePose, x: 960, y: 780, scale: 1.5, yaw: 0.1, look: 0, armL: { a: 42, b: 30 }, armR: { a: 44, b: 32 } };
  const j = joints(pose);
  const hl = toWorld(pose, j.armL.end);
  const hr = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(960, 700, 1.9)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={620} r={460} o={0.14} />
      <K.Hero look={EMMA} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(${hl.x} ${hl.y})`}><Notebook x={0} y={0} s={0.55} rot={-8} /></g>
      <g transform={`translate(${hr.x} ${hr.y})`}><Notebook x={0} y={0} s={0.55} rot={6} /></g>
    </g>
  );
};

// P1S13: but her shadow? — low on the floor, the silhouette shrugs
export const P1S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 830], [len, 815]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
    <Hallway t={t + 145} />
    <ellipse cx={SH_X} cy={SH_Y} rx={70} ry={13} fill="#000" opacity={0.4} />
    <ShadowFigure x={SH_X} y={SH_Y} s={0.5} mood="shrug" t={t} />
    <Tag x={1400} y={300} t={t} text="?" />
    <Glow x={SH_X} y={SH_Y - 120} r={200} o={0.07} />
  </g>
);

// P1S14: it was waving like it had just spotted its favourite celebrity
export const P1S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1080], [len, 1050]]), kf(t, [[0, 840], [len, 820]]), kf(t, [[0, 1.6], [len, 1.9]]))}>
    <Hallway t={t + 160} />
    <ellipse cx={SH_X} cy={SH_Y} rx={76} ry={14} fill="#000" opacity={0.35} />
    <ShadowFigure x={SH_X} y={SH_Y} s={0.52} flip={-1} mood="wave" t={t} />
    {/* little star sparkles around its head — it found a celebrity */}
    {[[-30, -40], [34, -52], [0, -70]].map(([dx, dy], i) => (
      <path key={i} d={`M ${SH_X + dx} ${SH_Y + dy} l 4 -10 l 4 10 l 10 4 l -10 4 l -4 10 l -4 -10 l -10 -4 Z`} fill="#FFE9B0" opacity={clamp(Math.sin(t * 0.3 + i) * 0.5 + 0.5)} />
    ))}
  </g>
);

// P1S15: you stared at it — tight on Pip, eyes locked on the floor
export const P1S15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.1;
  const pose: Pose = { ...K.basePose, x: 960, y: 640 - K.HEAD.y * sc, scale: sc, yaw: 0.35, look: -0.9, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, ...faceAt(t, [[0, 'shock'], [len * 0.55, 'worried']]) };
  return (
    <g transform={camT(960, 600, 1.1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={560} r={460} o={0.12} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// P1S16: the shadow pointed at you, then made a heart with both hands
export const P1S16: React.FC<ShotProps> = ({ t, len }) => {
  const mood = t < len * 0.45 ? 'point' : 'heart';
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1035]]), kf(t, [[0, 835], [len, 815]]), kf(t, [[0, 1.7], [len, 2.0]]))}>
      <Hallway t={t + 175} />
      {/* Pip's shoes at frame bottom — the shadow points AT us */}
      <ellipse cx={SH_X} cy={SH_Y} rx={78} ry={14} fill="#000" opacity={0.35} />
      <ShadowFigure x={SH_X} y={SH_Y} s={0.54} flip={-1} mood={mood} t={t} />
      {/* motion ticks on the point */}
      {mood === 'point' ? <path d={`M ${SH_X - 130} ${SH_Y - 260} l -18 -14 M ${SH_X - 118} ${SH_Y - 236} l -20 -8`} stroke="#8B7BB8" strokeWidth={5} strokeLinecap="round" opacity={0.7} /> : null}
      <Glow x={SH_X} y={SH_Y - 140} r={240} o={0.09} />
    </g>
  );
};

// P1S17: you almost dropped your backpack — Pip flinches, the bag slides off a shoulder
export const P1S17: React.FC<ShotProps> = ({ t, len }) => {
  const slip = kf(t, [[0, 0], [len * 0.7, 0], [len, 1]]);
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: -0.6, look: -0.9, armL: { a: 20, b: -14 }, armR: { a: 18, b: -12 } } },
    { f: 10, p: { yaw: -0.75, look: -1, squash: 0.08 }, ease: easeOut },
    { f: 30, p: { squash: 0.02, armL: { a: 46, b: -20 } } },
  ]);
  const j = joints(pose);
  const sh = toWorld(pose, { x: -30, y: -160 });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), kf(t, [[0, 640], [len, 625]]), kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Hallway t={t + 190} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <g transform={`translate(${sh.x} ${sh.y})`}><Backpack x={0} y={0} s={0.85} slip={slip} /></g>
    </g>
  );
};

// P1S18: you looked back at Emma — the danger is still smiling
export const P1S18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s * 0.95, yaw: -0.8, look: -0.9 } },
    { f: len * 0.4, p: { yaw: -0.35, look: 0.3 } },
    { f: len * 0.8, p: { yaw: -0.2, look: 0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 620], [len, 605]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Hallway t={t + 205} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.2, look: 0.4 })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P1S19: she was still chatting, completely unaware — wide, the shadow does its own thing behind her
export const P1S19: React.FC<ShotProps> = ({ t, len }) => {
  const emma = idle(EMP.x, EMP.y, EMP.s, { yaw: 0.2, look: 0.4, armR: { a: 24, b: -18 } });
  const mo = idle(MO.x, MO.y, MO.s, { yaw: 0.4, look: 0.5 });
  const sis = idle(SISP.x, SISP.y, SISP.s, { yaw: -0.4, look: -0.5 });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Hallway t={t + 220} />
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.3} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.3} />
      <K.Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.3} />
      {/* the shadow, behind her, giving a quiet thumbs-up */}
      <ellipse cx={SH_X} cy={SH_Y} rx={70} ry={13} fill="#000" opacity={0.35} />
      <ShadowFigure x={SH_X} y={SH_Y} s={0.46} flip={-1} mood="thumb" t={t} opacity={0.9} />
    </g>
  );
};

// P1S20: you quickly walked into your classroom — Pip retreats down the hall, door light ahead
export const P1S20: React.FC<ShotProps> = ({ t, len }) => {
  const walk = K.walkPose(kf(t, [[0, 520], [len, 700]]), t * 0.6, 860, 1.0, { yaw: 1, look: 0 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 590], [len, 575]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Hallway t={t + 235} />
      {/* classroom door at the end of the hall, warm light inside */}
      <rect x={880} y={430} width={160} height={290} rx={4} fill="#F2B95C" opacity={0.55} />
      <rect x={880} y={430} width={160} height={290} rx={4} fill="none" stroke="#141126" strokeWidth={8} />
      <Glow x={960} y={575} r={240} o={0.15} />
      <K.Hero look={YOU} pose={{ ...walk, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <ForegroundLike />
    </g>
  );
};

const ForegroundLike: React.FC = () => (
  <g>
    <path d="M 30 1080 Q 140 860 300 790 Q 220 930 260 1080 Z" fill="#0E0A1C" opacity={0.85} />
    <path d="M 1890 1080 Q 1790 870 1650 810 Q 1740 940 1700 1080 Z" fill="#0C0918" opacity={0.85} />
  </g>
);

export const p1c2Shots: ShotMap = { P1S11, P1S12, P1S13, P1S14, P1S15, P1S16, P1S17, P1S18, P1S19, P1S20 };
