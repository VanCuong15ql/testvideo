import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p5c5 — "The confession": walk outside at orange dusk, leftover
// supplies box, banter about the day. Brief: p5c5_brief.md

const { Street, Booth, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

// Post-festival dusk street: warmer orange sky, fewer stalls
const DuskWalk: React.FC<{ t: number; id?: string }> = ({ t, id = 'g5a' }) => (
  <g>
    {/* orange dusk sky band */}
    <rect x={-200} y={-100} width={2400} height={700} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={420} fill="#E8915A" opacity={0.28} />
    {/* setting sun disc */}
    <circle cx={1560} cy={420} r={130} fill="#F2B06E" opacity={0.5} />
    <Glow x={1560} y={420} r={380} o={0.3} />
    {/* ground */}
    <rect x={-200} y={800} width={2400} height={400} fill="#241D33" />
    <rect x={-200} y={800} width={2400} height={10} fill="#3A2E4A" />
    {/* distant silhouettes leaving */}
    <ShadowFigure x={300} y={880} s={0.55} mood="idle" t={t} opacity={0.4} />
    <ShadowFigure x={460} y={890} s={0.5} flip={-1} mood="idle" t={t + 6} opacity={0.35} />
    <ShadowFigure x={1960} y={880} s={0.55} flip={-1} mood="idle" t={t + 3} opacity={0.4} />
    {/* string lights */}
    {[-1, 0, 1, 2].map((i) => (
      <circle key={i} cx={400 + i * 340} cy={560 + Math.sin(t * 0.4 + i) * 6} r={7} fill="#F2D48A" opacity={0.7 + Math.sin(t * 2 + i * 2) * 0.2} />
    ))}
  </g>
);

const EMP = { x: 1180, y: 800, s: 0.9 };
const PIP = { x: 760, y: 820, s: 0.95 };

const pair = (t: number, len: number, pipExtra: Partial<Pose> = {}, empExtra: Partial<Pose> = {}, pipExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], empExpr: Parameters<typeof faceAt>[1] = [[0, 'happy']], cam: [number, number, number] = [985, 578, 1.4]) => (
  <g transform={camT(kf(t, [[0, cam[0]], [len, cam[0] + 8]]), kf(t, [[0, cam[1]], [len, cam[1] + 4]]), kf(t, [[0, cam[2]], [len, cam[2] * 1.06]]))}>
    <DuskWalk t={t} id={`g5${Math.round(t)}`} />
    <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...pipExtra, ...faceAt(t, pipExpr) })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.45, look: -0.55, ...empExtra, ...faceAt(t, empExpr) })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S41: title — "The confession"
export const P5S41: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, 1)}>
    <DuskWalk t={t} id="g5t" />
    <Glow x={960} y={420} r={440} o={0.25} />
    <Tag x={960} y={300} t={t} text="the confession" />
    <K.Hero look={YOU} pose={idle(800, 800, 0.9, { yaw: 0.5, look: 0.6 })} rimId="rimR" shadow={0.45} />
    <K.Hero look={EMMA} pose={idle(1120, 800, 0.9, { yaw: -0.5, look: -0.6 })} rimId="rimR" shadow={0.4} />
  </g>
);

// P5S42: after festival, walked outside together — walking pair
export const P5S42: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / (len * 0.8)));
  const ex = kf(t, [[0, 700], [len * 0.8, 1100], [len, 1160]]);
  const px = ex - 380;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 995]]), kf(t, [[0, 578], [len, 582]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <DuskWalk t={t} id="g5b" />
      <K.Hero look={YOU} pose={idle(px, 830, 0.95, { yaw: 0.55, look: 0.6, legL: { a: -16, b: 18 }, legR: { a: 16, b: -18 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(ex, 815, 0.9, { yaw: -0.55, look: -0.6, legL: { a: 14, b: -16 }, legR: { a: -14, b: 16 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Tag x={960} y={300} t={t - 4} text="after the festival" />
    </g>
  );
};

// P5S43: sky turning orange — sky fills frame
export const P5S43: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1010]]), kf(t, [[0, 480], [len, 470]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-200} y={-100} width={2400} height={1080} fill="#3A2440" />
    <rect x={-200} y={-100} width={2400} height={560} fill="#E8915A" opacity={0.35 + clamp(t / len) * 0.15} />
    <circle cx={1560} cy={430} r={150} fill="#F2B06E" opacity={0.6} />
    <Glow x={1560} y={430} r={460} o={0.4} />
    {/* birds */}
    {[0, 1, 2].map((i) => {
      const bx = 300 + i * 420 + Math.sin(t * 0.3 + i) * 60;
      const by = 300 + i * 50 + Math.sin(t * 0.9 + i * 2) * 10;
      return <path key={i} d={`M ${bx - 14} ${by} q 14 -12 28 0 q 14 -12 28 0`} stroke="#1A1226" strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
    <Tag x={960} y={880} t={t - 2} text="the sky was turning orange" />
  </g>
);

// P5S44: students leaving in groups — silhouettes carrying stuff
export const P5S44: React.FC<ShotProps> = ({ t, len }) => {
  const walkers = [0, 1, 2, 3, 4].map((i) => {
    const wx = 200 + i * 380 + Math.sin(t * 0.15 + i * 2) * 40;
    const wy = 900 - (i % 3) * 30;
    return (
      <g key={i} transform={`translate(${wx} ${wy}) scale(0.6 -0.6)`} opacity={0.75}>
        <path d="M -16 -170 Q 0 -182 16 -170 L 18 -80 Q 0 -70 -18 -80 Z" fill="#1A1226" />
        <circle cx={0} cy={-198} r={16} fill="#1A1226" />
        <path d="M -12 -160 L -16 -20 M 12 -160 L 16 -20" stroke="#1A1226" strokeWidth={9} strokeLinecap="round" />
        {/* carried box/bag */}
        <rect x={18} y={-160} width={34} height={30} rx={4} fill="#3A2E4A" stroke="#1A1226" strokeWidth={3} />
      </g>
    );
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.1], [len, 1.25]]))}>
      <DuskWalk t={t} id="g5d" />
      {walkers}
    </g>
  );
};

// P5S45: Emma holds a small box of leftover supplies — close on the box
export const P5S45: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.5, armL: { a: 50, b: -25 }, headTilt: 4 }) },
  ]);
  const bob = Math.sin(t * 1.2) * 3;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 590], [len, 595]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <DuskWalk t={t} id="g5e" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* the little box in her arms */}
      <g transform={`translate(${EMP.x - 30} ${EMP.y - 150 + bob}) rotate(-4)`}>
        <rect x={-55} y={-40} width={110} height={80} rx={8} fill="#8A6452" stroke="#0D0A14" strokeWidth={4} />
        <rect x={-55} y={-40} width={110} height={20} rx={8} fill="#6E5640" stroke="#0D0A14" strokeWidth={3} />
        <text x={0} y={18} textAnchor="middle" fontSize={20} fill="#F4EEE0">supplies</text>
      </g>
      <Glow x={EMP.x} y={EMP.y - 160} r={200} o={0.14} />
    </g>
  );
};

// P5S46: "Today was exhausting," she said — Emma, tired but warm
export const P5S46: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 4 },
    { headTilt: 8, sway: Math.sin(t * 1.1) * 3 },
    [[0, 'happy']], [[0, 'tired'], [len * 0.7, 'happy']], [1000, 580, 1.5]);

// P5S47: "Definitely." — Pip agrees, big nod
export const P5S47: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { headTilt: 0 },
    {},
    [[0, 'happy']], [[0, 'happy']], [1000, 580, 1.45]);

// P5S48: "But it was fun." — Emma's smile returns
export const P5S48: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    {},
    { headTilt: -4 },
    [[0, 'happy']], [[0, 'tired'], [len * 0.4, 'happy']], [1000, 580, 1.45]);

// P5S49: "Yeah. Especially the paper fight." — both laugh, callback
export const P5S49: React.FC<ShotProps> = ({ t, len }) =>
  pair(t, len,
    { armR: { a: 60, b: -30 } },
    { armL: { a: 60, b: -28 } },
    [[0, 'happy'], [len * 0.5, 'oops']],
    [[0, 'happy'], [len * 0.5, 'oops']],
    [1000, 580, 1.4]);

// P5S50: she laughed — Emma doubled over laughing
export const P5S50: React.FC<ShotProps> = ({ t, len }) => {
  const bend = easeOut(clamp((t - 3) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 590], [len, 596]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <DuskWalk t={t} id="g5j" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y + bend * 30, EMP.s * (1 - bend * 0.12), { yaw: -0.45, look: -0.55, headTilt: -18, armL: { a: 60, b: -26 }, armR: { a: 60, b: -26 }, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) })} rimId="rimR" shadow={0.4} />
      {/* laugh lines */}
      <path d={`M ${EMP.x - 120} ${EMP.y - 300} q -16 -14 -30 0 M ${EMP.x - 140} ${EMP.y - 272} q -12 -10 -24 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={0.7} />
      <Glow x={EMP.x} y={EMP.y - 170} r={220} o={0.18} />
    </g>
  );
};

export const p5c5Shots: ShotMap = {
  P5S41, P5S42, P5S43, P5S44, P5S45, P5S46, P5S47, P5S48, P5S49, P5S50,
};
