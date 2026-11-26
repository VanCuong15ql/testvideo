import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c4 — the yank: the string snaps taut and hauls them together, foreheads
// collide, and that's how the strangest relationship of Alex's life begins.
// The page-1 payoff: two silhouettes becoming one.
//
// DESIGN — set: Gate. The string is at max tension (slack ~0, thick, blazing).
// Motion: both bodies translate toward center with easeIn (the pull has weight),
// impact squash + shake + a heart-shaped spark burst at the forehead contact,
// then a slow pull-back to the "relationship" wide with the string now slack.

const {
  ALEX, MAYA, Gate, RedString,
  Tag, FloatLabel, Glow, Say,
  camT, kf, clamp, lerp, easeOut, easeInOut, easeIn, backOut, settle, spring, shake,
  poseAt, faceAt, joints, toWorld, pinky, idle,
} = K;

// P1S31: mid-yank — both airborne toward each other, string a straight blazing line
export const P1S31: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / len);
  const ax = lerp(900, 990, easeIn(p));
  const mx = lerp(1250, 1160, easeIn(p));
  const alex = poseAt(t, [
    { f: 0, p: idle(ax, 900 - p * 14, 1.05, { yaw: 0.3, look: -0.3, tilt: -4, expr: 'shock' }) },
    { f: len, p: { x: ax, y: 900 - p * 14, tilt: -2 } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(mx, 900 - p * 14, 1.05, { yaw: -0.3, look: 0.3, tilt: 4, expr: 'shock' }) },
    { f: len, p: { x: mx, y: 900 - p * 14, tilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1075]]), kf(t, [[0, 545], [len, 540]]), kf(t, [[0, 1.8], [len, 2.1]]))}>
      <Gate t={t} />
      {/* speed lines radiating from the string */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + t * 0.05;
        const r0 = 60 + (i % 3) * 30;
        return <line key={i} x1={1075 + Math.cos(a) * r0} y1={760 + Math.sin(a) * r0 * 0.6} x2={1075 + Math.cos(a) * (r0 + 60)} y2={760 + Math.sin(a) * (r0 + 60) * 0.6} stroke={K.RED_GLOW} strokeWidth={4} opacity={0.5} strokeLinecap="round" />;
      })}
      <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.005} glow={1.4} pulse={2} t={t} width={7} />
      <Glow x={1075} y={720} r={400} o={0.35} kind="red" />
    </g>
  );
};

// P1S32: pulled toward each other — bodies streaking inward, limbs flailing
export const P1S32: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeIn(clamp(t / (len * 0.8)));
  const alex = poseAt(t, [
    { f: 0, p: idle(lerp(960, 1030, p), lerp(900, 880, p), 1.05, { yaw: 0.4, look: -0.3, tilt: -6, spin: -8 * p, armL: { a: 60, b: -30 }, armR: { a: -20, b: 20 }, legL: { a: 30, b: -20 }, legR: { a: -30, b: 20 }, expr: 'dizzy' }) },
    { f: len, p: { tilt: -3, spin: -3 } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(lerp(1150, 1070, p), lerp(900, 880, p), 1.05, { yaw: -0.4, look: 0.3, tilt: 6, spin: 8 * p, armL: { a: -20, b: 20 }, armR: { a: 60, b: -30 }, legL: { a: -30, b: 20 }, legR: { a: 30, b: -20 }, expr: 'shock' }) },
    { f: len, p: { tilt: 3, spin: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1085]]), kf(t, [[0, 540], [len, 535]]), kf(t, [[0, 1.9], [len, 2.3]]))}>
      <Gate t={t} />
      {/* radial blur streaks */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={1075 + Math.cos(a) * 200} y1={760 + Math.sin(a) * 140} x2={1075 + Math.cos(a) * (200 + 90 * p)} y2={760 + Math.sin(a) * (140 + 60 * p)} stroke="#F4EEE0" strokeWidth={6} opacity={0.3 * p} strokeLinecap="round" />;
      })}
      <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.005} glow={1.6} pulse={2.5} t={t} width={8} />
      <Glow x={1075} y={700} r={450} o={0.4} kind="red" />
    </g>
  );
};

// P1S33: foreheads COLLIDE — impact frame: squash, shake, spark burst, stars
export const P1S33: React.FC<ShotProps> = ({ t, len }) => {
  const hitAt = len * 0.3;
  const p = clamp((t - hitAt) / 10);
  const alex = poseAt(t, [
    { f: 0, p: idle(1000, 890, 1.05, { yaw: 0.5, look: -0.4, tilt: -8, spin: -4, squash: 0.12, expr: 'shock' }) },
    { f: hitAt + 8, p: { x: 1040, y: 895, tilt: -2, spin: 0, squash: -0.08 }, ease: backOut },
    { f: len, p: { x: 1040, y: 895, squash: settle((t - hitAt - 8) / 30, 0.05) } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(1150, 890, 1.05, { yaw: -0.5, look: 0.4, tilt: 8, spin: 4, squash: 0.12, expr: 'shock' }) },
    { f: hitAt + 8, p: { x: 1110, y: 895, tilt: 2, spin: 0, squash: -0.08 }, ease: backOut },
    { f: len, p: { x: 1110, y: 895, squash: settle((t - hitAt - 8) / 30, 0.05) } },
  ]);
  const sh = shake(t, hitAt, 12, 14);
  // contact point between their faces
  const cx = 1075, cy = 700;
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1075]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.85], [len, 2.2]]))}>
      <Gate t={t} />
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'shock'], [hitAt + 6, 'dizzy']]) }} rimId="rimR" shadow={0.55} />
        <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [hitAt + 6, 'dizzy']]) }} rimId="rimR" shadow={0.55} />
      </g>
      {/* impact starburst */}
      {p < 1 && p > 0 ? (
        <g transform={`translate(${cx} ${cy}) scale(${0.4 + p * 1.6})`} opacity={1 - p}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M ${Math.cos(a) * 20} ${Math.sin(a) * 20} L ${Math.cos(a) * 70} ${Math.sin(a) * 70}`} stroke="#FFE9B0" strokeWidth={7} strokeLinecap="round" />;
          })}
          <circle r={26} fill="#FFF" opacity={0.8} />
        </g>
      ) : null}
      {/* the string slackens instantly — now a soft curve between them */}
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={lerp(0.005, 0.25, p)} glow={1} pulse={0} t={t} width={5} />
      <Glow x={1075} y={700} r={300} o={0.3} kind="red" />
    </g>
  );
};

// P1S34: "the strangest relationship of Alex's life began" — wide: the pair nose-to-nose, string slack, sunset
export const P1S34: React.FC<ShotProps> = ({ t, len }) => {
  const alex = poseAt(t, [
    { f: 0, p: idle(1013, 895, 1.0, { yaw: 0.45, look: -0.15, headTilt: -3, expr: 'dizzy' }) },
    { f: len * 0.5, p: { expr: 'worried', look: -0.1 } },
    { f: len, p: { expr: 'neutral' } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(1137, 895, 1.0, { yaw: -0.45, look: 0.15, headTilt: 3, expr: 'dizzy' }) },
    { f: len * 0.5, p: { expr: 'smug', look: 0.1 } },
    { f: len, p: { expr: 'neutral' } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1070]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Gate t={t} />
      {/* hearts drifting up — relationship energy */}
      {[0, 1, 2].map((i) => {
        const k = (t * 0.5 + i * 0.33) % 1;
        return (
          <path key={i} d={`M ${1000 + i * 80} ${640 - k * 160} c -8 -10 -20 -4 -15 6 c 3 6 15 12 15 12 c 0 0 12 -6 15 -12 c 5 -10 -7 -16 -15 -6 Z`} fill="#E86A92" opacity={(1 - k) * 0.7} />
        );
      })}
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'dizzy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'dizzy'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.55} />
      {/* string slack, swaying, warm */}
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.3 + Math.sin(t * 0.12) * 0.06} glow={0.85} pulse={0.3} t={t} width={4} />
      <Glow x={1075} y={700} r={350} o={0.2} kind="red" />
      <Tag x={960} y={160} t={t} text="...AND THAT'S HOW IT BEGAN" />
    </g>
  );
};

export const p1c4Shots: ShotMap = {
  P1S31, P1S32, P1S33, P1S34,
};
