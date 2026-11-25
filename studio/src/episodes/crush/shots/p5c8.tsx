import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c8 — "I like you too." / "Really?" / "Really." Brief: p5c8_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'g8a' }) => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.3} />
    <circle cx={1560} cy={430} r={140} fill="#F2B06E" opacity={0.55} />
    <Glow x={1560} y={430} r={420} o={0.35} />
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
  </g>
);

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], zoom = 1.4) => (
  <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, zoom], [len, zoom * 1.05]]))}>
    <DuskWalk t={t} id={`g8${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S71: she said nothing — held silence, both frozen
export const P5S71: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 965], [len, 985]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.15], [len, 1.3]]))}>
    <DuskWalk t={t} id="g8b" />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: 2, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.5, look: -0.6, headTilt: -6, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) })} rimId="rimR" shadow={0.4} />
    <Glow x={960} y={500} r={480} o={0.2} />
    <text x={960} y={300} textAnchor="middle" fontSize={52} fill="#E9C46A" opacity={0.5}>…</text>
  </g>
);

// P5S72: then she looked down — Emma's gaze drops, courage gathering
export const P5S72: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeOut(clamp((t - 3) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1020]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <DuskWalk t={t} id="g8c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, headTilt: -4 + drop * 14, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'tired']]) })} rimId="rimR" shadow={0.4} />
      {/* her shadow behind: hands clasped nervously */}
      <ShadowFigure x={1050} y={915} s={0.5} flip={-1} mood="think" t={t} opacity={0.7} />
    </g>
  );
};

// P5S73: her shadow immediately jumped up and started celebrating — THE payoff shot
export const P5S73: React.FC<ShotProps> = ({ t, len }) => {
  const jump = easeOut(clamp((t - 3) / 8));
  const cheer = clamp((t - len * 0.4) / 8);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1070]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <DuskWalk t={t} id="g8d" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s * 0.85, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s * 0.85, { yaw: -0.4, look: -0.4, headTilt: 10, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* HER SHADOW: mid-leap celebration — arms up, legs tucked */}
      <g transform={`translate(${EMP.x + 130} ${EMP.y + 110 - jump * 220 - Math.sin(t * 6) * 14 * cheer}) scale(0.6 -0.6)`} opacity={clamp((t - 2) / 6)}>
        <path d="M -30 -160 Q 0 -172 30 -160 L 32 -70 Q 0 -58 -32 -70 Z" fill="#100C1C" />
        <circle cx={0} cy={-196} r={25} fill="#100C1C" />
        {/* legs tucked up */}
        <path d="M -20 -70 L -38 -110 M 20 -70 L 40 -108" stroke="#100C1C" strokeWidth={11} strokeLinecap="round" />
        {/* arms thrown up in V */}
        <path d="M -22 -150 L -52 -215 M 22 -150 L 54 -212" stroke="#100C1C" strokeWidth={11} strokeLinecap="round" />
      </g>
      <Glow x={EMP.x + 130} y={EMP.y - 60} r={260} o={0.25 * cheer} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${EMP.x + 200 + i * 26} ${EMP.y - 330 - i * 18} l 12 -14`} stroke="#E86A92" strokeWidth={5} strokeLinecap="round" opacity={0.7 * cheer} />
      ))}
      <Tag x={960} y={280} t={t - 6} text="her shadow already knew" />
    </g>
  );
};

// P5S74: Emma slowly looked back at you — she lifts her head
export const P5S74: React.FC<ShotProps> = ({ t, len }) => {
  const lift = easeOut(clamp((t - 3) / 12));
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 590], [len, 585]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
      <DuskWalk t={t} id="g8e" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, headTilt: 12 * (1 - lift), ...faceAt(t, [[0, 'worried'], [len * 0.4, 'tired'], [len * 0.8, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Glow x={EMP.x} y={EMP.y - 190} r={220} o={0.18 * lift} />
    </g>
  );
};

// P5S75: "I like you too." — THE answer, close on Emma
export const P5S75: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1040], [len, 1060]]), kf(t, [[0, 600], [len, 595]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <Glow x={960} y={540} r={520} o={0.25} />
    <K.Hero look={EMMA} pose={idle(960, 780, 1.45, { yaw: 0.2, look: -0.4, headTilt: -4, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'happy']]) })} rimId="rimR" shadow={0} />
    <Tag x={960} y={300} t={t - 4} text="i like you too." />
  </g>
);

// P5S76: you blinked — Pip's double-take, eyes squeeze
export const P5S76: React.FC<ShotProps> = ({ t, len }) => {
  const blinkK = Math.sin(clamp(t / 10) * Math.PI);
  const fa = faceAt(t, [[0, 'shock'], [len * 0.6, 'happy']]);
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1050]]), kf(t, [[0, 610], [len, 605]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={480} o={0.2} />
      <K.Hero look={YOU} pose={idle(960, 790, 1.5, { yaw: -0.2, look: -0.5, headTilt: 0, expr: fa.expr, blink: Math.max(fa.blink, blinkK * 0.85) })} rimId="rimR" shadow={0} />
      {/* "!" above his head */}
      <text x={1150} y={420} fontSize={90} fill="#E86A92" opacity={blinkK} transform={`rotate(${8 - blinkK * 8} 1150 420)`}>!</text>
    </g>
  );
};

// P5S77: "Really?" — Pip, barely a whisper
export const P5S77: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 8, armL: { a: 30, b: -14 } },
    { headTilt: -2 },
    [[0, 'shock'], [len * 0.5, 'happy']], [[0, 'happy']], 1.6);

// P5S78: she nodded — firm little nod
export const P5S78: React.FC<ShotProps> = ({ t, len }) => {
  const nod = Math.sin(clamp((t - 2) / 10) * Math.PI * 2) * 5;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 590], [len, 585]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
      <DuskWalk t={t} id="g8i" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, headTilt: nod, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P5S79: "Really." — Emma, certain
export const P5S79: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -3 },
    { headTilt: -3 },
    [[0, 'happy']], [[0, 'happy']], 1.5);

// P5S80: you smiled — the smile that breaks the dam
export const P5S80: React.FC<ShotProps> = ({ t, len }) => {
  const beam = easeOut(clamp((t - 3) / 10));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1005]]), kf(t, [[0, 565], [len, 555]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
      <DuskWalk t={t} id="g8j" />
      <Glow x={960} y={480} r={500 + beam * 160} o={0.25 + beam * 0.15} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, headTilt: -6, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: -4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <ShadowFigure x={1050} y={915} s={0.5} flip={-1} mood="heart" t={t} opacity={0.8 * beam} />
    </g>
  );
};

export const p5c8Shots: ShotMap = {
  P5S71, P5S72, P5S73, P5S74, P5S75, P5S76, P5S77, P5S78, P5S79, P5S80,
};
