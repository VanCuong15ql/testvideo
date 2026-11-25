import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c3 — the first strange discovery: break time, Emma asks about question five,
// hands you her notebook, and her shadow leans in on the wall. Brief: out/crush/scenes/p1c3_brief.md

const { Classroom, ShadowFigure, Notebook, Tag, Glow, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, joints, toWorld, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

// classroom blocking: Pip by the window (left), Emma approaches from the right aisle
const PIP = { x: 640, y: 830, s: 1.0 };
const EMMA_NEAR = { x: 1010, y: 800, s: 0.92 };
const EMMA_FAR = { x: 1420, y: 745, s: 0.8 };

// her shadow, cast big on the back wall behind/right of her
const WALL_SH = { x: 1230, y: 655 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'c3a' }) => <Classroom t={t + 400} id={id} board={<K.Question5Board t={t} />} />;

// P1S21: no way you'd spend the morning staring at a shadow — Pip at the window, resolved face
export const P1S21: React.FC<ShotProps> = ({ t, len }) => {
  const pose = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.6, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'cool']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P1S22: at least, that was the plan — the plan cracks: Pip's smile fades
export const P1S22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.5, look: 0.6,
    ...faceAt(t, [[0, 'happy'], [len * 0.35, 'neutral'], [len * 0.7, 'worried']]),
  });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 970]]), kf(t, [[0, 560], [len, 555]]), kf(t, [[0, 1.6], [len, 1.72]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0.5} />
      {/* his shadow on the floor already tilting toward something off-frame */}
      <ellipse cx={760} cy={900} rx={60} ry={10} fill="#000" opacity={0.3} />
      <ShadowFigure x={800} y={905} s={0.5} mood="idle" t={t} opacity={0.55} />
    </g>
  );
};

// P1S23: title beat — the first strange discovery. Chalk-style card over the classroom
export const P1S23: React.FC<ShotProps> = ({ t }) => {
  const inK = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45 * inK} />
      <g transform={`translate(960 520) scale(${0.7 + 0.3 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={72} fill="#F2E3C9" fontStyle="italic">The First Strange Discovery</text>
        <line x1={-320} y1={34} x2={320} y2={34} stroke="#8B7BB8" strokeWidth={4} opacity={0.8} />
      </g>
    </g>
  );
};

// P1S24: during break, standing near the window — Emma approaches from the aisle
export const P1S24: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_FAR.x, EMMA_FAR.y, EMMA_FAR.s, { yaw: -0.4, look: -0.6 }) },
    { f: len * 0.6, p: { x: EMMA_NEAR.x, y: EMMA_NEAR.y, scale: EMMA_NEAR.s, yaw: -0.25, look: -0.5 }, ease: easeOut },
    { f: len, p: {} },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy'], [len * 0.7, 'neutral']]) }} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S25: "Hey, do you understand question five?" — Emma leans in, notebook hint
export const P1S25: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_NEAR.x, EMMA_NEAR.y, EMMA_NEAR.s, { yaw: -0.3, look: -0.55, headTilt: -4 }) },
    { f: len * 0.3, p: { armR: { a: 30, b: -14 }, headTilt: 0 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.6, look: 0.55, ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* speech ticks near Emma */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${1055 - i * 26} ${560 - i * 8} q ${10 + i * 6} ${-8} ${22 + i * 6} 0`} stroke="#E9C46A" strokeWidth={4} fill="none" strokeLinecap="round" opacity={clamp(0.9 - t * 0.04)} />
      ))}
    </g>
  );
};

// P1S26: you turned around — Pip rotates to face her fully
export const P1S26: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.55, look: 0.5 } },
    { f: len * 0.45, p: { yaw: 0.9, look: 0.8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.45], [len, 1.52]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMMA_NEAR.x, EMMA_NEAR.y, EMMA_NEAR.s, { yaw: -0.3, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S27: "Uh… maybe. Let me see." — Pip shrugs, buys time
export const P1S27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.9, look: 0.8, armL: { a: 20, b: -10 }, armR: { a: 18, b: -8 } } },
    { f: len * 0.4, p: { armL: { a: 55, b: -30 }, armR: { a: 58, b: -32 }, headTilt: 6 }, ease: easeOut },
    { f: len * 0.7, p: { armL: { a: 40, b: -24 }, armR: { a: 42, b: -26 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.45], [len, 1.52]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMMA_NEAR.x, EMMA_NEAR.y, EMMA_NEAR.s, { yaw: -0.3, look: -0.55, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'neutral']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S28: she handed you her notebook — the notebook travels Emma → Pip
export const P1S28: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 4) / (len * 0.45)));
  const hx = lerp(1010, 800, k);
  const hy = lerp(640, 700, k) - Math.sin(k * Math.PI) * 60;
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_NEAR.x, EMMA_NEAR.y, EMMA_NEAR.s, { yaw: -0.3, look: -0.5, armR: { a: 24, b: -16 } }) },
    { f: len * 0.5, p: { armR: { a: 55, b: -30 } } },
    { f: len, p: { armR: { a: 20, b: -14 } } },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.9, look: 0.7, armL: { a: 20, b: -12 }, armR: { a: 18, b: -10 } }) },
    { f: len * 0.5, p: { armL: { a: 52, b: -30 }, armR: { a: 50, b: -28 } } },
    { f: len, p: { armL: { a: 30, b: -18 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.4} />
      <Notebook x={hx} y={hy} s={0.9} rot={-10 + k * 14} open={k > 0.8 ? 1 : 0} />
      {/* dotted path the notebook travels */}
      <path d={`M 1010 650 Q 920 ${560 - k * 30} 800 700`} fill="none" stroke="#8B7BB8" strokeWidth={3} strokeDasharray="8 10" opacity={0.4 * (1 - k)} />
    </g>
  );
};

// P1S29: you look at the question, concentrating hard — close-up on the notebook page + Pip's eyes above
export const P1S29: React.FC<ShotProps> = ({ t }) => {
  const sc = 2.6;
  const pose: Pose = { ...K.basePose, x: 1150, y: 560 - K.HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.6, armL: { a: 60, b: -40 }, armR: { a: 62, b: -42 }, ...faceAt(t, [[0, 'worried'], [15, 'neutral']]) };
  return (
    <g transform={camT(960, 540, 1.35)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={480} r={520} o={0.14} />
      {/* the notebook page fills lower frame */}
      <g transform="translate(960 780) rotate(-4) scale(2.2)">
        <rect x={-160} y={-110} width={320} height={220} rx={10} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} />
        <rect x={-160} y={-110} width={46} height={220} rx={8} fill="#C9D4EE" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={-96 + (i % 2) * 10} y={-80 + i * 44} width={200 - i * 18} height={9} rx={4} fill="#8A93AE" opacity={0.7} />
          </g>
        ))}
        {/* question five, circled */}
        <ellipse cx={30} cy={-36} rx={86} ry={30} fill="none" stroke="#C0392B" strokeWidth={5} transform="rotate(-6 30 -36)" opacity={0.85} />
        <text x={30} y={-30} textAnchor="middle" fontFamily="monospace" fontSize={22} fill="#3A3550">5. Solve for x</text>
      </g>
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// P1S30: then you noticed her shadow on the wall — cut to the wall: a second shadow beside hers
export const P1S30: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = clamp((t - len * 0.4) / (len * 0.3));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 480], [len, 470]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Cls t={t} />
      {/* Emma small at bottom, unaware, still smiling at the notebook */}
      <K.Hero look={EMMA} pose={idle(1010, 800, 0.9, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* her real shadow + the EXTRA shadow on the wall, revealed late */}
      <ellipse cx={1050} cy={880} rx={70} ry={12} fill="#000" opacity={0.3} />
      <ShadowFigure x={1050} y={885} s={0.55} mood="idle" t={t} opacity={0.5} />
      <ShadowFigure x={WALL_SH.x} y={WALL_SH.y} s={1.15} flip={-1} mood="think" t={t} opacity={reveal} />
      {reveal > 0 ? <Glow x={WALL_SH.x} y={WALL_SH.y - 120} r={260} o={0.12 * reveal} /> : null}
      {/* Pip's eyeline ticks toward the wall */}
      {reveal > 0 ? <path d={`M 640 640 L 980 560 M 640 656 L 990 580`} stroke="#8B7BB8" strokeWidth={4} strokeLinecap="round" opacity={0.6 * reveal} /> : null}
    </g>
  );
};

export const p1c3Shots: ShotMap = {
  P1S21, P1S22, P1S23, P1S24, P1S25, P1S26, P1S27, P1S28, P1S29, P1S30,
};
