import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c4 — "You'll help?" / classroom ticket prep montage / "thank you" /
// her shadow makes a heart / genuinely happy again. Brief: p5c4_brief.md

const { Classroom, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1150, y: 815, s: 0.9 };
const PIP = { x: 680, y: 830, s: 0.95 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'g4a' }) => <Classroom t={t + 950} id={id} />;

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'worried']]) => (
  <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 580], [len, 574]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <Cls t={t} id={`g4${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S31: "You'll help?" — Emma's hopeful disbelief
export const P5S31: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    {},
    { headTilt: -4, armL: { a: 35, b: -16 } },
    [[0, 'happy']], [[0, 'shock'], [len * 0.6, 'worried']]);

// P5S32: "Of course." — Pip, easy
export const P5S32: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armR: { a: 30, b: -14 }, headTilt: -3 },
    {},
    [[0, 'happy']], [[0, 'worried'], [len * 0.6, 'neutral']]);

// P5S33: both back at the classroom preparing tickets — montage desk shot
export const P5S33: React.FC<ShotProps> = ({ t, len }) => {
  const stamp = Math.sin(clamp(t / len) * Math.PI * 4) > 0 ? -8 : 0;
  const tickets = [0, 1, 2, 3].map((i) => (
    <g key={i} transform={`translate(${780 + i * 90} ${640 + (i % 2) * 26}) rotate(${(i % 2 ? -4 : 4)})`}>
      <rect x={-38} y={-24} width={76} height={48} rx={4} fill="#E9C46A" stroke="#0D0A14" strokeWidth={3} />
      <line x1={-20} y1={0} x2={20} y2={0} stroke="#0D0A14" strokeWidth={2} />
    </g>
  ));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.2], [len, 1.32]]))}>
      <Cls t={t} id="g4c" />
      {/* desk surface */}
      <rect x={600} y={700} width={760} height={40} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={4} />
      {tickets}
      {/* stamp tool bouncing */}
      <g transform={`translate(${980} ${640 + stamp})`}>
        <rect x={-16} y={-50} width={32} height={50} rx={6} fill="#4A3A5E" stroke="#0D0A14" strokeWidth={3} />
        <rect x={-22} y={-62} width={44} height={16} rx={6} fill="#8B7BB8" stroke="#0D0A14" strokeWidth={3} />
      </g>
      <K.Hero look={YOU} pose={idle(820, 860, 0.8, { yaw: 0.5, look: 0.55, armR: { a: 70, b: -35 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(1150, 850, 0.8, { yaw: -0.45, look: -0.55, armL: { a: 70, b: -35 }, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <Glow x={960} y={620} r={360} o={0.16} />
      <Tag x={960} y={300} t={t - 2} text="fifteen minutes flat" />
    </g>
  );
};

// P5S34: under fifteen minutes — sped-up clock gag
export const P5S34: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1.1)}>
    <Cls t={t} id="g4d" />
    {/* wall clock spinning */}
    <g transform="translate(960 300)">
      <circle r={70} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={5} />
      <line x1={0} y1={0} x2={0} y2={-48} stroke="#0D0A14" strokeWidth={6} strokeLinecap="round" transform={`rotate(${t * 36})`} />
      <line x1={0} y1={0} x2={34} y2={0} stroke="#B4543F" strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 360})`} />
      <circle r={6} fill="#0D0A14" />
    </g>
    <text x={960} y={430} textAnchor="middle" fontSize={44} fill="#E9C46A" opacity={0.8}>…15 min?</text>
    <K.Hero look={YOU} pose={idle(780, 850, 0.85, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    <K.Hero look={EMMA} pose={idle(1140, 850, 0.85, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
  </g>
);

// P5S35: back at festival, Emma relieved — corner set again, soft light
const FestCorner: React.FC<{ t: number; id?: string }> = ({ t, id = 'g4e' }) => (
  <g>
    <K.Street t={t} id={id} />
    <K.Booth t={t} sign="LUCKY DRAW" />
  </g>
);

// P5S35
export const P5S35: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 995]]), kf(t, [[0, 580], [len, 585]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <FestCorner t={t} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: 6, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.8, 'happy']]) })} rimId="rimR" shadow={0.4} />
    <Glow x={EMP.x} y={EMP.y - 180} r={240} o={0.15} />
  </g>
);

// P5S36: "Thank you." — Emma, sincere
export const P5S36: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 995]]), kf(t, [[0, 580], [len, 585]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <FestCorner t={t} id="g4f" />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: -4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
    <Tag x={960} y={320} t={t - 4} text="thank you." />
  </g>
);

// P5S37: "No problem." — Pip shrugs it off
export const P5S37: React.FC<ShotProps> = ({ t, len }) => {
  const shrug = Math.sin(clamp((t - 2) / 8) * Math.PI);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 995]]), kf(t, [[0, 580], [len, 585]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <FestCorner t={t} id="g4g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, sway: shrug * 6, armL: { a: 25 + shrug * 18, b: -14 }, armR: { a: 25 + shrug * 16, b: -13 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P5S38: her shadow suddenly jumped up, heart with both hands — the payoff
export const P5S38: React.FC<ShotProps> = ({ t, len }) => {
  const jump = easeOut(clamp((t - 2) / 8));
  const heartK = easeOut(clamp((t - len * 0.35) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1050]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <FestCorner t={t} id="g4h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* her shadow leaps and throws heart hands — none of them notice */}
      <g transform={`translate(${EMP.x + 140} ${EMP.y + 120 - jump * 190}) scale(0.55 -0.55)`} opacity={clamp((t - 2) / 6)}>
        <path d="M -30 -160 Q 0 -175 30 -160 L 34 -60 Q 0 -48 -34 -60 Z" fill="#100C1C" />
        <circle cx={0} cy={-192} r={24} fill="#100C1C" />
        <path d="M -22 -150 L -34 -60 M 22 -150 L 36 -60" stroke="#100C1C" strokeWidth={11} strokeLinecap="round" />
        {/* heart hands: two arcs meeting */}
        <path d={`M -40 -160 Q -52 -196 -30 -206 Q -14 -214 -8 -196 M 40 -160 Q 52 -196 30 -206 Q 14 -214 8 -196`} stroke="#E86A92" strokeWidth={7} fill="none" opacity={heartK} strokeLinecap="round" />
      </g>
      <Glow x={EMP.x + 140} y={EMP.y - 60} r={220} o={0.18 * heartK} />
      <Tag x={EMP.x + 200} y={300} t={t - 6} text="her shadow approves" />
    </g>
  );
};

// P5S39: you smiled — Pip's warm beat
export const P5S39: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 995]]), kf(t, [[0, 580], [len, 585]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <FestCorner t={t} id="g4i" />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: -4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S40: Emma genuinely happy again — warm two-shot, both glowing
export const P5S40: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t * 0.8) * 4;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.3], [len, 1.42]]))}>
      <FestCorner t={t} id="g4j" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y - bob, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y - bob * 0.8, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Glow x={960} y={500} r={520} o={0.2} />
      <Glow x={PIP.x} y={PIP.y - 200} r={160} o={0.12} />
      <Glow x={EMP.x} y={EMP.y - 190} r={160} o={0.12} />
    </g>
  );
};

export const p5c4Shots: ShotMap = {
  P5S31, P5S32, P5S33, P5S34, P5S35, P5S36, P5S37, P5S38, P5S39, P5S40,
};
