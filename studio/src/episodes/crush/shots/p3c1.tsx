import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c1 — the rainy afternoon: heavy rain at school end, you shelter under the roof,
// Emma appears with a small blue umbrella. Brief: out/crush/scenes/p3c1_brief.md

const { Street, Rain, Umbrella, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, walkPose, YOU, EMMA, FRIEND } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 860, s: 1.0 };
const EMP = { x: 1150, y: 830, s: 0.95 };

// P3S1: title beat — rain streaks over a dark card
export const P3S1: React.FC<ShotProps> = ({ t }) => {
  const inK = easeOut(clamp(t / 14));
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" />
      <Rain t={t} n={70} o={0.5} />
      <g transform={`translate(960 520) scale(${0.7 + 0.3 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={72} fill="#F2E3C9" fontStyle="italic">The Rainy Afternoon</text>
        <line x1={-280} y1={34} x2={280} y2={34} stroke="#8FD3FF" strokeWidth={4} opacity={0.8} />
      </g>
    </g>
  );
};

// P3S2: the following Thursday — rain starts as school ends; wide street
export const P3S2: React.FC<ShotProps> = ({ t, len }) => {
  const rainO = clamp(t / 20);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55 * rainO} />
      {/* students pouring out, small silhouettes running */}
      {[0, 1, 2, 3, 4].map((i) => {
        const k = clamp((t - i * 4) / 20);
        return <K.Kid key={i} x={lerp(700 + i * 130, 960 + (i - 2) * 60, k)} y={lerp(560, 780 + (i % 3) * 40, k)} s={0.55} look={K.KIDS[i % K.KIDS.length]} />;
      })}
      <Glow x={960} y={480} r={560} o={0.16} />
    </g>
  );
};

// P3S3: students rushed toward the entrance — closer, umbrellas bobbing
export const P3S3: React.FC<ShotProps> = ({ t, len }) => {
  const rush = kf(t, [[0, 0], [len, 1]]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 965]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Street t={t} />
      <Rain t={t} n={120} o={0.6} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${lerp(300 + i * 420, 960 + (i - 1.5) * 90, rush)} ${lerp(520, 760 + (i % 2) * 50, rush)})`}>
          <Umbrella x={0} y={-190} s={0.8} tilt={Math.sin(t * 0.2 + i) * 6} color={['#3E6FB8', '#C0392B', '#3E8E5A', '#8B5A9E'][i]} />
          <K.Kid x={0} y={0} s={0.7} look={K.KIDS[(i + 1) % K.KIDS.length]} />
        </g>
      ))}
      <Tag x={960} y={300} t={t - 4} text="rush!" />
    </g>
  );
};

// P3S4: you stood under the roof, checking your phone — Pip under awning, phone glow
export const P3S4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.3, armL: { a: 55, b: -30 }, armR: { a: 58, b: -32 } }) },
    { f: len * 0.5, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Street t={t} />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'tired']]) }} rimId="rimR" shadow={0.5} />
      {/* phone glow in hands */}
      <g transform={`translate(${PIP.x + 30} ${PIP.y - 190}) rotate(8)`}>
        <rect x={-16} y={-26} width={32} height={52} rx={6} fill="#22203A" stroke="#4A4480" strokeWidth={3} />
        <rect x={-11} y={-19} width={22} height={36} rx={3} fill="#8B7BB8" opacity={0.7} />
      </g>
      <Glow x={PIP.x + 40} y={PIP.y - 190} r={120} o={0.15} />
    </g>
  );
};

// P3S5: then Emma appeared beside you — she steps in from the rain
export const P3S5: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x + 160, y: EMP.y + 30, scale: EMP.s, yaw: 0.6, look: 0.4 } },
    { f: len * 0.55, p: { x: EMP.x, y: EMP.y, yaw: 0.45, look: 0.35 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.3, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.45} />
      {/* her umbrella already up */}
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.85} tilt={-8} />
    </g>
  );
};

// P3S6: "Do you have an umbrella?" — Emma asks, tilts head
export const P3S6: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, headTilt: -6, armL: { a: 50, b: -24 } }) },
    { f: len * 0.5, p: { headTilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} />
      <Rain t={t} n={100} o={0.5} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.35, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.85} tilt={-8} />
      <path d={`M ${EMP.x - 60} ${EMP.y - 360} q 16 -14 34 0 M ${EMP.x - 90} ${EMP.y - 336} q 12 -10 26 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P3S7: you shook your head — Pip's no
export const P3S7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.35, headTilt: 0 }) },
    { f: len * 0.3, p: { headTilt: -14 }, ease: easeOut },
    { f: len * 0.55, p: { headTilt: -8 } },
    { f: len * 0.8, p: { headTilt: -14 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} />
      <Rain t={t} n={100} o={0.5} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.85} tilt={-8} />
    </g>
  );
};

// P3S8: "Unfortunately, no." — Pip shrugs, rain heavier
export const P3S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.35 }) },
    { f: len * 0.4, p: { armL: { a: 55, b: -28 }, armR: { a: 58, b: -30 }, headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} />
      <Rain t={t} n={130} o={0.65} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.85} tilt={-8} />
    </g>
  );
};

// P3S9: she held up a small blue umbrella — insert on the tiny umbrella
export const P3S9: React.FC<ShotProps> = ({ t, len }) => {
  const rise = easeOut(clamp((t - 3) / 10));
  return (
    <g transform={camT(960, 560, 1.3)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={480} o={0.13} />
      <Rain t={t} n={80} o={0.5} />
      <K.Hero look={EMMA} pose={idle(960, 700, 1.5, { yaw: 0, look: 0, armR: { a: 80, b: -16 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0} />
      {/* the comically small umbrella */}
      <g transform={`translate(960 ${700 - 300 - (1 - rise) * 60})`} opacity={rise}>
        <Umbrella x={0} y={0} s={0.55} tilt={-4} color="#3E6FB8" />
      </g>
      <Tag x={960} y={300} t={t - 6} text="small. very small." />
    </g>
  );
};

// P3S10: "Want to share?" — Emma offers, Pip's eyes widen
export const P3S10: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.35, look: 0.4 }) },
    { f: len * 0.5, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Street t={t} />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.45, look: 0.3, armL: { a: 40, b: -18 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={EMP.x + 40} y={EMP.y - 300} s={0.55} tilt={-6} color="#3E6FB8" />
      <path d={`M ${EMP.x - 70} ${EMP.y - 350} q 16 -14 34 0 M ${EMP.x - 100} ${EMP.y - 326} q 12 -10 26 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

export const p3c1Shots: ShotMap = {
  P3S1, P3S2, P3S3, P3S4, P3S5, P3S6, P3S7, P3S8, P3S9, P3S10,
};
