import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c6 — the trophy bit ("Bro, you can't just draw me a trophy!" / "You deserve one."),
// the warm "make the world better" beat, then the turn: "But there was one problem."
// Page 1 ends on the cliffhanger — the notebook, a dark scribble, the pencil still moving.
//
// DESIGN NOTE — same classroom until P1S58, which drains the light (lower glow, cooler
// rim). P1S59 is a macro notebook insert on dark ground: the page, a shadowy scribble,
// the pencil hovering — motion continues past the cut (page 2 picks it up).

const {
  NOAH, TEACHER, ETHAN, CLASSMATE, Cls, Note, Pencil, Hamburger, BikeD, UmbrellaD, TrophyD, DogD, Crown,
  SchoolDesk, Tag, Toast, FloatLabel, Glow, AppearFx, Materialize, Say,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle,
  poseAt, faceAt, joints, toWorld, idle, NOAH_POS, NOAH_DESK, ETHAN_POS,
} = K;

const NoahAtDesk: React.FC<{ pose: Pose; t?: number }> = ({ pose, t = 0 }) => (
  <g>
    <K.Hero look={NOAH} pose={pose} rimId="rimR" shadow={0.55} />
    <SchoolDesk x={NOAH_DESK} />
    <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
  </g>
);

// P1S51: trophy handed over — Ethan holds it up, disbelief; Noah smug
export const P1S51: React.FC<ShotProps> = ({ t, len }) => {
  const eth = poseAt(t, [
    { f: 0, p: idle(ETHAN_POS.x + 30, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.55, look: 0.6, headTilt: -6, armL: { a: 30, b: -70 }, armR: { a: 30, b: -70 } }) },
    { f: len * 0.5, p: { headTilt: 0, armL: { a: 80, b: -40 }, armR: { a: 80, b: -40 } } }, // lifts it
    { f: len, p: { armL: { a: 95, b: -30 }, armR: { a: 95, b: -30 }, headTilt: -4 } },
  ]);
  const j = joints(eth);
  const lH = toWorld(eth, j.armL.end);
  const rH = toWorld(eth, j.armR.end);
  return (<>
    <g transform={camT(kf(t, [[0, 960], [len, 942]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t + 585} />
      {/* trophy hovering between Ethan's hands */}
      <TrophyD x={(lH.x + rH.x) / 2} y={(lH.y + rH.y) / 2 - 30} s={0.8} t={t} />
      <K.Hero look={ETHAN} pose={{ ...eth, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried'], [len * 0.8, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Backpack eth={ETHAN_POS} t={t} />
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.4, look: 0.6, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) })} t={t} />
      <Glow x={960} y={600} r={460} o={0.13} />
    </g>
    {/* "Bro, you can't just draw me a trophy!" starts ~t53 */}
    <Say x={570} y={275} tx={568} ty={620} text="Bro, you can't just draw me a trophy!" at={53} until={72} t={t} fs={40} maxW={540} />
  </>);
};

const Backpack: React.FC<{ eth: { x: number; y: number }; t: number }> = ({ eth, t }) => (
  <g transform={`translate(${eth.x + 95} ${eth.y - 55}) rotate(10) scale(0.85)`}>
    <rect x={-34} y={-30} width={68} height={76} rx={16} fill="#3E8C86" stroke={K.INK} strokeWidth={4} />
    <rect x={-34} y={-30} width={68} height={18} rx={9} fill="#2F6E69" />
    <path d="M -18 -30 Q 0 -58 18 -30" fill="none" stroke={K.INK} strokeWidth={6} />
    <rect x={-22} y={10} width={44} height={14} rx={6} fill="#2F6E69" />
  </g>
);

// P1S52: "Bro, you can't just draw me a trophy!" — Ethan indignant, trophy still up
export const P1S52: React.FC<ShotProps> = ({ t, len }) => {
  const eth = poseAt(t, [
    { f: 0, p: idle(ETHAN_POS.x + 30, ETHAN_POS.y, ETHAN_POS.s * 1.05, { yaw: 0.6, look: 0.6, headTilt: -6, armL: { a: 95, b: -30 }, armR: { a: 95, b: -30 } }) },
    { f: len * 0.5, p: { armL: { a: 110, b: -20 }, armR: { a: 110, b: -20 }, headTilt: -10 } }, // thrusts it at Noah
    { f: len, p: { headTilt: -6 } },
  ]);
  const j = joints(eth);
  const mid = { x: (toWorld(eth, j.armL.end).x + toWorld(eth, j.armR.end).x) / 2, y: (toWorld(eth, j.armL.end).y + toWorld(eth, j.armR.end).y) / 2 - 40 };
  return (<>
    <g transform={camT(kf(t, [[0, 900], [len, 885]]), kf(t, [[0, 630], [len, 614]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Cls t={t + 600} />
      <TrophyD x={mid.x} y={mid.y} s={0.75} t={t} />
      <K.Hero look={ETHAN} pose={{ ...eth, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'worried'], [len * 0.75, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Backpack eth={ETHAN_POS} t={t} />
      {/* Noah small right, smiling through it */}
      <NoahAtDesk pose={idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'smug']]) })} t={t} />
      <Glow x={900} y={560} r={420} o={0.12} />
    </g>
    {/* same line continues from S51 — bubble already settled */}
    <Say x={650} y={260} tx={632} ty={590} text="Bro, you can't just draw me a trophy!" at={-20} until={60} t={t} fs={40} maxW={540} />
  </>);
};

// P1S53: "Why not? You deserve one." — Noah warm, almost proud
export const P1S53: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.3, look: 0.5, headTilt: 3 }) },
    { f: len * 0.5, p: { headTilt: -2, look: 0.55, armL: { a: 30, b: -30 } } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (<>
    <g transform={camT(kf(t, [[0, 960], [len, 942]]), kf(t, [[0, 590], [len, 574]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Cls t={t + 615} />
      <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
      {/* trophy resting on the desk now */}
      <TrophyD x={NOAH_DESK - 150} y={700} s={0.9} t={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len * 0.8, 'cool']]) }} t={t} />
      {/* Ethan softening, half-smile */}
      <K.Hero look={ETHAN} pose={idle(ETHAN_POS.x + 30, ETHAN_POS.y, ETHAN_POS.s, { yaw: 0.5, look: -0.4, headTilt: 4, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Glow x={NOAH_POS.x} y={540} r={420} o={0.15} />
    </g>
    <Say x={1060} y={310} tx={1018} ty={685} text="Why not? You deserve one." at={2} until={55} t={t} fs={40} maxW={440} />
  </>);
};

// P1S54: "he could make the world a better place" — warm glow blooms around Noah
export const P1S54: React.FC<ShotProps> = ({ t, len }) => {
  const bloom = easeOut(clamp(t / 30));
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.5, headTilt: -3 }) },
    { f: len * 0.6, p: { headTilt: -6, look: 0.55 } }, // chin up, dreaming
    { f: len, p: { headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Cls t={t + 630} />
      {/* his creations line the room: burger, bike, dog, crown, umbrella */}
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <BikeD x={620} y={960} s={1.0} t={t} />
      <DogD x={1420} y={1000} s={1.1} t={t * 1.2} flip={-1} />
      <UmbrellaD x={1560} y={700} s={0.9} t={t} tilt={10} />
      <TrophyD x={NOAH_DESK - 150} y={700} s={0.85} t={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} t={t} />
      {/* warm bloom */}
      <Glow x={NOAH_POS.x} y={520} r={640 * bloom + 200} o={0.1 + bloom * 0.12} />
      <Glow x={960} y={700} r={300} o={0.08} />
    </g>
  );
};

// P1S55: "he wasn't just a student with a pencil anymore" — the pencil in his hand catches light
export const P1S55: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.35, look: 0.5, headTilt: -2, armR: { a: 45, b: -20 } }) },
    { f: len * 0.5, p: { armR: { a: 55, b: -24 }, look: 0.6 } }, // pencil raised, glinting
    { f: len, p: { armR: { a: 48, b: -22 } } },
  ]);
  const j = joints(pose);
  const h = toWorld(pose, j.armR.end);
  const glint = 0.5 + Math.sin(t * 0.4) * 0.5;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 920]]), kf(t, [[0, 590], [len, 572]]), kf(t, [[0, 2.0], [len, 2.2]]))}>
      <Cls t={t + 645} />
      <Hamburger x={NOAH_DESK} y={692} s={1.3} steam={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} t={t} />
      {/* the pencil, big and lit */}
      <Pencil x={h.x} y={h.y - 14} s={1.4} rot={pose.armR.a - 80} t={t} />
      <Glow x={h.x} y={h.y} r={140} o={0.2 * glint} />
      {/* rising sparkles */}
      {[0, 1, 2].map((i) => {
        const k = (t * 0.05 + i * 0.33) % 1;
        return <circle key={i} cx={h.x - 30 + i * 30} cy={h.y - 60 - k * 160} r={4 + k * 5} fill="#FFE9B0" opacity={(1 - k) * 0.8} />;
      })}
    </g>
  );
};

// P1S56: "he could create almost anything he imagined" — notebook page of doodles, items floating out
export const P1S56: React.FC<ShotProps> = ({ t, len }) => {
  const float = Math.sin(t * 0.06) * 14;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 540], [len, 525]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t + 660} />
      {/* giant notebook center, doodles floating up off the page */}
      <Note x={960} y={600} s={2.2} rot={-3} open={1} doodle t={t} />
      {/* things rising off the page */}
      <g transform={`translate(0 ${float})`}>
        <Hamburger x={700} y={420} s={0.9} steam={t} />
        <BikeD x={1220} y={430} s={0.8} t={t} />
        <DogD x={960} y={330} s={0.75} t={t * 1.3} />
        <Crown x={800} y={520} s={0.6} t={t} />
      </g>
      {/* faint pencil lines trailing them */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${640 + i * 300} ${560 + i * 12} q 20 -30 0 -60`} stroke={K.SKETCH} strokeWidth={4} fill="none" opacity={0.4} />
      ))}
      <Glow x={960} y={500} r={560} o={0.13} />
    </g>
  );
};

// P1S57: same beat, wider — Noah small among his creations, "almost anything"
export const P1S57: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t * 0.08) * 10;
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.5, headTilt: -4 }) },
    { f: len * 0.6, p: { headTilt: -7, look: 0.6 } },
    { f: len, p: { headTilt: -5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 990]]), kf(t, [[0, 540], [len, 522]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Cls t={t + 675} />
      {/* the whole menagerie, gently bobbing */}
      <g transform={`translate(0 ${bob})`}>
        <Hamburger x={NOAH_DESK} y={692} s={1.4} steam={t} />
        <BikeD x={560} y={950} s={1.05} t={t} />
        <DogD x={1450} y={1005} s={1.15} t={t * 1.2} flip={-1} />
        <UmbrellaD x={1590} y={720} s={0.95} t={t} tilt={8} />
        <TrophyD x={NOAH_DESK - 150} y={700} s={0.9} t={t} />
        <Crown x={NOAH_POS.x} y={NOAH_POS.y - 280} s={0.9} rot={-4} t={t} />
      </g>
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} t={t} />
      <Glow x={960} y={520} r={620} o={0.14} />
      <Glow x={960} y={700} r={340} o={0.08} />
    </g>
  );
};

// P1S58: "but there was one problem" — the light drains; Noah's smile fades; the notebook edge glints
export const P1S58: React.FC<ShotProps> = ({ t, len }) => {
  const dim = easeInOut(clamp(t / 24));
  const pose = poseAt(t, [
    { f: 0, p: idle(NOAH_POS.x, NOAH_POS.y, NOAH_POS.s, { yaw: 0.2, look: 0.5, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: 4, look: 0.3 }, ease: easeInOut }, // the smile drops
    { f: len, p: { look: 0.2, headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t + 690} />
      {/* cool it down: a blue veil slides over the warm classroom */}
      <rect x={0} y={0} width={1920} height={1080} fill="#2A3A6E" opacity={dim * 0.28} />
      <Hamburger x={NOAH_DESK} y={692} s={1.35} steam={t} />
      <TrophyD x={NOAH_DESK - 150} y={700} s={0.9} t={t} />
      <NoahAtDesk pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [len * 0.45, 'neutral'], [len * 0.8, 'worried']]) }} t={t} />
      {/* the notebook corner catching a cold edge-light */}
      <Note x={860} y={745} s={0.95} rot={-7} open={1} doodle={false} t={t} />
      <Glow x={860} y={700} r={160} o={0.1 + dim * 0.1} kind="cool" />
    </g>
  );
};

// P1S59: the cliffhanger — macro on the open notebook, a dark scribble, the pencil still moving
export const P1S59: React.FC<ShotProps> = ({ t, len }) => {
  const scribble = easeInOut(clamp(t / 30));
  const tremble = Math.sin(t * 0.9) * 1.5;
  const px = 760 + kf(t, [[0, 0], [len * 0.5, 60], [len, 96]]);
  const py = 470 + Math.sin(t * 0.13) * 5;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 2.1], [len, 2.3]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#0D0A18" />
      {/* faint classroom ghosts, nearly gone */}
      <rect x={1300} y={150} width={340} height={400} rx={12} fill="#F2B95C" opacity={0.04} />
      <rect x={150} y={200} width={240} height={360} rx={8} fill="#3E6FB8" opacity={0.05} />
      {/* the open notebook, dark page */}
      <Note x={960} y={600} s={2.5} rot={-4} open={1} doodle={false} t={t} />
      {/* a dark scribble crawling across the page — something he never meant to draw */}
      <path
        d={`M 700 560 q 60 -40 120 -10 q 60 30 120 -20 q 70 -55 140 10 q 60 55 120 -10`}
        stroke="#1A1428" strokeWidth={10} fill="none" strokeLinecap="round"
        strokeDasharray={`${scribble * 800} 800`} opacity={0.9}
      />
      {/* two pale eyes opening in the scribble */}
      <g opacity={clamp((t - len * 0.6) / 20)}>
        <ellipse cx={960} cy={548} rx={14} ry={8} fill="#E8ECF7" />
        <ellipse cx={1030} cy={556} rx={14} ry={8} fill="#E8ECF7" />
        <circle cx={963} cy={548} r={4} fill="#1A1428" />
        <circle cx={1033} cy={556} r={4} fill="#1A1428" />
      </g>
      {/* the pencil hovering, still moving — page 2 continues this */}
      <g transform={`translate(${tremble} 0)`}>
        <Pencil x={px} y={py} s={1.6} rot={-22 + Math.sin(t * 0.2) * 3} t={t} />
      </g>
      {/* cold edge light on the page corner */}
      <Glow x={1300} y={700} r={300} o={0.1} kind="cool" />
      <Tag x={300} y={170} t={t} text="TO BE CONTINUED" />
    </g>
  );
};

export const p1c6Shots: ShotMap = {
  P1S51, P1S52, P1S53, P1S54, P1S55, P1S56, P1S57, P1S58, P1S59,
};
