import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c1 — the moment she needed you: festival crowded, Emma alone by her
// phone, Pip walks over. Brief: p5c1_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, easeOut, poseAt, faceAt, YOU, EMMA, FRIEND } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'g1a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

// P5S1: title — "The moment she needed you"
export const P5S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1)}>
    <Fest t={t} id="g1t" />
    <Glow x={960} y={430} r={420} o={0.3} />
    <Tag x={960} y={300} t={t} text="the moment she needed you" />
    {/* Pip + Emma silhouettes facing each other */}
    <K.Hero look={YOU} pose={idle(800, 780, 0.9, { yaw: 0.5, look: 0.6 })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(1120, 780, 0.9, { yaw: -0.5, look: -0.6 })} rimId="rimR" shadow={0.4} />
    <ShadowFigure x={960} y={930} s={0.6} mood="heart" t={t} opacity={0.7} />
  </g>
);

// P5S2: festival becomes crowded — wide, many figures
export const P5S2: React.FC<ShotProps> = ({ t, len }) => {
  const crowd = [0.5, 0.62, 0.7, 0.58, 0.66].map((o, i) => (
    <ShadowFigure key={i} x={300 + i * 330} y={880} s={o * 0.9} flip={i % 2 ? 1 : -1} mood="idle" t={t + i * 7} opacity={0.75} />
  ));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
      <Fest t={t} id="g1b" />
      {crowd}
      <Tag x={960} y={260} t={t - 2} text="the festival got crowded" />
    </g>
  );
};

// P5S3: Emma collecting tickets at the entrance — booth close-up
export const P5S3: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(960, 800, 1.0, { yaw: -0.3, look: -0.5, armR: { a: 45, b: -20 } }) },
    { f: len * 0.6, p: { armR: { a: 30, b: -12 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 590], [len, 578]]), kf(t, [[0, 1.3], [len, 1.42]]))}>
      <Fest t={t} id="g1c" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'tired']]) }} rimId="rimR" shadow={0.45} />
      {/* ticket roll + queue */}
      <g transform="translate(760 660)">
        <rect x={-40} y={-14} width={80} height={28} rx={4} fill="#E9C46A" stroke="#0D0A14" strokeWidth={3} />
        {[0, 1, 2].map((i) => <line key={i} x1={-20 + i * 20} y1={-14} x2={-20 + i * 20} y2={14} stroke="#0D0A14" strokeWidth={2} />)}
      </g>
      <ShadowFigure x={1160} y={880} s={0.62} flip={-1} mood="idle" t={t} opacity={0.7} />
      <ShadowFigure x={1240} y={890} s={0.58} flip={-1} mood="idle" t={t + 5} opacity={0.6} />
    </g>
  );
};

// P5S4: you were helping at the game booth — Pip tossing balls
export const P5S4: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(820, 830, 1.0, { yaw: 0.5, look: 0.6, armR: { a: 60, b: -30 } }) },
    { f: len * 0.4, p: { armR: { a: 100, b: -40 } }, ease: easeOut },
    { f: len * 0.7, p: { armR: { a: 50, b: -20 } } },
  ]);
  const ballY = 640 - Math.abs(Math.sin((t / len) * Math.PI * 3)) * 180;
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Fest t={t} id="g1d" />
      <g transform="translate(700 720)">
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#B4543F" stroke="#0D0A14" strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontSize={26} fill="#F4EEE0">throw!</text>
      </g>
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <circle cx={PIP_BALL_X(t)} cy={ballY} r={14} fill="#E9C46A" stroke="#0D0A14" strokeWidth={3} />
    </g>
  );
};
const PIP_BALL_X = (t: number) => 900 + Math.sin(t * 0.7) * 60;

// P5S5: you noticed her alone near the side — wide, Emma isolated at frame edge
export const P5S5: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(1520, 780, 0.85, { yaw: 0.6, look: 0.4, headTilt: 12 }) },
    { f: len * 0.5, p: { headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 555], [len, 540]]), kf(t, [[0, 1.15], [len, 1.3]]))}>
      <Fest t={t} id="g1e" />
      {/* crowd masses left, Emma alone right — negative space */}
      <ShadowFigure x={500} y={870} s={0.7} mood="idle" t={t} opacity={0.6} />
      <ShadowFigure x={680} y={880} s={0.62} flip={-1} mood="idle" t={t + 4} opacity={0.55} />
      <ShadowFigure x={840} y={890} s={0.58} mood="idle" t={t + 8} opacity={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <Glow x={1520} y={600} r={200} o={0.1} />
      {/* phone glow in her hand */}
      <rect x={1580} y={640} width={30} height={48} rx={5} fill="#8FD3FF" opacity={0.85} transform={`rotate(${8 + Math.sin(t) * 3} 1595 664)`} />
    </g>
  );
};

// P5S6: she was looking down at her phone — close on Emma + phone
export const P5S6: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(960, 800, 1.15, { yaw: 0.3, look: 0.3, headTilt: 16, armR: { a: 40, b: -30 } }) },
  ]);
  const flicker = 0.75 + Math.sin(t * 3) * 0.15 + Math.sin(t * 7.3) * 0.1;
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 985]]), kf(t, [[0, 590], [len, 585]]), kf(t, [[0, 1.55], [len, 1.65]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={480} o={0.14} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      {/* phone screen glowing, face lit from below */}
      <rect x={1040} y={660} width={90} height={140} rx={12} fill="#8FD3FF" opacity={flicker * 0.5} transform="rotate(-8 1085 730)" />
      <rect x={1050} y={670} width={70} height={120} rx={8} fill="#0E1B2E" stroke="#8FD3FF" strokeWidth={3} transform="rotate(-8 1085 730)" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={1062} y={700 + i * 24} width={46 - i * 8} height={10} rx={5} fill="#8FD3FF" opacity={0.6} transform="rotate(-8 1085 730)" />
      ))}
    </g>
  );
};

// P5S7: something seemed wrong — slow push on her hunched silhouette
export const P5S7: React.FC<ShotProps> = ({ t, len }) => {
  const emp = idle(960, 820, 1.0, { yaw: 0.3, look: 0.3, headTilt: 18, ...faceAt(t, [[0, 'tired'], [len * 0.7, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Fest t={t} id="g1f" />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      <ShadowFigure x={1180} y={890} s={0.5} flip={-1} mood="think" t={t} opacity={0.55} />
      <Glow x={960} y={600} r={240} o={0.12} />
    </g>
  );
};

// P5S8: you walked over — Pip crosses frame left→right toward Emma
export const P5S8: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / (len * 0.7)));
  const px = kf(t, [[0, 420], [len * 0.7, 900], [len, 960]]);
  const pip = poseAt(t, [
    { f: 0, p: idle(px, 860, 0.95, { yaw: 0.5, look: 0.6, legL: { a: -18, b: 20 }, legR: { a: 18, b: -20 } }) },
    { f: len * 0.7, p: { yaw: 0.35, look: 0.4, legL: { a: 0, b: 0 }, legR: { a: 0, b: 0 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 985]]), kf(t, [[0, 575], [len, 578]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Fest t={t} id="g1g" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(1180, 800, 0.9, { yaw: -0.5, look: -0.6, headTilt: 14, ...faceAt(t, [[0, 'tired']]) })} rimId="rimR" shadow={0.4} />
      {/* walk dust puffs */}
      {[0, 1, 2].map((i) => {
        const pk = clamp((t - i * 8) / 20);
        return pk > 0 && pk < 1 ? <circle key={i} cx={px - 60 - pk * 80} cy={890 - pk * 20} r={10 + pk * 22} fill="#8B7BB8" opacity={(1 - pk) * 0.25} /> : null;
      })}
      <Tag x={960} y={320} t={t - 2} text="you walked over" />
    </g>
  );
};

// P5S9: "Hey. Everything okay?" — Pip arrives, concerned
export const P5S9: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(960, 860, 0.95, { yaw: -0.4, look: -0.5 }) },
    { f: len * 0.4, p: { armL: { a: 35, b: -16 } }, ease: easeOut },
  ]);
  const emp = poseAt(t, [
    { f: 0, p: idle(1180, 800, 0.9, { yaw: -0.5, look: -0.6, headTilt: 14 }) },
    { f: len * 0.6, p: { headTilt: 4, yaw: -0.2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 990]]), kf(t, [[0, 575], [len, 578]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="g1h" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={320} t={t - 3} text="hey. everything okay?" />
    </g>
  );
};

// P5S10: she looked up — Emma raises her head, phone lowers
export const P5S10: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(1150, 800, 0.95, { yaw: -0.4, look: -0.6, headTilt: 15, armR: { a: 40, b: -30 } }) },
    { f: len * 0.5, p: { headTilt: 0, armR: { a: 15, b: -8 } }, ease: easeOut },
  ]);
  const flicker = 0.6 + Math.sin(t * 4) * 0.2;
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 1000]]), kf(t, [[0, 585], [len, 590]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Fest t={t} id="g1i" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'tired'], [len * 0.5, 'worried'], [len * 0.8, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(900, 860, 0.95, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.45} />
      {/* phone lowers out of frame */}
      <g opacity={1 - clamp((t - len * 0.3) / (len * 0.3)) * 0.7}>
        <rect x={1180} y={620} width={80} height={120} rx={10} fill="#8FD3FF" opacity={flicker * 0.4} transform="rotate(-10 1220 680)" />
      </g>
    </g>
  );
};

export const p5c1Shots: ShotMap = {
  P5S1, P5S2, P5S3, P5S4, P5S5, P5S6, P5S7, P5S8, P5S9, P5S10,
};
