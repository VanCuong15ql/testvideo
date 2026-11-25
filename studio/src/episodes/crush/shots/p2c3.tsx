import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c3 — working together gets good; then the shadow gives Pip two thumbs-up
// beside his chair and he has to look away before Emma notices. Brief: p2c3_brief.md

const { Study, Desk, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, YOU, EMMA, FRIEND, SIS } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 620, y: 830, s: 1.0 };
const EMP = { x: 1080, y: 815, s: 0.95 };
const SH = { x: 830, y: 905 };   // beside Pip's chair

const Lib: React.FC<{ t: number; id?: string }> = ({ t, id = 'p3l' }) => <Study t={t + 700} id={id} veil={0.3} />;

// P2S21: "Wow. You agreed with me twice." — Emma counts on fingers, delighted
export const P2S21: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2 }) },
    { f: len * 0.4, p: { armL: { a: 60, b: -20 }, armR: { a: 62, b: -22 }, headTilt: -5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p3l1" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.45, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      {/* two tick marks — agreed twice */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${EMP.x + 130 + i * 46} ${EMP.y - 260})`} opacity={clamp((t - 4 - i * 5) / 6)}>
          <circle r={18} fill="none" stroke="#9BEFB0" strokeWidth={5} />
          <path d="M -8 0 l 6 8 l 12 -14" stroke="#9BEFB0" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

// P2S22: you laughed — Pip throws head back
export const P2S22: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.5, look: 0.4, headTilt: 0 } },
    { f: len * 0.4, p: { headTilt: -10, armR: { a: 55, b: -24 } }, ease: easeOut },
    { f: len * 0.7, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Lib t={t} id="p3l2" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      {/* laugh ticks */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${PIP.x + 90 + i * 30} ${PIP.y - 300 - i * 20} q 10 -12 22 0`} stroke="#E9C46A" strokeWidth={4} fill="none" opacity={clamp(1 - t * 0.05)} />
      ))}
    </g>
  );
};

// P2S23: "Should I disagree just to make things interesting?" — Pip mock-offended
export const P2S23: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4 }) },
    { f: len * 0.4, p: { armL: { a: 50, b: -26 }, headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p3l3" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S24: "Please don't." — Emma panics jokingly, hands up
export const P2S24: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2 }) },
    { f: len * 0.35, p: { armL: { a: 75, b: -16 }, armR: { a: 78, b: -14 }, headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p3l4" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'smug']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
    </g>
  );
};

// P2S25: her shadow was standing beside your chair — reveal, low beside Pip's desk
export const P2S25: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = clamp((t - len * 0.35) / (len * 0.3));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 640], [len, 625]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Lib t={t} id="p3l5" />
      <Desk x0={420} x1={760} y={880} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      {/* the shadow beside the chair — bigger than life, revealed late */}
      <ellipse cx={SH.x} cy={SH.y} rx={60} ry={10} fill="#000" opacity={0.3} />
      <ShadowFigure x={SH.x} y={SH.y} s={0.6} flip={-1} mood="idle" t={t} opacity={reveal} />
      {reveal > 0 ? <Glow x={SH.x} y={SH.y - 120} r={200} o={0.12 * reveal} /> : null}
    </g>
  );
};

// P2S26: two thumbs-up — close on the shadow's hands
export const P2S26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 840], [len, 830]]), kf(t, [[0, 800], [len, 790]]), kf(t, [[0, 2.6], [len, 2.8]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <ellipse cx={SH.x} cy={SH.y} rx={90} ry={14} fill="#000" opacity={0.35} />
    <ShadowFigure x={SH.x} y={SH.y} s={0.85} flip={-1} mood="thumb" t={t} />
    {/* both thumbs — the mood only raises one; add the second manually */}
    <g transform={`translate(${SH.x - 40} ${SH.y - 190})`}>
      <path d="M 0 0 q 6 -30 0 -44" stroke="#100C1C" strokeWidth={16} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-52} r={12} fill="#100C1C" />
    </g>
    <Glow x={SH.x} y={SH.y - 160} r={240} o={0.14} />
  </g>
);

// P2S27: you had to look away before Emma noticed — Pip drops eyes, fake scroll
export const P2S27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.55, look: 0.5 } },
    { f: len * 0.4, p: { look: -0.8, headTilt: 12, armL: { a: 55, b: -30 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Lib t={t} id="p3l6" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.2, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) })} rimId="rimR" shadow={0.4} />
      {/* Emma's gaze drifting toward Pip — almost caught */}
      <path d={`M ${EMP.x - 40} ${EMP.y - 300} L ${PIP.x + 40} ${PIP.y - 280}`} stroke="#E86A92" strokeWidth={3} strokeDasharray="6 8" opacity={clamp((t - len * 0.6) / 8) * 0.5} />
    </g>
  );
};

// P2S28: over the next few days it became enjoyable — montage: calendar pages flip
export const P2S28: React.FC<ShotProps> = ({ t, len }) => {
  const day = Math.floor(kf(t, [[0, 1], [len, 4]]));
  const flip = (t * 0.5) % 1;
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={480} r={520} o={0.14} />
      {/* desk scene miniaturized behind the calendar */}
      <g opacity={0.5} transform="translate(0 60)">
        <Lib t={t} id="p3l7" />
        <K.Hero look={YOU} pose={idle(700, 850, 0.7, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
        <K.Hero look={EMMA} pose={idle(1150, 840, 0.68, { yaw: -0.3, look: -0.2, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      </g>
      {/* calendar pages */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${700 + i * 180} 300) rotate(${(i - day) * 8})`} opacity={i === day ? 1 : 0.45}>
          <rect x={-70} y={-90} width={140} height={180} rx={8} fill={i === day ? '#F4EEE0' : '#3E5A8C'} stroke="#0D0A14" strokeWidth={3} />
          <text x={0} y={-58} textAnchor="middle" fontSize={26} fill={i === day ? '#3A3550' : '#C9D4EE'}>{['Mon', 'Tue', 'Wed', 'Thu'][i]}</text>
          <text x={0} y={20} textAnchor="middle" fontSize={54} fill={i === day ? '#0D0A14' : '#8B7BB8'} fontWeight="bold">{i + 12}</text>
          {i === day ? <path d="M -40 60 q 20 -14 40 0 q 20 14 40 0" stroke="#8B7BB8" strokeWidth={5} fill="none" /> : null}
        </g>
      ))}
      <Tag x={960} y={560} t={t - 5} text="good team" />
    </g>
  );
};

// P2S29: Emma organized but forgets details — she checks a list, misses a crossed item
export const P2S29: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.25, armL: { a: 50, b: -30 } }) },
    { f: len * 0.5, p: { headTilt: 8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 570], [len, 562]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Lib t={t} id="p3l8" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.45} />
      {/* her checklist — last item unchecked */}
      <g transform={`translate(${EMP.x + 110} ${EMP.y - 220}) rotate(4)`}>
        <rect x={-60} y={-80} width={120} height={160} rx={6} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={3} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={-46} y={-62 + i * 40} width={16} height={16} rx={3} fill={i < 2 ? '#3E8E5A' : '#D9534F'} opacity={0.9} />
            <rect x={-22} y={-58 + i * 40} width={70 - i * 12} height={9} rx={4} fill="#8A93AE" />
          </g>
        ))}
      </g>
    </g>
  );
};

// P2S30: you worry about minor things — Pip spirals over a tiny detail
export const P2S30: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: PIP.x, y: PIP.y, scale: PIP.s, yaw: 0.5, look: 0.4, headTilt: 0 } },
    { f: len * 0.4, p: { headTilt: 12, armL: { a: 45, b: -26 }, armR: { a: 48, b: -28 } }, ease: easeOut },
  ]);
  const spiral = clamp(t / len);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 570], [len, 562]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Lib t={t} id="p3l9" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: 0.3, look: 0.25, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.4} />
      {/* worry spiral above Pip's head */}
      <g transform={`translate(${PIP.x} ${PIP.y - 380})`} opacity={spiral}>
        <path d={`M 0 0 q ${30 * Math.sin(spiral * 9)} ${-30 * Math.cos(spiral * 9)} 0 -60`} stroke="#8B7BB8" strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle r={10} fill="#8B7BB8" opacity={0.8} />
      </g>
    </g>
  );
};

export const p2c3Shots: ShotMap = {
  P2S21, P2S22, P2S23, P2S24, P2S25, P2S26, P2S27, P2S28, P2S29, P2S30,
};
