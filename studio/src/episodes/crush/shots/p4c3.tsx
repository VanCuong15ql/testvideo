import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c3 — you forget the decorations; her shadow laughs beside her; then you nick
// your finger on cardboard and Emma comes over. Brief: out/crush/scenes/p4c3_brief.md

const { Classroom, ShadowFigure, Bandage, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1100, y: 815, s: 0.95 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'f3a' }) => <Classroom t={t + 1000} id={id} />;

// P4S21: you forgot the decorations — dreamy beat, hearts floating
export const P4S21: React.FC<ShotProps> = ({ t, len }) => {
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) });
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, headTilt: -6, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Cls t={t} id="f3b" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      {/* drifting hearts — forgot the work */}
      {[0, 1, 2].map((i) => {
        const k = (t * 0.3 + i * 0.33) % 1;
        return <path key={i} d={`M ${960 + (i - 1) * 160} ${300 + k * 200} c -10 -12 -24 -4 -18 7 c 4 7 18 14 18 14 c 0 0 14 -7 18 -14 c 6 -11 -8 -19 -18 -7 Z`} fill="#E86A92" opacity={(1 - k) * 0.5} />;
      })}
      <Glow x={960} y={520} r={500} o={0.2} />
      <Tag x={960} y={240} t={t - 6} text="decorations? what decorations" />
    </g>
  );
};

// P4S22: her shadow sat beside her, laughing too — shadow seated, doubled over
export const P4S22: React.FC<ShotProps> = ({ t, len }) => {
  const laughY = Math.sin(t * 0.8) * 6;
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1045]]), kf(t, [[0, 620], [len, 608]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t} id="f3c" />
      {/* Emma small at bottom, still smiling */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      {/* the shadow on the floor beside her, laughing */}
      <ShadowFigure x={EMP.x + 200} y={EMP.y + 60 + laughY} s={0.55} flip={-1} mood="laugh" t={t * 1.6} />
      <Glow x={EMP.x + 200} y={EMP.y - 60} r={220} o={0.14} />
    </g>
  );
};

// P4S23: it looked happier than ever — shadow alone, joy radiating
export const P4S23: React.FC<ShotProps> = ({ t, len }) => {
  const jump = Math.abs(Math.sin(t * 0.8));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 2.0], [len, 2.2]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={480} r={560} o={0.16} />
      <ShadowFigure x={960} y={760 - jump * 60} s={0.9} mood="cheer" t={t * 1.5} />
      {/* joy sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${800 + i * 110} ${480 - (i % 2) * 60} l 6 -14 l 6 14 l 14 6 l -14 6 l -6 14 l -6 -14 l -14 -6 Z`} fill="#FFE9B0" opacity={clamp(Math.sin(t * 0.4 + i * 1.5) * 0.5 + 0.5)} />
      ))}
      <Tag x={960} y={260} t={t - 4} text="happiest it's ever been" />
    </g>
  );
};

// P4S24: cutting cardboard, nicked your finger — close on hands + cardboard
export const P4S24: React.FC<ShotProps> = ({ t, len }) => {
  const cut = clamp((t - len * 0.4) / 8);
  const pose: Pose = { ...K.basePose, x: 960, y: 640, scale: 2.4, yaw: 0.2, look: 0.3, armL: { a: 65, b: -30 }, armR: { a: 68, b: -32 } };
  return (
    <g transform={camT(960, 620, 1.4)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={560} r={480} o={0.13} />
      {/* cardboard sheet */}
      <g transform="translate(960 780) rotate(-3)">
        <rect x={-220} y={-80} width={440} height={160} rx={8} fill="#B08A5A" stroke="#0D0A14" strokeWidth={4} />
        <path d={`M -160 -60 L ${-160 + cut * 140} ${-60 + cut * 30}`} stroke="#E86A92" strokeWidth={5} strokeLinecap="round" opacity={cut} />
      </g>
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.55, 'shock']]) }} rimId="rimR" shadow={0} />
      {/* the nick: tiny red dot + flinch lines */}
      {cut > 0 ? (
        <g>
          <circle cx={960 + 40} cy={640 - 120} r={6} fill="#E86A92" />
          <path d="M 900 540 l -14 -18 M 1020 540 l 14 -18" stroke="#E9C46A" strokeWidth={5} strokeLinecap="round" opacity={cut} />
        </g>
      ) : null}
    </g>
  );
};

// P4S25: "Ow." — tiny yelp, Pip shakes hand
export const P4S25: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t * 1.4) * 6 * clamp(t / 5);
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.4, look: 0.4, armR: { a: 60, b: -34 } } },
    { f: len * 0.4, p: { x: PIP.x + shake * 0.4, armR: { a: 75, b: -40 }, headTilt: 10 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Cls t={t} id="f3d" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      {/* cardboard on the floor */}
      <g transform="translate(300 900) rotate(-4)" opacity={0.8}>
        <rect x={-140} y={-50} width={280} height={100} rx={8} fill="#B08A5A" stroke="#0D0A14" strokeWidth={4} />
      </g>
      <Tag x={PIP.x + 130} y={PIP.y - 330} t={t - 2} text="ow" />
    </g>
  );
};

// P4S26: Emma immediately looked over — her head snaps toward him
export const P4S26: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5 }) },
    { f: len * 0.4, p: { yaw: 0.5, look: 0.4, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Cls t={t} id="f3e" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      {/* fast glance lines */}
      <path d={`M ${EMP.x - 140} ${EMP.y - 340} l -20 -10 M ${EMP.x - 160} ${EMP.y - 320} l -22 -6`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

// P4S27: "What happened?" — Emma asks, concerned
export const P4S27: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.4, armL: { a: 40, b: -18 } }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Cls t={t} id="f3f" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P4S28: "It's nothing." — Pip downplays, hides hand
export const P4S28: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4 }) },
    { f: len * 0.4, p: { armR: { a: 50, b: -45 }, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Cls t={t} id="f3g" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P4S29: she put down her marker and came closer — Emma approaches
export const P4S29: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x, y: EMP.y, scale: EMP.s, yaw: 0.5, look: 0.4 } },
    { f: len * 0.6, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f3h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      {/* marker left on the desk */}
      <rect x={EMP.x + 140} y={EMP.y - 140} width={12} height={60} rx={6} fill="#E86A92" transform="rotate(20)" />
    </g>
  );
};

// P4S30: "Let me see." — Emma reaches for his hand
export const P4S30: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5, armL: { a: 30, b: -14 } } },
    { f: len * 0.5, p: { armL: { a: 55, b: -28 } }, ease: easeOut },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armR: { a: 50, b: -45 } }) },
    { f: len * 0.5, p: { armR: { a: 40, b: -30 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Cls t={t} id="f3i" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={380} t={t - 3} text="let me see" />
    </g>
  );
};

export const p4c3Shots: ShotMap = {
  P4S21, P4S22, P4S23, P4S24, P4S25, P4S26, P4S27, P4S28, P4S29, P4S30,
};
