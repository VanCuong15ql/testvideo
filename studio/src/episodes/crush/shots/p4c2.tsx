import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c2 — "you're very demanding" / "creative direction" — then a paper battle,
// Emma laughs herself to the floor. Brief: out/crush/scenes/p4c2_brief.md

const { Classroom, PaperBall, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, YOU, EMMA, ShadowFigure } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1100, y: 815, s: 0.95 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'f2a' }) => <Classroom t={t + 950} id={id} />;

// P4S11: she narrowed her eyes — Emma's suspicious stare
export const P4S11: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.65], [len, 1.78]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={530} r={480} o={0.13} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0} />
      {/* narrowed-eye ticks */}
      <path d={`M ${EMP.x - 120} ${EMP.y - 320} l 30 -6 M ${EMP.x - 130} ${EMP.y - 300} l 34 -4`} stroke="#E9C46A" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
    </g>
  );
};

// P4S12: "You're very demanding for someone who hasn't done much." — Emma calls out
export const P4S12: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, armR: { a: 40, b: -18 } }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f2b" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P4S13: "I've been providing creative direction." — Pip, self-important
export const P4S13: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, headTilt: -4 }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -22 }, armR: { a: 50, b: -20 }, headTilt: -8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f2c" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={330} t={t - 4} text="creative direction" />
    </g>
  );
};

// P4S14: "That's a fancy way of saying you've been sitting there." — Emma unimpressed
export const P4S14: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, headTilt: 6 }) },
    { f: len * 0.5, p: { headTilt: 2 }, ease: easeOut },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, headTilt: -8 }) },
    { f: len * 0.5, p: { headTilt: -2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f2d" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.4} />
      {/* Pip literally sitting on a chair, pointing */}
      <g transform={`translate(${PIP.x} ${PIP.y + 40})`} opacity={0.9}>
        <rect x={-60} y={-10} width={120} height={18} rx={6} fill="#4A3430" />
        <rect x={-50} y={8} width={14} height={50} fill="#4A3430" />
        <rect x={36} y={8} width={14} height={50} fill="#4A3430" />
      </g>
    </g>
  );
};

// P4S15: you laughed — Pip breaks
export const P4S15: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, headTilt: -2 }) },
    { f: len * 0.4, p: { headTilt: -10, armR: { a: 50, b: -22 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Cls t={t} id="f2e" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P4S16: she threw a paper ball — projectile Emma→Pip
export const P4S16: React.FC<ShotProps> = ({ t, len }) => {
  const throwK = clamp((t - 4) / 10);
  const bx = lerp(EMP.x - 80, PIP.x + 100, throwK);
  const by = lerp(EMP.y - 300, PIP.y - 200, throwK) - Math.sin(throwK * Math.PI) * 120;
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, armR: { a: 30, b: -14 } }) },
    { f: 8, p: { armR: { a: 80, b: -16 } }, ease: easeOut },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35 }) },
    { f: 12, p: { look: 0.6, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f2f" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {throwK > 0 && throwK < 1 ? <PaperBall x={bx} y={by} rot={t * 12} c="#F4EEE0" /> : null}
      {/* motion arc */}
      <path d={`M ${EMP.x - 80} ${EMP.y - 320} Q ${(EMP.x + PIP.x) / 2} ${Math.min(EMP.y, PIP.y) - 420} ${PIP.x + 100} ${PIP.y - 220}`} fill="none" stroke="#8B7BB8" strokeWidth={3} strokeDasharray="8 10" opacity={0.4} />
    </g>
  );
};

// P4S17: you picked it up and threw it back — reverse arc
export const P4S17: React.FC<ShotProps> = ({ t, len }) => {
  const throwK = clamp((t - 3) / 9);
  const bx = lerp(PIP.x + 100, EMP.x - 80, throwK);
  const by = lerp(PIP.y - 200, EMP.y - 300, throwK) - Math.sin(throwK * Math.PI) * 130;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f2g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, armR: { a: 75, b: -18 }, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, headTilt: -6, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) })} rimId="rimR" shadow={0.4} />
      {throwK > 0 && throwK < 1 ? <PaperBall x={bx} y={by} rot={-t * 14} c="#E9C46A" /> : null}
    </g>
  );
};

// P4S18: ridiculous paper battle — chaos: balls everywhere, both ducking
export const P4S18: React.FC<ShotProps> = ({ t, len }) => {
  const balls = Array.from({ length: 12 }, (_, i) => {
    const dir = i % 2 ? 1 : -1;
    const speed = 1.4 + (i % 4) * 0.3;
    const k = ((t * speed + i * 1.7) % 2);
    return {
      x: lerp(dir > 0 ? PIP.x + 80 : EMP.x - 80, dir > 0 ? EMP.x - 80 : PIP.x + 80, k),
      y: lerp(700 + (i % 3) * 60, 620 + (i % 4) * 50, k) - Math.sin(k * Math.PI) * (80 + (i % 3) * 40),
      r: t * (dir * 10 + i),
      c: ['#F4EEE0', '#E9C46A', '#E86A92'][i % 3],
    };
  });
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35 }) },
    { f: 10, p: { x: PIP.x - 30, y: PIP.y - 20, squash: 0.1 }, ease: easeOut },
    { f: 20, p: { squash: 0 } },
    { f: 30, p: { armR: { a: 80, b: -20 } } },
  ]);
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45 }) },
    { f: 14, p: { x: EMP.x + 30, y: EMP.y - 15, squash: 0.08 }, ease: easeOut },
    { f: 26, p: { squash: 0 } },
    { f: 34, p: { armL: { a: 75, b: -22 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 960]]), kf(t, [[0, 585], [len, 562]]), kf(t, [[0, 1.45], [len, 1.75]]))}>
      <Cls t={t} id="f2h" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len * 0.8, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {balls.map((b, i) => <PaperBall key={i} x={b.x} y={b.y} rot={b.r} c={b.c} s={0.8} />)}
      <Glow x={960} y={560} r={500} o={0.2} />
      <Tag x={960} y={280} t={t - 3} text="PAPER WAR" />
    </g>
  );
};

// P4S19: Emma laughed so hard she sat down — she drops to the floor laughing
export const P4S19: React.FC<ShotProps> = ({ t, len }) => {
  const sitK = easeInOut(clamp((t - len * 0.3) / (len * 0.4)));
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -14, armL: { a: 60, b: -26 } }, ease: easeOut },
    { f: len * 0.7, p: { y: EMP.y + sitK * 130, scale: EMP.s * (1 - sitK * 0.35), headTilt: -20 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 566]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Cls t={t} id="f2i" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) }} rimId="rimR" shadow={0.4} />
      {/* a few stray balls still bouncing */}
      {[0, 1].map((i) => (
        <PaperBall key={i} x={EMP.x - 150 + i * 200} y={820 - Math.abs(Math.sin(t * 0.8 + i)) * 60} rot={t * 10 + i * 30} s={0.7} />
      ))}
      {/* her shadow doubled over laughing too */}
      <ShadowFigure x={EMP.x + 180} y={EMP.y + 90} s={0.5} flip={-1} mood="laugh" t={t * 1.5} opacity={0.6} />
    </g>
  );
};

// P4S20: you looked at her — quiet beat, she on the floor
export const P4S20: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4 }) },
    { f: len * 0.5, p: { look: -0.3, yaw: 0.6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={500} o={0.13} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y + 100, EMP.s * 0.7, { yaw: -0.4, look: -0.5, headTilt: -16, ...faceAt(t, [[0, 'oops']]) })} rimId="rimR" shadow={0} />
    </g>
  );
};

export const p4c2Shots: ShotMap = {
  P4S11, P4S12, P4S13, P4S14, P4S15, P4S16, P4S17, P4S18, P4S19, P4S20,
};
