import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c7 — THE confession: "Emma?" … "I've started liking you." Brief: p5c7_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'g7a' }) => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.26} />
    <circle cx={1560} cy={430} r={130} fill="#F2B06E" opacity={0.5} />
    <Glow x={1560} y={430} r={380} o={0.3} />
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
  </g>
);

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'worried']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'neutral']], zoom = 1.4) => (
  <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, zoom], [len, zoom * 1.05]]))}>
    <DuskWalk t={t} id={`g7${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S61: "Emma?" — Pip calls her name softly
export const P5S61: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len, { headTilt: 4 }, {}, [[0, 'worried']], [[0, 'neutral']], 1.5);

// P5S62: "Yeah?" — Emma turns, attentive
export const P5S62: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len, {}, { yaw: -0.3, look: -0.4, headTilt: -2 }, [[0, 'worried']], [[0, 'neutral']], 1.5);

// P5S63: "Can I tell you something?" — Pip gathers nerve
export const P5S63: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armL: { a: 30, b: -14 }, headTilt: 6 },
    { headTilt: 4 },
    [[0, 'worried'], [len * 0.7, 'neutral']], [[0, 'neutral']], 1.5);

// P5S64: she turned toward you — Emma fully faces him
export const P5S64: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp(t / (len * 0.6)));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <DuskWalk t={t} id="g7d" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45 + (1 - turn) * -0.3, look: -0.55 + (1 - turn) * 0.2, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P5S65: "Of course." — Emma soft, gives him the floor
export const P5S65: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 8 },
    { headTilt: -3 },
    [[0, 'worried']], [[0, 'neutral'], [len * 0.6, 'happy']], 1.5);

// P5S66: you took a breath — close on Pip, chest rise
export const P5S66: React.FC<ShotProps> = ({ t, len }) => {
  const breath = Math.sin(clamp(t / (len * 0.5)) * Math.PI) * 8;
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1050]]), kf(t, [[0, 610], [len, 600]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={500} o={0.18} />
      <K.Hero look={YOU} pose={idle(960, 790, 1.5, { yaw: 0.3, look: 0.5, squash: breath * 0.4, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0} />
      {/* breath puffs */}
      {[0, 1].map((i) => {
        const bk = clamp((t - i * 12) / 30);
        return bk > 0 && bk < 1 ? (
          <ellipse key={i} cx={1120 + bk * 60} cy={560 - bk * 30} rx={16 + bk * 30} ry={10 + bk * 16} fill="#E9C46A" opacity={(1 - bk) * 0.2} />
        ) : null;
      })}
    </g>
  );
};

// P5S67: "I think I've started liking you." — THE line, Pip steady
export const P5S67: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 985], [len, 1000]]), kf(t, [[0, 578], [len, 575]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
    <DuskWalk t={t} id="g7f" />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: -2, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'neutral'], [len * 0.8, 'happy']]) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: 0, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
    <Glow x={960} y={560} r={420} o={0.2} />
    <Tag x={960} y={290} t={t - 4} text="i think i've started liking you" />
  </g>
);

// P5S68: Emma stopped walking — she freezes mid-step
export const P5S68: React.FC<ShotProps> = ({ t, len }) => {
  const freeze = easeOut(clamp(t / 8));
  const legA = -16 * (1 - freeze);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1000]]), kf(t, [[0, 578], [len, 575]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <DuskWalk t={t} id="g7g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.5, look: -0.6, headTilt: -6, legL: { a: legA, b: -legA * 1.2 }, legR: { a: 16 * (1 - freeze), b: -16 * (1 - freeze) }, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'shock'], [len * 0.8, 'worried']]) })} rimId="rimR" shadow={0.4} />
      {/* freeze: motion lines cut off */}
      <path d={`M ${EMP.x - 60} ${EMP.y - 200} l -30 10 M ${EMP.x - 60} ${EMP.y - 160} l -34 4`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.6 * freeze} />
      <Glow x={EMP.x} y={EMP.y - 180} r={260} o={0.22 * freeze} />
    </g>
  );
};

// P5S69: you continued before you lost your courage — Pip presses on, fast
export const P5S69: React.FC<ShotProps> = ({ t, len }) => {
  const rush = Math.sin(clamp(t / (len * 0.5)) * Math.PI);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1005]]), kf(t, [[0, 578], [len, 578]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <DuskWalk t={t} id="g7h" />
      <K.Hero look={YOU} pose={idle(PIP.x + rush * 30, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, armR: { a: 40, b: -18 }, headTilt: -3, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.85, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.5, look: -0.6, headTilt: -8, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0.4} />
      {/* speed lines behind Pip */}
      <path d={`M ${PIP.x - 140} ${PIP.y - 260} l -40 6 M ${PIP.x - 150} ${PIP.y - 220} l -46 2 M ${PIP.x - 140} ${PIP.y - 180} l -40 -4`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.6 * rush} />
    </g>
  );
};

// P5S70: "Actually, I've liked you for a while…" — the full confession, wide emotional two-shot
export const P5S70: React.FC<ShotProps> = ({ t, len }) => {
  const settle = easeOut(clamp((t - 6) / 14));
  return (
    <g transform={camT(kf(t, [[0, 965], [len, 985]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
      <DuskWalk t={t} id="g7i" />
      <Glow x={960} y={480} r={500} o={0.22 * settle} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: -3, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'neutral'], [len * 0.8, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.5, look: -0.6, headTilt: -8, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'worried'], [len * 0.8, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      {/* her shadow can't hold it in — little bounce of excitement */}
      <ShadowFigure x={1050} y={915} s={0.5} flip={-1} mood="cheer" t={t} opacity={0.7 * settle} />
      <Tag x={960} y={270} t={t - 6} text="liked you for a while" />
    </g>
  );
};

export const p5c7Shots: ShotMap = {
  P5S61, P5S62, P5S63, P5S64, P5S65, P5S66, P5S67, P5S68, P5S69, P5S70,
};
