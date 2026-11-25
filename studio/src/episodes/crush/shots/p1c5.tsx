import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c5 — you nearly laugh; Emma heads back to her seat; the shadow gives a final
// thumbs-up and follows; you start to suspect it has a personality. Brief: p1c5_brief.md
//
// DESIGN NOTE — set: Classroom + ClsForeground. Characters: YOU (laugh → fake-calm → suspicion),
// EMMA walks the aisle away (walkPose), wall shadow exits frame-right trailing her.
// Keyframes: laugh = shoulder shake decay + shadow laugh mood; walk-off has continuous gait;
// shadow follow slides down wall→floor with scale shrink; final close-up Pip + shadow peek.

const { Classroom, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const EMP_SEAT = { x: 1420, y: 745, s: 0.8 };   // her desk further down the aisle
const EMP_NEAR = { x: 1010, y: 800, s: 0.92 };
const WALL_SH = { x: 1160, y: 640 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'c5a' }) => (
  <>
    <Classroom t={t + 400} id={id} board={<K.Question5Board t={t} />} />
    <K.ClsForeground t={t} />
  </>
);

// P1S41: you nearly laughed — Pip bites lip, shoulders shake
export const P1S41: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t * 0.9) * 3 * clamp(t / 6);
  const pose = poseAt(t, [
    { f: 0, p: { x: 640 + shake, y: 830, scale: 1.0, yaw: 0.9, look: 0.8, armL: { a: 30, b: -18 }, armR: { a: 32, b: -20 } } },
    { f: len * 0.5, p: { headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'happy'], [len * 0.8, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP_NEAR.x, EMP_NEAR.y, EMP_NEAR.s, { yaw: -0.3, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <ShadowFigure x={WALL_SH.x} y={WALL_SH.y} s={1.0} flip={-1} mood="laugh" t={t * 1.5} opacity={0.7} />
      {/* a snort tick */}
      <path d={`M 700 520 q 10 -10 22 0`} stroke="#E9C46A" strokeWidth={4} fill="none" opacity={clamp(1 - t * 0.06)} />
    </g>
  );
};

// P1S42: "You're welcome." — Pip says it through a fake-calm face
export const P1S42: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 640, y: 830, scale: 1.0, yaw: 0.9, look: 0.8, armR: { a: 30, b: -16 } } },
    { f: len * 0.4, p: { armR: { a: 55, b: -26 } }, ease: backOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Cls t={t} id="c5b" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'cool']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP_NEAR.x, EMP_NEAR.y, EMP_NEAR.s, { yaw: -0.3, look: -0.55, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <ShadowFigure x={WALL_SH.x} y={WALL_SH.y} s={1.0} flip={-1} mood="thumb" t={t} opacity={0.7} />
    </g>
  );
};

// P1S43: Emma walked back to her seat — she walks down the aisle away from camera
export const P1S43: React.FC<ShotProps> = ({ t, len }) => {
  const walk = walkPose(kf(t, [[0, EMP_NEAR.x], [len, EMP_SEAT.x]]), t * 0.55, lerp(EMP_NEAR.y, EMP_SEAT.y, clamp(t / len)), lerp(EMP_NEAR.s, EMP_SEAT.s, clamp(t / len)), { yaw: 1, look: 0 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="c5c" />
      <K.Hero look={EMMA} pose={{ ...walk, ...faceAt(t, [[0, 'happy'], [len * 0.7, 'neutral']]) }} rimId="rimR" shadow={0.35} />
      {/* Pip watches her go, small at left */}
      <K.Hero look={YOU} pose={idle(560, 850, 0.95, { yaw: 0.7, look: 0.6, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
    </g>
  );
};

// P1S44: the shadow turns, gives one final thumbs-up, then follows her — shadow travels with her
export const P1S44: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - len * 0.35) / (len * 0.5)));
  const sx = lerp(WALL_SH.x, 1330, k);
  const sy = lerp(WALL_SH.y, 700, k) + settle(t - len * 0.85, 8);
  const emmaX = lerp(EMP_NEAR.x, EMP_SEAT.x, clamp(t / len));
  const emma = walkPose(emmaX, t * 0.55, lerp(EMP_NEAR.y, EMP_SEAT.y, clamp(t / len)), lerp(EMP_NEAR.s, EMP_SEAT.s, clamp(t / len)), { yaw: 1, look: 0 }, 1);
  const mood = t < len * 0.45 ? 'thumb' : 'idle';
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="c5d" />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.3} />
      {/* the wall shadow slides down to the floor and trails after her */}
      <ShadowFigure x={sx} y={sy} s={lerp(1.0, 0.6, k)} flip={-1} mood={mood} t={t} opacity={0.85} />
      {k < 0.9 ? <Glow x={sx} y={sy - 80} r={220} o={0.1 * (1 - k)} /> : null}
    </g>
  );
};

// P1S45: you begin to suspect it has a personality — close-up Pip, thinking, shadow peeking at frame edge
export const P1S45: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.4;
  const pose: Pose = { ...K.basePose, x: 900, y: 620 - K.HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.5, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 }, headTilt: 6, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'worried']]) };
  const peek = clamp((t - len * 0.5) / (len * 0.3));
  return (
    <g transform={camT(960 + kf(t, [[0, 0], [len, 24]]), 560 + kf(t, [[0, 0], [len, -14]]), 1.15 + kf(t, [[0, 0], [len, 0.09]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={500} r={480} o={0.13} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
      {/* the shadow peeks in from the right edge, one eye-ish tilt */}
      <g opacity={peek} transform={`translate(${1920 - peek * 60} 0)`}>
        <ShadowFigure x={1900} y={880} s={0.9} flip={-1} mood="think" t={t} />
      </g>
      {/* suspicion ticks */}
      <Tag x={1500} y={260} t={t - 6} text="?" />
      <Tag x={1560} y={300} t={t - 2} text="?" />
    </g>
  );
};

export const p1c5Shots: ShotMap = { P1S41, P1S42, P1S43, P1S44, P1S45 };
