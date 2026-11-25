import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c4 — teasing each other; the assignment becomes the best part of the week;
// then a late library afternoon, two hours gone, "you spent half the time choosing fonts."
// Brief: out/crush/scenes/p2c4_brief.md

const { Study, Desk, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 830, s: 1.0 };
const EMP = { x: 1080, y: 815, s: 0.95 };

const Lib: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'p4l', veil = 0.3 }) => <Study t={t + 800} id={id} veil={veil} night={veil < 0.2} />;

// P2S31: she teased you — Emma points, playful
export const P2S31: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2 }) },
    { f: len * 0.4, p: { armR: { a: 65, b: -20 }, headTilt: -5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p4l1" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      {/* tease ticks */}
      <path d={`M ${EMP.x - 70} ${EMP.y - 340} q 14 -12 30 0 M ${EMP.x - 96} ${EMP.y - 316} q 10 -9 22 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P2S32: you teased her back — Pip's comeback, finger point
export const P2S32: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45 }) },
    { f: len * 0.4, p: { armR: { a: 62, b: -26 }, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p4l2" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S33: the chore became the best part of the week — hearts/sparkles over the pair
export const P2S33: React.FC<ShotProps> = ({ t, len }) => {
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: 0.25, look: 0.15, ...faceAt(t, [[0, 'happy']]) });
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.45, look: 0.35, ...faceAt(t, [[0, 'happy']]) });
  const hearts = [0, 1, 2].map((i) => {
    const k = clamp((t - 6 - i * 8) / 10);
    return { x: lerp(PIP.x + 60, EMP.x - 60, (i + 1) / 4), y: 560 - i * 40 - k * 60, o: k, s: 0.8 + i * 0.2 };
  });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 570], [len, 558]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Lib t={t} id="p4l3" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      <Glow x={850} y={500} r={400} o={0.18} />
      {hearts.map((h, i) => (
        <path key={i} d={`M ${h.x} ${h.y} c -12 -14 -30 -5 -23 9 c 5 9 23 18 23 18 c 0 0 18 -9 23 -18 c 7 -14 -11 -23 -23 -9 Z`} fill="#E86A92" opacity={h.o} transform={`scale(${h.s}) translate(${-h.x / h.s + h.x / h.s} 0)`} />
      ))}
      <Tag x={960} y={330} t={t - 8} text="best part of the week" />
    </g>
  );
};

// P2S34: one afternoon, stayed late — clock on wall shows late, fewer lights
export const P2S34: React.FC<ShotProps> = ({ t, len }) => {
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'tired']]) });
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 968]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Lib t={t} id="p4l4" veil={0.18} />
      {/* late clock */}
      <g transform="translate(1420 200)">
        <circle r={52} fill="#EFE2CC" stroke="#1E1824" strokeWidth={7} />
        <path d="M 0 0 L 0 -34 M 0 0 L 24 12" stroke="#1E1824" strokeWidth={6} strokeLinecap="round" />
        <text y={86} textAnchor="middle" fontSize={26} fill="#8B7BB8">6:40</text>
      </g>
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      <Glow x={960} y={520} r={500} o={0.2} />
    </g>
  );
};

// P2S35: the library almost empty — wide, one lamp pool of light
export const P2S35: React.FC<ShotProps> = ({ t, len }) => {
  const emp = idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, armL: { a: 60, b: -32 }, armR: { a: 58, b: -30 }, ...faceAt(t, [[0, 'tired']]) });
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, armR: { a: 55, b: -30 }, ...faceAt(t, [[0, 'tired']]) });
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 550], [len, 542]]), kf(t, [[0, 1.3], [len, 1.38]]))}>
      <Lib t={t} id="p4l5" veil={0.12} />
      {/* single lamp glow over their table */}
      <Glow x={850} y={600} r={380} o={0.3} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.35} />
      {/* empty chairs receding */}
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.5 - i * 0.12}>
          <ellipse cx={300 + i * 500} cy={980} rx={70} ry={12} fill="#000" opacity={0.3} />
          <rect x={270 + i * 500} y={850} width={60} height={90} rx={8} fill="#3A3550" />
        </g>
      ))}
    </g>
  );
};

// P2S36: Emma stretched and looked at the clock — stretch pose + glance up
export const P2S36: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }) },
    { f: len * 0.45, p: { armL: { a: 170, b: -10 }, armR: { a: 170, b: -10 }, headTilt: -12, look: -0.6 }, ease: easeOut },
    { f: len * 0.8, p: { headTilt: -6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p4l6" veil={0.15} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'tired'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'tired']]) })} rimId="rimR" shadow={0.4} />
      {/* eyeline to the clock */}
      <path d={`M ${EMP.x - 30} ${EMP.y - 300} L 1420 250`} stroke="#E9C46A" strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
    </g>
  );
};

// P2S37: "Wow. We've been here for two hours." — Emma's jaw drops at clock
export const P2S37: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: -0.6, headTilt: -10 }) },
    { f: len * 0.5, p: { armL: { a: 40, b: -18 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 978]]), kf(t, [[0, 565], [len, 555]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Lib t={t} id="p4l7" veil={0.15} />
      {/* big clock insert */}
      <g transform="translate(1420 210)">
        <circle r={70} fill="#EFE2CC" stroke="#1E1824" strokeWidth={9} />
        <path d="M 0 0 L 0 -52 M 0 0 L -40 22" stroke="#1E1824" strokeWidth={8} strokeLinecap="round" />
        <text y={110} textAnchor="middle" fontSize={34} fill="#E9C46A">2 hrs</text>
      </g>
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={330} t={t - 3} text="2 hours?!" />
    </g>
  );
};

// P2S38: "Really? It felt like twenty minutes." — Pip blinks, time-warp gag
export const P2S38: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.3 }) },
    { f: len * 0.4, p: { headTilt: 8, armL: { a: 40, b: -20 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p4l8" veil={0.15} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.4} />
      {/* time-warp swirl */}
      <g transform={`translate(${PIP.x} ${PIP.y - 360})`} opacity={clamp(t / 10)}>
        <path d="M 0 -50 A 50 50 0 1 1 -50 0 A 36 36 0 1 0 0 -36" fill="none" stroke="#8B7BB8" strokeWidth={7} strokeLinecap="round" />
        <path d="M 30 -60 l -10 22 M -50 30 l 22 -10" stroke="#8B7BB8" strokeWidth={6} strokeLinecap="round" />
      </g>
      <Tag x={PIP.x + 80} y={PIP.y - 420} t={t - 4} text="20 min??" />
    </g>
  );
};

// P2S39: she looked at you — Emma turns, eyes narrowing with a grin
export const P2S39: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, headTilt: 0 }) },
    { f: len * 0.5, p: { yaw: 0.55, look: 0.5, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 570], [len, 562]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={540} r={480} o={0.13} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0} />
      {/* her shadow on the wall already giggling */}
      <ShadowFigure x={1350} y={660} s={1.0} flip={-1} mood="laugh" t={t * 1.4} opacity={0.4} />
    </g>
  );
};

// P2S40: "That's because you spent half the time choosing fonts." — reveal: font picker wall
export const P2S40: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4 }) },
    { f: len * 0.4, p: { headTilt: -6 }, ease: easeOut },
  ]);
  const fonts = ['Aa', 'Ag', 'Ar', 'Ae', 'Ac'];
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p4l9" veil={0.15} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'oops']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy']]) })} rimId="rimR" shadow={0.4} />
      {/* the evidence: a wall of font choices on his laptop */}
      <g transform={`translate(${PIP.x + 90} ${PIP.y - 180}) rotate(-4)`} opacity={clamp((t - 4) / 8)}>
        <rect x={-80} y={-60} width={160} height={120} rx={6} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={3} />
        {fonts.map((f, i) => (
          <text key={i} x={-60} y={-30 + i * 22} fontSize={18 + i * 2} fill={i === 2 ? '#C0392B' : '#3A3550'} fontFamily="serif" fontStyle={i % 2 ? 'italic' : 'normal'}>{f}</text>
        ))}
      </g>
      <Tag x={PIP.x + 200} y={PIP.y - 300} t={t - 6} text="fonts > everything" />
    </g>
  );
};

export const p2c4Shots: ShotMap = {
  P2S31, P2S32, P2S33, P2S34, P2S35, P2S36, P2S37, P2S38, P2S39, P2S40,
};
