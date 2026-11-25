import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c2 — "I'm fine" but her shadow sits sad on the floor; Pip offers a
// break; two empty chairs by the window; silence. Brief: p5c2_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'g2a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

const EMP = { x: 1150, y: 800, s: 0.95 };
const PIP = { x: 880, y: 855, s: 0.95 };

// P5S11: "Oh. Yeah. I'm fine." — Emma's too-quick reply
export const P5S11: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.55, headTilt: 4 }) },
    { f: len * 0.4, p: { headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.45], [len, 1.52]]))}>
      <Fest t={t} id="g2b" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.8, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={320} t={t - 4} text="oh. yeah. i'm fine." />
    </g>
  );
};

// P5S12: her shadow was sitting on the floor, head lowered — THE reveal
export const P5S12: React.FC<ShotProps> = ({ t, len }) => {
  const slump = Math.sin(clamp(t / 30) * Math.PI * 0.5) * 14;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), kf(t, [[0, 610], [len, 595]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Fest t={t} id="g2c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6 })} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.55, headTilt: 5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      {/* HER SHADOW: slumped sitting figure, head down — bigger than her real one */}
      <g transform={`translate(980 ${930 + slump}) scale(0.85 -0.85)`} opacity={easeOut(clamp((t - 2) / 10))}>
        {/* seated body */}
        <path d="M -40 -140 Q 0 -155 40 -140 L 45 -30 Q 0 -18 -45 -30 Z" fill="#100C1C" />
        <circle cx={0} cy={-168} r={26} fill="#100C1C" />
        {/* head bowed: face shadow dips */}
        <ellipse cx={0} cy={-150} rx={20} ry={12} fill="#1E1730" />
        {/* legs stretched out front */}
        <path d="M -30 -30 L -80 -8 M 30 -30 L 85 -12" stroke="#100C1C" strokeWidth={13} strokeLinecap="round" />
        {/* arms limp at sides */}
        <path d="M -32 -120 Q -45 -70 -35 -40 M 32 -120 Q 45 -70 35 -40" stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
      </g>
      <Glow x={980} y={760} r={280} o={0.15} />
      <Tag x={960} y={300} t={t - 5} text="her shadow was… sad" />
    </g>
  );
};

// P5S13: it looked sad — closer on the slumped shadow, slow zoom
export const P5S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 985], [len, 1005]]), kf(t, [[0, 640], [len, 630]]), kf(t, [[0, 2.2], [len, 2.45]]))}>
    <Fest t={t} id="g2d" />
    <g transform={`translate(980 ${935}) scale(1.15 -1.15)`} opacity={0.95}>
      <path d="M -40 -140 Q 0 -155 40 -140 L 45 -30 Q 0 -18 -45 -30 Z" fill="#100C1C" />
      <circle cx={0} cy={-168} r={26} fill="#100C1C" />
      <ellipse cx={0} cy={-150} rx={20} ry={12} fill="#1E1730" />
      <path d="M -30 -30 L -80 -8 M 30 -30 L 85 -12" stroke="#100C1C" strokeWidth={13} strokeLinecap="round" />
      <path d="M -32 -120 Q -45 -70 -35 -40 M 32 -120 Q 45 -70 35 -40" stroke="#100C1C" strokeWidth={11} fill="none" strokeLinecap="round" />
    </g>
    {/* single tear drop from the shadow's face */}
    <path d={`M 975 ${760 + Math.sin(clamp(t / len) * Math.PI) * 40} q 8 14 0 22 q -8 -8 0 -22`} fill="#8FD3FF" opacity={0.7} />
    <Glow x={980} y={780} r={240} o={0.18} />
  </g>
);

// P5S14: you could tell she wasn't okay — Pip watching, worried, from behind-ish
export const P5S14: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: 6 }) },
    { f: len * 0.5, p: { armL: { a: 30, b: -14 }, headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Fest t={t} id="g2e" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.55, headTilt: 5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      {/* her shadow still slumped, smaller at her feet */}
      <ShadowFigure x={1050} y={920} s={0.42} mood="cry" t={t} opacity={0.6} />
      {/* eyeline Pip→Emma */}
      <path d={`M ${PIP.x + 70} ${PIP.y - 290} L ${EMP.x - 90} ${EMP.y - 270}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.4} />
    </g>
  );
};

// P5S15: "Want to take a break?" — Pip offers, gentle
export const P5S15: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, armL: { a: 30, b: -14 } }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -24 }, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.4], [len, 1.48]]))}>
      <Fest t={t} id="g2f" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.55, headTilt: 5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <Tag x={960} y={320} t={t - 4} text="want to take a break?" />
    </g>
  );
};

// P5S16: Emma hesitated — she looks away, fingers the strap
export const P5S16: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.55, headTilt: 5 }) },
    { f: len * 0.5, p: { yaw: -0.7, look: -0.7, headTilt: 8 }, ease: easeOut },
  ]);
  const wiggle = Math.sin(t * 2.5) * 4 * clamp((t - 5) / 8) * clamp((len - t) / 8);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.45], [len, 1.52]]))}>
      <Fest t={t} id="g2g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, sway: wiggle, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.35} />
      <ShadowFigure x={1050} y={920} s={0.4} mood="think" t={t} opacity={0.6} />
    </g>
  );
};

// P5S17: then she nodded — small nod, relief
export const P5S17: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.5, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: 10 }, ease: easeOut },
    { f: len * 0.7, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.45], [len, 1.52]]))}>
      <Fest t={t} id="g2h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.6, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.8, 'happy']]) }} rimId="rimR" shadow={0.35} />
    </g>
  );
};

// P5S18: two empty chairs near the window — quiet corner, window light
export const P5S18: React.FC<ShotProps> = ({ t, len }) => {
  const chair = (x: number, y: number, s: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-55} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={41} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-130} width={110} height={44} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
      <rect x={-55} y={-92} width={110} height={10} fill="#8A6E52" />
    </g>
  );
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Fest t={t} id="g2i" />
      {/* window glow upper right */}
      <rect x={1350} y={120} width={420} height={480} rx={14} fill="#2A2340" stroke="#0D0A14" strokeWidth={5} />
      <rect x={1370} y={140} width={380} height={440} rx={10} fill="#E9C46A" opacity={0.16} />
      <Glow x={1560} y={360} r={380} o={0.2} />
      {chair(1150, 800, 0.9)}
      {chair(1330, 790, 0.85)}
      <ShadowFigure x={1240} y={920} s={0.45} mood="idle" t={t} opacity={0.35} />
    </g>
  );
};

// P5S19: neither of you spoke — the two seated, long silence, dust motes
export const P5S19: React.FC<ShotProps> = ({ t, len }) => {
  const pip = idle(1120, 780, 0.8, { yaw: 0.5, look: 0.6, headTilt: 4, ...faceAt(t, [[0, 'neutral'], [len * 0.8, 'worried']]) });
  const emp = idle(1310, 770, 0.8, { yaw: -0.5, look: -0.6, headTilt: 6, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'tired']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 995]]), kf(t, [[0, 575], [len, 570]]), kf(t, [[0, 1.3], [len, 1.38]]))}>
      <Fest t={t} id="g2j" />
      <rect x={1350} y={120} width={420} height={480} rx={14} fill="#2A2340" stroke="#0D0A14" strokeWidth={5} />
      <rect x={1370} y={140} width={380} height={440} rx={10} fill="#E9C46A" opacity={0.14} />
      {(() => {
        const chair = (x: number, y: number, s: number) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x={-55} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
            <rect x={41} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
            <rect x={-55} y={-130} width={110} height={44} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
            <rect x={-55} y={-92} width={110} height={10} fill="#8A6E52" />
          </g>
        );
        return <>{chair(1150, 800, 0.9)}{chair(1330, 790, 0.85)}</>;
      })()}
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.35} />
      {/* floating silence: "…" */}
      <text x={1215} y={420} textAnchor="middle" fontSize={64} fill="#E9C46A" opacity={0.5 + Math.sin(t * 0.5) * 0.2}>…</text>
    </g>
  );
};

// P5S20: then she finally said — Emma turns, gathers courage
export const P5S20: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(1310, 770, 0.8, { yaw: -0.5, look: -0.6, headTilt: 6 }) },
    { f: len * 0.4, p: { yaw: -0.15, look: -0.2, headTilt: 0, armL: { a: 35, b: -14 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1005]]), kf(t, [[0, 575], [len, 580]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Fest t={t} id="g2k" />
      <rect x={1350} y={120} width={420} height={480} rx={14} fill="#2A2340" stroke="#0D0A14" strokeWidth={5} />
      <rect x={1370} y={140} width={380} height={440} rx={10} fill="#E9C46A" opacity={0.14} />
      {(() => {
        const chair = (x: number, y: number, s: number) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x={-55} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
            <rect x={41} y={-90} width={14} height={90} fill="#5A4632" stroke="#0D0A14" strokeWidth={3} />
            <rect x={-55} y={-130} width={110} height={44} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
            <rect x={-55} y={-92} width={110} height={10} fill="#8A6E52" />
          </g>
        );
        return <>{chair(1150, 800, 0.9)}{chair(1330, 790, 0.85)}</>;
      })()}
      <K.Hero look={YOU} pose={idle(1120, 780, 0.8, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.35} />
      <Glow x={1215} y={600} r={260} o={0.14} />
    </g>
  );
};

export const p5c2Shots: ShotMap = {
  P5S11, P5S12, P5S13, P5S14, P5S15, P5S16, P5S17, P5S18, P5S19, P5S20,
};
