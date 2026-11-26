import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c1 — cold open: title card, 10:15 Monday, Noah sketches a hamburger in the
// notebook corner, five seconds later a GIANT one lands on his desk, the class freezes,
// the teacher yells, Noah looks down then back up: "I think I just drew lunch."
//
// DESIGN NOTE — set: Classroom engine (chalkboard, dusk windows, desk rows, pinboard,
// clock) + ClsForeground (3 blurry classmates, bottom corners). Characters: NOAH behind
// SchoolDesk at (980,815); TEACHER (suit) at the board (1180,720); ETHAN (mo) at (690,800).
// Keyframes: 4-6 pose keys/shot, camera push-ins, prop motion = the notebook doodle,
// pencil, hamburger pop, steam, chalk dust.

const {
  NOAH, ETHAN, TEACHER, Cls, MathBoard, Note, Pencil, Hamburger, SchoolDesk,
  TitleCard, Tag, Toast, FloatLabel, Glow, AppearFx, Materialize,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle, spring, shake, rnd,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK, TEACHER_POS,
} = K;

/** Noah at his desk with the school desk occluding his legs. */
const NoahAtDesk: React.FC<{ pose: Pose; t?: number }> = ({ pose, t = 0 }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
  </g>
);

/** Pencil floating at a world point, angled like a held pencil. */
const PencilAt: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = -30, s = 1 }) => (
  <Pencil x={x} y={y} s={s} rot={rot} t={0} />
);

// P1S1: title over the empty classroom — slow push, lamp sway, chalk dust drifting
export const P1S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len * 0.55, 950], [len, 940]]), kf(t, [[0, 590], [len * 0.55, 575], [len, 562]]), kf(t, [[0, 0.95], [len, 1.04]]))}>
    <Cls t={t + 30} />
    <TitleCard t={t} lines={['WHAT IF EVERYTHING', 'YOU DREW BECAME REAL?']} accent="DREW" accentT={36} y={180} size={92} />
    {/* two students already in their seats for scale */}
    <K.Kid x={620} y={742} s={0.6} look={K.KIDS[0]} t={t} />
    <K.Kid x={1300} y={738} s={0.58} look={K.KIDS[3]} t={t + 9} />
    <Glow x={960} y={500} r={700} o={0.1} />
  </g>
);

// P1S2: 10:15 Monday — macro insert: the math notebook on the desk, pencil sketching the burger
export const P1S2: React.FC<ShotProps> = ({ t, len }) => {
  const doodle = clamp((t - 18) / 40);
  const px = 700 + kf(t, [[0, 0], [len * 0.6, 60], [len, 96]]);
  const py = 430 + Math.sin(t * 0.11) * 6;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* suggestion of the desk surface + classroom bokeh behind */}
      <rect x={0} y={760} width={1920} height={320} fill="#241E3C" />
      <rect x={120} y={140} width={300} height={380} rx={12} fill="#F2B95C" opacity={0.05} />
      <rect x={1500} y={180} width={280} height={340} rx={10} fill="#3E6FB8" opacity={0.06} />
      {/* the notebook, open, graph grid up */}
      <Note x={960} y={600} s={2.6} rot={-4} open={1} doodle={doodle > 0.85} t={t} />
      {/* the pencil mid-sketch, tip tracing the burger */}
      {doodle < 1 ? <PencilAt x={px} y={py} rot={-24 + Math.sin(t * 0.7) * 5} s={1.5} /> : null}
      {/* fresh pencil line drawing itself on the page */}
      <g stroke={SKETCH_LINE} strokeWidth={5} fill="none" strokeLinecap="round" opacity={doodle}>
        <path d="M 800 560 q 40 -22 80 0 q -40 18 -80 0 Z" />
        <path d="M 812 532 q 36 14 72 0" />
      </g>
      <Tag x={300} y={180} t={t} text="10:15 — MONDAY" />
      <Glow x={960} y={560} r={560} o={0.14} />
    </g>
  );
};
const SKETCH_LINE = '#8A7A5C';

// P1S3: doodle done — pencil lifts, the little burger sits in the notebook corner; beat of stillness
export const P1S3: React.FC<ShotProps> = ({ t, len }) => {
  const lift = easeOut(clamp((t - len * 0.45) / 18));
  return (
    <g transform={camT(kf(t, [[0, 955], [len, 940]]), kf(t, [[0, 555], [len, 548]]), kf(t, [[0, 2.0], [len, 2.12]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={0} y={760} width={1920} height={320} fill="#241E3C" />
      <rect x={120} y={140} width={300} height={380} rx={12} fill="#F2B95C" opacity={0.05} />
      <Note x={960} y={600} s={2.6} rot={-4} open={1} doodle t={t} />
      {/* pencil lifting away, drifting up-right */}
      <g transform={`translate(${120 + lift * 160} ${380 - lift * 200}) rotate(${-30 - lift * 40})`} opacity={1 - lift * 0.4}>
        <Pencil x={0} y={0} s={1.5} rot={0} t={t} />
      </g>
      {/* a tiny "drawn" burger inside the notebook, glowing faintly — the first hint */}
      <Hamburger x={1130} y={520} s={0.5} steam={0} />
      <Glow x={1130} y={520} r={140} o={0.12 + Math.sin(t * 0.2) * 0.03} />
    </g>
  );
};

// P1S4: five seconds later — back in the classroom, Noah mid-draw at his desk, pencil up
export const P1S4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.25, look: 0.4, headTilt: 4, armR: { a: 55, b: -20 } }) },
    { f: len * 0.5, p: { headTilt: 2, armR: { a: 40, b: -14 } } },
    { f: len, p: { look: 0.55, armR: { a: 30, b: -10 } } },
  ]);
  const j = joints({ ...pose });
  const rH = toWorld({ ...pose }, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len * 0.6, 985], [len, 970]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Cls t={t + 40} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) }} t={t} />
      {/* notebook open on the desk corner, doodle half-drawn */}
      <Note x={880} y={742} s={0.85} rot={-8} open={1} doodle={false} t={t} />
      <PencilAt x={rH.x} y={rH.y - 10} rot={pose.armR.a - 90} s={0.8} />
      {/* second-hands ticking on the wall clock */}
      <Tag x={1560} y={170} t={t} text="5 SECONDS LATER" />
      <Glow x={980} y={620} r={420} o={0.1} />
    </g>
  );
};

// P1S5: THE MOMENT — a giant hamburger materializes on the desk. Pop + ring + Noah flinches
export const P1S5: React.FC<ShotProps> = ({ t, len }) => {
  const popAt = len * 0.3;
  const p = clamp((t - popAt) / 14);
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.4, armR: { a: 30, b: -10 }, squash: 0 }) },
    { f: popAt, p: { squash: 0.12 } },
    { f: popAt + 8, p: { squash: -0.1, headTilt: -4 }, ease: backOut },
    { f: popAt + 20, p: { squash: settle((t - popAt - 8) / 30, 0.05), look: 0.3, expr: 'shock' } },
    { f: len, p: { look: 0.45 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [popAt, 985], [len, 965]]), kf(t, [[0, 580], [popAt, 576], [len, 560]]), kf(t, [[0, 1.5], [len, 1.68]]))}>
      <Cls t={t + 55} />
      <Hamburger x={NOAH_DESK} y={690} s={1.7} steam={t - popAt > 0 ? t - popAt : 0} />
      <AppearFx x={NOAH_DESK} y={680} p={p} r={150} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [popAt + 4, 'shock']]) }} t={t} />
      {/* a couple of classmates' heads turning */}
      <K.Kid x={640} y={742} s={0.6} look={K.KIDS[0]} turn={clamp((t - popAt) / 8)} t={t} />
      <Glow x={NOAH_DESK} y={640} r={380} o={0.12} />
    </g>
  );
};

// P1S6: he stared — medium on Noah frozen, burger in foreground edge, class behind
export const P1S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x - 60, NOAH_POS.y, NOAH_POS.s * 1.02, { yaw: 0.15, look: 0.5, headTilt: 3 }) },
    { f: len * 0.5, p: { headTilt: 1, look: 0.6 } },
    { f: len, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 885]]), kf(t, [[0, 640], [len, 628]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Cls t={t + 70} />
      {/* burger big in the near foreground, softly out of focus feel via low opacity glow */}
      <Hamburger x={1420} y={960} s={1.5} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]) }} t={t} />
      <Glow x={1420} y={880} r={300} o={0.1} />
    </g>
  );
};

// P1S7: classmates stared — row of kids mid-turn, teacher mid-sentence dying on his lips
export const P1S7: React.FC<ShotProps> = ({ t, len }) => {
  const teach = poseAt(t, [
    { f: 0, p: idle(TEACHER_POS.x, TEACHER_POS.y, TEACHER_POS.s, { yaw: -0.3, look: -0.4, armR: { a: 40, b: -20 }, headTilt: 4 }) },
    { f: len * 0.4, p: { armR: { a: 12, b: -6 }, headTilt: 8 }, ease: easeInOut },
    { f: len, p: { headTilt: 6, look: -0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 995]]), kf(t, [[0, 620], [len, 606]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Cls t={t + 80} />
      <K.Hero look={TEACHER} pose={{ ...teach, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.45} />
      {/* kids turning: three silhouettes lifting heads */}
      <K.Kid x={560} y={748} s={0.62} look={K.KIDS[1]} turn={clamp(t / 20)} t={t} />
      <K.Kid x={780} y={742} s={0.6} look={K.KIDS[2]} turn={clamp((t - 6) / 20)} t={t + 4} />
      <K.Kid x={1290} y={745} s={0.6} look={K.KIDS[4]} turn={clamp((t - 10) / 20)} t={t + 8} />
      <FloatLabel x={700} y={300} t={t} text="..." size={60} color="#8B7BB8" />
    </g>
  );
};

// P1S8: the teacher yells — low angle on the suit, arm shooting up, class silhouettes below
export const P1S8: React.FC<ShotProps> = ({ t, len }) => {
  const teach = poseAt(t, [
    { f: 0, p: idle(TEACHER_POS.x, TEACHER_POS.y - 10, TEACHER_POS.s * 1.05, { yaw: -0.2, look: -0.5, armL: { a: 20, b: -10 } }) },
    { f: 8, p: { armR: { a: 150, b: -10 }, headTilt: -6 }, ease: backOut },
    { f: 26, p: { armR: { a: 138, b: -6 }, headTilt: -3 } },
    { f: len, p: { armR: { a: 145, b: -8 } } },
  ]);
  const sh = shake(t, 6, 10, 6);
  return (
    <g transform={camT(kf(t, [[0, 1120], [len, 1100]]), kf(t, [[0, 640], [len, 622]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Cls t={t + 90} />
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <K.Hero look={TEACHER} pose={{ ...teach, ...faceAt(t, [[0, 'shock'], [10, 'worried']]) }} rimId="rimR" shadow={0.5} />
      </g>
      {/* shout ticks */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${1260 + i * 30} ${480 - i * 20} l 18 -22 M ${1260 + i * 30} ${480 - i * 20} l 30 -6`} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" opacity={clamp(1 - Math.abs(t - 12 - i * 3) / 10) * 0.8} />
      ))}
      <Toast x={960} y={180} t={t} text="ORDER IN THE COURT!" hold={30} />
    </g>
  );
};

// P1S9: Noah looks down at the notebook, then back at the burger — the guilty beat
export const P1S9: React.FC<ShotProps> = ({ t, len }) => {
  const mid = len * 0.45;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.55, headTilt: 4 }) },
    { f: mid, p: { headTilt: 14, look: 0.85, armL: { a: 30, b: -30 }, armR: { a: 24, b: -24 } } }, // down at the notebook
    { f: mid + 8, p: { headTilt: 14, look: 0.85 } },
    { f: len - 12, p: { headTilt: -2, look: 0.4, armL: { a: 14, b: -10 }, armR: { a: 18, b: -12 } }, ease: easeInOut }, // back up at the burger
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [mid, 958], [len, 950]]), kf(t, [[0, 620], [mid, 640], [len, 610]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t + 100} />
      <Hamburger x={NOAH_DESK} y={695} s={1.55} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [mid, 'oops'], [len - 14, 'worried']]) }} t={t} />
      {/* notebook in his left hand, dipping as he looks down */}
      <Note x={870} y={740} s={0.8} rot={-10} open={1} doodle t={t} />
      <Glow x={980} y={660} r={360} o={0.1} />
    </g>
  );
};

// P1S10: "I think I just drew lunch" — tight close-up, sheepish, burger soft behind
export const P1S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.1;
  const pose: Pose = {
    ...idle(980, 640 - K.HEAD.y * sc, sc, { yaw: 0.1, look: -0.2 }),
    ...faceAt(t, [[0, 'oops'], [len * 0.5, 'worried'], [len * 0.85, 'neutral']]),
    headTilt: Math.sin(t * 0.06) * 2,
    armL: { a: 16, b: -10 },
    armR: { a: 20, b: -12 },
  };
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 968]]), kf(t, [[0, 600], [len, 592]]), kf(t, [[0, 1], [len, 1.06]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* classroom ghosts behind */}
      <rect x={1350} y={160} width={340} height={400} rx={12} fill="#F2B95C" opacity={0.06} />
      <rect x={140} y={200} width={240} height={360} rx={8} fill="#3E6FB8" opacity={0.07} />
      {/* the burger, out-of-focus suggestion bottom-right */}
      <Hamburger x={1560} y={1010} s={1.2} steam={t} />
      <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={960} y={540} r={520} o={0.16} />
    </g>
  );
};

export const p1c1Shots: ShotMap = {
  P1S1, P1S2, P1S3, P1S4, P1S5, P1S6, P1S7, P1S8, P1S9, P1S10,
};
