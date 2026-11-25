import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c2 — the shadow's small treasons: it isn't waving (it's holding books),
// then it points, makes a heart, and Pip almost drops his backpack.
// Rich set: Hallway + HallForeground; shadow gets its own spotlight treatment.

const { HALL, Hallway, HallForeground, ShadowFigure, Notebook, Backpack, Tag, Glow, camT, kf, clamp, lerp, poseAt, faceAt, easeOut, easeInOut, YOU, EMMA, FRIEND, SIS } = K;

const EMP = { x: 960, y: HALL.far.y, s: HALL.far.s };
const MO = { x: 700, y: 706, s: 0.74 };
const SISP = { x: 1230, y: 700, s: 0.7 };
const PIP = { x: 1380, y: 860, s: 1.02 };

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

// the floor spot where Emma's shadow lives
const SH_X = 1060;
const SH_Y = 812;

const Scene: React.FC<{ t: number; children?: React.ReactNode; fg?: boolean }> = ({ t, children, fg = true }) => (
  <g>
    <Hallway t={t} />
    {children}
    {fg ? <HallForeground t={t} /> : null}
  </g>
);

// P1S11: she wasn't waving — medium on Emma; her shadow stands quiet, arms at sides
export const P1S11: React.FC<ShotProps> = ({ t, len }) => {
  const emma = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.25, look: 0.4, armL: { a: 20, b: -30 }, armR: { a: 22, b: -28 } }) },
    { f: len * 0.4, p: { armL: { a: 14, b: -20 }, armR: { a: 16, b: -22 } } },
    { f: len * 0.75, p: { armR: { a: 34, b: -24 }, headTilt: -3 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: idle(MO.x, MO.y, MO.s, { yaw: 0.4, look: 0.5 }) },
    { f: len * 0.6, p: { armL: { a: 38, b: -30 }, headTilt: 4 } },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: idle(SISP.x, SISP.y, SISP.s, { yaw: -0.4, look: -0.5 }) },
    { f: len * 0.5, p: { armR: { a: 34, b: -26 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len * 0.5, 988], [len, 976]]), kf(t, [[0, 600], [len, 588]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Scene t={t + 130}>
        <ellipse cx={SH_X} cy={SH_Y} rx={64} ry={12} fill="#000" opacity={0.35} />
        <ShadowFigure x={SH_X} y={SH_Y} s={0.44} mood="idle" t={t} />
      </Scene>
      <K.Hero look={FRIEND} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.35} />
      <K.Hero look={EMMA} pose={{ ...emma, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.35} />
    </g>
  );
};

// P1S12: insert — both her hands still holding her books; shadow behind holds air
export const P1S12: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...K.basePose, x: 960, y: 800, scale: 1.6, yaw: 0.1, look: 0, armL: { a: 42, b: 30 }, armR: { a: 44, b: 32 } };
  const j = K.joints(pose);
  const lH = K.toWorld(pose, j.armL.end), rH = K.toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 968]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.3], [len, 1.42]]))}>
      <Hallway t={t + 140} />
      {/* Emma medium close, arms wrapped around a stack of books */}
      <K.Hero look={EMMA} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.3} />
      {/* the books themselves, gripped in both hands */}
      <g transform={`translate(${(lH.x + rH.x) / 2} ${(lH.y + rH.y) / 2 + 10}) rotate(-3)`}>
        <rect x={-70} y={-46} width={140} height={92} rx={6} fill="#3E5A8C" stroke={K.INK} strokeWidth={4} />
        <rect x={-70} y={-46} width={140} height={18} rx={6} fill="#E9C46A" stroke={K.INK} strokeWidth={3} />
        <line x1={-50} y1={-8} x2={50} y2={-8} stroke="#C9D4EE" strokeWidth={3} opacity={0.7} />
        <line x1={-50} y1={8} x2={50} y2={8} stroke="#C9D4EE" strokeWidth={3} opacity={0.7} />
      </g>
      {/* behind her, out of focus: her shadow holding nothing — arms slack */}
      <g opacity={0.5}>
        <ShadowFigure x={1000} y={930} s={0.55} mood="idle" t={t} />
      </g>
      <Tag x={960} y={300} t={t - 3} text="both hands: still on the books" />
    </g>
  );
};

// P1S13: but her shadow? — dramatic beat, camera pushes toward the floor shadow
export const P1S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 990], [len, 1005]]), kf(t, [[0, 700], [len, 690]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
    <Hallway t={t + 155} />
    <ellipse cx={1060} cy={816} rx={70} ry={13} fill="#000" opacity={0.4} />
    {/* the shadow, mid-frame, lit by a violet rim so it reads as "the impossible" */}
    <Glow x={1060} y={700} r={300} o={0.22} />
    <ShadowFigure x={1060} y={816} s={0.5} mood="idle" t={t} />
    <text x={1060} y={560} textAnchor="middle" fontSize={60} fill="#8B7BB8" opacity={0.85} fontStyle="italic">…but her shadow?</text>
  </g>
);

// P1S14: it was waving like it spotted a celebrity — shadow wave + sparkle stars
export const P1S14: React.FC<ShotProps> = ({ t, len }) => {
  const waveRot = Math.sin(t * 0.4) * 16;
  const sparkle = [0, 1, 2, 3].map((i) => {
    const k = (t * 0.8 + i * 0.25) % 1;
    return { x: SH_X + 60 + i * 34, y: SH_Y - 190 - k * 60, o: Math.sin(k * Math.PI) };
  });
  return (
    <g transform={camT(kf(t, [[0, 1020], [len * 0.5, 1005], [len, 995]]), kf(t, [[0, 780], [len, 762]]), kf(t, [[0, 1.6], [len, 1.9]]))}>
      <Hallway t={t + 170} />
      {/* Emma tiny at top, still chatting with friends */}
      <K.Hero look={EMMA} pose={idle(EMP.x + 30, EMP.y - 6, EMP.s * 0.85, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0} />
      <K.Hero look={FRIEND} pose={idle(MO.x + 40, MO.y + 4, MO.s, { yaw: 0.4, look: 0.4 })} rimId="rimR" shadow={0} />
      {/* HER shadow: full celebrity-worship wave */}
      <ellipse cx={SH_X + 20} cy={SH_Y + 6} rx={90} ry={16} fill="#000" opacity={0.35} />
      <Glow x={SH_X} y={SH_Y - 120} r={280} o={0.18} />
      <g transform={`rotate(${waveRot * 0.4} ${SH_X} ${SH_Y - 60})`}>
        <ShadowFigure x={SH_X + 20} y={SH_Y + 6} s={0.55} flip={-1} mood="wave" t={t * 1.5} />
      </g>
      {/* excited sparkles around the waving hand */}
      {sparkle.map((sp, i) => (
        <path key={i} d={`M ${sp.x} ${sp.y} l 6 -10 M ${sp.x} ${sp.y} l -6 -10 M ${sp.x} ${sp.y} l 10 0`} stroke="#FFE9B0" strokeWidth={3} strokeLinecap="round" opacity={sp.o * 0.9} />
      ))}
    </g>
  );
};

// P1S15: you stared at it — Pip frozen, eyes locked downward; slow push
export const P1S15: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x - 40, y: PIP.y, scale: PIP.s, yaw: 0.7, look: 0.9, headTilt: 14 } },
    { f: len * 0.5, p: { look: 0.95, headTilt: 16 } },
    { f: len, p: { headTilt: 15, armL: { a: 10, b: -8 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1100]]), kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.7], [len, 1.95]]))}>
      <Hallway t={t + 185} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* eyeline down to the shadow spot */}
      <path d={`M ${PIP.x - 60} ${PIP.y - 300} L ${SH_X + 90} ${SH_Y - 40}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
      <Glow x={SH_X} y={SH_Y - 100} r={240} o={0.15} />
    </g>
  );
};

// P1S16: it pointed at you, then made a heart — two-beat shadow performance
export const P1S16: React.FC<ShotProps> = ({ t, len }) => {
  const heartK = easeOut(clamp((t - len * 0.45) / (len * 0.35)));
  const pointK = clamp(t / (len * 0.4));
  return (
    <g transform={camT(kf(t, [[0, 1020], [len * 0.5, 1010], [len, 1000]]), kf(t, [[0, 780], [len, 764]]), kf(t, [[0, 1.55], [len, 1.8]]))}>
      <Hallway t={t + 200} />
      <K.Hero look={EMMA} pose={idle(EMP.x + 30, EMP.y - 6, EMP.s * 0.85, { yaw: 0.3, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0} />
      {/* THE SHADOW: point at Pip (first half) → both hands heart (second half) */}
      <ellipse cx={SH_X + 10} cy={SH_Y + 4} rx={90} ry={15} fill="#000" opacity={0.35} />
      <Glow x={SH_X} y={SH_Y - 130} r={300} o={0.16 + heartK * 0.14} />
      <ShadowFigure x={SH_X + 10} y={SH_Y + 4} s={0.55} flip={-1} mood={heartK > 0.5 ? 'heart' : 'point'} t={t * 1.4} />
      {/* point emphasis line toward Pip */}
      <path d={`M ${SH_X + 60} ${SH_Y - 190} L ${PIP.x - 120} ${PIP.y - 60}`} stroke="#8B7BB8" strokeWidth={4} strokeDasharray="8 10" opacity={(1 - heartK) * 0.6 * pointK} />
      {/* heart burst particles on the reveal */}
      {[0, 1, 2, 3, 4].map((i) => {
        const k = clamp((t - len * 0.45 - i * 4) / 20);
        const a = (i / 5) * Math.PI * 2;
        return k > 0 && k < 1 ? (
          <circle key={i} cx={SH_X + 10 + Math.cos(a) * (40 + k * 90)} cy={SH_Y - 190 - k * 120 + Math.sin(a) * 30} r={6 * (1 - k)} fill="#E86A92" opacity={(1 - k) * 0.8} />
        ) : null;
      })}
    </g>
  );
};

// P1S17: you almost dropped your backpack — slip + flail, bag tilts hard
export const P1S17: React.FC<ShotProps> = ({ t, len }) => {
  const slip = Math.sin(clamp(t / (len * 0.6)) * Math.PI);
  const flail = Math.sin(t * 2.4) * 18 * slip;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1105]]), kf(t, [[0, 630], [len, 612]]), kf(t, [[0, 1.8], [len, 2.05]]))}>
      <Hallway t={t + 215} />
      <K.Hero look={YOU} pose={idle(PIP.x - 30, PIP.y + slip * 14, PIP.s, { yaw: 0.7, look: 0.95, headTilt: 16, armL: { a: 50 + flail * 0.4, b: -40 }, armR: { a: 55 - flail * 0.4, b: -42 }, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0.5} />
      {/* the backpack slipping off one shoulder */}
      <Backpack x={PIP.x - 90} y={PIP.y - 140 + slip * 30} s={0.85} rot={-18 * slip} slip={slip} />
      {/* motion chaos lines */}
      <path d={`M ${PIP.x - 160} ${PIP.y - 300} l -30 -18 M ${PIP.x - 170} ${PIP.y - 260} l -36 -8 M ${PIP.x + 120} ${PIP.y - 280} l 30 -16`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.6 * slip} />
      <Glow x={PIP.x} y={PIP.y - 160} r={260} o={0.14} />
    </g>
  );
};

// P1S18: you looked back at Emma — Pip's head turns, double-checking she's normal
export const P1S18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x - 30, y: PIP.y + 10, scale: PIP.s, yaw: 0.7, look: 0.95, headTilt: 14 } },
    { f: len * 0.45, p: { yaw: -0.2, look: -0.2, headTilt: -6 }, ease: easeInOut },
    { f: len * 0.8, p: { yaw: -0.15, look: -0.1, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1020]]), kf(t, [[0, 640], [len, 615]]), kf(t, [[0, 1.55], [len, 1.78]]))}>
      <Hallway t={t + 230} />
      {/* Emma perfectly normal — mid-laugh with friends, zero idea */}
      <K.Hero look={EMMA} pose={poseAt(t, [
        { f: 0, p: idle(EMP.x + 20, EMP.y - 4, EMP.s * 1.0, { yaw: 0.2, look: -0.3, armR: { a: 30, b: -22 } }) },
        { f: len * 0.5, p: { headTilt: 6, armL: { a: 26, b: -18 } } },
        { f: len, p: { headTilt: 2 } },
      ])} {...{ ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={FRIEND} pose={idle(MO.x + 30, MO.y + 2, MO.s, { yaw: 0.45, look: 0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried'], [len * 0.85, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      {/* contrast ring: real Emma vs. the shadow still waving behind */}
      <ShadowFigure x={SH_X + 20} y={SH_Y + 6} s={0.5} flip={-1} mood="wave" t={t * 1.3} opacity={0.9} />
    </g>
  );
};

// P1S19: she was still chatting, completely unaware — split attention: her joy vs shadow's wave
export const P1S19: React.FC<ShotProps> = ({ t, len }) => {
  const laugh = Math.sin(t * 0.5) * 4;
  return (
    <g transform={camT(kf(t, [[0, 990], [len * 0.6, 975], [len, 965]]), kf(t, [[0, 595], [len, 578]]), kf(t, [[0, 1.5], [len, 1.68]]))}>
      <Hallway t={t + 250} />
      {/* the friend group, full noise */}
      <K.Hero look={EMMA} pose={idle(EMP.x + 10, EMP.y - 8 + laugh * 0.3, EMP.s, { yaw: 0.25, look: -0.35, headTilt: 8 + laugh * 0.4, armR: { a: 44, b: -30 }, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={FRIEND} pose={idle(MO.x + 20, MO.y, MO.s, { yaw: 0.5, look: 0.45, headTilt: 6, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={SIS} pose={idle(SISP.x, SISP.y, SISP.s, { yaw: -0.4, look: -0.45, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      {/* meanwhile, below them: the shadow keeps waving, bigger, more enthusiastic */}
      <ellipse cx={SH_X + 20} cy={SH_Y + 8} rx={95} ry={16} fill="#000" opacity={0.35} />
      <Glow x={SH_X + 20} y={SH_Y - 140} r={320} o={0.2} />
      <ShadowFigure x={SH_X + 20} y={SH_Y + 8} s={0.58} flip={-1} mood="wave" t={t * 1.6} />
      <Tag x={960} y={290} t={t - 8} text="completely unaware" />
    </g>
  );
};

// P1S20: you quickly walked into your classroom — Pip exits frame toward the doors
export const P1S20: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp(t / (len * 0.75)));
  const px = kf(t, [[0, 560], [len * 0.75, 1150], [len, 1250]]);
  const stride = Math.sin(t * 0.9);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 1010]]), kf(t, [[0, 585], [len, 590]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Hallway t={t + 270} />
      {/* Emma group shrinking behind him, still mid-chat */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y - 10, EMP.s * 0.8, { yaw: 0.3, look: -0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      {/* Pip walking away — back to camera, quick steps, glancing back once */}
      <K.Hero look={YOU} pose={poseAt(t, [
        { f: 0, p: { x: px, y: 850, scale: 0.98, yaw: 0.5, look: 0.6, legL: { a: -14 * stride, b: 10 }, legR: { a: 14 * stride, b: -10 } } },
        { f: len * 0.4, p: { yaw: 0.2, look: -0.6, headTilt: 6 } },
        { f: len * 0.75, p: { yaw: 0.5, look: 0.6, headTilt: 0 } },
        { f: len, p: { x: px, legL: { a: 0, b: 0 }, legR: { a: 0, b: 0 } } },
      ])} {...{ ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      {/* his backpack bouncing on his back */}
      <Backpack x={px - 40} y={720 + Math.abs(stride) * 8} s={0.8} rot={stride * 4} />
      {/* speed lines — he IS walking fast */}
      <path d={`M ${px - 140} ${760} l -36 8 M ${px - 150} ${800} l -42 2 M ${px - 130} ${840} l -34 -6`} stroke="#E9C46A" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
      {/* the shadow's wave follows him, sad to see him go — small beat */}
      <ShadowFigure x={SH_X + 20} y={SH_Y + 8} s={0.5} flip={-1} mood="idle" t={t} opacity={0.85} />
      <Tag x={960} y={300} t={t - 4} text="classroom. now." />
    </g>
  );
};

export const p1c2Shots: ShotMap = {
  P1S11, P1S12, P1S13, P1S14, P1S15, P1S16, P1S17, P1S18, P1S19, P1S20,
};
