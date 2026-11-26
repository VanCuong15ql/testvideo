import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c5 — "detail = realistic" finishes with the bicycle, then Noah starts helping:
// Ethan gets an e-bike, a classmate gets an umbrella, Ethan gets a trophy for losing.
//
// DESIGN NOTE — same classroom. Ethan (mo) at (690,800); classmate Linh at (1330,795).
// Each gift follows the grammar: sketch hint -> Materialize pop -> the thing works
// (spinning wheels, umbrella canopy, trophy glint). Noah watches from his desk.

const {
  NOAH, TEACHER, ETHAN, CLASSMATE, Cls, Note, Hamburger, BikeD, UmbrellaD, TrophyD,
  SchoolDesk, Tag, Toast, FloatLabel, Glow, AppearFx, Materialize,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK, ETHAN_POS, CLASSMATE_POS,
} = K;

const NoahAtDesk: React.FC<{ pose: Pose; t?: number }> = ({ pose, t = 0 }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
    <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
  </g>
);

// P1S41: "after a few experiments..." — Noah at his desk, notebook open covered in doodles, thoughtful
export const P1S41: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.25, look: 0.5, headTilt: 4, armL: { a: 30, b: -50 } }) }, // chin on hand
    { f: len * 0.5, p: { headTilt: 2, look: 0.55 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 970], [len, 950]]), kf(t, [[0, 590], [len, 578]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Cls t={t + 450} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} t={t} />
      {/* notebook open on desk, covered in doodles */}
      <Note x={870} y={742} s={1.0} rot={-7} open={1} doodle t={t} />
      {/* doodle fleet on the page */}
      <BikeD x={960} y={660} s={0.4} t={t} />
      <Glow x={980} y={600} r={420} o={0.11} />
    </g>
  );
};

// P1S42: "the more detailed his drawings became" — the page fills with detailed doodles
export const P1S42: React.FC<ShotProps> = ({ t, len }) => {
  const doodles = [
    { x: 780, y: 500, s: 0.5 }, { x: 1050, y: 470, s: 0.55 }, { x: 880, y: 640, s: 0.45 }, { x: 1180, y: 600, s: 0.5 },
  ];
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Cls t={t + 465} />
      {/* giant open notebook filling the left half */}
      <g transform="translate(700 560) rotate(-4) scale(1.8)">
        <rect x={-300} y={-210} width={600} height={420} rx={14} fill={K.PAPER} stroke={K.INK} strokeWidth={7} />
        <rect x={-300} y={-210} width={600} height={420} rx={14} fill="#3E5A8C" opacity={0.28} />
        {[0, 1, 2].map((i) => <line key={i} x1={-270} y1={-150 + i * 110} x2={270} y2={-150 + i * 110} stroke="#B9C4D8" strokeWidth={4} />)}
        {/* doodles appearing one by one */}
        {doodles.map((d, i) => {
          const p = clamp((t - i * 12) / 12);
          return (
            <g key={i} transform={`translate(${d.x - 700} ${d.y - 560}) scale(${d.s})`} opacity={p}>
              {i === 0 ? <Hamburger x={0} y={0} s={0.8} steam={t} /> : null}
              {i === 1 ? <K.DogD x={0} y={0} s={0.7} t={t} /> : null}
              {i === 2 ? <BikeD x={0} y={-10} s={0.6} t={t} /> : null}
              {i === 3 ? <K.Crown x={0} y={0} s={0.6} t={t} /> : null}
            </g>
          );
        })}
      </g>
      {/* Noah watching his own page, pencil in hand */}
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.55, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) })} t={t} />
      <Glow x={960} y={560} r={560} o={0.12} />
    </g>
  );
};

// P1S43: "the more realistic they appeared" — doodle vs real: the bike sketch inks into the real thing
export const P1S43: React.FC<ShotProps> = ({ t, len }) => {
  const ink = clamp((t - 10) / 30);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 480} />
      {/* sketch bike left (pencil lines), real bike right */}
      <path d="M 480 700 L 580 640 L 700 680 L 760 760 M 580 640 L 640 760 M 700 680 L 640 760 M 760 760 L 720 700 M 700 680 L 720 640"
        stroke={K.SKETCH} strokeWidth={6} fill="none" opacity={1 - ink * 0.6} />
      <circle cx={520} cy={770} r={34} fill="none" stroke={K.SKETCH} strokeWidth={5} opacity={1 - ink * 0.6} />
      <circle cx={720} cy={770} r={34} fill="none" stroke={K.SKETCH} strokeWidth={5} opacity={1 - ink * 0.6} />
      <BikeD x={1250} y={800} s={1.5} t={t} />
      <AppearFx x={1250} y={800} p={ink} r={130} color="#8FD3FF" />
      <Glow x={1100} y={600} r={460} o={0.12} />
    </g>
  );
};

// P1S44: "a simple circle became a ball" — mini insert: circle inks into the red ball
export const P1S44: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.5) / 12);
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      {/* the pencil circle, then the ball inks in */}
      <circle cx={960} cy={540} r={150} fill="none" stroke={K.SKETCH} strokeWidth={8} opacity={1 - pop * 0.7} />
      <Materialize x={960} y={540} p={pop} s={1.4}>
        <K.RedBall x={960} y={540} r={110} t={t} />
      </Materialize>
      <AppearFx x={960} y={540} p={pop} r={170} color="#D9534F" />
      <Glow x={960} y={540} r={520} o={0.14} />
    </g>
  );
};

// P1S45: "a carefully drawn bicycle became a fully functional bicycle" — BikeD lands, wheels spin
export const P1S45: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.4) / 12);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.7], [len, 1.95]]))}>
      <Cls t={t + 495} />
      {/* the bike materializes center-floor */}
      <Materialize x={960} y={900} p={pop} s={1.6}>
        <BikeD x={960} y={900} s={1.6} t={t} />
      </Materialize>
      <AppearFx x={960} y={900} p={pop} r={150} color="#8FD3FF" />
      {/* crank + pedal hint spinning */}
      <circle cx={960} cy={870} r={12} fill="#3E8C86" stroke={K.INK} strokeWidth={3} />
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.55, ...faceAt(t, [[0, 'smug'], [len * 0.7, 'happy']]) })} t={t} />
      <Glow x={960} y={700} r={480} o={0.13} />
    </g>
  );
};

// P1S46: "started using his power to help people" — Noah smiles, reaches toward Ethan off-frame
export const P1S46: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.55, headTilt: -2 }) },
    { f: len * 0.5, p: { yaw: 0.55, look: 0.7, armR: { a: 55, b: -25 } }, ease: easeOut }, // warm reach
    { f: len, p: { headTilt: -4, armR: { a: 60, b: -22 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 580], [len, 566]]), kf(t, [[0, 1.7], [len, 1.9]]))}>
      <Cls t={t + 510} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} t={t} />
      {/* warm glow blooms */}
      <Glow x={NOAH_POS.x} y={560} r={500} o={0.14 + Math.sin(t * 0.08) * 0.03} />
      {/* Ethan small in the aisle, hopeful */}
      <K.Hero look={ETHAN} pose={idle(ETHAN_POS.x + 40, ETHAN_POS.y + 10, ETHAN_POS.s * 0.95, { yaw: 0.6, look: -0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S47: "Ethan complained about walking to school" — Ethan slumped, backpack on, morning slump
export const P1S47: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(ETHAN_POS.x + 40, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.5, look: 0.5, headTilt: 10, tilt: 4 }) }, // slumped
    { f: len * 0.5, p: { headTilt: 12, armL: { a: 30, b: -60 } } }, // shoulder sag
    { f: len, p: { headTilt: 9, look: 0.4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), kf(t, [[0, 640], [len, 626]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Cls t={t + 525} />
      {/* Ethan with backpack, shoulders drooping */}
      <K.Hero look={ETHAN} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <Backpack2 x={ETHAN_POS.x + 90} y={ETHAN_POS.y - 60} s={0.9} rot={8} />
      {/* Noah watching from desk, pencil already moving */}
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.4, look: 0.6, armR: { a: 55, b: -25 }, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) })} t={t} />
      {/* Zzz-ish slump ticks */}
      {[0, 1].map((i) => (
        <text key={i} x={ETHAN_POS.x + 130 + i * 26} y={ETHAN_POS.y - 260 - i * 22} fontSize={30 + i * 8} fill="#8B7BB8" opacity={0.5} fontFamily="monospace">z</text>
      ))}
      <Glow x={960} y={620} r={440} o={0.11} />
    </g>
  );
};

/** Simple backpack for Ethan — mustard straps, teal body. */
const Backpack2: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-34} y={-30} width={68} height={76} rx={16} fill="#3E8C86" stroke={K.INK} strokeWidth={4} />
    <rect x={-34} y={-30} width={68} height={18} rx={9} fill="#2F6E69" />
    <path d="M -18 -30 Q 0 -58 18 -30" fill="none" stroke={K.INK} strokeWidth={6} />
    <rect x={-22} y={10} width={44} height={14} rx={6} fill="#2F6E69" />
  </g>
);

// P1S48: "Noah drew him a brand-new electric bicycle" — BikeD pops beside Ethan, he stares
export const P1S48: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.45) / 12);
  const eth = poseAt(t, [
    { f: 0, p: idle(ETHAN_POS.x + 30, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.5, look: 0.6, headTilt: 8 }) },
    { f: len * 0.6, p: { headTilt: 2, look: 0.55 }, ease: easeOut }, // stands up straight
    { f: len, p: { headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 930], [len, 910]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 540} />
      {/* the e-bike materializes beside Ethan */}
      <Materialize x={560} y={940} p={pop} s={1.25}>
        <BikeD x={560} y={940} s={1.25} t={t} />
      </Materialize>
      <AppearFx x={560} y={940} p={pop} r={140} color="#8FD3FF" />
      <K.Hero look={ETHAN} pose={{ ...eth, ...faceAt(t, [[0, 'tired'], [len * 0.55, 'shock'], [len * 0.85, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Backpack2 x={ETHAN_POS.x + 95} y={ETHAN_POS.y - 55} s={0.85} rot={10} />
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.45, look: 0.6, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) })} t={t} />
      <Glow x={760} y={640} r={440} o={0.12} />
    </g>
  );
};

// P1S49: "another classmate forgot her umbrella" — Linh damp, umbrella pops open over her head
export const P1S49: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.5) / 12);
  const cm = poseAt(t, [
    { f: 0, p: idle(CLASSMATE_POS.x, CLASSMATE_POS.y, CLASSMATE_POS.s, { yaw: -0.4, look: -0.5, headTilt: 8 }) }, // damp, shivering
    { f: len * 0.6, p: { headTilt: 0, look: -0.4 }, ease: easeOut },
    { f: len, p: { armR: { a: 40, b: -30 } } }, // reaches for it
  ]);
  const umbY = lerp(CLASSMATE_POS.y - 420, CLASSMATE_POS.y - 330, easeOut(pop));
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 610], [len, 596]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Cls t={t + 555} />
      <K.Hero look={CLASSMATE} pose={{ ...cm, ...faceAt(t, [[0, 'worried'], [len * 0.55, 'happy'], [len * 0.8, 'smug']]) }} rimId="rimL" shadow={0.45} />
      {/* umbrella materializes above her head, canopy opening */}
      <g transform={`translate(${CLASSMATE_POS.x} ${umbY}) scale(${pop})`} opacity={clamp(pop * 2)}>
        <UmbrellaD x={0} y={0} s={1.5} t={t} tilt={-6} />
      </g>
      <AppearFx x={CLASSMATE_POS.x} y={umbY - 40} p={pop} r={120} color="#8B7BB8" />
      {/* Noah's hand still raised with the pencil */}
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.5, look: 0.6, armR: { a: 60, b: -26 } })} t={t} />
      {/* rain streaks through the window side */}
      {Array.from({ length: 16 }, (_, i) => {
        const rx = 200 + ((i * 131 + t * 22) % 500);
        const ry = ((i * 97 + t * 500) % 700) + 60;
        return <line key={i} x1={rx} y1={ry} x2={rx - 8} y2={ry + 26} stroke="#9FC0D6" strokeWidth={3} opacity={0.3} />;
      })}
      <Glow x={1250} y={560} r={440} o={0.12} />
    </g>
  );
};

// P1S50: "Ethan lost a video game tournament, Noah drew him a golden trophy"
export const P1S50: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - len * 0.5) / 12);
  const eth = poseAt(t, [
    { f: 0, p: idle(ETHAN_POS.x + 40, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.55, look: 0.6, headTilt: -8 }) }, // dejected
    { f: len * 0.55, p: { headTilt: 4, look: 0.7 }, ease: easeOut }, // looks up
    { f: len, p: { headTilt: -2, armR: { a: 50, b: -40 } } }, // reaches for it
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 620], [len, 602]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 570} />
      {/* trophy materializes on the desk edge between them */}
      <Materialize x={NOAH_DESK - 140} y={700} p={pop} s={1.1}>
        <TrophyD x={NOAH_DESK - 140} y={700} s={1.1} t={t} />
      </Materialize>
      <AppearFx x={NOAH_DESK - 140} y={700} p={pop} r={110} />
      <K.Hero look={ETHAN} pose={{ ...eth, ...faceAt(t, [[0, 'tired'], [len * 0.5, 'shock'], [len * 0.85, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Backpack2 x={ETHAN_POS.x + 95} y={ETHAN_POS.y - 55} s={0.85} rot={10} />
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.4, look: 0.6, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) })} t={t} />
      <Glow x={900} y={600} r={460} o={0.13} />
    </g>
  );
};

export const p1c5Shots: ShotMap = {
  P1S41, P1S42, P1S43, P1S44, P1S45, P1S46, P1S47, P1S48, P1S49, P1S50,
};
