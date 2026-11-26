import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c4 — the working demos close-up (watch, dog), the tiny dinosaur that was
// "forgotten friendly", the classroom chase, the shouting, and the detail->real lesson
// (circle vs ball, line bike vs real bike).
//
// DESIGN NOTE — same classroom. Chase shots use x-moving pose keys with alternating leg
// swings; classmates become ShadowFigure silhouettes standing on desks (mood 'cheer').
// P1S40 is a schematic-style compare on dark ground: sketch vs solid.

const {
  NOAH, TEACHER, ETHAN, Cls, Hamburger, WatchD, DogD, Dino, BikeD,
  SchoolDesk, Tag, Toast, Glow, AppearFx, Materialize, ShadowFigure,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK, TEACHER_POS, ETHAN_POS,
} = K;

const NoahAtDesk: React.FC<{ pose: Pose; t?: number; burger?: boolean }> = ({ pose, t = 0, burger = true }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
    {burger ? <Hamburger x={NOAH_DESK} y={692} s={1.4} steam={t} /> : null}
  </g>
);

// P1S31: "they actually worked" — Noah checks the watch on his wrist, satisfied
export const P1S31: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.5, headTilt: -2, armL: { a: 60, b: -70 } }) }, // wrist up
    { f: len * 0.5, p: { look: 0.55, headTilt: -4 } },
    { f: len, p: { armL: { a: 55, b: -66 }, headTilt: -2 } },
  ]);
  const j = joints(pose);
  const wrist = toWorld(pose, j.armL.mid);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 590], [len, 578]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t + 330} />
      <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} t={t} burger={false} />
      {/* the watch on his raised wrist */}
      <g transform={`translate(${wrist.x} ${wrist.y}) rotate(-30)`}>
        <WatchD x={0} y={0} s={0.85} t={t} />
      </g>
      <Glow x={980} y={580} r={400} o={0.12} />
    </g>
  );
};

// P1S32: "a watch could tell time" — macro on the watch face, hands sweeping
export const P1S32: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* giant watch face */}
      <WatchD x={960} y={540} s={4.2} t={t} />
      {/* tick marks orbiting */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + t * 0.02;
        return <circle key={i} cx={960 + Math.cos(a) * 330} cy={540 + Math.sin(a) * 330} r={5} fill="#8FD3FF" opacity={0.4} />;
      })}
      <Glow x={960} y={540} r={560} o={0.16} />
    </g>
  );
};

// P1S33: "the little dog could bark and wag its tail" — dog mid-bark, teeth, tail a blur
export const P1S33: React.FC<ShotProps> = ({ t, len }) => {
  const bark = Math.sin(t * 0.9) > 0.6;
  return (
    <g transform={camT(kf(t, [[0, 1250], [len, 1230]]), kf(t, [[0, 900], [len, 880]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Cls t={t + 345} />
      {/* dog on the floor, big */}
      <DogD x={1250} y={1010} s={1.9} t={t * 1.6} flip={-1} />
      {/* bark shock ticks */}
      {bark ? [0, 1].map((i) => (
        <path key={i} d={`M ${1420 + i * 40} ${880 - i * 30} l 16 -20 M ${1420 + i * 40} ${880 - i * 30} l 28 -4`} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      )) : null}
      {/* Noah watching from his desk, amused */}
      <NoahAtDesk pose={{
        ...poseAt(t, [
          { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: -0.4, look: -0.7, headTilt: 4 }) },
          { f: len * 0.5, p: { look: -0.8, headTilt: 6 } },
          { f: len, p: { headTilt: 3 } },
        ]),
        ...faceAt(t, [[0, 'happy'], [len * 0.7, 'smug']]),
      }} t={t} burger={false} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <Glow x={1250} y={880} r={380} o={0.12} />
    </g>
  );
};

// P1S34: "he even drew a tiny dinosaur" — pencil sketches it, Dino pops in small beside the desk
export const P1S34: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.55) / 12);
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.55, armR: { a: 64, b: -30}, headTilt: 4 }) },
    { f: len * 0.5, p: { look: 0.5, headTilt: 1 } },
    { f: len, p: { armR: { a: 26, b: -14 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 970], [len, 945]]), kf(t, [[0, 590], [len, 572]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 360} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) }} t={t} burger={false} />
      {/* the tiny dino pops onto the floor beside the desk */}
      <Materialize x={640} y={1010} p={pop} s={0.55}>
        <Dino x={640} y={1010} s={0.55} t={t} flip={-1} mood="calm" />
      </Materialize>
      <AppearFx x={640} y={1000} p={pop} r={90} color="#8FBC6A" />
      <Glow x={800} y={900} r={360} o={0.11} />
    </g>
  );
};

// P1S35: "unfortunately, he forgot to make it friendly" — the dino's eye opens, head turns; Noah steps back
export const P1S35: React.FC<ShotProps> = ({ t, len }) => {
  const eyeOpen = clamp((t - len * 0.4) / 10);
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: -0.3, look: -0.6, headTilt: 2 }) },
    { f: len * 0.45, p: { x: NOAH_POS.x + 40, headTilt: -4, look: -0.8 }, ease: easeOut }, // steps back
    { f: len, p: { x: NOAH_POS.x + 70, look: -0.85, headTilt: -6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), kf(t, [[0, 640], [len, 622]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 375} />
      {/* dino, bigger in frame, turning its head toward Noah */}
      <g transform={`translate(${lerp(0, -30, eyeOpen)} 0)`}>
        <Dino x={700} y={1010} s={0.85} t={t} flip={-1} mood={eyeOpen > 0.5 ? 'snarl' : 'calm'} />
      </g>
      {/* eye glint */}
      <circle cx={742} cy={938} r={5} fill="#FFE9B0" opacity={eyeOpen * (0.6 + Math.sin(t * 0.5) * 0.4)} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.45, 'worried'], [len * 0.8, 'shock']]) }} t={t} burger={false} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <Glow x={800} y={880} r={380} o={0.12} />
    </g>
  );
};

// running pose helper: legs alternate, torso leans into the run
const runPose = (x: number, y: number, s: number, phase: number, extra: Partial<Pose> = {}): Pose => ({
  ...idle(x, y, s, {
    yaw: 0.35, look: 0.6,
    legL: { a: Math.sin(phase) * 38, b: Math.max(0, Math.cos(phase)) * 30 },
    legR: { a: -Math.sin(phase) * 38, b: Math.max(0, -Math.cos(phase)) * 30 },
    armL: { a: -Math.sin(phase) * 30, b: -20 },
    armR: { a: Math.sin(phase) * 30, b: -24 },
    tilt: 8,
    ...extra,
  }),
});

// P1S36: the chase — Noah bolts right, dino bounds after, classmates up on desks screaming
export const P1S36: React.FC<ShotProps> = ({ t, len }) => {
  const nx = lerp(700, 1350, easeInOut(clamp(t / len)));
  const dx = lerp(430, 1080, easeInOut(clamp(t / len)));
  const pose = runPose(nx, 830, 0.95, t * 0.55);
  const dinoBob = Math.abs(Math.sin(t * 0.5)) * 26;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Cls t={t + 390} laugh={1} />
      {/* classmates up on desks: shadow figures cheering */}
      <ShadowFigure x={520} y={700} s={0.5} mood="cheer" t={t} opacity={0.85} />
      <ShadowFigure x={1560} y={690} s={0.48} flip={-1} mood="cheer" t={t + 8} opacity={0.8} />
      {/* dino chasing */}
      <g transform={`translate(0 ${-dinoBob})`}>
        <Dino x={dx} y={1015} s={1.0} t={t * 1.3} flip={1} mood="snarl" />
      </g>
      {/* Noah mid-run */}
      <K.Hero look={NOAH} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* speed lines */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${nx - 120 - i * 30} ${760 + i * 30} h 90`} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" opacity={0.4} />
      ))}
      <Glow x={960} y={560} r={560} o={0.12} />
    </g>
  );
};

// P1S37: closer on the chase — dino jaws snapping at Noah's heels
export const P1S37: React.FC<ShotProps> = ({ t, len }) => {
  const nx = lerp(1250, 850, easeInOut(clamp(t / len)));
  const dx = lerp(1520, 1120, easeInOut(clamp(t / len)));
  const pose = runPose(nx, 840, 1.05, t * 0.6 + 2);
  const snap = Math.sin(t * 0.9) > 0.5;
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1010]]), kf(t, [[0, 640], [len, 618]]), kf(t, [[0, 1.7], [len, 1.9]]))}>
      <Cls t={t + 405} laugh={1} />
      <g transform={`translate(${snap ? 14 : 0} 0)`}>
        <Dino x={dx} y={1020} s={1.25} t={t * 1.4} flip={-1} mood="snarl" />
      </g>
      <K.Hero look={NOAH} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.5} />
      {/* snap ticks */}
      {snap ? [0, 1].map((i) => (
        <path key={i} d={`M ${dx - 90 - i * 30} ${960 - i * 26} l 14 -18`} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
      )) : null}
      {/* desk-camper silhouettes bottom corners */}
      <ShadowFigure x={300} y={880} s={0.55} mood="cheer" t={t + 5} opacity={0.75} />
      <ShadowFigure x={1620} y={870} s={0.5} flip={-1} mood="point" t={t + 11} opacity={0.75} />
      <Glow x={1000} y={580} r={480} o={0.12} />
    </g>
  );
};

// P1S38: "WHY WOULD YOU DRAW THAT?" — the teacher pointing after them, mid-shout
export const P1S38: React.FC<ShotProps> = ({ t, len }) => {
  const teach = poseAt(t, [
    { f: 0, p: idle(TEACHER_POS.x, TEACHER_POS.y, TEACHER_POS.s * 1.05, { yaw: -0.5, look: -0.6, armL: { a: 20, b: -10 } }) },
    { f: 10, p: { armR: { a: 155, b: -8 }, headTilt: -7 }, ease: backOut },
    { f: 30, p: { armR: { a: 142, b: -6 } } },
    { f: len, p: { armR: { a: 150, b: -8 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1080]]), kf(t, [[0, 630], [len, 615]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t + 420} />
      <K.Hero look={TEACHER} pose={{ ...teach, ...faceAt(t, [[0, 'shock'], [12, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* Ethan doubled over laughing in the aisle */}
      <K.Hero look={ETHAN} pose={idle(ETHAN_POS.x + 60, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.6, look: 0.7, headTilt: 12, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Toast x={960} y={170} t={t} text="DETAINMENT!" hold={30} />
      <Glow x={1100} y={560} r={420} o={0.12} />
    </g>
  );
};

// P1S39: "I didn't think it would be this fast!" — Noah yelling mid-run, dino right behind
export const P1S39: React.FC<ShotProps> = ({ t, len }) => {
  const nx = lerp(500, 1150, easeInOut(clamp(t / len)));
  const dx = nx - 210;
  const pose = runPose(nx, 835, 1.0, t * 0.62 + 4);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 950]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 435} laugh={1} />
      <Dino x={dx} y={1020} s={1.15} t={t * 1.5} flip={1} mood="snarl" />
      <K.Hero look={NOAH} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* shout ticks */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${nx + 60 + i * 30} ${700 - i * 24} q 16 -8 30 0`} stroke="#FFE9B0" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
      ))}
      <Glow x={900} y={580} r={460} o={0.12} />
    </g>
  );
};

// P1S40: "the more detailed, the more realistic" — schematic compare: circle vs ball, line-bike vs real bike
export const P1S40: React.FC<ShotProps> = ({ t, len }) => {
  const inK = easeOut(clamp(t / 20));
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* blueprint grid */}
      {Array.from({ length: 12 }, (_, i) => <line key={`v${i}`} x1={i * 180} y1={0} x2={i * 180} y2={1080} stroke="#2A2450" strokeWidth={2} />)}
      {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 180} x2={1920} y2={i * 180} stroke="#2A2450" strokeWidth={2} />)}
      {/* left: sketch -> right: real */}
      <g opacity={inK}>
        <text x={480} y={200} textAnchor="middle" fontFamily="monospace" fontSize={36} fill="#8B7BB8">SKETCH</text>
        <circle cx={380} cy={420} r={80} fill="none" stroke={K.SKETCH} strokeWidth={6} />
        <path d="M 300 340 L 460 500 M 460 340 L 300 500" stroke={K.SKETCH} strokeWidth={4} opacity={0.4} />
        {/* arrow */}
        <path d="M 560 420 L 700 420 M 680 400 L 704 420 L 680 440" stroke="#E9C46A" strokeWidth={6} fill="none" strokeLinecap="round" />
        <RedBallLocal x={880} y={420} r={80} t={t} />
        <text x={880} y={580} textAnchor="middle" fontFamily="monospace" fontSize={30} fill="#8FD3FF">DETAIL = REAL</text>
      </g>
      {/* bottom row: bike line vs bike */}
      <g opacity={clamp((t - 30) / 15)}>
        <path d="M 300 820 L 420 760 L 560 800 L 640 880 M 420 760 L 480 880 M 560 800 L 480 880 M 640 880 L 600 820 M 560 800 L 580 760" stroke={K.SKETCH} strokeWidth={5} fill="none" />
        <path d="M 780 780 L 900 720" stroke="#E9C46A" strokeWidth={6} />
        <path d="M 900 720 L 960 720" stroke="#E9C46A" strokeWidth={6} />
        <BikeD x={1180} y={880} s={1.3} t={t} />
      </g>
      <Tag x={300} y={150} t={t} text="RULE 1" />
      <Glow x={960} y={540} r={700} o={0.08} />
    </g>
  );
};

const RedBallLocal: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#D9534F" stroke={K.INK} strokeWidth={7} />
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.28} ry={r * 0.16} fill="#F4A79E" opacity={0.8} transform="rotate(-30)" />
    <path d={`M ${-r * 0.9} ${Math.sin(t * 0.4) * 4} q ${r * 0.9} ${-r * 0.4} ${r * 1.8} 0`} stroke="#8F2F2B" strokeWidth={4} fill="none" opacity={0.5} />
  </g>
);

export const p1c4Shots: ShotMap = {
  P1S31, P1S32, P1S33, P1S34, P1S35, P1S36, P1S37, P1S38, P1S39, P1S40,
};
