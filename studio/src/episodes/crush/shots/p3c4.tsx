import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c4 — her shadow holds an imaginary umbrella over both of you, then leans its
// head on your shoulder. You walk into a puddle. Emma: "Can I tell you something?"
// Brief: out/crush/scenes/p3c4_brief.md

const { Street, Rain, Umbrella, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, walkPose, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 860, s: 1.0 };
const EMP = { x: 1100, y: 845, s: 0.95 };
const SH_X = 960;
const SH_Y = 960;

const walkPair = (t: number, px: number, ex: number) => ({
  pip: { ...walkPose(px, t * 0.5, 868, 0.98, { yaw: 0.15, look: 0.25 }, 1), ...faceAt(t, [[0, 'neutral'] as const]) },
  emp: { ...walkPose(ex, t * 0.5 + 3, 855, 0.93, { yaw: -0.15, look: -0.25 }, -1), ...faceAt(t, [[0, 'happy'] as const]) },
});

// P3S31: you looked down — her shadow doing something strange; low shot on wet ground
export const P3S31: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = clamp((t - len * 0.35) / (len * 0.3));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 700], [len, 685]]), kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Street t={t} id="p4s" />
      <Rain t={t} n={80} o={0.5} />
      {/* their feet + two shadows on the wet ground */}
      <ellipse cx={760} cy={940} rx={80} ry={12} fill="#000" opacity={0.35} />
      <ellipse cx={1120} cy={935} rx={80} ry={12} fill="#000" opacity={0.35} />
      <ShadowFigure x={780} y={948} s={0.6} mood="idle" t={t} opacity={0.6} />
      <ShadowFigure x={1100} y={943} s={0.58} flip={-1} mood="idle" t={t} opacity={0.6} />
      {/* the stranger: her shadow steps between them, holding an umbrella */}
      <g opacity={reveal}>
        <ShadowFigure x={SH_X} y={SH_Y} s={0.62} flip={-1} mood="idle" t={t} />
        {/* imaginary umbrella: a dark canopy on a thin stick */}
        <g transform={`translate(${SH_X} ${SH_Y - 240}) rotate(-6)`}>
          <path d="M -60 0 Q -60 -64 0 -64 Q 60 -64 60 0 Q 45 -10 30 -2 Q 15 -10 0 -2 Q -15 -10 -30 -2 Q -45 -10 -60 0 Z" fill="#100C1C" />
          <path d="M 0 -64 L 0 20" stroke="#100C1C" strokeWidth={6} />
        </g>
      </g>
      {reveal > 0 ? <Glow x={SH_X} y={SH_Y - 140} r={240} o={0.14 * reveal} /> : null}
      <Tag x={960} y={420} t={t - len * 0.4} text="?" />
    </g>
  );
};

// P3S32: imaginary umbrella over both of you — medium, shadow between them
export const P3S32: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = walkPair(t, kf(t, [[0, PIP.x], [len, PIP.x + 120]]), kf(t, [[0, EMP.x], [len, EMP.x - 110]]));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Street t={t} id="p4t" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.7, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={745} s={0.55} tilt={8} />
      {/* the shadow's own umbrella, slightly bigger, covering both heads */}
      <ShadowFigure x={SH_X} y={SH_Y} s={0.6} flip={-1} mood="idle" t={t} />
      <g transform={`translate(${SH_X} ${SH_Y - 235}) rotate(-5)`}>
        <path d="M -72 0 Q -72 -76 0 -76 Q 72 -76 72 0 Q 54 -12 36 -2 Q 18 -12 0 -2 Q -18 -12 -36 -2 Q -54 -12 -72 0 Z" fill="#100C1C" opacity={0.9} />
        <path d="M 0 -76 L 0 26" stroke="#100C1C" strokeWidth={7} />
      </g>
      <Glow x={SH_X} y={SH_Y - 160} r={220} o={0.13} />
    </g>
  );
};

// P3S33: it leaned its head against your shoulder — close two-shot, shadow head tilts
export const P3S33: React.FC<ShotProps> = ({ t, len }) => {
  const lean = easeInOut(clamp((t - 3) / (len * 0.4)));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Street t={t} id="p4u" />
      <Rain t={t} n={90} o={0.5} />
      {/* Pip, unaware, looking forward */}
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s * 1.1, { yaw: 0.2, look: 0.2, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={830} y={745} s={0.55} tilt={8} />
      {/* the shadow's head slides toward Pip's shoulder */}
      <ShadowFigure x={lerp(SH_X, PIP.x + 120, lean * 0.55)} y={SH_Y} s={0.6} flip={-1} mood="idle" t={t} />
      {lean > 0.5 ? <Glow x={SH_X - 60} y={SH_Y - 200} r={200} o={0.12} /> : null}
      <Tag x={960} y={400} t={t - len * 0.3} text="?!" />
    </g>
  );
};

// P3S34: you almost walked into a puddle — Pip stumbles, water splash
export const P3S34: React.FC<ShotProps> = ({ t, len }) => {
  const stumble = Math.sin(clamp(t / len) * Math.PI);
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.2, look: 0.2 } },
    { f: len * 0.4, p: { x: PIP.x + 70, y: PIP.y - stumble * 30, squash: stumble * 0.15, headTilt: 10 }, ease: easeOut },
    { f: len * 0.8, p: { squash: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 570]]), kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Street t={t} id="p4v" />
      <Rain t={t} n={100} o={0.55} />
      {/* the puddle */}
      <ellipse cx={PIP.x + 180} cy={PIP.y + 60} rx={130} ry={20} fill="#8B7BB8" opacity={0.4} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 160} y={748} s={0.55} tilt={-2} />
      {/* splash */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={PIP.x + 160 + i * 30} cy={PIP.y + 20 - stumble * (40 + i * 15)} r={6 + i * 2} fill="#9FC0D6" opacity={stumble * 0.8} />
      ))}
    </g>
  );
};

// P3S35: Emma looked at you — she notices the wobble
export const P3S35: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.3 }) },
    { f: len * 0.5, p: { look: -0.6, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} id="p4w" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.2, look: 0.2, ...faceAt(t, [[0, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 160} y={748} s={0.55} tilt={-2} />
    </g>
  );
};

// P3S36: "Careful!" — Emma reaches out
export const P3S36: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.6, armL: { a: 30, b: -14 } }) },
    { f: len * 0.4, p: { armL: { a: 65, b: -28 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 585], [len, 578]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Street t={t} id="p4x" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.2, look: 0.2, ...faceAt(t, [[0, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 160} y={748} s={0.55} tilt={-2} />
      <Tag x={EMP.x - 120} y={EMP.y - 340} t={t - 2} text="!" />
    </g>
  );
};

// P3S37: "Yeah. Sorry." — Pip apologizes, still rattled
export const P3S37: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.2, look: 0.2, headTilt: 8 }) },
    { f: len * 0.4, p: { headTilt: 4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 585], [len, 580]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Street t={t} id="p4y" />
      <Rain t={t} n={100} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 160} y={748} s={0.55} tilt={-2} />
    </g>
  );
};

// P3S38: you continued walking — the pair resumes, shadow still there
export const P3S38: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, emp } = walkPair(t, kf(t, [[0, PIP.x + 60], [len, PIP.x + 260]]), kf(t, [[0, EMP.x - 60], [len, EMP.x - 240]]));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Street t={t} id="p4z" />
      <Rain t={t} n={110} o={0.55} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x + 160, EMP.x - 200, 0.5)} y={748} s={0.55} tilt={-3} />
      <ShadowFigure x={SH_X + 140} y={SH_Y} s={0.6} flip={-1} mood="idle" t={t} opacity={0.85} />
      <Glow x={SH_X + 140} y={SH_Y - 160} r={200} o={0.1} />
    </g>
  );
};

// P3S39: a few minutes later — transition: the pair further along, golden light shift
export const P3S39: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const { pip, emp } = walkPair(t * 0.7, kf(t, [[0, 700], [len, 560]]), kf(t, [[0, 1250], [len, 1380]]));
  return (
    <g transform={camT(kf(t, [[0, 975], [len, 955]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Street t={t} id="p5s" />
      <Rain t={t} n={90} o={0.4 * (1 - k * 0.5)} />
      {/* the sun breaking through */}
      <Glow x={1400} y={420} r={700} o={0.2 + k * 0.15} />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <Umbrella x={lerp(640, 960, k)} y={745} s={0.55} tilt={-4} />
      <ShadowFigure x={lerp(760, 1080, k)} y={SH_Y} s={0.6} flip={-1} mood="idle" t={t} opacity={0.8} />
    </g>
  );
};

// P3S40: "Can I tell you something?" — Emma stops, serious face
export const P3S40: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x, y: EMP.y, scale: EMP.s, yaw: -0.3, look: -0.5, headTilt: 0 } },
    { f: len * 0.5, p: { headTilt: 4, armL: { a: 40, b: -18 } }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.3, look: 0.4, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Street t={t} id="p5t" />
      <Rain t={t} n={90} o={0.45} />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.45} />
      <Umbrella x={lerp(PIP.x, EMP.x, 0.5) + 150} y={748} s={0.55} tilt={-4} />
      <ShadowFigure x={1000} y={SH_Y} s={0.6} flip={-1} mood="think" t={t} opacity={0.8} />
      <Tag x={960} y={400} t={t - 3} text="can I tell you…" />
    </g>
  );
};

export const p3c4Shots: ShotMap = {
  P3S31, P3S32, P3S33, P3S34, P3S35, P3S36, P3S37, P3S38, P3S39, P3S40,
};
