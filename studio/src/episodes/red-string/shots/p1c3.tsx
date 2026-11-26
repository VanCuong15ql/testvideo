import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c3 — the school gate: Alex follows the thread out, and THERE is Maya —
// the girl he's liked for a year — with the red string tied to HER little finger.
// "Alex... why is there a red string connecting us?" Then it tightens.
//
// DESIGN — set: Gate (dusk sky, school facade, pillars, fence, street). Depth:
// building/fence background, gate midground, Alex+Maya foreground pair. The string
// is drawn between their pinkies — the money shot of the episode so far.
// Blocking: Maya left third, Alex right third, string sagging between them.

const {
  ALEX, MAYA, Gate, RedString,
  Tag, FloatLabel, Glow, Say, Toast,
  camT, kf, clamp, lerp, easeOut, easeInOut, easeIn, backOut, settle, spring, shake,
  poseAt, faceAt, joints, toWorld, handR, handL, pinky, idle, walkPose,
} = K;

const AlexAt = (x: number, y: number, s: number, extra: Partial<Pose> = {}) =>
  idle(x, y, s, { yaw: 0, look: 0, ...extra });

// P1S21: wide on the gate — Alex arrives following the thread; Maya waits near the pillars
export const P1S21: React.FC<ShotProps> = ({ t, len }) => {
  const enter = easeInOut(clamp((t - 4) / 26));
  const ax = lerp(300, 760, enter);
  const pose = walkPose(ax, t * 0.45, 900, 0.95, { look: 0.5, expr: 'worried' }, 1);
  const fp = pinky({ ...pose }, 'L');
  const maya = poseAt(t, [
    { f: 0, p: idle(1330, 900, 0.95, { yaw: -0.3, look: -0.4, armL: { a: 20, b: -10 } }) },
    { f: len * 0.6, p: { look: -0.5, headTilt: 2 } },
    { f: len, p: { look: -0.55 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Gate t={t} />
      {/* Maya by the right pillar, hands in pockets-ish */}
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={pose} rimId="rimR" shadow={0.55} />
      {/* the string: from his pinky across to HER hand — the reveal */}
      <RedString x1={fp.x} y1={fp.y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.3} glow={0.9} pulse={0.4} t={t} width={4} />
      <Glow x={1050} y={700} r={400} o={0.12} kind="red" />
    </g>
  );
};

// P1S22: closer — Maya notices him, turns; the string between them catches the light
export const P1S22: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(1250, 900, 1.0, { yaw: -0.35, look: -0.5, armL: { a: 15, b: -8 } }) },
    { f: len * 0.5, p: { yaw: -0.15, look: -0.2, armL: { a: 30, b: -15 }, headTilt: 3 }, ease: easeInOut },
    { f: len, p: { look: -0.1, headTilt: 1 } },
  ]);
  const alex = poseAt(t, [
    { f: 0, p: idle(820, 900, 0.98, { yaw: 0.2, look: 0.4, expr: 'worried' }) },
    { f: len * 0.5, p: { look: 0.15, headTilt: 4 } },
    { f: len, p: { look: 0.1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1010]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Gate t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.28} glow={1} pulse={0.6} t={t} width={4.5} />
      <Glow x={1030} y={720} r={300} o={0.2} kind="red" />
    </g>
  );
};

// P1S23: "the girl he had secretly liked for almost a year" — Maya close-up, soft dusk light
export const P1S23: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(960, 900, 1.35, { yaw: -0.1, look: -0.3, headTilt: 2, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }) },
    { f: len * 0.6, p: { look: -0.1, headTilt: 0 } },
    { f: len, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Gate t={t} />
      {/* Maya big in frame, Alex a shoulder at left edge */}
      <g transform="translate(620 900) scale(0.9)" opacity={0.9}>
        <K.Hero look={ALEX} pose={idle(0, 0, 1, { yaw: 0.4, look: 0.6, expr: 'worried' })} rimId="rimR" shadow={0.4} />
      </g>
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.6} />
      {/* her hand — the string's other end tied to her pinky, in close view */}
      <RedString x1={620} y1={820} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.22} glow={1} pulse={0.5} t={t} width={5} />
      <Tag x={960} y={170} t={t} text="...THE GIRL HE LIKED" />
      <Glow x={1100} y={650} r={350} o={0.2} kind="red" />
    </g>
  );
};

// P1S24: insert — macro on HER little finger: the thread's knot, same red as his
export const P1S24: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(960, 900, 1.2, { yaw: -0.15, look: -0.4, armR: { a: 50, b: -30 } }) },
    { f: len, p: { armR: { a: 55, b: -34 }, look: -0.45 } },
  ]);
  const fp = pinky({ ...maya }, 'R');
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), kf(t, [[0, 640], [len, 630]]), kf(t, [[0, 3.0], [len, 3.2]]))}>
      <Gate t={t} />
      <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.6} />
      {/* knot on her pinky + thread leaving frame left toward Alex */}
      <g transform={`translate(${fp.x} ${fp.y}) rotate(-15)`}>
        <ellipse rx={15} ry={9} fill="none" stroke={K.RED} strokeWidth={4} />
        <circle r={6} fill={K.RED_DARK} />
      </g>
      <RedString x1={fp.x - 10} y1={fp.y - 6} x2={600} y2={700} slack={0.25} glow={1} pulse={0.7} t={t} width={5} />
      <Glow x={fp.x} y={fp.y} r={140} o={0.5} kind="red" />
      <FloatLabel x={1300} y={280} t={t} text="HER. little finger." size={44} color={K.RED_GLOW} />
    </g>
  );
};

// P1S25: Maya looks down at her hand — close on her face + hand dropping into view
export const P1S25: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(960, 900, 1.3, { yaw: -0.1, look: -0.2, armR: { a: 15, b: -8 }, headTilt: 2 }) },
    { f: len * 0.55, p: { armR: { a: 55, b: -32 }, look: 0.3, headTilt: 10 }, ease: easeInOut },
    { f: len, p: { look: 0.35, headTilt: 8 } },
  ]);
  const fp = pinky({ ...maya }, 'R');
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.85], [len, 2.0]]))}>
      <Gate t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.6} />
      {/* her hand drops into frame bottom, pinky knot visible */}
      <g transform={`translate(${fp.x} ${fp.y})`}>
        <ellipse rx={14} ry={9} fill="none" stroke={K.RED} strokeWidth={4} transform="rotate(-15)" />
        <circle r={5.5} fill={K.RED_DARK} />
      </g>
      <RedString x1={fp.x} y1={fp.y} x2={560} y2={760} slack={0.2} glow={0.95} pulse={0.5} t={t} width={4.5} />
    </g>
  );
};

// P1S26: she looks at Alex — his POV-ish reverse, her eyes finding him
export const P1S26: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(960, 900, 1.3, { yaw: -0.15, look: 0.4, headTilt: 4 }) },
    { f: len * 0.5, p: { yaw: -0.05, look: 0.1, headTilt: 1 } },
    { f: len, p: { look: 0.05 } },
  ]);
  const alex = idle(620, 900, 0.85, { yaw: 0.45, look: -0.6, expr: 'worried' });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Gate t={t} />
      <g transform="translate(620 900) scale(0.85)" opacity={0.9}>
        <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.4} />
      </g>
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.6} />
      {/* string between them, swaying gently */}
      <RedString x1={pinky(alex, 'L').x} y1={pinky(alex, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.3 + Math.sin(t * 0.15) * 0.05} glow={0.9} pulse={0.5} t={t} width={4} />
      <Glow x={1030} y={700} r={280} o={0.15} kind="red" />
    </g>
  );
};

// P1S27: back at the string — Maya's double-take, then the question (bubble)
export const P1S27: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: idle(1050, 900, 1.25, { yaw: -0.2, look: -0.5, armR: { a: 40, b: -25 }, headTilt: 4 }) },
    { f: len * 0.4, p: { armR: { a: 55, b: -35 }, look: -0.55, headTilt: 6 } },
    { f: len, p: { armR: { a: 50, b: -30 }, look: -0.5 } },
  ]);
  const alex = idle(700, 900, 0.9, { yaw: 0.35, look: 0.55, expr: 'worried' });
  return (<>
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 550], [len, 540]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Gate t={t} />
      <g transform="translate(700 900) scale(0.9)" opacity={0.9}>
        <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [len * 0.8, 'worried']]) }} rimId="rimR" shadow={0.4} />
      </g>
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <RedString x1={pinky(alex, 'L').x} y1={pinky(alex, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.22} glow={1} pulse={0.6} t={t} width={4.5} />
    </g>
    <Say x={1180} y={250} tx={1120} ty={520} text="Alex... why is there a red string connecting us?" at={10} until={len - 8} t={t} maxW={620} fs={40} />
  </>);
};

// P1S28: Alex has no answer — mouth open, hands up slightly, the string vibrating between them
export const P1S28: React.FC<ShotProps> = ({ t, len }) => {
  const alex = poseAt(t, [
    { f: 0, p: idle(880, 900, 1.0, { yaw: 0.2, look: -0.3, armL: { a: 25, b: -15 }, armR: { a: 25, b: -15 }, headTilt: 5 }) },
    { f: len * 0.5, p: { armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 }, headTilt: 8 }, ease: easeInOut },
    { f: len, p: { headTilt: 5 } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(1250, 900, 1.0, { yaw: -0.2, look: -0.4 }) },
    { f: len, p: { look: -0.35 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 550], [len, 540]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
      <Gate t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.18} glow={1} pulse={0.8} t={t} width={5} />
      <FloatLabel x={960} y={220} t={t} text="...no answer." size={50} color="#8B7BB8" />
    </g>
  );
};

// P1S29: Alex had absolutely no answer — his blank face, string still humming between them
export const P1S29: React.FC<ShotProps> = ({ t, len }) => {
  const alex = poseAt(t, [
    { f: 0, p: idle(900, 900, 1.15, { yaw: 0.15, look: -0.4, headTilt: 3, armL: { a: 20, b: -10 }, armR: { a: 30, b: -18 } }) },
    { f: len * 0.6, p: { headTilt: 6, look: -0.5 } },
    { f: len, p: { headTilt: 4 } },
  ]);
  const maya = idle(1240, 900, 1.05, { yaw: -0.2, look: -0.45 });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Gate t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.55} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'shock'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky(maya, 'R').x} y2={pinky(maya, 'R').y} slack={0.2} glow={0.9} pulse={0.9} t={t} width={5} />
      {/* "..." bubble over Alex */}
      <FloatLabel x={900} y={330} t={t} text="..." size={80} color={K.PAPER} />
    </g>
  );
};

// P1S30: the string suddenly tightens — whip pan energy, both jolted toward each other
export const P1S30: React.FC<ShotProps> = ({ t, len }) => {
  const yankAt = len * 0.35;
  const alex = poseAt(t, [
    { f: 0, p: idle(900, 900, 1.05, { yaw: 0.15, look: -0.4, expr: 'worried' }) },
    { f: yankAt, p: { x: 1010, y: 898, squash: 0.1, tilt: -3, look: -0.2 }, ease: easeIn },
    { f: yankAt + 10, p: { x: 1000, y: 902, squash: -0.06, tilt: 2 }, ease: backOut },
    { f: len, p: { x: 1005, y: 900, tilt: 1 } },
  ]);
  const maya = poseAt(t, [
    { f: 0, p: idle(1250, 900, 1.05, { yaw: -0.2, look: -0.5 }) },
    { f: yankAt, p: { x: 1140, y: 898, squash: 0.1, tilt: 3 }, ease: easeIn },
    { f: yankAt + 10, p: { x: 1150, y: 902, squash: -0.06, tilt: -2 }, ease: backOut },
    { f: len, p: { x: 1145, y: 900, tilt: -1 } },
  ]);
  const sh = shake(t, yankAt, 10, 12);
  const tight = clamp((t - yankAt) / 8);
  return (
    <g transform={camT(kf(t, [[0, 1010], [yankAt, 1000], [len, 1060]]), kf(t, [[0, 555], [len, 545]]), kf(t, [[0, 1.7], [len, 1.95]]))}>
      <Gate t={t} />
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [yankAt, 'shock']]) }} rimId="rimR" shadow={0.55} />
        <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'worried'], [yankAt, 'shock']]) }} rimId="rimR" shadow={0.55} />
      </g>
      {/* the string SLAMS taut — vibration lines */}
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={lerp(0.2, 0.01, tight)} glow={1} pulse={tight * 1.5} t={t} width={6} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${980 + i * 24} ${640 - i * 16} l ${14 + tight * 10} -18`} stroke={K.RED_GLOW} strokeWidth={4} strokeLinecap="round" opacity={tight * (1 - i * 0.2)} />
      ))}
      <FloatLabel x={960} y={200} t={t - yankAt} text="SNAP!" size={70} color={K.RED_GLOW} />
    </g>
  );
};

export const p1c3Shots: ShotMap = {
  P1S21, P1S22, P1S23, P1S24, P1S25, P1S26, P1S27, P1S28, P1S29, P1S30,
};
