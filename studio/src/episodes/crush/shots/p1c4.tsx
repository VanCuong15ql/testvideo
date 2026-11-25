import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c4 — the wall shadow leans in, nods, and then jumps for joy while Emma thanks you.
// Brief: out/crush/scenes/p1c4_brief.md

const { Classroom, ShadowFigure, Glow, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1010, y: 800, s: 0.92 };
const WALL_SH = { x: 1230, y: 655 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'c4a' }) => <Classroom t={t + 400} id={id} board={<K.Question5Board t={t} />} />;

// P1S31: while Emma reads, her wall shadow leans toward you, hands clasped — 'worried' + drift
export const P1S31: React.FC<ShotProps> = ({ t, len }) => {
  const drift = easeOut(clamp(t / (len * 0.5)));
  const sx = lerp(WALL_SH.x, WALL_SH.x - 90, drift);
  const sy = lerp(WALL_SH.y, WALL_SH.y + 18, drift);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 480], [len, 468]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Cls t={t} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.55, armL: { a: 50, b: -30 }, armR: { a: 52, b: -32 }, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.9, look: 0.8, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <ShadowFigure x={sx} y={sy} s={1.15} flip={-1} mood="think" t={t} opacity={0.85} />
      <Glow x={sx} y={sy - 120} r={260} o={0.12} />
    </g>
  );
};

// P1S32: it looked like it was waiting for something — the clasped hands + a "..." thought bubble
export const P1S32: React.FC<ShotProps> = ({ t, len }) => {
  const bobY = Math.sin(t * 0.15) * 6;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), kf(t, [[0, 430], [len, 415]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t} id="c4b" />
      <ShadowFigure x={WALL_SH.x - 60} y={WALL_SH.y} s={1.35} flip={-1} mood="think" t={t} />
      {/* waiting dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={WALL_SH.x - 190 - i * 34} cy={WALL_SH.y - 330 - bobY - i * 10} r={9 - i} fill="#8B7BB8" opacity={clamp(0.9 - ((t * 0.4 + i * 8) % 24) / 24) * 0.9} />
      ))}
      <Glow x={WALL_SH.x - 60} y={WALL_SH.y - 130} r={300} o={0.14} />
    </g>
  );
};

// P1S33: you glanced at Emma — quick cut to her, still reading, oblivious
export const P1S33: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: EMP.x - 60, y: EMP.y, scale: EMP.s * 1.25, yaw: -0.25, look: -0.6, headTilt: 8 } },
    { f: len * 0.5, p: { headTilt: 5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.9], [len, 2.0]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={480} o={0.13} />
      <K.Hero look={EMMA} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0} />
      <NotebookLook x={EMP.x - 120} y={EMP.y - 210} />
    </g>
  );
};

const NotebookLook: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-6) scale(0.8)`}>
    <rect x={-40} y={-30} width={80} height={60} rx={6} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={3} />
    <rect x={-40} y={-30} width={16} height={60} rx={5} fill="#3E5A8C" />
    <path d="M -14 -8 L 28 -8 M -14 6 L 28 6 M -14 20 L 20 20" stroke="#8A93AE" strokeWidth={3} />
  </g>
);

// P1S34: "What's wrong?" she asked — Emma looks up from the page
export const P1S34: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.6, headTilt: 8 }) },
    { f: len * 0.4, p: { headTilt: 0, look: -0.4, armL: { a: 30, b: -16 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.35} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.9, look: 0.8, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      {/* speech ticks */}
      <path d={`M ${EMP.x - 90} ${540} q 14 -12 30 0`} stroke="#E9C46A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P1S35: "Nothing. I just… need to think." — Pip covers mouth, the wall shadow waits
export const P1S35: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.9, look: 0.8, armR: { a: 30, b: -14 } }) },
    { f: len * 0.35, p: { armR: { a: 70, b: -50 }, headTilt: 8 }, ease: easeOut },
    { f: len * 0.6, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.5, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <ShadowFigure x={WALL_SH.x - 60} y={WALL_SH.y} s={1.1} flip={-1} mood="think" t={t} opacity={0.8} />
    </g>
  );
};

// P1S36: her shadow suddenly nodded enthusiastically — nod mood, bigger
export const P1S36: React.FC<ShotProps> = ({ t, len }) => {
  const pop = easeOut(clamp((t - len * 0.25) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 430], [len, 418]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Cls t={t} id="c4c" />
      <ShadowFigure x={WALL_SH.x - 60} y={WALL_SH.y} s={1.3 * (0.9 + 0.1 * pop)} flip={-1} mood="nod" t={t * 1.6} />
      {/* speed ticks on the nod */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${WALL_SH.x - 230 - i * 20} ${WALL_SH.y - 300 + i * 16} q -14 10 -6 26`} stroke="#8B7BB8" strokeWidth={4} fill="none" opacity={0.5} />
      ))}
      <Glow x={WALL_SH.x - 60} y={WALL_SH.y - 130} r={280} o={0.14} />
    </g>
  );
};

// P1S37: you looked away — Pip turns back to the window, pretending
export const P1S37: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.9, look: 0.8 } },
    { f: len * 0.5, p: { yaw: 0.4, look: 0.3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <ShadowFigure x={WALL_SH.x - 60} y={WALL_SH.y} s={1.1} flip={-1} mood="idle" t={t} opacity={0.75} />
    </g>
  );
};

// P1S38: after explaining, Emma smiled — the explanation montage: notebook between them, check mark
export const P1S38: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.5 }) },
    { f: len * 0.5, p: { headTilt: -4 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.85, look: 0.75, armR: { a: 55, b: -28 }, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.35} />
      <NotebookLook x={850} y={700} />
      {/* a check mark appears on the page */}
      <path d={`M ${880} ${690} l 14 14 l 26 -30`} stroke="#3E8E5A" strokeWidth={7} fill="none" strokeLinecap="round" opacity={clamp((t - len * 0.5) / 8)} />
    </g>
  );
};

// P1S39: "Thanks! I knew you'd understand it." — Emma beams, heart-ish warmth
export const P1S39: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.25, look: -0.55 }) },
    { f: len * 0.4, p: { armL: { a: 40, b: -20 }, armR: { a: 42, b: -22 }, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Cls t={t} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.35} />
      <Glow x={EMP.x} y={EMP.y - 200} r={320} o={0.16} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.85, look: 0.75, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.5} />
      {/* speech ticks */}
      <path d={`M ${EMP.x - 100} ${520} q 16 -14 34 0 M ${EMP.x - 130} ${545} q 12 -10 26 0`} stroke="#E9C46A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={clamp(1 - t * 0.04)} />
    </g>
  );
};

// P1S40: her shadow immediately jumped into the air — big jump, arms up
export const P1S40: React.FC<ShotProps> = ({ t, len }) => {
  const jump = Math.sin(clamp(t / len) * Math.PI);
  const sy = WALL_SH.y - jump * 160;
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), kf(t, [[0, 430], [len, 410]]), kf(t, [[0, 1.9], [len, 2.15]]))}>
      <Cls t={t} id="c4d" />
      {/* Emma still smiling below, unaware */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.25, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      <ShadowFigure x={WALL_SH.x - 60} y={sy} s={1.3} flip={-1} mood="cheer" t={t * 1.4} />
      {/* motion streaks under the jump */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${WALL_SH.x - 140 + i * 30} ${WALL_SH.y + 40 - jump * 60} l -20 ${26 + i * 8}`} stroke="#8B7BB8" strokeWidth={5} strokeLinecap="round" opacity={0.5 * (1 - jump * 0.5)} />
      ))}
      <Glow x={WALL_SH.x - 60} y={sy - 140} r={300} o={0.16} />
    </g>
  );
};

export const p1c4Shots: ShotMap = {
  P1S31, P1S32, P1S33, P1S34, P1S35, P1S36, P1S37, P1S38, P1S39, P1S40,
};
