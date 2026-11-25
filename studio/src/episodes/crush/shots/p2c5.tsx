import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c5 — "Fonts are important." / "Sure. Very important." Her shadow is laughing.
// Not Emma. The shadow. Brief: out/crush/scenes/p2c5_brief.md

const { Study, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 830, s: 1.0 };
const EMP = { x: 1080, y: 815, s: 0.95 };
const SH = { x: 1350, y: 660 };   // her wall shadow behind her

const Lib: React.FC<{ t: number; id?: string }> = ({ t, id = 'p5l' }) => <Study t={t + 900} id={id} veil={0.15} night />;

// P2S41: "Fonts are important." — Pip defends, deadpan
export const P2S41: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, headTilt: 0 }) },
    { f: len * 0.4, p: { armR: { a: 45, b: -20 }, headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p5l1" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S42: "Sure. Very important." — Emma's dry agreement, flat smile
export const P2S42: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, headTilt: 4 }) },
    { f: len * 0.5, p: { headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p5l2" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P2S43: her shadow was laughing — cut to the wall: silhouette doubled over
export const P2S43: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1060], [len, 1045]]), kf(t, [[0, 450], [len, 438]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
    <Glow x={960} y={500} r={500} o={0.13} />
    {/* Emma tiny at bottom edge, still composed */}
    <K.Hero look={EMMA} pose={idle(960, 980, 0.5, { yaw: 0, look: 0, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0} />
    {/* the shadow, huge on the wall, bent double laughing */}
    <ShadowFigure x={SH.x} y={SH.y + Math.sin(t * 0.8) * 8} s={1.35} flip={-1} mood="laugh" t={t * 1.6} />
    {/* laugh tears */}
    <path d={`M ${SH.x - 60} ${SH.y - 300} q 10 16 0 26 M ${SH.x + 60} ${SH.y - 300} q -10 16 0 26`} stroke="#8FD3FF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
    <Glow x={SH.x} y={SH.y - 140} r={320} o={0.16} />
  </g>
);

// P2S44: not Emma. — same frame, Emma's face: totally straight
export const P2S44: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s * 1.15, { yaw: 0.3, look: 0.2, headTilt: 6 }) },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), kf(t, [[0, 555], [len, 548]]), kf(t, [[0, 1.9], [len, 2.0]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={480} o={0.12} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.7, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Tag x={960} y={300} t={t - 2} text="not her" />
    </g>
  );
};

// P2S45: the shadow. — back to the wall: it can't stop
export const P2S45: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1060], [len, 1045]]), kf(t, [[0, 450], [len, 438]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
    <Glow x={960} y={500} r={500} o={0.13} />
    <ShadowFigure x={SH.x} y={SH.y} s={1.4} flip={-1} mood="laugh" t={t * 1.7} />
    <Tag x={SH.x - 260} y={280} t={t - 2} text="the shadow" />
  </g>
);

// P2S46: both hands on stomach, bending forward — custom doubled-over laugh
export const P2S46: React.FC<ShotProps> = ({ t, len }) => {
  const bend = Math.sin(t * 0.9) * 6;
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 440], [len, 425]]), kf(t, [[0, 2.0], [len, 2.2]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={480} r={520} o={0.14} />
      <g transform={`translate(${SH.x} ${SH.y + bend}) rotate(${bend * 0.6}) scale(1.5 -1)`}>
        {/* doubled-over body: torso pitched forward, hands clasped on belly */}
        <path d="M -30 -170 Q 0 -185 30 -170 L 34 -60 Q 60 -30 40 10 L -40 10 Q -60 -30 -34 -60 Z" fill="#100C1C" />
        <circle cx={0} cy={-215} r={30} fill="#100C1C" />
        <path d="M -18 -160 Q -40 -110 -30 -60 M 18 -160 Q 40 -110 30 -60" stroke="#100C1C" strokeWidth={18} fill="none" strokeLinecap="round" />
        {/* hands on stomach */}
        <ellipse cx={0} cy={-30} rx={34} ry={16} fill="#100C1C" />
        <circle cx={-14} cy={-40} r={9} fill="#100C1C" />
        <circle cx={14} cy={-40} r={9} fill="#100C1C" />
        {/* legs */}
        <path d="M -16 -10 L -20 40 M 16 -10 L 20 40" stroke="#100C1C" strokeWidth={16} strokeLinecap="round" />
      </g>
      {/* big laugh shakes */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${SH.x - 220 + i * 26} ${SH.y - 330 + i * 30} q 12 14 0 28`} stroke="#8FD3FF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
      ))}
      <Glow x={SH.x} y={SH.y - 160} r={340} o={0.18} />
    </g>
  );
};

// P2S47: you quickly looked down at your laptop — Pip hides behind screen
export const P2S47: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4 }) },
    { f: len * 0.4, p: { look: -0.9, headTilt: 18, armL: { a: 60, b: -32 }, armR: { a: 58, b: -30 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p5l3" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.4} />
      {/* laptop screen up, hiding his face */}
      <g transform={`translate(${PIP.x + 70} ${PIP.y - 150}) rotate(-6)`}>
        <rect x={-70} y={-50} width={140} height={90} rx={6} fill="#22203A" stroke="#4A4480" strokeWidth={4} />
        <rect x={-60} y={-40} width={120} height={60} rx={3} fill="#3E5A8C" opacity={0.8} />
      </g>
    </g>
  );
};

// P2S48: this was getting ridiculous — Pip facepalms-ish, defeated
export const P2S48: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.3, headTilt: 10 }) },
    { f: len * 0.5, p: { armL: { a: 80, b: -40 }, armR: { a: 82, b: -42 }, headTilt: 16 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 982]]), kf(t, [[0, 570], [len, 563]]), kf(t, [[0, 1.55], [len, 1.66]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={500} o={0.13} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'dizzy']]) }} rimId="rimR" shadow={0} />
      <Tag x={960} y={320} t={t - 4} text="ridiculous" />
    </g>
  );
};

export const p2c5Shots: ShotMap = {
  P2S41, P2S42, P2S43, P2S44, P2S45, P2S46, P2S47, P2S48,
};
