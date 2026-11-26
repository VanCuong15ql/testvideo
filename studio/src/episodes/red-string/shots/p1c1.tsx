import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c1 — cold open: title card over the night bedroom, then the "imagine" demos:
// waking to find a red string on your little finger, pulling it (it stretches),
// cutting it (scissors pass through), the other end on your crush, and running
// can't escape. Ends on "an ordinary Monday".
//
// DESIGN — set: engine Bedroom (night, lamp, moon window) for the mystery; the string is
// the hero prop. Depth: bed midground, window/moon background, lamp foreground glow.
// Blocking: Alex sits up in bed centre-left; his right hand (little finger) anchors the
// string's near end. Keyframes: 4-6 pose keys/shot, camera push-ins, string sag/tension,
// scissors open/close, run cycle legs.

const {
  ALEX, MAYA, INK, Bedroom, bedSit, BedDuvet, DawnRoom, RedString, Scissors,
  TitleCard, Tag, Toast, FloatLabel, Glow, Say,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle, spring, shake, rnd,
  poseAt, faceAt, joints, toWorld, handR, pinky, idle, walkPose,
} = K;

/** Alex sitting up in the engine bedroom (duvet off for the shot, drawn by caller if needed). */
const AlexInBed: React.FC<{ pose: Pose; duvet?: boolean; t?: number }> = ({ pose, duvet = true, t = 0 }) => {
  const sit = bedSit(0.16);
  return (
    <g>
      <K.Hero look={ALEX} pose={{ ...pose, x: sit.x, y: sit.y, scale: sit.scale }} rimId="rimR" shadow={0.5} />
      {duvet ? <BedDuvet from={0.2} knees={0.4} kneeU={0.3} /> : null}
    </g>
  );
};

// P1S1: title over the dark bedroom — slow push in, lamp flicker, dust
export const P1S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len * 0.6, 930], [len, 915]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.0], [len, 1.0]]))}>
    <Bedroom t={t + 20} clock="07:02" lamp={0.9} />
    <TitleCard t={t} lines={['WHAT IF A RED STRING', 'CONNECTED YOU TO YOUR CRUSH?']} accent="RED STRING" accentT={40} y={170} size={86} />
    <Glow x={960} y={480} r={620} o={0.1} />
  </g>
);

// P1S2: waking up — Alex sits bolt upright, eyes on his left hand; tiny red thread glints
export const P1S2: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.16);
  const pose = poseAt(t, [
    { f: 0, p: idle(sit.x, sit.y, sit.scale, { yaw: 0.2, look: 0.5, headTilt: 6, armL: { a: 30, b: -20 }, armR: { a: 40, b: -20 }, expr: 'tired' }) },
    { f: len * 0.3, p: { yaw: 0.1, look: 0.2, headTilt: -4, armL: { a: 60, b: -30 }, armR: { a: 20, b: -10 }, squash: -0.06 }, ease: backOut },
    { f: len * 0.7, p: { look: 0.35, headTilt: 2, armL: { a: 70, b: -40 } } },
    { f: len, p: { look: 0.5, headTilt: 4 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const threadOn = clamp((t - len * 0.45) / 10);
  return (
    <g transform={camT(kf(t, [[0, 980], [len * 0.6, 965], [len, 950]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.35], [len, 1.35]]))}>
      <Bedroom t={t + 30} clock="07:02" lamp={0.9} duvet={false} />
      <AlexInBed pose={pose} duvet={false} t={t} />
      {/* the red thread on his little finger, glinting into view */}
      {threadOn > 0 ? (
        <g opacity={threadOn}>
          <circle cx={fp.x} cy={fp.y} r={5} fill={K.RED} />
          <RedString x1={fp.x} y1={fp.y} x2={fp.x + 60} y2={fp.y - 30} slack={0.5} glow={0.9} t={t} width={3} />
          <Glow x={fp.x} y={fp.y} r={90} o={0.4 * threadOn} kind="red" />
        </g>
      ) : null}
    </g>
  );
};

// P1S3: he pulls — the string stretches like elastic, his whole body leans back
export const P1S3: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.16);
  const pull = easeOut(clamp((t - 8) / 14));
  const pose = poseAt(t, [
    { f: 0, p: idle(sit.x, sit.y, sit.scale, { yaw: 0.15, look: 0.4, armL: { a: 55, b: -25 } }) },
    { f: len * 0.4, p: { armL: { a: 80, b: -50 }, tilt: -4, look: 0.3 } },
    { f: len, p: { armL: { a: 72, b: -44 }, tilt: -2 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const stretch = 40 + pull * 200;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.6], [len, 1.6]]))}>
      <Bedroom t={t + 40} clock="07:02" lamp={0.9} duvet={false} />
      <AlexInBed pose={pose} duvet={false} t={t} />
      {/* the string stretched taut toward frame right, vibrating */}
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + stretch} y2={fp.y - 50 - pull * 60} slack={0.08} glow={0.85} pulse={0.6} t={t} width={4} />
      {/* tension ticks at the far end */}
      {[0, 1, 2].map((i) => {
        const k = (t * 0.3 + i * 0.33) % 1;
        return <path key={i} d={`M ${fp.x + stretch - 20 - k * 30} ${fp.y - 60 - k * 20} l -14 -10`} stroke={K.RED_GLOW} strokeWidth={4} strokeLinecap="round" opacity={(1 - k) * 0.8} />;
      })}
      <FloatLabel x={fp.x + stretch * 0.6} y={fp.y - 140} t={t} text="STRETCH!" size={54} color={K.RED_GLOW} />
    </g>
  );
};

// P1S4: he grabs scissors — insert shot of the hand + scissors closing on the thread
export const P1S4: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.16);
  const pose = poseAt(t, [
    { f: 0, p: idle(sit.x, sit.y, sit.scale, { yaw: 0.2, look: 0.4, armL: { a: 60, b: -30 } }) },
    { f: len * 0.5, p: { armR: { a: 50, b: -30 }, look: 0.3 } },
    { f: len, p: { armR: { a: 45, b: -26 } } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const rp = handR({ ...pose });
  const snip = clamp((t - len * 0.55) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), kf(t, [[0, 500], [len, 490]]), kf(t, [[0, 2.2], [len, 2.2]]))}>
      <Bedroom t={t + 50} clock="07:02" lamp={0.9} duvet={false} />
      <AlexInBed pose={pose} duvet={false} t={t} />
      {/* scissors hovering at the thread */}
      <Scissors x={fp.x + 40} y={fp.y - 60} s={1.6} rot={-30 + snip * 20} open={snip > 0.5 ? 1 - snip : 0.4} />
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 90} y2={fp.y - 40} slack={0.2} glow={0.9} t={t} width={3.5} />
      <Tag x={960} y={180} t={t} text="ONE TRY" />
    </g>
  );
};

// P1S5: the scissors pass straight through — blades ghost through the thread, it stays whole
export const P1S5: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.16);
  const pose = poseAt(t, [
    { f: 0, p: idle(sit.x, sit.y, sit.scale, { yaw: 0.2, look: 0.4, armL: { a: 60, b: -30 } }) },
    { f: len * 0.4, p: { squash: 0.08 } },
    { f: len * 0.7, p: { squash: -0.05, look: 0.5, headTilt: 6 }, ease: backOut },
    { f: len, p: { look: 0.6, headTilt: 8 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const cutP = clamp((t - len * 0.3) / (len * 0.5));
  const scX = fp.x + 40 + cutP * 30;
  const scY = fp.y - 60 + Math.sin(cutP * Math.PI) * -14;
  return (
    <g transform={camT(kf(t, [[0, 890], [len, 875]]), kf(t, [[0, 490], [len, 482]]), kf(t, [[0, 2.4], [len, 2.4]]))}>
      <Bedroom t={t + 60} clock="07:02" lamp={0.9} duvet={false} />
      <AlexInBed pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.45, 'shock']]) }} duvet={false} t={t} />
      {/* scissors slicing through — the thread does NOT break, it just slides along the blades */}
      <Scissors x={scX} y={scY} s={1.7} rot={-50 + cutP * 90} open={0.2 + Math.sin(t * 0.5) * 0.1} />
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 140} y2={fp.y - 50} slack={0.25} glow={1} pulse={0.8} t={t} width={4} />
      {/* "pass through" ticks where blades crossed */}
      <FloatLabel x={fp.x + 90} y={fp.y - 130} t={t - len * 0.4} text="...THROUGH?" size={50} color="#8FD3FF" />
      <Glow x={fp.x + 90} y={fp.y - 40} r={160} o={0.3} kind="cool" />
    </g>
  );
};

// P1S6: the terrifying part — extreme close on his face, eyes wide, string glow reflecting
export const P1S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(960, 780, 1.5, { yaw: 0, look: 0.2, headTilt: 2 }) },
    { f: len * 0.5, p: { headTilt: -3, look: 0.4, squash: -0.04 } },
    { f: len, p: { headTilt: -1, look: 0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 700], [len, 690]]), kf(t, [[0, 2.6], [len, 2.6]]))}>
      {/* abstract dark bedroom hint */}
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={0} y={760} width={1920} height={320} fill="#1E1834" />
      <Glow x={960} y={520} r={500} o={0.2} kind="red" />
      <K.Hero look={ALEX} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.6} />
      {/* the red glow bleeding in from frame left — the string's pull */}
      <RedString x1={-40} y1={500} x2={880} y2={640} slack={0.3} glow={0.9} pulse={1} t={t} width={5} />
      <FloatLabel x={960} y={220} t={t} text="THE TERRIFYING PART..." size={58} color={K.RED_GLOW} />
    </g>
  );
};

// P1S7: the other end — the string reaches across the dark to a silhouette of a girl
export const P1S7: React.FC<ShotProps> = ({ t, len }) => {
  const girlBob = Math.sin(t * 0.1) * 4;
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1050]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.3], [len, 1.3]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* school hallway depth behind the reveal */}
      <HallwayHint t={t} />
      {/* Maya silhouette far right, lit by dusk window */}
      <g transform={`translate(1560 ${760 + girlBob}) scale(1.05)`} opacity={0.95}>
        <K.ShadowFigure x={0} y={0} s={1.6} flip={-1} mood="idle" t={t} opacity={0.95} />
      </g>
      <Glow x={1560} y={640} r={300} o={0.3} />
      {/* the string spanning the whole frame, taut, glowing */}
      <RedString x1={300} y1={700} x2={1540} y2={600} slack={0.05} glow={1} pulse={0.7} t={t} width={5} />
      <Tag x={960} y={180} t={t} text="THE OTHER END" />
      <FloatLabel x={960} y={960} t={t - 10} text="...IS YOUR CRUSH." size={60} color={K.RED_GLOW} />
    </g>
  );
};

const HallwayHint: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={0.5}>
    <rect x={300} y={0} width={1320} height={720} fill="#241F42" />
    <polygon points="0,0 640,300 1280,300 1920,0" fill="#1E1834" opacity={0.6} />
    <rect x={640} y={300} width={640} height={420} fill="#2E2850" opacity={0.7} />
    <rect x={668} y={430} width={140} height={290} fill="#38315E" opacity={0.8} />
    <rect x={1112} y={430} width={140} height={290} fill="#38315E" opacity={0.8} />
    {[840, 960, 1060].map((y) => {
      const xl = 640 - (y - 720) * 1.9;
      const xr = 1280 + (y - 720) * 1.9;
      return <line key={y} x1={xl} y1={y} x2={xr} y2={y} stroke="#0F0C1C" strokeWidth={3} opacity={0.6} />;
    })}
    <polygon points="0,1080 640,720 1280,720 1920,1080" fill="#171327" />
  </g>
);

// P1S8: no matter how far you run — Alex sprinting right-to-left, string stretching behind
export const P1S8: React.FC<ShotProps> = ({ t, len }) => {
  const runX = kf(t, [[0, 1500], [len, 500]], easeInOut);
  const pose = walkPose(runX, t * 0.385, 880, 1.0, { look: 0.4, expr: 'worried' }, -1);
  const fp = pinky({ ...pose }, 'R');
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 980]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.5], [len, 1.5]]))}>
      <DawnRoom t={t} dawn={0.8} />
      {/* motion streaks */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={runX + 120 + i * 60} y1={820 - i * 60} x2={runX + 260 + i * 80} y2={820 - i * 60} stroke="#F2B95C" strokeWidth={5} strokeLinecap="round" opacity={0.3 - i * 0.08} />
      ))}
      <K.Hero look={ALEX} pose={pose} rimId="rimR" shadow={0.55} />
      {/* the string whipping behind him, impossibly long */}
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 700 + Math.sin(t * 0.4) * 60} y2={fp.y - 120} slack={0.12} glow={0.9} pulse={0.5} t={t} width={4} />
      <FloatLabel x={960} y={200} t={t} text="HOW FAR YOU RUN..." size={54} color={K.RED_GLOW} />
    </g>
  );
};

// P1S9: still can't escape — he rounds a corner (gate), string snaps taut ahead of him
export const P1S9: React.FC<ShotProps> = ({ t, len }) => {
  const runX = kf(t, [[0, 300], [len, 1300]], easeInOut);
  const pose = walkPose(runX, t * 0.35 + 2, 880, 1.0, { look: 0.5, expr: 'dizzy' }, 1);
  const fp = pinky({ ...pose }, 'R');
  const taut = clamp((t - len * 0.55) / 12);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 1000]]), kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.45], [len, 1.45]]))}>
      <K.Gate t={t} />
      <K.Hero look={ALEX} pose={pose} rimId="rimR" shadow={0.55} />
      {/* the string now taut ahead — it IS the leash */}
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 900} y2={fp.y - 200} slack={lerp(0.4, 0.02, taut)} glow={0.95} pulse={taut} t={t} width={4.5} />
      {taut > 0.5 ? <FloatLabel x={960} y={950} t={t} text="...CAN'T ESCAPE HER." size={56} color={K.RED_GLOW} /> : null}
    </g>
  );
};

// P1S10: "It all started on an ordinary Monday" — calendar flip to a school morning
export const P1S10: React.FC<ShotProps> = ({ t, len }) => {
  const calFlip = easeInOut(clamp((t - len * 0.3) / 20));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.2], [len, 1.2]]))}>
      <DawnRoom t={t} dawn={0.5} />
      {/* big wall calendar flipping to MONDAY */}
      <g transform={`translate(960 480) scale(1.6) rotate(${-4 + calFlip * 3})`}>
        <rect x={-110} y={-130} width={220} height={260} rx={10} fill="#F4EEE0" stroke={INK} strokeWidth={6} />
        <rect x={-110} y={-130} width={220} height={52} rx={10} fill="#B4543F" />
        <text x={0} y={-94} textAnchor="middle" fontSize={34} fill="#FFF" fontFamily="Georgia, serif">MONDAY</text>
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => {
            const day = r * 6 + c + 1;
            const isMon = r === 0 && c === 0;
            return (
              <g key={`${r}${c}`}>
                <rect x={-88 + c * 32} y={-62 + r * 44} width={26} height={34} rx={3} fill={isMon ? '#F2B95C' : 'none'} stroke="#8A93AE" strokeWidth={2} opacity={0.9} />
                <text x={-75 + c * 32} y={-40 + r * 44} fontSize={15} fill={isMon ? '#B4543F' : '#5A5478'} fontWeight={isMon ? 700 : 400}>{day}</text>
              </g>
            );
          }),
        )}
        {/* red circle around Monday */}
        <ellipse cx={-62} cy={-45} rx={22} ry={26} fill="none" stroke={K.RED} strokeWidth={4} opacity={calFlip} transform="rotate(-8)" />
      </g>
      <Tag x={960} y={180} t={t} text="AN ORDINARY MONDAY" />
      <FloatLabel x={960} y={940} t={t - 6} text="...that wasn't." size={48} color={K.RED_GLOW} />
    </g>
  );
};

export const p1c1Shots: ShotMap = {
  P1S1, P1S2, P1S3, P1S4, P1S5, P1S6, P1S7, P1S8, P1S9, P1S10,
};
