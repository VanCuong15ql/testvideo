import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c2 — the cover story, the realization, the prank theory, and the red ball
// that rolls out of the notebook: proof. Ends on "so naturally, he decided to test it."
//
// DESIGN NOTE — same classroom set; new blocking: ETHAN (mo) at (690,800) for the prank
// theory, NOAH centre at his desk. Inserts: notebook macro for the ball test. Props:
// Note, Pencil, RedBall (rolling on a bezier off the page), Hamburger still on the desk.

const {
  NOAH, ETHAN, TEACHER, Cls, Note, Pencil, Hamburger, RedBall, SchoolDesk,
  Tag, Toast, FloatLabel, Glow, AppearFx, Materialize,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle, spring,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK,
} = K;

const NoahAtDesk: React.FC<{ pose: Pose; t?: number; burger?: boolean }> = ({ pose, t = 0, burger = true }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
    {burger ? <Hamburger x={NOAH_DESK} y={692} s={1.5} steam={t} /> : null}
  </g>
);

// P1S11: "I... I think I just drew lunch." — sheepish close-medium, burger behind his shoulder
export const P1S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x - 40, NOAH_POS.y, NOAH_POS.s * 1.05, { yaw: 0.3, look: -0.2, headTilt: 6 }) },
    { f: len * 0.4, p: { headTilt: 3, look: -0.1 } },
    { f: len, p: { armR: { a: 26, b: -14 }, headTilt: 1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 925]]), kf(t, [[0, 610], [len, 600]]), kf(t, [[0, 1.9], [len, 2.02]]))}>
      <Cls t={t + 110} />
      <Hamburger x={NOAH_DESK} y={690} s={1.5} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'oops'], [len * 0.5, 'worried'], [len * 0.8, 'neutral']]) }} t={t} burger={false} />
      {/* a stammer tick near his mouth */}
      {[0, 1].map((i) => (
        <circle key={i} cx={1080 + i * 34} cy={560 - i * 14} r={4 + i * 2} fill="#8B7BB8" opacity={clamp(0.7 - Math.abs(t - 20 - i * 9) / 8)} />
      ))}
      <Glow x={980} y={600} r={420} o={0.12} />
    </g>
  );
};

// P1S12: the moment of discovery — eyes widen, glow pulse, notebook + burger in frame
export const P1S12: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 0.5 + Math.sin(t * 0.12) * 0.5;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.4, headTilt: 2 }) },
    { f: len * 0.45, p: { headTilt: -5, look: 0.6 }, ease: easeOut }, // the "oh" lands
    { f: len, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 970], [len * 0.6, 955], [len, 940]]), kf(t, [[0, 595], [len, 580]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 125} />
      <Hamburger x={NOAH_DESK} y={690} s={1.55} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.4, 'shock'], [len * 0.75, 'neutral']]) }} t={t} burger={false} />
      <Note x={860} y={745} s={0.85} rot={-8} open={1} doodle t={t} />
      {/* realization rings around him */}
      <FocusRing x={NOAH_POS.x} y={NOAH_POS.y - 180} t={t} />
      <Glow x={NOAH_POS.x} y={620} r={480} o={0.1 + pulse * 0.06} />
    </g>
  );
};

const FocusRing: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const k = (t * 0.08) % 1;
  return <circle cx={x} cy={y} r={90 + k * 120} fill="none" stroke="#8FD3FF" strokeWidth={4} opacity={(1 - k) * 0.4} />;
};

// P1S13: "everything he drew could become real" — notebook doodles on the left, the burger answering on the right
export const P1S13: React.FC<ShotProps> = ({ t, len }) => {
  const draw = easeOut(clamp(t / 30));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.15], [len, 1.28]]))}>
      <Cls t={t + 140} />
      {/* giant notebook page suggestion, left */}
      <g transform={`translate(560 560) rotate(-5) scale(${1.9 * draw})`} opacity={draw}>
        <rect x={-260} y={-180} width={520} height={360} rx={16} fill={K.PAPER} stroke={K.INK} strokeWidth={8} />
        <rect x={-260} y={-180} width={520} height={360} rx={16} fill="#3E5A8C" opacity={0.25} />
        {[0, 1, 2].map((i) => <line key={i} x1={-230} y1={-120 + i * 90} x2={230} y2={-120 + i * 90} stroke="#B9C4D8" strokeWidth={4} />)}
        {/* doodle icons waking up one by one */}
        <Hamburger x={-90} y={-30} s={0.7} steam={t} />
        <RedBall x={90} y={20} r={30} t={t} />
        <g opacity={clamp((t - 30) / 15)}><K.BikeD x={30} y={120} s={0.5} t={t} /></g>
      </g>
      {/* the real burger answering on the right */}
      <Materialize x={1420} y={600} p={clamp((t - 20) / 14)} s={1.3}>
        <Hamburger x={1420} y={600} s={1.3} steam={t} />
      </Materialize>
      <AppearFx x={1420} y={600} p={clamp((t - 20) / 14)} r={140} />
      {/* dotted line: page -> world */}
      <path d="M 860 560 Q 1150 480 1300 570" stroke="#8B7BB8" strokeWidth={5} strokeDasharray="14 12" fill="none" opacity={0.6 * draw} />
      <Glow x={960} y={560} r={620} o={0.12} />
    </g>
  );
};

// P1S14: "at first he thought it was a joke" — Noah squints at the burger suspiciously
export const P1S14: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.55, headTilt: 3 }) },
    { f: len * 0.5, p: { look: 0.3, headTilt: 5, armR: { a: 34, b: -16 } } }, // reaching to poke it
    { f: len, p: { look: 0.4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 948]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Cls t={t + 155} />
      <Hamburger x={NOAH_DESK} y={692} s={1.5} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'neutral']]) }} t={t} burger={false} />
      <Glow x={980} y={620} r={400} o={0.1} />
    </g>
  );
};

// P1S15: "maybe someone placed it to prank him" — Ethan and a classmate sharing a look, pointing
export const P1S15: React.FC<ShotProps> = ({ t, len }) => {
  const ethan = poseAt(t, [
    { f: 0, p: idle(K.ETHAN_POS.x, K.ETHAN_POS.y, K.ETHAN_POS.s, { yaw: 0.5, look: 0.6, armR: { a: 20, b: -12 } }) },
    { f: len * 0.5, p: { armR: { a: 46, b: -18 }, headTilt: 4 } }, // the "psh, it's a prank" gesture
    { f: len, p: { armR: { a: 30, b: -14 } } },
  ]);
  const cm = poseAt(t, [
    { f: 0, p: idle(K.CLASSMATE_POS.x, K.CLASSMATE_POS.y, K.CLASSMATE_POS.s, { yaw: -0.5, look: -0.5 }) },
    { f: len * 0.6, p: { headTilt: -4, armL: { a: 30, b: -20 } } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 885]]), kf(t, [[0, 640], [len, 628]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Cls t={t + 165} />
      {/* the burger small on Noah's desk far left */}
      <Hamburger x={NOAH_DESK} y={700} s={1.1} steam={t} />
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.5, ...faceAt(t, [[0, 'worried']]) })} t={t} burger={false} />
      <K.Hero look={ETHAN} pose={{ ...ethan, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={K.CLASSMATE} pose={{ ...cm, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.4} />
      {/* conspiratorial whisper ticks between them */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${800 + i * 26} ${560 - i * 10} q 10 -8 20 0`} stroke="#8B7BB8" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.5 + Math.sin(t * 0.3 + i) * 0.2} />
      ))}
      <Glow x={960} y={620} r={460} o={0.1} />
    </g>
  );
};

// P1S16: "but then he grabbed his pencil" — hand close-up reaching for the pencil on the desk
export const P1S16: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp(t / 16));
  const hx = lerp(1350, 1080, reach);
  const hy = lerp(820, 760, reach) + Math.sin(t * 0.3) * 3;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 700], [len, 680]]), kf(t, [[0, 2.6], [len, 2.9]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* desk surface suggestion */}
      <rect x={0} y={820} width={1920} height={260} fill="#3A2C22" />
      <rect x={0} y={800} width={1920} height={22} fill="#4A3A2C" />
      {/* notebook + burger small on the desk */}
      <Note x={700} y={790} s={1.1} rot={-6} open={1} doodle t={t} />
      <Hamburger x={560} y={760} s={0.9} steam={t} />
      {/* Noah's arm + hand entering from right, grabbing the pencil */}
      <g>
        <path d={`M 1500 900 Q ${hx + 160} ${hy + 120} ${hx + 60} ${hy + 40}`} stroke={K.NOAH.jacket} strokeWidth={34} fill="none" strokeLinecap="round" />
        <circle cx={hx} cy={hy} r={20} fill={K.NOAH.skin} stroke={K.INK} strokeWidth={3} />
      </g>
      <Pencil x={hx + 30} y={hy + 6} s={1.1} rot={-12} t={t} />
      <Glow x={1000} y={700} r={500} o={0.13} />
    </g>
  );
};

// P1S17: "drew a small red ball" — macro: pencil draws a circle on the page, sketch becomes solid
export const P1S17: React.FC<ShotProps> = ({ t, len }) => {
  const draw = easeOut(clamp(t / 22));
  const pop = clamp((t - len * 0.6) / 12);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 2.2], [len, 2.35]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={0} y={780} width={1920} height={300} fill="#241E3C" />
      <Note x={960} y={590} s={2.4} rot={-3} open={1} doodle={false} t={t} />
      {/* the circle sketch drawing itself */}
      <circle cx={960} cy={560} r={90} fill="none" stroke={K.SKETCH} strokeWidth={7} strokeDasharray={`${draw * 570} 570`} strokeLinecap="round" transform="rotate(-90 960 560)" />
      {/* pencil tip tracing */}
      {draw < 1 ? <Pencil x={960 + Math.cos(draw * Math.PI * 2 - Math.PI / 2) * 90} y={560 + Math.sin(draw * Math.PI * 2 - Math.PI / 2) * 90 - 16} s={1.2} rot={draw * 360 - 90} t={t} /> : null}
      {/* the ball pops solid */}
      <Materialize x={960} y={560} p={pop} s={1}>
        <RedBall x={960} y={560} r={62} t={t} />
      </Materialize>
      <AppearFx x={960} y={560} p={pop} r={110} color="#D9534F" />
    </g>
  );
};

// P1S18: "watched it roll right out of the notebook" — the ball tips off the page edge and bounces away
export const P1S18: React.FC<ShotProps> = ({ t, len }) => {
  const roll = easeInOut(clamp(t / (len * 0.7)));
  const bx = lerp(960, 1560, roll);
  const by = 700 - Math.sin(roll * Math.PI) * 260 + roll * roll * 120;
  const rot = roll * 540;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 940]]), kf(t, [[0, 590], [len, 560]]), kf(t, [[0, 1.6], [len, 1.85]]))}>
      <Cls t={t + 175} />
      {/* notebook on desk, ball half-out */}
      <Note x={880} y={745} s={0.9} rot={-6} open={1} doodle t={t} />
      <g transform={`translate(${bx} ${by}) rotate(${rot})`}>
        <RedBall x={0} y={0} r={34} t={t} />
      </g>
      {/* motion streaks */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${bx - 60 - i * 26} ${by - 10 + i * 10} q 30 -6 60 0`} stroke="#FFE9B0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={clamp(0.7 - roll * 0.3)} />
      ))}
      {/* Noah tracking it */}
      <NoahAtDesk pose={{
        ...poseAt(t, [
          { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: -0.2, look: -0.7 }) },
          { f: len * 0.5, p: { look: -0.9, headTilt: 6 } },
          { f: len, p: { look: -0.5 } },
        ]),
        ...faceAt(t, [[0, 'shock'], [len * 0.7, 'worried']]),
      }} t={t} burger={false} />
      <Hamburger x={NOAH_DESK} y={695} s={1.4} steam={t} />
      <Glow x={1200} y={600} r={420} o={0.1} />
    </g>
  );
};

// P1S19: "Okay. That was impossible." — tight close-up, ball bouncing in foreground
export const P1S19: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.0;
  const bounce = Math.abs(Math.sin(t * 0.5)) * 60;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 966]]), kf(t, [[0, 600], [len, 592]]), kf(t, [[0, 1], [len, 1.07]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={1300} y={180} width={320} height={380} rx={10} fill="#F2B95C" opacity={0.06} />
      {/* the ball bouncing past camera */}
      <g transform={`translate(1560 ${980 - bounce}) scale(${1.6})`}>
        <RedBall x={0} y={0} r={30} t={t} />
      </g>
      <K.Hero look={NOAH} pose={{
        ...idle(960, 640 - K.HEAD.y * sc, sc, { yaw: 0.15, look: -0.4 }),
        ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]),
        headTilt: 3,
      }} rimId="rimR" shadow={0} />
      <Glow x={960} y={540} r={520} o={0.15} />
    </g>
  );
};

// P1S20: "so naturally, he decided to test it" — determined Noah, notebook open, pencil raised like a scientist
export const P1S20: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.4, headTilt: -2, armR: { a: 60, b: -30 } }) },
    { f: len * 0.55, p: { headTilt: 0, armR: { a: 48, b: -24 } }, ease: easeOut },
    { f: len, p: { look: 0.55, armL: { a: 20, b: -16 } } },
  ]);
  const j = joints(pose);
  const rH = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 970], [len, 950]]), kf(t, [[0, 590], [len, 578]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Cls t={t + 190} />
      <Hamburger x={NOAH_DESK} y={692} s={1.4} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'cool'], [len * 0.85, 'smug']]) }} t={t} burger={false} />
      {/* blank notebook waiting, pencil hovering — the test begins */}
      <Note x={870} y={744} s={0.85} rot={-6} open={1} doodle={false} t={t} />
      <Pencil x={rH.x} y={rH.y - 12} s={0.85} rot={pose.armR.a - 80} t={t} />
      <Tag x={1560} y={180} t={t} text="EXPERIMENT 1" />
      <Glow x={980} y={620} r={440} o={0.11} />
    </g>
  );
};

export const p1c2Shots: ShotMap = {
  P1S11, P1S12, P1S13, P1S14, P1S15, P1S16, P1S17, P1S18, P1S19, P1S20,
};
