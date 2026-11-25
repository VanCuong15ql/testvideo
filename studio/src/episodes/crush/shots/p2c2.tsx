import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c2 — she smiles, the shadow celebrates; then the library: laptops, presentation,
// a short video idea, and Emma's surprised face. Brief: out/crush/scenes/p2c2_brief.md

const { Study, Desk, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 830, s: 1.0 };
const EMP = { x: 1080, y: 815, s: 0.95 };
const SH = { x: 1150, y: 890 };

const Lib: React.FC<{ t: number; id?: string }> = ({ t, id = 'p2l' }) => <Study t={t + 600} id={id} veil={0.3} />;

// laptop drawn flat on the desk
const Laptop: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-8} width={140} height={10} rx={3} fill="#3A3550" />
    <rect x={-58} y={-52} width={116} height={46} rx={4} fill="#22203A" stroke="#4A4480" strokeWidth={3} />
    <rect x={-50} y={-44} width={100} height={30} rx={2} fill={glow > 0 ? '#8B7BB8' : '#3E5A8C'} opacity={0.55 + glow * 0.45} />
    <path d="M -40 -34 l 24 -10 M -20 -36 l 20 12 M 4 -36 l 16 10" stroke="#C9D4EE" strokeWidth={3} opacity={0.7} />
  </g>
);

// P2S11: she smiled — Emma's smile, warm
export const P2S11: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.5, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: 0, armL: { a: 30, b: -14 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <ClsShim t={t} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P2S12: her shadow immediately threw both hands into the air — cheer
export const P2S12: React.FC<ShotProps> = ({ t, len }) => {
  const pop = easeOut(clamp((t - 2) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <ClsShim t={t} id="p2l2" />
      <ellipse cx={SH.x} cy={SH.y} rx={70} ry={12} fill="#000" opacity={0.3} />
      <ShadowFigure x={SH.x} y={SH.y - pop * 20} s={0.55 * (0.8 + 0.2 * pop)} flip={-1} mood="cheer" t={t * 1.5} />
      <Glow x={SH.x} y={SH.y - 160} r={260} o={0.15 * pop} />
    </g>
  );
};

// P2S13: you pretended not to notice — Pip looks at his shoes, fake focus
export const P2S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s * 1.2, yaw: 0.6, look: -0.6, headTilt: 14, armL: { a: 50, b: -30 } } },
    { f: len * 0.5, p: { look: -0.8 } },
  ]);
  return (
    <g transform={camT(960, 560, 1.5)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={480} o={0.12} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0} />
      {/* his fake-studious scribble */}
      <path d={`M 1300 700 q 30 -20 60 0 q 30 20 60 0`} stroke="#C9D4EE" strokeWidth={6} fill="none" opacity={0.5} />
      <path d={`M 1300 730 q 30 -16 60 4 q 30 20 60 -4`} stroke="#8A93AE" strokeWidth={5} fill="none" opacity={0.4} />
    </g>
  );
};

// P2S14: after class, the library — wide establishing, two desks, dusk lamps
export const P2S14: React.FC<ShotProps> = ({ t, len }) => {
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'happy']]) });
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Lib t={t} id="p2l3" />
      <Desk x0={420} x1={760} y={880} />
      <Desk x0={1060} x1={1400} y={860} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      {/* their two shadows on the floor between the desks */}
      <ellipse cx={880} cy={950} rx={120} ry={14} fill="#000" opacity={0.28} />
      <ShadowFigure x={900} y={958} s={0.5} mood="idle" t={t} opacity={0.4} />
      <Glow x={960} y={480} r={560} o={0.12} />
    </g>
  );
};

// P2S15: she opened her laptop, you wrote ideas — split attention
export const P2S15: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, armL: { a: 55, b: -30 }, armR: { a: 55, b: -30 } }) },
    { f: len * 0.4, p: { headTilt: -6 }, ease: easeOut },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, armR: { a: 50, b: -28 } }) },
    { f: len * 0.5, p: { armR: { a: 62, b: -34 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p2l4" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <Laptop x={EMP.x + 60} y={EMP.y - 160} s={0.9} glow={clamp(t / len)} />
      {/* Pip's notebook page */}
      <g transform={`translate(${PIP.x + 90} ${PIP.y - 140}) rotate(-5)`}>
        <rect x={-55} y={-40} width={110} height={80} rx={5} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={3} />
        <path d="M -40 -20 q 16 -8 32 0 M -40 0 q 16 -8 32 0 M -40 20 q 16 -8 32 0" stroke="#8A93AE" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

// P2S16: "How about a presentation instead of a poster?" — Emma suggests, finger up
export const P2S16: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, headTilt: 6 }) },
    { f: len * 0.4, p: { armR: { a: 70, b: -20 }, headTilt: -2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p2l5" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <Laptop x={EMP.x + 60} y={EMP.y - 160} s={0.9} glow={0.6} />
      <Tag x={EMP.x - 60} y={EMP.y - 330} t={t - 3} text="presentation?" />
      <path d={`M ${EMP.x + 40} ${EMP.y - 320} q 16 -14 34 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.04)} />
    </g>
  );
};

// P2S17: "That could work." — Pip nods, thoughtful
export const P2S17: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, headTilt: -4 }) },
    { f: len * 0.45, p: { headTilt: 8 }, ease: easeOut },
    { f: len * 0.75, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.4], [len, 1.48]]))}>
      <Lib t={t} id="p2l6" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.25, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S18: "And maybe we can add a short video." — Emma brightens, idea spark
export const P2S18: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2 }) },
    { f: len * 0.4, p: { armL: { a: 45, b: -20 }, armR: { a: 65, b: -22 }, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p2l7" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.4} />
      {/* video camera doodle */}
      <g transform={`translate(${EMP.x - 40} ${EMP.y - 300}) rotate(-8)`} opacity={clamp((t - 4) / 8)}>
        <rect x={-34} y={-20} width={68} height={40} rx={6} fill="#3A3550" stroke="#8B7BB8" strokeWidth={3} />
        <circle cx={0} cy={0} r={12} fill="#141126" stroke="#8B7BB8" strokeWidth={3} />
        <rect x={-10} y={-34} width={20} height={14} rx={3} fill="#3A3550" stroke="#8B7BB8" strokeWidth={3} />
      </g>
      <Glow x={EMP.x - 40} y={EMP.y - 300} r={160} o={0.2} />
    </g>
  );
};

// P2S19: "That's actually a good idea." — Pip agrees, pencil taps
export const P2S19: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, armR: { a: 55, b: -30 } }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -36 }, headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.4], [len, 1.48]]))}>
      <Lib t={t} id="p2l8" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.25, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S20: she looked surprised — Emma's eyebrows up, caught off guard by agreement
export const P2S20: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -8, armL: { a: 35, b: -16 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 570], [len, 562]]), kf(t, [[0, 1.6], [len, 1.72]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={540} r={500} o={0.13} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0} />
      {/* surprise ticks */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${EMP.x - 160 + i * 20} ${EMP.y - 380 - i * 14} l 10 -14`} stroke="#E9C46A" strokeWidth={5} strokeLinecap="round" opacity={clamp(1 - t * 0.03)} />
      ))}
    </g>
  );
};

// classroom-ish backdrop for the first three shots (they're still in class / transition)
const ClsShim: React.FC<{ t: number; id?: string }> = ({ t, id = 'p2l1' }) => <K.Classroom t={t + 550} id={id} />;

export const p2c2Shots: ShotMap = {
  P2S11, P2S12, P2S13, P2S14, P2S15, P2S16, P2S17, P2S18, P2S19, P2S20,
};
