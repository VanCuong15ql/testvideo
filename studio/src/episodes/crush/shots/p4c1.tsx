import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c1 — the school festival: class game booth, you and Emma decorate it,
// she holds up a sign, you critique the letters. Brief: out/crush/scenes/p4c1_brief.md

const { Classroom, Booth, Glow, Tag, camT, kf, clamp, lerp, easeOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1100, y: 815, s: 0.95 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'f1a' }) => <Classroom t={t + 900} id={id} />;

// P4S1: title beat
export const P4S1: React.FC<ShotProps> = ({ t }) => {
  const inK = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45 * inK} />
      <g transform={`translate(960 520) scale(${0.7 + 0.3 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={76} fill="#F2E3C9" fontStyle="italic">The School Festival</text>
        <line x1={-300} y1={36} x2={300} y2={36} stroke="#E86A92" strokeWidth={4} opacity={0.8} />
      </g>
    </g>
  );
};

// P4S2: a week later — announcement: confetti + festival bunting over classroom
export const P4S2: React.FC<ShotProps> = ({ t, len }) => {
  const confetti = Array.from({ length: 40 }, (_, i) => {
    const k = (t * 0.4 + i * 0.37) % 1;
    return { x: (i * 97) % 1920, y: -20 + k * 900, r: 4 + (i % 3) * 2, c: ['#E86A92', '#E9C46A', '#3E8E5A', '#3E6FB8', '#8B7BB8'][i % 5], o: clamp(1 - k * 0.4) };
  });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 560], [len, 552]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f1b" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.3, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      {confetti.map((c, i) => <rect key={i} x={c.x} y={c.y} width={c.r * 2} height={c.r * 3} rx={2} fill={c.c} opacity={c.o * 0.8} transform={`rotate(${i * 40} ${c.x} ${c.y})`} />)}
      <Tag x={960} y={300} t={t - 4} text="FESTIVAL WEEK" />
    </g>
  );
};

// P4S3: every class prepares an activity — montage of booth icons
export const P4S3: React.FC<ShotProps> = ({ t, len }) => {
  const icons = ['game', 'stall', 'draw', 'throw', 'music'];
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={500} r={560} o={0.14} />
      <text x={960} y={240} textAnchor="middle" fontFamily="Georgia, serif" fontSize={48} fill="#F2E3C9" fontStyle="italic">every class makes something</text>
      {icons.map((ic, i) => {
        const k = clamp((t - i * 5) / 8);
        return (
          <g key={i} transform={`translate(${560 + i * 200} ${520 + Math.sin(i * 1.2) * 30}) scale(${k})`} opacity={k}>
            <rect x={-70} y={-70} width={140} height={140} rx={16} fill="#3E5A8C" stroke="#8B7BB8" strokeWidth={4} />
            <text x={0} y={16} textAnchor="middle" fontFamily="Georgia, serif" fontSize={30} fill="#F2E3C9" fontStyle="italic">{icons[i]}</text>
          </g>
        );
      })}
    </g>
  );
};

// P4S4: your class runs a game booth — the Booth appears
export const P4S4: React.FC<ShotProps> = ({ t, len }) => {
  const pop = easeOut(clamp((t - 4) / 12));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.3], [len, 1.42]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <g transform={`translate(960 540) scale(${0.6 + 0.4 * pop}) translate(-960 -540)`}>
        <Booth t={t} sign="LUCKY DRAW" />
      </g>
      <Glow x={960} y={520} r={600} o={0.2} />
      <Tag x={960} y={220} t={t - 8} text="our class booth" />
    </g>
  );
};

// P4S5: you and Emma end up decorating it — two figures at the booth
export const P4S5: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.3, armL: { a: 60, b: -24 } }) },
    { f: len * 0.5, p: { armL: { a: 70, b: -16 } }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, armR: { a: 55, b: -28 }, ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 575], [len, 562]]), kf(t, [[0, 1.35], [len, 1.48]]))}>
      <Cls t={t} id="f1c" />
      <Booth t={t} sign="?" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* paper scraps + tape everywhere */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={700 + i * 130} y={720 + (i % 2) * 40} width={46} height={34} rx={3} fill={['#E86A92', '#E9C46A', '#3E8E5A', '#3E6FB8', '#F4EEE0'][i]} opacity={0.85} transform={`rotate(${i * 17 - 30} ${722 + i * 130} ${737})`} />
      ))}
    </g>
  );
};

// P4S6: after school — colorful paper, markers, tape, cardboard pile
export const P4S6: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f1d" />
      {/* cardboard pile foreground */}
      <g transform="translate(300 880) rotate(-4)">
        <rect x={-140} y={-60} width={280} height={120} rx={8} fill="#B08A5A" stroke="#0D0A14" strokeWidth={4} />
        <rect x={-120} y={-95} width={240} height={60} rx={8} fill="#C49A68" stroke="#0D0A14" strokeWidth={4} transform="rotate(3)" />
      </g>
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.3, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      {/* markers + tape roll on the floor */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1500 + i * 40} y={900} width={26} height={90} rx={8} fill={['#E86A92', '#3E6FB8', '#3E8E5A'][i]} transform={`rotate(${i * 12 - 10} ${1513 + i * 40} 945)`} />
      ))}
      <circle cx={1330} cy={930} r={26} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={3} />
      <circle cx={1330} cy={930} r={10} fill="#8A93AE" />
    </g>
  );
};

// P4S7: Emma held up a sign — she lifts a hand-lettered card
export const P4S7: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.3, armL: { a: 30, b: -16 } }) },
    { f: len * 0.5, p: { armL: { a: 75, b: -20 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f1e" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* the sign, rising into frame */}
      <g transform={`translate(${EMP.x - 130} ${EMP.y - 330 - easeOut(clamp((t - 5) / 10)) * 30}) rotate(-4)`}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fill="#3A3550">WIN!</text>
        <path d="M -60 -34 q 30 -16 60 0 M -50 4 q 25 -12 50 0" stroke="#E86A92" strokeWidth={6} fill="none" />
      </g>
    </g>
  );
};

// P4S8: "Does this look good?" — Emma asks hopefully
export const P4S8: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.3, armL: { a: 75, b: -20 }, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: 0 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f1f" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.4} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      {/* sign held steady */}
      <g transform={`translate(${EMP.x - 130} ${EMP.y - 360}) rotate(-4)`}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fill="#3A3550">WIN!</text>
        <path d="M -60 -34 q 30 -16 60 0 M -50 4 q 25 -12 50 0" stroke="#E86A92" strokeWidth={6} fill="none" />
      </g>
      <path d={`M ${EMP.x - 220} ${EMP.y - 420} q 16 -14 34 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={clamp(1 - t * 0.05)} />
    </g>
  );
};

// P4S9: you tilted your head — Pip studying it
export const P4S9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: -12, look: 0.45 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 570], [len, 562]]), kf(t, [[0, 1.6], [len, 1.72]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={520} r={480} o={0.13} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      {/* magnifier over the sign */}
      <g transform={`translate(${PIP.x + 150} ${PIP.y - 260})`} opacity={clamp(t / 8)}>
        <circle r={46} fill="#8FD3FF" opacity={0.18} stroke="#E9C46A" strokeWidth={6} />
        <path d="M 32 32 L 58 58" stroke="#E9C46A" strokeWidth={8} strokeLinecap="round" />
      </g>
    </g>
  );
};

// P4S10: "Maybe the letters should be bigger." — critique, sign zoom comparison
export const P4S10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.35, armR: { a: 45, b: -20 } }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -26 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f1g" />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'worried']]) })} rimId="rimR" shadow={0.4} />
      {/* side-by-side: current vs bigger letters */}
      <g transform={`translate(${EMP.x - 130} ${EMP.y - 360}) rotate(-4)`}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} />
        <text x={0} y={16} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fill="#3A3550">WIN!</text>
      </g>
      <g transform={`translate(${EMP.x - 130} ${EMP.y - 560}) rotate(-4)`} opacity={clamp((t - len * 0.4) / 8)}>
        <rect x={-90} y={-60} width={180} height={120} rx={8} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} />
        <text x={0} y={24} textAnchor="middle" fontFamily="Georgia, serif" fontSize={52} fill="#3A3550">WIN!</text>
      </g>
      <Tag x={EMP.x - 130} y={EMP.y - 640} t={t - len * 0.5} text="bigger" />
    </g>
  );
};

export const p4c1Shots: ShotMap = {
  P4S1, P4S2, P4S3, P4S4, P4S5, P4S6, P4S7, P4S8, P4S9, P4S10,
};
