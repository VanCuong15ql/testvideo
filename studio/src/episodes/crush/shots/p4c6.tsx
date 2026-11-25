import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c6 — the misunderstanding deepens: you look away, know you shouldn't be jealous,
// then see her shadow isn't celebrating — it's disappointed, and it points: come closer.
// Brief: out/crush/scenes/p4c6_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, YOU, EMMA, DANIEL } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f6a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

const EMP = { x: 1250, y: 815, s: 0.88 };
const DAN = { x: 1420, y: 800, s: 0.85 };
const PIP = { x: 560, y: 850, s: 0.95 };
const SH = { x: 1050, y: 920 };

// P4S51: she smiled and thanked him — Emma + Daniel, drink in hand
export const P4S51: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45 }) },
    { f: len * 0.4, p: { headTilt: -5 }, ease: easeOut },
  ]);
  const dan = idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f6b" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.8, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={dan} rimId="rimR" shadow={0.4} />
      {/* drink in her hand */}
      <g transform={`translate(${EMP.x - 60} ${EMP.y - 160})`}>
        <rect x={-14} y={-20} width={28} height={40} rx={5} fill="#E9C46A" stroke="#0D0A14" strokeWidth={3} />
        <rect x={-10} y={-30} width={20} height={10} rx={3} fill="#E86A92" />
      </g>
    </g>
  );
};

// P4S52: you looked away — Pip turns to the booth, jaw tight
export const P4S52: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.7, look: 0.8 } },
    { f: len * 0.5, p: { yaw: 0.2, look: 0.2 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Fest t={t} id="f6c" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P4S53: you knew you had no reason — self-aware beat: thought bubble "it's fine"
export const P4S53: React.FC<ShotProps> = ({ t, len }) => {
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, headTilt: 4, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) });
  const bubO = clamp(t / 10) * clamp((len - t) / 8);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 978]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Fest t={t} id="f6d" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      {/* thought bubble: a little "it's fine" bubble */}
      <g opacity={bubO}>
        <ellipse cx={PIP.x + 60} cy={PIP.y - 420} rx={120} ry={60} fill="#F4EEE0" opacity={0.92} />
        <circle cx={PIP.x - 10} cy={PIP.y - 330} r={20} fill="#F4EEE0" opacity={0.8} />
        <circle cx={PIP.x - 40} cy={PIP.y - 290} r={10} fill="#F4EEE0" opacity={0.6} />
        <text x={PIP.x + 60} y={PIP.y - 405} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fill="#3A3550" fontStyle="italic">it's fine</text>
      </g>
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
    </g>
  );
};

// P4S54: but somehow it still bothered you — chest tighten, jaw
export const P4S54: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: 8, squash: 0.06 }, ease: easeOut },
    { f: len * 0.8, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Fest t={t} id="f6e" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) }} rimId="rimR" shadow={0.5} />
      {/* dark vignette closing in */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={clamp((t - len * 0.4) / (len * 0.4)) * 0.3} />
    </g>
  );
};

// P4S55: then you looked at her shadow — cut to the ground: THE SHADOW
export const P4S55: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = easeOut(clamp((t - len * 0.3) / (len * 0.35)));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 640], [len, 625]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Fest t={t} id="f6f" />
      {/* Emma + Daniel small above */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      {/* her shadow on the wet ground — revealed */}
      <ellipse cx={SH.x} cy={SH.y} rx={80} ry={12} fill="#000" opacity={0.35} />
      <ShadowFigure x={SH.x} y={SH.y} s={0.62} flip={-1} mood="idle" t={t} opacity={reveal} />
      {reveal > 0 ? <Glow x={SH.x} y={SH.y - 140} r={240} o={0.13 * reveal} /> : null}
      <Tag x={960} y={420} t={t - len * 0.35} text="her shadow" />
    </g>
  );
};

// P4S56: it wasn't celebrating — the shadow stands still, arms down
export const P4S56: React.FC<ShotProps> = ({ t, len }) => {
  const still = 1 - clamp(t / (len * 0.4));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 620], [len, 605]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={520} r={520} o={0.14} />
      {/* two faint celebratory ghosts that fade — what it is NOT */}
      <ShadowFigure x={760} y={780} s={0.8} mood="cheer" t={t} opacity={0.12 * still} />
      <ShadowFigure x={1160} y={780} s={0.8} mood="thumb" t={t} opacity={0.12 * still} />
      {/* the real shadow: motionless, arms hanging */}
      <ShadowFigure x={960} y={800} s={0.85} flip={-1} mood="idle" t={0} />
      <Tag x={960} y={380} t={t - 4} text="not celebrating" />
    </g>
  );
};

// P4S57: it wasn't smiling — close on shadow face area; deadpan
export const P4S57: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1060], [len, 1045]]), kf(t, [[0, 540], [len, 528]]), kf(t, [[0, 2.3], [len, 2.5]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <Glow x={960} y={480} r={500} o={0.14} />
    {/* shadow head and shoulders, huge */}
    <g transform="translate(960 620)">
      <circle cx={0} cy={-160} r={90} fill="#100C1C" />
      <path d="M -110 -90 Q 0 -130 110 -90 L 120 60 Q 0 100 -120 60 Z" fill="#100C1C" />
      {/* flat mouth line — no smile */}
      <path d="M -34 -140 L 34 -140" stroke="#5A5478" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      {/* heavy brows */}
      <path d="M -58 -178 L -20 -172 M 20 -172 L 58 -178" stroke="#5A5478" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    </g>
    <Tag x={960} y={300} t={t - 3} text="not smiling" />
  </g>
);

// P4S58: disappointed expression, looking directly at you — shadow head turns to camera
export const P4S58: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp((t - 4) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 540], [len, 528]]), kf(t, [[0, 2.3], [len, 2.5]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={480} r={520} o={0.15} />
      {/* Pip tiny in foreground bottom — the shadow looks AT him */}
      <K.Hero look={YOU} pose={idle(960, 1010, 0.55, { yaw: 0, look: 0, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0} />
      <g transform={`translate(${960 + (1 - turn) * 200} 620)`}>
        <circle cx={0} cy={-160} r={90} fill="#100C1C" />
        <path d="M -110 -90 Q 0 -130 110 -90 L 120 60 Q 0 100 -120 60 Z" fill="#100C1C" />
        {/* disappointed: flat-to-frown mouth, raised inner brows */}
        <path d="M -30 -138 Q 0 -150 30 -138" stroke="#5A5478" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
        <path d="M -56 -186 Q -30 -176 -14 -180 M 56 -186 Q 30 -176 14 -180" stroke="#5A5478" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.75} />
      </g>
      {/* gaze line shadow → Pip */}
      <path d={`M ${960 + (1 - turn) * 200} 480 L 960 880`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.4 * turn} />
      <Tag x={960} y={300} t={t - 5} text="disappointed" />
    </g>
  );
};

// P4S59: it pointed at Emma, gestured "come closer" — point + beckon
export const P4S59: React.FC<ShotProps> = ({ t, len }) => {
  const beckon = Math.sin(t * 0.6) * 10;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 570]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Fest t={t} id="f6g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* shadow points at Emma then beckons Pip closer */}
      <ShadowFigure x={SH.x} y={SH.y} s={0.62} flip={-1} mood={t < len * 0.5 ? 'point' : 'idle'} t={t} />
      {t >= len * 0.5 ? (
        <g transform={`translate(${SH.x + 60} ${SH.y - 150 + beckon})`}>
          <path d="M 0 0 q 24 -20 8 -44" stroke="#100C1C" strokeWidth={12} fill="none" strokeLinecap="round" />
          <circle cx={8} cy={-48} r={9} fill="#100C1C" />
        </g>
      ) : null}
      {/* beckon motion arcs */}
      {t >= len * 0.5 ? [0, 1].map((i) => (
        <path key={i} d={`M ${SH.x + 100 + i * 26} ${SH.y - 210 - i * 20} q 12 10 4 24`} stroke="#8B7BB8" strokeWidth={4} fill="none" opacity={0.6} />
      )) : null}
      <Glow x={SH.x} y={SH.y - 160} r={220} o={0.13} />
    </g>
  );
};

// P4S60: you hesitated — Pip frozen mid-step, shadow waiting
export const P4S60: React.FC<ShotProps> = ({ t, len }) => {
  const freeze = clamp(t / (len * 0.4));
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.5, look: 0.6 } },
    { f: len * 0.5, p: { x: PIP.x + freeze * 10, squash: freeze * 0.04 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Fest t={t} id="f6h" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      <K.Hero look={DANIEL} pose={idle(DAN.x, DAN.y, DAN.s, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      <ShadowFigure x={SH.x} y={SH.y} s={0.62} flip={-1} mood="think" t={t} />
      {/* hesitation marks */}
      <path d={`M ${PIP.x + 140} ${PIP.y - 320} l 16 -14 M ${PIP.x + 156} ${PIP.y - 306} l 14 -6`} stroke="#E9C46A" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

export const p4c6Shots: ShotMap = {
  P4S51, P4S52, P4S53, P4S54, P4S55, P4S56, P4S57, P4S58, P4S59, P4S60,
};
