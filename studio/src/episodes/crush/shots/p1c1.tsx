import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c1 — cold open: title, 8:12 Monday, the crush across the hallway, the smile,
// the look away — then the impossible thing: her shadow waves.
// Rich set: Hallway (clock, boards, lockers, light shafts, dust) + HallForeground depth layer.

const { HALL, Hallway, HallForeground, Clock8_12, ShadowFigure, TitleCard, Tag, Glow, camT, kf, clamp, lerp, poseAt, faceAt, easeOut, easeInOut, YOU, EMMA, FRIEND, SIS } = K;

// blocking: Emma and her friends far down the hall; "you" (Pip) near camera
const EMMA_POS = { x: 960, y: HALL.far.y, s: HALL.far.s };
const MO_POS = { x: 700, y: 706, s: 0.74 };
const SIS_POS = { x: 1230, y: 700, s: 0.7 };
const PIP_POS = { x: 1380, y: 860, s: 1.02 };
const PIP_POS2 = { x: 560, y: 850, s: 1.0 };

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...K.basePose, x, y, scale: s, ...extra,
});

/** The full hallway stack used by most shots: set + foreground depth + optional clock insert. */
const Scene: React.FC<{ t: number; fg?: boolean; children?: React.ReactNode }> = ({ t, fg = true, children }) => (
  <g>
    <Hallway t={t} />
    {children}
    {fg ? <HallForeground t={t} /> : null}
  </g>
);

// P1S1: title over the empty hallway — slow drift + lamp flicker + title letters
export const P1S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len * 0.5, 955], [len, 948]]), kf(t, [[0, 570], [len * 0.5, 548], [len, 536]]), kf(t, [[0, 0.92], [len, 1.0]]))}>
    <Scene t={t + 10} fg={false} />
    <TitleCard t={t} lines={["WHAT IF YOUR CRUSH'S", 'SHADOW REVEALED HER FEELINGS?']} accent="SHADOW" accentT={30} size={84} y={170} />
    {/* a single student silhouette crossing far down the hall for scale */}
    <ShadowFigure x={960} y={740} s={0.4} mood="idle" t={t} opacity={0.5} />
  </g>
);

// P1S2: 8:12 Monday — clock insert + Pip small in hall, three beats of stillness
export const P1S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP_POS2.x, y: PIP_POS2.y, scale: PIP_POS2.s, yaw: 0.55, look: 0.5, armL: { a: 8, b: -6 }, armR: { a: 14, b: -8 } } },
    { f: len * 0.3, p: { look: 0.2, headTilt: 2 } },
    { f: len * 0.65, p: { yaw: 0.6, look: 0.55 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  const secA = (t * 6) % 360;
  return (
    <g transform={camT(kf(t, [[0, 980], [len * 0.5, 965], [len, 950]]), kf(t, [[0, 600], [len, 578]]), kf(t, [[0, 1.5], [len, 1.66]]))}>
      <Scene t={t + 20}>
        {/* the wall clock on the back wall, hands creeping toward 8:12 */}
        <Clock8_12 x={960} y={345} r={34} id="c1clk" />
        <line x1={960} y1={345} x2={960} y2={315} stroke="#B4543F" strokeWidth={3} strokeLinecap="round" transform={`rotate(${secA} 960 345)`} opacity={0.8} />
      </Scene>
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Tag x={330} y={220} t={t} text="8:12 — MONDAY" />
    </g>
  );
};

// P1S3: across the hall — Emma + friends chatting, three independent gesture loops
export const P1S3: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s, { yaw: -0.3, look: -0.4, armR: { a: 30, b: -20 }, headTilt: -2 }) },
    { f: 50, p: { armR: { a: 18, b: -12 }, look: -0.2 } },
    { f: 100, p: { armL: { a: 24, b: -16 }, headTilt: 2 } },
    { f: len - 20, p: { armR: { a: 40, b: -22 }, headTilt: -4 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: idle(MO_POS.x, MO_POS.y, MO_POS.s, { yaw: 0.4, look: 0.5, armL: { a: 40, b: -30 } }) },
    { f: 60, p: { armL: { a: 20, b: -14 } } },
    { f: len - 30, p: { armL: { a: 44, b: -32 }, headTilt: 4 } },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: idle(SIS_POS.x, SIS_POS.y, SIS_POS.s, { yaw: -0.4, look: -0.5, armR: { a: 36, b: -26 } }) },
    { f: 70, p: { armR: { a: 16, b: -10 } } },
    { f: len - 40, p: { armR: { a: 40, b: -28 }, headTilt: -3 } },
  ]);
  // their shadows on the floor, subtly alive too
  return (
    <g transform={camT(kf(t, [[0, 990], [len * 0.6, 972], [len, 960]]), kf(t, [[0, 590], [len, 562]]), kf(t, [[0, 1.45], [len, 1.66]]))}>
      <Scene t={t + 40}>
        <ShadowFigure x={980} y={762} s={0.3} mood="idle" t={t * 1.2} opacity={0.35} />
        <ShadowFigure x={730} y={762} s={0.28} flip={-1} mood="idle" t={t * 1.2 + 9} opacity={0.3} />
        <ShadowFigure x={1260} y={758} s={0.27} flip={-1} mood="idle" t={t * 1.2 + 17} opacity={0.3} />
      </Scene>
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'happy'], [len * 0.7, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P1S4: you looked at her — OTS on Pip, Emma mid-laugh, hold then drift
export const P1S4: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s * 1.15, { yaw: 0.15, look: -0.5, armR: { a: 20, b: -14 } }) },
    { f: len * 0.4, p: { headTilt: 3, look: -0.3 } },
    { f: len * 0.75, p: { armL: { a: 30, b: -20 }, headTilt: 5 } },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP_POS.x + 120, y: PIP_POS.y, scale: PIP_POS.s * 0.9, yaw: -0.85, look: -0.8, armL: { a: 20, b: -14 }, armR: { a: 16, b: -10 } } },
    { f: len * 0.5, p: { look: -0.9, yaw: -0.92 } },
    { f: len, p: { headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len * 0.5, 1000], [len, 992]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Scene t={t + 55} fg={false} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.3} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// P1S5: she smiled — insert close-up, her head tilts into the smile + hair sheen
export const P1S5: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.1;
  const pose = poseAt(t, [
    { f: 0, p: { ...K.basePose, x: 960, y: 640 - K.HEAD.y * sc, scale: sc, yaw: 0.1, look: -0.3, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, headTilt: 0 } },
    { f: len * 0.45, p: { headTilt: -5, look: -0.45 } },
    { f: len, p: { headTilt: -3 } },
  ]);
  const fa = faceAt(t, [[0, 'neutral'], [len * 0.3, 'happy'], [len * 0.8, 'smug']]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 968]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.15], [len, 1.28]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      {/* suggestion of the hallway behind her: window rectangles + lockers, out of focus */}
      <rect x={1350} y={200} width={380} height={420} rx={10} fill="#F2B95C" opacity={0.08} />
      <rect x={150} y={240} width={220} height={360} rx={6} fill="#38315E" opacity={0.5} />
      {[0, 1, 2].map((i) => <rect key={i} x={170 + i * 60} y={260} width={46} height={300} rx={3} fill="#443D70" opacity={0.5} />)}
      <K.Hero look={EMMA} pose={{ ...pose, expr: fa.expr, blink: fa.blink }} rimId="rimR" shadow={0} />
      <Glow x={960} y={480} r={520} o={0.16} />
    </g>
  );
};

// P1S6: you immediately looked away — Pip's head snaps off, over-corrects, whistle raise
export const P1S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP_POS2.x, y: PIP_POS2.y, scale: PIP_POS2.s, yaw: 0.5, look: 0.6, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 7, p: { yaw: -0.6, look: -0.95, headTilt: -5 }, ease: easeOut },
    { f: 14, p: { yaw: -0.45, look: -0.7, headTilt: -1 }, ease: easeInOut },
    { f: 40, p: { yaw: -0.55, look: -0.75, armL: { a: 18, b: -10 } } },
    { f: len - 10, p: { armR: { a: 58, b: -22 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len * 0.4, 885], [len, 868]]), kf(t, [[0, 620], [len, 604]]), kf(t, [[0, 1.7], [len, 1.82]]))}>
      <Scene t={t + 70}>
        {/* Pip's long shadow stretches across the floor as he turns */}
        <ellipse cx={640} cy={950} rx={150} ry={20} fill="#000" opacity={0.3} />
      </Scene>
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10, 'smug'], [len - 20, 'happy']]) }} rimId="rimR" shadow={0.5} />
      {/* whistle-ish motion arc */}
      <path d={`M ${PIP_POS2.x + 60} ${PIP_POS2.y - 320} q 30 -20 54 4`} stroke="#E9C46A" strokeWidth={4} fill="none" strokeLinecap="round" opacity={clamp((t - len + 30) / 20)} />
    </g>
  );
};

// P1S7: just another normal day — deep two-shot, everyone in their own lane, drift apart
export const P1S7: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMMA_POS.x, EMMA_POS.y, EMMA_POS.s, { yaw: 0.2, look: 0.4, armL: { a: 10, b: -8 }, armR: { a: 14, b: -10 } }) },
    { f: len * 0.5, p: { headTilt: 3, armR: { a: 30, b: -20 } } },
    { f: len, p: { headTilt: 0 } },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP_POS.x - 160, y: PIP_POS.y, scale: PIP_POS.s * 0.85, yaw: -0.7, look: -0.6 } },
    { f: len * 0.4, p: { x: PIP_POS.x - 120, look: -0.4, headTilt: -3 } },
    { f: len, p: { x: PIP_POS.x - 90, headTilt: 0 } },
  ]);
  const mo = idle(MO_POS.x, MO_POS.y, MO_POS.s, { yaw: 0.5, look: 0.4 });
  const sis = idle(SIS_POS.x, SIS_POS.y, SIS_POS.s, { yaw: -0.5, look: -0.4 });
  return (
    <g transform={camT(kf(t, [[0, 1010], [len * 0.6, 995], [len, 980]]), kf(t, [[0, 610], [len, 592]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Scene t={t + 85} />
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.35} />
      <K.Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// P1S8: impossible — camera drops to floor level; Emma's shadow pool, figure peeling off
export const P1S8: React.FC<ShotProps> = ({ t, len }) => {
  const lift = kf(t, [[0, 0], [len * 0.4, -8], [len, -30]]);
  const stretch = kf(t, [[0, 1], [len * 0.5, 1.15], [len, 1.35]]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 972]]), kf(t, [[0, 790], [len, 772]]), kf(t, [[0, 1.6], [len, 1.95]]))}>
      <Scene t={t + 100} fg={false} />
      {/* Emma small at top, still unaware, friends around her */}
      <K.Hero look={EMMA} pose={idle(EMMA_POS.x + 60, EMMA_POS.y - 10, EMMA_POS.s * 0.9, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0} />
      <K.Hero look={FRIEND} pose={idle(MO_POS.x + 40, MO_POS.y + 6, MO_POS.s, { yaw: 0.4, look: 0.4 })} rimId="rimR" shadow={0} />
      {/* her shadow on the floor — pool first, then silhouette detaches and stretches */}
      <ellipse cx={1020} cy={806} rx={70 + stretch * 14} ry={13} fill="#000" opacity={0.42} />
      <g transform={`translate(1030 ${800 + lift * 0.4}) scale(${stretch} ${stretch}) translate(${-1030} ${-800})`}>
        <ShadowFigure x={1030} y={800} s={0.44} mood={t > len * 0.5 ? 'idle' : 'idle'} t={t} opacity={0.95} />
      </g>
      {/* the "impossible" tell: shadow clearly separated from her feet */}
      <Glow x={1030} y={750} r={240} o={0.1} />
    </g>
  );
};

// P1S9: her shadow was waving — silhouette beside her feet, clearly its own person
export const P1S9: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t * 0.35) * 6;
  const lean = Math.sin(t * 0.22) * 4;
  return (
    <g transform={camT(kf(t, [[0, 1030], [len * 0.5, 1012], [len, 998]]), kf(t, [[0, 800], [len, 784]]), kf(t, [[0, 1.5], [len, 1.78]]))}>
      <Scene t={t + 115} fg={false} />
      {/* Emma from the knees up, chatting on, oblivious — gesture loop continues */}
      <K.Hero look={EMMA} pose={poseAt(t, [
        { f: 0, p: idle(1030, 740, 0.95, { yaw: -0.2, look: -0.4, armR: { a: 26, b: -18 } }) },
        { f: len * 0.5, p: { armL: { a: 30, b: -20 }, headTilt: 3 } },
        { f: len, p: { armR: { a: 40, b: -24 } } },
      ])} {...{ ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* HER shadow: on the floor, waving hello — the star of the shot */}
      <ellipse cx={1140} cy={884} rx={85} ry={15} fill="#000" opacity={0.32} />
      <g transform={`translate(${lean} ${bob * 0.4})`}>
        <ShadowFigure x={1150} y={884} s={0.52} flip={-1} mood="wave" t={t * 1.4} />
      </g>
      {/* Pip's shocked eyes + hand entering frame right */}
      <g opacity={clamp((t - len * 0.5) / 12)}>
        <K.Hero look={YOU} pose={idle(1470, 890, 1.15, { yaw: -0.9, look: -0.95, headTilt: 4, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0} />
      </g>
      {/* eyeline Pip → shadow */}
      <path d="M 1390 800 L 1180 850" stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.4} />
    </g>
  );
};

// P1S10: you blinked — tight close-up, single slow blink, background falls to black
export const P1S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6;
  const pose: Pose = {
    ...K.basePose,
    x: 960,
    y: 620 - K.HEAD.y * sc,
    scale: sc,
    yaw: 0.12,
    look: -0.5,
    armL: { a: 12, b: -8 },
    armR: { a: 12, b: -8 },
    ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]),
    blink: kf(t, [[0, 0], [len * 0.4, 0], [len * 0.4 + 5, 1], [len * 0.4 + 10, 0], [len, 0]]),
  };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 972]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1], [len, 1.08]]))}>
      {/* faint hallway ghosts behind, sinking darker */}
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <rect x={1350} y={180} width={360} height={400} rx={10} fill="#F2B95C" opacity={0.05} />
      <rect x={120} y={220} width={200} height={340} rx={6} fill="#38315E" opacity={0.35} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={960} y={560} r={520} o={0.15} />
      {/* blink impact ticks at the moment eyes shut */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${880 - i * 30} ${480 + i * 60} l -18 -14 M ${1040 + i * 30} ${470 + i * 60} l 18 -14`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={clamp(1 - Math.abs(t - len * 0.4 - i * 4) / 8) * 0.7} />
      ))}
    </g>
  );
};

export const p1c1Shots: ShotMap = { P1S1, P1S2, P1S3, P1S4, P1S5, P1S6, P1S7, P1S8, P1S9, P1S10 };
