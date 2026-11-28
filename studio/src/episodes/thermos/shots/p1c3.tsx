import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c3 — across the room: Minh Anh feels the cold matcha through YOUR thermos.
// She shudders, winces, hugs her cheek, and her eyes snap straight to you. P1S17–P1S20.
// Set: Classroom, camera on Minh Anh's desk across the room.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, YOU, MINH, idle, Cls } = K;

const MA = { x: 1180, y: 780, s: 0.9 };
const MA_DESK = { x: 1180, y: 842 };
const PIP = K.CLS_YOU;

// P1S17: "Nhưng ở dãy bàn bên kia... Minh Anh đột ngột rung mình, nhăn tít mũi," —
// she jolts upright, nose scrunches, thermos (YOURS) on her desk
export const P1S17: React.FC<ShotProps> = ({ t, len }) => {
  const jolt = t < 8 ? 0 : Math.exp(-(t - 8) / 9) * Math.sin((t - 8) * 0.7);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.3, look: -0.5, headTilt: 0 }) },
    { f: 8, p: { y: MA.y - 26, headTilt: -8, armL: { a: 20, b: -14 }, armR: { a: 25, b: -18 } } },
    { f: len * 0.5, p: { y: MA.y, headTilt: 6 } },
    { f: len, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1170]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.55], [len * 0.3, 1.7], [len, 1.62]]))}>
      <Cls t={t} />
      {/* her desk */}
      <g transform={`translate(${MA_DESK.x} ${MA_DESK.y}) scale(${MA.s})`}>
        <rect x={-95} y={-14} width={190} height={16} rx={4} fill="#8A6242" stroke={K.INK} strokeWidth={4} />
        <rect x={-85} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
        <rect x={71} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
      </g>
      {/* YOUR grey thermos sitting on her desk */}
      <g transform={`translate(${MA_DESK.x + 30} ${MA_DESK.y - 40}) scale(${0.62 * MA.s}) rotate(${Math.sin(t * 0.4) * 2})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* cold aura creeping from the thermos toward her */}
      <Glow x={MA_DESK.x + 30} y={MA_DESK.y - 60} r={140} kind="cool" o={0.3 * clamp((t - 6) / 14)} />
      <g transform={`translate(${MA.x} ${MA.y - 30 + jolt * 8}) scale(${MA.s})`}>
        <K.Hero look={MINH} pose={{ ...ma, y: ma.y + jolt * 10, ...faceAt(t, [[0, 'neutral'], [10, 'shock'], [len * 0.5, 'worried'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      </g>
      {/* cold puffs around her face */}
      {[0, 1, 2].map((i) => {
        const pt = (t * 1.1 + i * 18) % 54;
        return <circle key={i} cx={MA.x - 60 + i * 55 + pt * 0.7} cy={MA.y - 220 - pt * 0.9} r={9 + pt * 0.25} fill="#BFE8FF" opacity={clamp(1 - pt / 54) * 0.6} />;
      })}
      <FloatTag3 t={t} at={12} text="RÙNG MÌNH!" x={MA.x - 150} y={MA.y - 330} color="#BFE8FF" />
    </g>
  );
};

// P1S18: "rồi đưa tay ôm má như vừa nếm phải thứ gì đó cực kỳ lạnh hoặc chát." —
// hand to cheek, eyes squeezed, shiver lines
export const P1S18: React.FC<ShotProps> = ({ t, len }) => {
  const hug = easeOut(clamp((t - 6) / 16));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.3, look: -0.5, headTilt: 10 }) },
    { f: len * 0.5, p: { armR: { a: lerp(20, 85, hug), b: lerp(-14, -55, hug) }, headTilt: 12, look: -0.7 } },
    { f: len, p: { armR: { a: 80, b: -50 }, headTilt: 10 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1165]]), 575, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Cls t={t} />
      <g transform={`translate(${MA.x} ${MA.y}) scale(${MA.s})`}>
        <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'worried'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      </g>
      {/* shiver marks */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${MA.x + 90 + i * 26} ${MA.y - 260 + i * 30})`} opacity={0.7}>
          <path d={`M 0 -14 q 8 7 0 14 q -8 -7 0 -14`} fill="none" stroke="#BFE8FF" strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      {/* "cold!" mini bubble */}
      <Say x={1480} y={360} tx={MA.x + 40} ty={MA.y - 260} text="LẠNH QUÁ!" at={len * 0.3} until={len * 0.95} t={t} fs={36} />
    </g>
  );
};

// P1S19: "Ánh mắt của ấy lia thẳng sang bạn." — her eyes snap LEFT toward Pip (off-screen)
export const P1S19: React.FC<ShotProps> = ({ t, len }) => {
  const snap = easeOut(clamp((t - 8) / 8));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.3, look: -0.6, headTilt: 8 }) },
    { f: len * 0.4, p: { yaw: -0.5 * snap - 0.2, look: -1 * snap - 0.2, headTilt: 6 } },
    { f: len, p: {} },
  ]);
  // eye-line: dashed sight line from her eyes to bottom-left (Pip's desk)
  const eyeX = MA.x - 24 * MA.s, eyeY = MA.y - 168 * MA.s;
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1080]]), kf(t, [[0, 570], [len, 600]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Cls t={t} />
      <g transform={`translate(${MA.x} ${MA.y}) scale(${MA.s})`}>
        <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'shock'], [len, 'shock']]) }} rimId="rimL" shadow={0.4} />
      </g>
      {/* sight line */}
      <line x1={eyeX} y1={eyeY} x2={lerp(eyeX, 480, snap)} y2={lerp(eyeY, 830, snap)} stroke="#FFE9B0" strokeWidth={4} strokeDasharray="12 10" opacity={0.8 * snap} />
      <circle cx={eyeX} cy={eyeY} r={10 * snap} fill="none" stroke="#FFE9B0" strokeWidth={4} opacity={snap} />
      <FloatTag3 t={t} at={12} text="NHÌN BẠN!" x={MA.x - 180} y={MA.y - 340} color="#FFE9B0" />
    </g>
  );
};

// P1S20: "Cơ chế kỳ hoạt này lập tức lộ rõ quy luật." — YOU's face, eyes widen, idea spark
export const P1S20: React.FC<ShotProps> = ({ t, len }) => {
  const spark = t > len * 0.4 ? backOut(clamp((t - len * 0.4) / 12)) : 0;
  const pose = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.4, look: 0.4,
    ...faceAt(t, [[0, 'shock'], [len * 0.4, 'neutral'], [len, 'smug']]),
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 970]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0.5} />
      {/* idea bulb over head */}
      <g transform={`translate(${PIP.x + 120} ${PIP.y - 300}) scale(${spark})`} opacity={clamp(spark)}>
        <circle cx={0} cy={0} r={40} fill="#FFE9A8" stroke={K.INK} strokeWidth={5} />
        <rect x={-10} y={34} width={20} height={14} rx={4} fill="#B98A4E" stroke={K.INK} strokeWidth={4} />
        <path d="M -14 -8 L 14 -8 M -18 6 L 18 6" stroke={K.INK} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={-8} y1={-18} x2={-16} y2={-30} stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-18} x2={16} y2={-30} stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <Glow x={PIP.x + 120} y={PIP.y - 300} r={90} o={0.3 * spark} />
      <Tag x={PIP.x - 140} y={PIP.y - 330} t={t + 14} text="QUY LUẬT!" w={200} />
    </g>
  );
};

const FloatTag3: React.FC<{ t: number; at: number; text: string; x: number; y: number; color?: string }> = ({ t, at, text, x, y, color = '#FFE9B0' }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 45);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.7})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={40} fontWeight={700} fill={color} stroke={K.INK} strokeWidth={6} paintOrder="stroke">{text}</text>
    </g>
  );
};

export const p1c3Shots: ShotMap = { P1S17, P1S18, P1S19, P1S20 };
