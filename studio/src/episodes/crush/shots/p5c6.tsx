import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c6 — banter about the paper fight, conversation goes quiet, recap
// of their weeks together, "you still didn't know what Emma felt". Brief: p5c6_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA, PaperBall } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'g6a' }) => (
  <g>
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.28} />
    <circle cx={1560} cy={420} r={130} fill="#F2B06E" opacity={0.5} />
    <Glow x={1560} y={420} r={380} o={0.3} />
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
    {[-1, 0, 1, 2].map((i) => (
      <circle key={i} cx={400 + i * 340} cy={560 + Math.sin(t * 0.4 + i) * 6} r={7} fill="#F2D48A" opacity={0.7 + Math.sin(t * 2 + i * 2) * 0.2} />
    ))}
  </g>
);

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], zoom = 1.4) => (
  <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, zoom], [len, zoom * 1.05]]))}>
    <DuskWalk t={t} id={`g6${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S51: "I still can't believe you threw paper at me." — Emma mock-offended
export const P5S51: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armR: { a: 40, b: -20 }, headTilt: -4 },
    { headTilt: 6, armL: { a: 30, b: -14 } },
    [[0, 'happy']], [[0, 'worried'], [len * 0.5, 'smug']], 1.45);

// P5S52: "You started it." — Pip points back
export const P5S52: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armR: { a: 65, b: -30 } },
    { headTilt: 8 },
    [[0, 'smug']], [[0, 'oops']], 1.45);

// P5S53: "I did not!" — Emma protests, paper ball flies
export const P5S53: React.FC<ShotProps> = ({ t, len }) => {
  const throwK = easeOut(clamp((t - len * 0.3) / (len * 0.3)));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <DuskWalk t={t} id="g6c" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, armR: { a: 60, b: -30 }, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, armR: { a: 70, b: -35 }, headTilt: -6, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'oops']]) })} rimId="rimR" shadow={0.4} />
      {/* the retaliatory paper ball arcing */}
      <PaperBall x={EMP.x - 80 - throwK * 320} y={EMP.y - 260 - Math.sin(throwK * Math.PI) * 140} rot={throwK * 400} s={0.8} />
    </g>
  );
};

// P5S54: you both laughed — shared laugh beat
export const P5S54: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: -10, armL: { a: 55, b: -26 }, armR: { a: 55, b: -26 } },
    { headTilt: -12, armL: { a: 55, b: -26 }, armR: { a: 55, b: -26 } },
    [[0, 'happy'], [len * 0.4, 'oops']], [[0, 'happy'], [len * 0.4, 'oops']], 1.3);

// P5S55: conversation slowly became quiet — wide, both smaller, gap between
export const P5S55: React.FC<ShotProps> = ({ t, len }) => {
  const dim = 1 - clamp((t - len * 0.3) / (len * 0.5)) * 0.35;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.1], [len, 1.28]]))}>
      <DuskWalk t={t} id="g6e" />
      <K.Hero look={YOU} pose={idle(PIP.x - 60, PIP.y, PIP.s * 0.92, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0.45 * dim} />
      <K.Hero look={EMMA} pose={idle(EMP.x + 60, EMP.y, EMP.s * 0.92, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'neutral']]) })} rimId="rimR" shadow={0.4 * dim} />
      {/* silence dots between them */}
      <text x={960} y={560} textAnchor="middle" fontSize={56} fill="#E9C46A" opacity={0.4 + Math.sin(t * 0.5) * 0.15}>…</text>
      <rect x={0} y={0} width={1920} height={1080} fill="#0D0A14" opacity={1 - dim} />
    </g>
  );
};

// P5S56: weeks of time together — montage: four mini-flash frames in one
export const P5S56: React.FC<ShotProps> = ({ t, len }) => {
  const ph = (t * 0.5) % 4; // cycles through 4 memories
  const mem = Math.floor(ph);
  const captions = ['assignments', 'one umbrella', 'the booth', 'paper fight'];
  const memPose = (ex: number, ey: number, s: number, look: Partial<Pose> = {}) => idle(ex, ey, s, { ...look });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.15], [len, 1.3]]))}>
      <DuskWalk t={t} id="g6f" />
      <Glow x={960} y={500} r={480} o={0.18} />
      {mem === 0 && (
        <>
          <K.Hero look={YOU} pose={memPose(800, 800, 0.85, { yaw: 0.5, look: 0.55, armR: { a: 60, b: -30 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
          <K.Hero look={EMMA} pose={memPose(1120, 800, 0.85, { yaw: -0.5, look: -0.55, armL: { a: 60, b: -30 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
        </>
      )}
      {mem === 1 && (
        <>
          {/* umbrella shared */}
          <path d="M 820 480 Q 960 380 1100 480" stroke="#8B7BB8" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 820 480 L 960 620 M 1100 480 L 960 620" stroke="#8B7BB8" strokeWidth={4} opacity={0.7} />
          <K.Hero look={YOU} pose={memPose(880, 800, 0.85, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
          <K.Hero look={EMMA} pose={memPose(1040, 800, 0.85, { yaw: -0.4, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
        </>
      )}
      {mem === 2 && (
        <>
          <rect x={700} y={600} width={520} height={160} rx={10} fill="#B4543F" stroke="#0D0A14" strokeWidth={4} opacity={0.9} />
          <K.Hero look={YOU} pose={memPose(820, 800, 0.85, { yaw: 0.5, look: 0.55, armR: { a: 65, b: -30 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
          <K.Hero look={EMMA} pose={memPose(1100, 800, 0.85, { yaw: -0.5, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
        </>
      )}
      {mem === 3 && (
        <>
          <PaperBall x={900} y={500} rot={t * 12} s={0.9} />
          <PaperBall x={1040} y={460} rot={-t * 10} s={0.8} />
          <K.Hero look={YOU} pose={memPose(800, 800, 0.85, { yaw: 0.5, look: 0.55, armR: { a: 70, b: -30 }, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.4} />
          <K.Hero look={EMMA} pose={memPose(1120, 800, 0.85, { yaw: -0.5, look: -0.55, armL: { a: 70, b: -30 }, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.35} />
        </>
      )}
      <Tag x={960} y={280} t={t - 2} text={captions[mem]} />
    </g>
  );
};

// P5S57: and every time, her shadow revealed what she never said — montage of shadow moods
export const P5S57: React.FC<ShotProps> = ({ t, len }) => {
  const moods = ['heart', 'cheer', 'point', 'thumb'] as const;
  const mood = moods[Math.floor((t * 0.4) % 4)];
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1020]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <DuskWalk t={t} id="g6g" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s * 0.85, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s * 0.85, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
      {/* her shadow performing the current mood — oversized */}
      <ShadowFigure x={1200} y={900} s={0.8} flip={-1} mood={mood} t={t} opacity={0.8} />
      <Glow x={1200} y={700} r={240} o={0.15} />
      <Tag x={960} y={280} t={t - 2} text="what she never said out loud" />
    </g>
  );
};

// P5S58: but you still didn't know what Emma felt — quiet beat, shadow still, Pip searching
export const P5S58: React.FC<ShotProps> = ({ t, len }) => {
  const tilt = Math.sin(t * 0.6) * 3;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1000]]), kf(t, [[0, 578], [len, 570]]), kf(t, [[0, 1.35], [len, 1.55]]))}>
      <DuskWalk t={t} id="g6h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, headTilt: tilt, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, headTilt: 4, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'tired']]) })} rimId="rimR" shadow={0.35} />
      {/* her shadow: still, ambiguous — just standing, hands loose */}
      <ShadowFigure x={1050} y={915} s={0.5} flip={-1} mood="idle" t={t} opacity={0.6} />
      <Glow x={960} y={600} r={360} o={0.12} />
    </g>
  );
};

// P5S59: but you still didn't know — close on Pip's uncertain face
export const P5S59: React.FC<ShotProps> = ({ t, len }) => {
  const blink = Math.sin(t * 0.8) > 0.985 ? 1 : 0;
  const fa = faceAt(t, [[0, 'worried'], [len * 0.7, 'neutral']]);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1060]]), kf(t, [[0, 620], [len, 615]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={540} r={480} o={0.16} />
      <K.Hero look={YOU} pose={idle(960, 780, 1.5, { yaw: 0.3, look: 0.5, squash: 0, headTilt: 3, expr: fa.expr, blink: Math.max(fa.blink, blink) })} rimId="rimR" shadow={0} />
      {/* question mark floating beside his head */}
      <text x={1180} y={420} fontSize={90} fill="#E9C46A" opacity={0.5 + Math.sin(t * 0.7) * 0.15} transform={`rotate(${Math.sin(t * 0.5) * 8} 1180 420)`}>?</text>
    </g>
  );
};

// P5S60: you finally decided to ask — Pip squares up, resolves
export const P5S60: React.FC<ShotProps> = ({ t, len }) => {
  const resolve = easeOut(clamp((t - 4) / 12));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 1000]]), kf(t, [[0, 578], [len, 570]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <DuskWalk t={t} id="g6j" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.65, headTilt: -4 * resolve, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len * 0.8, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <Glow x={PIP.x} y={PIP.y - 200} r={180 + resolve * 120} o={0.1 + resolve * 0.1} />
      <Tag x={960} y={300} t={t - 5} text="you decided to ask" />
    </g>
  );
};

export const p5c6Shots: ShotMap = {
  P5S51, P5S52, P5S53, P5S54, P5S55, P5S56, P5S57, P5S58, P5S59, P5S60,
};
