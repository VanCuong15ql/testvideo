import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c1 — the group project: teacher announces pairs, you and Emma are stuck together.
// Brief: out/crush/scenes/p2c1_brief.md

const { Classroom, Glow, Tag, camT, kf, clamp, easeOut, poseAt, faceAt, walkPose, YOU, EMMA, FRIEND, SIS, TEACHER } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const TCHR = { x: 960, y: 560, s: 1.15 };   // teacher at the board
const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1050, y: 815, s: 0.95 };
const MO = { x: 480, y: 860, s: 0.9 };
const SISP = { x: 1240, y: 850, s: 0.9 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'p2a' }) => <Classroom t={t + 500} id={id} />;

// P2S1: title beat
export const P2S1: React.FC<ShotProps> = ({ t }) => {
  const inK = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45 * inK} />
      <g transform={`translate(960 520) scale(${0.7 + 0.3 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={76} fill="#F2E3C9" fontStyle="italic">The Group Project</text>
        <line x1={-300} y1={36} x2={300} y2={36} stroke="#8B7BB8" strokeWidth={4} opacity={0.8} />
      </g>
    </g>
  );
};

// P2S2: a few days later — teacher announces a group assignment
export const P2S2: React.FC<ShotProps> = ({ t, len }) => {
  const tch = poseAt(t, [
    { f: 0, p: idle(TCHR.x, TCHR.y, TCHR.s, { yaw: 0, look: 0, armR: { a: 30, b: -14 } }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -24 }, armL: { a: 40, b: -18 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={TEACHER} pose={{ ...tch, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <Tag x={1360} y={430} t={t - 4} text="GROUP WORK" />
    </g>
  );
};

// P2S3: you hoped for your usual friends — Mo and sis wave hopefully
export const P2S3: React.FC<ShotProps> = ({ t, len }) => {
  const mo = poseAt(t, [
    { f: 0, p: idle(MO.x, MO.y, MO.s, { yaw: 0.6, look: 0.6, armR: { a: 60, b: -20 } }) },
    { f: len * 0.5, p: { armR: { a: 75, b: -10 } } },
  ]);
  const sis = idle(SISP.x, SISP.y, SISP.s, { yaw: -0.5, look: -0.5, armL: { a: 55, b: -24 }, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="p2b" />
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={SIS} pose={sis} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'happy'], [len * 0.8, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      {/* hopeful thought bubble */}
      <g opacity={clamp(1 - t * 0.02)}>
        <circle cx={560} cy={480} r={46} fill="#F4EEE0" opacity={0.9} />
        <circle cx={540} cy={500} r={12} fill="#F4EEE0" opacity={0.7} />
        <circle cx={528} cy={522} r={7} fill="#F4EEE0" opacity={0.5} />
        <text x={560} y={492} textAnchor="middle" fontSize={30}>?</text>
      </g>
    </g>
  );
};

// P2S4: unfortunately, other plans — teacher's finger lands on YOU
export const P2S4: React.FC<ShotProps> = ({ t, len }) => {
  const tch = poseAt(t, [
    { f: 0, p: idle(TCHR.x, TCHR.y, TCHR.s, { yaw: 0, look: 0 }) },
    { f: len * 0.45, p: { armR: { a: 65, b: -20 }, look: 0.5 }, ease: easeOut },
    { f: len * 0.7, p: { look: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Cls t={t} id="p2c" />
      <K.Hero look={TEACHER} pose={{ ...tch, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len * 0.55, 'shock']]) })} rimId="rimR" shadow={0.5} />
      {/* pointer line from teacher to Pip */}
      <path d={`M ${TCHR.x + 60} ${TCHR.y - 120} L ${PIP.x - 60} ${PIP.y - 260}`} stroke="#E9C46A" strokeWidth={5} strokeDasharray="10 8" opacity={clamp((t - len * 0.5) / 6)} />
      <Tag x={PIP.x} y={PIP.y - 320} t={t - len * 0.5} text="!" />
    </g>
  );
};

// P2S5: "Emma and you will work together." — teacher taps Emma then Pip
export const P2S5: React.FC<ShotProps> = ({ t, len }) => {
  const tch = poseAt(t, [
    { f: 0, p: idle(TCHR.x, TCHR.y, TCHR.s, { yaw: 0.2, look: 0.2, armR: { a: 55, b: -22 } }) },
    { f: len * 0.5, p: { yaw: -0.15, look: -0.2, armL: { a: 50, b: -24 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Cls t={t} id="p2d" />
      <K.Hero look={TEACHER} pose={{ ...tch, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <Tag x={960} y={380} t={t - 2} text="PARTNERS" />
    </g>
  );
};

// P2S6: you tried to look calm — Pip's face cycles shock→worried→forced neutral
export const P2S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.4, look: 0.4,
    ...faceAt(t, [[0, 'shock'], [len * 0.3, 'worried'], [len * 0.6, 'neutral'], [len * 0.8, 'smug']]),
  });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 982]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.9], [len, 2.0]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={540} r={480} o={0.13} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
      {/* a bead of sweat */}
      <path d={`M ${PIP.x + 130} ${PIP.y - 330 - Math.sin(t * 0.2) * 6} q 8 12 0 20 q -8 -8 0 -20`} fill="#8FD3FF" opacity={clamp((t - len * 0.4) / 8)} />
    </g>
  );
};

// P2S7: "Okay." — tiny resigned nod
export const P2S7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: 10 }, ease: easeOut },
    { f: len * 0.7, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.6], [len, 1.68]]))}>
      <Cls t={t} id="p2e" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P2S8: Emma turned toward you — she rotates to face Pip
export const P2S8: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4 }) },
    { f: len * 0.5, p: { yaw: 0.5, look: 0.5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="p2f" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P2S9: "Looks like we're partners." — Emma gestures between them, smile
export const P2S9: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5, armR: { a: 30, b: -14 } }) },
    { f: len * 0.4, p: { armR: { a: 50, b: -22 }, armL: { a: 40, b: -18 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="p2g" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.5} />
      {/* little link icon between them */}
      <g opacity={clamp((t - len * 0.4) / 8)}>
        <circle cx={840} cy={600} r={16} fill="none" stroke="#E9C46A" strokeWidth={5} />
        <circle cx={920} cy={600} r={16} fill="none" stroke="#E9C46A" strokeWidth={5} />
      </g>
    </g>
  );
};

// P2S10: "Yeah. Guess so." — mutual awkward beat, both look away
export const P2S10: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5 }) },
    { f: len * 0.5, p: { yaw: 0.2, look: 0.2 }, ease: easeOut },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.5 }) },
    { f: len * 0.5, p: { yaw: -0.2, look: -0.2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.4], [len, 1.48]]))}>
      <Cls t={t} id="p2h" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.45} />
    </g>
  );
};

export const p2c1Shots: ShotMap = {
  P2S1, P2S2, P2S3, P2S4, P2S5, P2S6, P2S7, P2S8, P2S9, P2S10,
};
