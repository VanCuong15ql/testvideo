import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c3 — the test montage: smartphone, sneakers, crown; then the royal bit with
// the teacher; then the lunch discoveries — the car drives, the watch ticks, the dog barks.
//
// DESIGN NOTE — same classroom. Each demo follows the grammar: pencil gesture ->
// Materialize pop (spring + ring + ticks) -> the thing works (screen glow, wheels, wag).
// Blocking: NOAH at desk (980,815); TEACHER approaches from the board side (1050->1180).
// Props on desks/floor at fixed world spots for continuity.

const {
  NOAH, TEACHER, Cls, Note, Pencil, Hamburger, PhoneD, Sneakers, Crown,
  CarD, WatchD, DogD, SchoolDesk, Tag, Toast, FloatLabel, Glow, AppearFx, Materialize, Say,
  camT, kf, clamp, lerp, easeOut, easeInOut, easeIn, backOut, settle, spring,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK, TEACHER_POS,
} = K;

const NoahAtDesk: React.FC<{ pose: Pose; t?: number; burger?: boolean }> = ({ pose, t = 0, burger = true }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
    {burger ? <Hamburger x={NOAH_DESK} y={692} s={1.45} steam={t} /> : null}
  </g>
);

/** A pencil in Noah's raised right hand. */
const DrawHand: React.FC<{ pose: Pose }> = ({ pose }) => {
  const j = joints(pose);
  const h = toWorld(pose, j.armR.end);
  return <Pencil x={h.x} y={h.y - 14} s={0.85} rot={pose.armR.a - 80} t={0} />;
};

// P1S21: "first, he drew a brand-new smartphone" — pencil sketch, phone pops onto the desk
export const P1S21: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.55) / 12);
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.25, look: 0.5, headTilt: 3, armR: { a: 62, b: -28 } }) },
    { f: len * 0.4, p: { armR: { a: 50, b: -22 }, headTilt: 1 } },
    { f: len * 0.55, p: { look: 0.4, headTilt: -2 }, ease: easeOut },
    { f: len, p: { armR: { a: 24, b: -14 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.55], [len, 1.72]]))}>
      <Cls t={t + 200} />
      <Hamburger x={NOAH_DESK} y={692} s={1.4} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} t={t} burger={false} />
      {/* the phone materializes on the desk, right of the burger */}
      <Materialize x={1150} y={640} p={pop} s={1}>
        <PhoneD x={1150} y={640} s={1.15} t={t} />
      </Materialize>
      <AppearFx x={1150} y={640} p={pop} r={110} color="#8FD3FF" />
      <DrawHand pose={pose} />
      <Glow x={1050} y={620} r={420} o={0.11} />
    </g>
  );
};

// P1S22: "it appeared instantly" — insert on the phone: screen lights, glow pulse
export const P1S22: React.FC<ShotProps> = ({ t, len }) => {
  const flick = 0.7 + Math.sin(t * 0.4) * 0.3;
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1140]]), kf(t, [[0, 640], [len, 628]]), kf(t, [[0, 2.4], [len, 2.6]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={0} y={820} width={1920} height={260} fill="#2E2850" />
      <rect x={0} y={800} width={1920} height={20} fill="#3A3260" />
      {/* burger + phone lineup on the desk */}
      <Hamburger x={820} y={760} s={1.0} steam={t} />
      <PhoneD x={1180} y={720} s={1.9} t={t} />
      {/* screen glow spilling */}
      <Glow x={1180} y={720} r={300} o={0.16 * flick} kind="cool" />
      {/* notification dots popping */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1140 + i * 30} y={690} width={18} height={10} rx={4} fill="#8FD3FF" opacity={clamp((t - 10 - i * 8) / 8) * flick} />
      ))}
      <Tag x={300} y={170} t={t} text="INSTANT" />
    </g>
  );
};

// P1S23: "a pair of expensive sneakers" — they drop from above and land beside the desk
export const P1S23: React.FC<ShotProps> = ({ t, len }) => {
  const drop = clamp(t / 20);
  const land = t > 20 ? settle((t - 20) / 26, 0.12) : 0;
  const sy = lerp(-300, 0, easeIn(drop)) + land * 40;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.6, armR: { a: 66, b: -30 }, headTilt: 4 }) },
    { f: len * 0.5, p: { look: 0.45, headTilt: 1 } },
    { f: len, p: { armR: { a: 30, b: -16 }, look: 0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 970]]), kf(t, [[0, 590], [len, 575]]), kf(t, [[0, 1.5], [len, 1.68]]))}>
      <Cls t={t + 215} />
      <Hamburger x={NOAH_DESK} y={692} s={1.4} steam={t} />
      <PhoneD x={1150} y={648} s={0.95} t={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) }} t={t} burger={false} />
      {/* sneakers falling from above, landing beside the desk */}
      <g transform={`translate(760 ${860 + sy})`} opacity={clamp(drop * 2)}>
        <Sneakers x={0} y={0} s={1.5} rot={-6} />
      </g>
      {t > 18 && t < 40 ? <AppearFx x={760} y={880} p={clamp((t - 18) / 14)} r={120} /> : null}
      <DrawHand pose={pose} />
      <Glow x={960} y={620} r={440} o={0.11} />
    </g>
  );
};

// P1S24: "they landed perfectly beside his desk" — low angle, sneakers foreground, Noah beaming
export const P1S24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.25, look: 0.5, headTilt: -3 }) },
    { f: len * 0.5, p: { headTilt: -6, look: 0.6 } },
    { f: len, p: { armR: { a: 40, b: -18 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 885]]), kf(t, [[0, 660], [len, 640]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t + 230} />
      {/* sneakers big in the foreground, soft */}
      <Sneakers x={620} y={1010} s={2.1} rot={4} />
      <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
      <PhoneD x={1150} y={650} s={0.9} t={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len * 0.8, 'cool']]) }} t={t} burger={false} />
      <Glow x={960} y={600} r={460} o={0.12} />
    </g>
  );
};

// P1S25: "next, he drew a little golden crown and placed it on his head" — crown pops, lands on his head
export const P1S25: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.35) / 12);
  const settleK = t > len * 0.35 + 12 ? settle((t - len * 0.35 - 12) / 24, 0.05) : 0;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.25, look: 0.5, armR: { a: 70, b: -30 }, headTilt: 5 }) },
    { f: len * 0.4, p: { look: 0.55, headTilt: 2 }, ease: easeOut }, // feels it land
    { f: len, p: { headTilt: 0, armR: { a: 20, b: -12 } } },
  ]);
  const headTop = toWorld({ ...pose }, { x: 0, y: K.HEAD.y - 66 });
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 930]]), kf(t, [[0, 580], [len, 560]]), kf(t, [[0, 1.7], [len, 1.9]]))}>
      <Cls t={t + 245} />
      <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
      <PhoneD x={1150} y={650} s={0.85} t={t} />
      <Sneakers x={640} y={985} s={1.5} rot={3} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.55, 'smug']]) }} t={t} burger={false} />
      {/* the crown lands on his head */}
      <g transform={`translate(0 ${settleK * 30})`}>
        <Materialize x={headTop.x} y={headTop.y - 10} p={pop} s={0.85} rot={-4}>
          <Crown x={headTop.x} y={headTop.y - 10} s={0.85} rot={-4} t={t} />
        </Materialize>
        <AppearFx x={headTop.x} y={headTop.y - 10} p={pop} r={90} />
      </g>
      <Glow x={NOAH_POS.x} y={560} r={380} o={0.13} />
    </g>
  );
};

// P1S26: "Your Majesty, the homework is due today." — Noah the king, chin up, teacher approaching
export const P1S26: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.1, look: -0.3, headTilt: -6, armL: { a: 30, b: -20 } }) },
    { f: len * 0.5, p: { headTilt: -8, look: -0.4 } }, // regal nod
    { f: len, p: { armL: { a: 44, b: -22 } } }, // beckoning dismissively
  ]);
  const headTop = toWorld({ ...pose }, { x: 0, y: K.HEAD.y - 66 });
  return (<>
    <g transform={camT(kf(t, [[0, 980], [len, 962]]), kf(t, [[0, 600], [len, 586]]), kf(t, [[0, 1.75], [len, 1.9]]))}>
      <Cls t={t + 260} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <PhoneD x={1150} y={652} s={0.8} t={t} />
      <Sneakers x={640} y={985} s={1.45} rot={3} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'cool']]) }} t={t} burger={false} />
      <Crown x={headTop.x} y={headTop.y - 12} s={0.85} rot={-4} t={t} />
      {/* teacher entering from the right, dossier under arm */}
      <K.Hero look={TEACHER} pose={{
        ...poseAt(t, [
          { f: 0, p: idle(1280, 730, TEACHER_POS.s * 0.95, { yaw: -0.5, look: -0.5, armL: { a: 40, b: -60 } }) },
          { f: len, p: { x: 1200, yaw: -0.35, look: -0.3 } },
        ]),
        ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]),
      }} rimId="rimR" shadow={0.45} />
      <Toast x={960} y={190} t={t} text="ORDER!" hold={30} />
      <Glow x={960} y={580} r={440} o={0.13} />
    </g>
    <Say x={1380} y={170} tx={1440} ty={565} text="Your Majesty, the homework is due today." at={2} until={44} t={t} fs={40} maxW={520} />
  </>);
};

// P1S27: same line, reverse angle — over Noah's shoulder at the teacher, crown in foreground
export const P1S27: React.FC<ShotProps> = ({ t, len }) => {
  const teach = poseAt(t, [
    { f: 0, p: idle(1200, 730, TEACHER_POS.s * 1.05, { yaw: -0.4, look: -0.4, armR: { a: 30, b: -18 }, headTilt: 6 }) },
    { f: len * 0.5, p: { armR: { a: 55, b: -24 }, headTilt: 8 } }, // finger wag
    { f: len, p: { headTilt: 5 } },
  ]);
  return (<>
    <g transform={camT(kf(t, [[0, 1080], [len, 1065]]), kf(t, [[0, 610], [len, 598]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t + 275} />
      {/* Noah's shoulder + crown, big blurred-ish foreground left */}
      <g opacity={0.96}>
        <K.Hero look={NOAH} pose={idle(700, 830, NOAH_POS.s * 1.25, { yaw: 0.85, look: 0.7, armL: { a: 20, b: -12 } })} rimId="rimR" shadow={0} />
        <Crown x={640} y={480} s={1.15} rot={-6} t={t} />
      </g>
      <K.Hero look={TEACHER} pose={{ ...teach, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.45} />
      <Glow x={1100} y={580} r={420} o={0.12} />
    </g>
    {/* same line continues from S26 — bubble already settled */}
    <Say x={1330} y={180} tx={1200} ty={540} text="Your Majesty, the homework is due today." at={-20} until={50} t={t} fs={40} maxW={520} />
  </>);
};

// P1S28: "Noah looked at his teacher" — Noah turns, double-take; then "Sorry, citizens..."
export const P1S28: React.FC<ShotProps> = ({ t, len }) => {
  const mid = len * 0.5;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.15, look: -0.4, headTilt: -6 }) },
    { f: mid, p: { yaw: -0.15, look: -0.55, headTilt: -2 } }, // turns to face the teacher
    { f: len, p: { headTilt: 2 } },
  ]);
  const headTop = toWorld({ ...pose }, { x: 0, y: K.HEAD.y - 66 });
  return (<>
    <g transform={camT(kf(t, [[0, 980], [len, 962]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.75], [len, 1.88]]))}>
      <Cls t={t + 290} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <PhoneD x={1150} y={652} s={0.8} t={t} />
      <Sneakers x={640} y={985} s={1.4} rot={3} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [mid, 'happy'], [len * 0.8, 'cool']]) }} t={t} burger={false} />
      <Crown x={headTop.x} y={headTop.y - 12} s={0.85} rot={-4} t={t} />
      <K.Hero look={TEACHER} pose={idle(1190, 728, TEACHER_POS.s * 1.0, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0.45} />
      <Glow x={960} y={580} r={440} o={0.12} />
    </g>
    {/* "Sorry, citizens. Your king needs a little more time." starts at t~55 */}
    <Say x={780} y={290} tx={975} ty={650} text="Sorry, citizens. Your king needs a little more time." at={55} until={79} t={t} fs={38} maxW={560} />
  </>);
};

// P1S29: "Sorry, citizens. Your king needs a little more time." — royal wave, teacher facepalms-ish
export const P1S29: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: -0.1, look: -0.5, headTilt: -4, armR: { a: 20, b: -10 } }) },
    { f: len * 0.4, p: { armR: { a: 120, b: -20 }, headTilt: -8 }, ease: easeOut }, // the royal wave
    { f: len * 0.6, p: { armR: { a: 132, b: -24 } } },
    { f: len, p: { headTilt: -4 } },
  ]);
  const headTop = toWorld({ ...pose }, { x: 0, y: K.HEAD.y - 66 });
  return (<>
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 590], [len, 575]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Cls t={t + 305} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <PhoneD x={1150} y={652} s={0.8} t={t} />
      <Sneakers x={640} y={985} s={1.4} rot={3} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'cool'], [len * 0.5, 'smug']]) }} t={t} burger={false} />
      <Crown x={headTop.x} y={headTop.y - 12} s={0.85} rot={-4} t={t} />
      <K.Hero look={TEACHER} pose={poseAt(t, [
        { f: 0, p: idle(1190, 728, TEACHER_POS.s, { yaw: -0.45, look: -0.5, armR: { a: 20, b: -10 } }) },
        { f: len * 0.5, p: { headTilt: 10, armR: { a: 60, b: -30 } } }, // exasperated pinch
        { f: len, p: { headTilt: 8 } },
      ])} {...{ ...faceAt(t, [[0, 'worried'], [len * 0.55, 'tired']]) }} rimId="rimR" shadow={0.45} />
      {/* crown glint */}
      <Glow x={NOAH_POS.x} y={540} r={300} o={0.14} />
    </g>
    {/* same line continues from S28 — bubble already settled */}
    <Say x={800} y={285} tx={1015} ty={665} text="Sorry, citizens. Your king needs a little more time." at={-20} until={85} t={t} fs={38} maxW={560} />
  </>);
};

// P1S30: "by lunchtime... they actually worked" — three mini-demos in one wide: car rolls, watch ticks, dog wags
export const P1S30: React.FC<ShotProps> = ({ t, len }) => {
  const carX = 620 + Math.sin(t * 0.05) * 60;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.5, headTilt: 0 }) },
    { f: len * 0.5, p: { look: 0.6, headTilt: 3 } },
    { f: len, p: { armR: { a: 30, b: -16 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 970]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.15], [len, 1.3]]))}>
      <Cls t={t + 320} />
      {/* the working trio across the classroom floor */}
      <CarD x={carX} y={960} s={1.1} t={t} />
      <WatchD x={760} y={880} s={0.9} t={t} />
      <DogD x={1420} y={990} s={1.15} t={t} flip={-1} />
      {/* Noah watching them, crown still on */}
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} t={t} burger={false} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <PhoneD x={1150} y={652} s={0.75} t={t} />
      <Sneakers x={640} y={985} s={1.35} rot={3} />
      <Crown x={NOAH_POS.x} y={NOAH_POS.y - 268} s={0.85} rot={-4} t={t} />
      {/* speech ticks from the dog */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${1500 + i * 24} ${900 - i * 12} q 8 -10 18 0`} stroke="#FFE9B0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5 + Math.sin(t * 0.4 + i * 2) * 0.3} />
      ))}
      <Glow x={960} y={560} r={600} o={0.12} />
    </g>
  );
};

export const p1c3Shots: ShotMap = {
  P1S21, P1S22, P1S23, P1S24, P1S25, P1S26, P1S27, P1S28, P1S29, P1S30,
};
