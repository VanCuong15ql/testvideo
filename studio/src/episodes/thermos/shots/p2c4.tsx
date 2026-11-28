import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c4 — the flirty goodbye: "nhớ uống nhiều nước", "biết cậu đang khát hay đang lén nhìn tớ",
// she winks and leaves; Khải has the last laugh. P2S29–P2S37.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, easeInOut, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const KH = { x: 880, y: 818, s: 0.94 };
const MA = { x: 1020, y: 798, s: 0.95 };
const MA_EXIT = { x: 1450, y: 755, s: 0.8 };

// P2S29: "Hôm nay vui thật đấy, nhớ uống nhiều nước vào nhé, không là tớ biết ngay đấy." —
// she leans in close, warm smile
export const P2S29: React.FC<ShotProps> = ({ t, len }) => {
  const lean = easeOut(clamp(t / 22));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, headTilt: 0 }) },
    { f: len * 0.6, p: { x: MA.x - 30 * lean, yaw: -0.55, look: -0.8, headTilt: -4, armR: { a: 35, b: -24 } } },
    { f: len, p: {} },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }) },
    { f: len * 0.6, p: { yaw: 0.3, look: 0.3, headTilt: 4 } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 990]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.35], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1300} y={320} tx={MA.x + 10} ty={MA.y - 240} text="Hôm nay vui thật đấy! Nhớ uống nhiều nước nhé~" at={4} until={len * 0.6} t={t} fs={36} maxW={600} />
      {/* warm glow between them */}
      <Glow x={(PIP.x + MA.x) / 2} y={(PIP.y + MA.y) / 2 - 180} r={160} kind="warm" o={0.2} />
    </g>
  );
};

// P2S30: "không là tớ biết ngay đấy. Biết cái gì cơ?" — Khải butts in confused
export const P2S30: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.9, headTilt: 8 }) },
    { f: len, p: { headTilt: 12, look: -1 } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len, 'smug']]) });
  const ma = idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={ma} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1420} y={330} tx={KH.x + 40} ty={KH.y - 210} text="Biết cái gì cơ?" at={4} until={len - 4} t={t} fs={42} />
    </g>
  );
};

// P2S31: "Biết cậu đang khát hay đang... lén nhìn tớ." — she winks, the flirt line
export const P2S31: React.FC<ShotProps> = ({ t, len }) => {
  const wink = t > len * 0.55 ? clamp((t - len * 0.55) / 8) : 0;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.45, look: -0.7, headTilt: -4 }) },
    { f: len * 0.6, p: { yaw: -0.55, look: -0.85, headTilt: -8 } },
    { f: len, p: {} },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'shock'], [len, 'dizzy']]) }) },
    { f: len * 0.6, p: { headTilt: 8 } },
    { f: len, p: { headTilt: 10 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 980]]), kf(t, [[0, 575], [len, 555]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.9, ...faceAt(t, [[0, 'shock'], [len, 'shock']]) })} rimId="rimL" shadow={0.4} />
      {/* wink indicator */}
      {wink > 0.5 ? (
        <g transform={`translate(${MA.x - 16 * MA.s} ${MA.y - 178 * MA.s}) scale(${MA.s})`}>
          <path d="M -12 0 Q 0 -10 12 0" fill="none" stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      <Say x={1280} y={310} tx={MA.x} ty={MA.y - 240} text="Biết cậu đang khát — hay đang lén nhìn tớ?" at={4} until={len - 4} t={t} fs={34} maxW={620} />
      {/* heart burst on YOU */}
      {wink > 0.6 ? (
        <g transform={`translate(${PIP.x + 120} ${PIP.y - 300}) scale(${backOut(wink)})`} opacity={wink}>
          <path d="M 0 16 C -24 -8 -8 -32 0 -18 C 8 -32 24 -8 0 16 Z" fill="#F28C9A" stroke={K.INK} strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

// P2S32: "Minh Anh nháy mắt rồi quay về chỗ ngồi." — she winks, turns, walks back
export const P2S32: React.FC<ShotProps> = ({ t, len }) => {
  const turn = clamp((t - len * 0.5) / (len * 0.5));
  const x = lerp(MA.x, MA_EXIT.x, easeInOut(turn));
  const s = lerp(MA.s, MA_EXIT.s, turn);
  const yaw = lerp(-0.4, 0.6, turn);
  const ma = poseAt(t, [
    { f: 0, p: idle(x, MA.y, s, { yaw: -0.4, look: -0.6 }) },
    { f: len * 0.5, p: { yaw: -0.5, look: -0.8, headTilt: -4 } },
    { f: len, p: { yaw, look: 0.4 } },
  ]);
  const walk = turn > 0.3 ? walkPose(0, t * 0.25, MA.y, s, { expr: 'happy' }) : {};
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1150]]), kf(t, [[0, 575], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'dizzy'], [len, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...walk, ...faceAt(t, [[0, 'smug'], [len * 0.6, 'happy'], [len, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* her green thermos in hand */}
      <g transform={`translate(${x + 40 * s} ${MA.y - 130 * s}) scale(${0.6 * s}) rotate(${-8 + turn * 10})`}>
        <Thermos x={0} y={0} kind="minh" t={t} />
      </g>
      {/* wink star at turn moment */}
      {t > len * 0.48 && t < len * 0.62 ? (
        <g transform={`translate(${MA.x - 20} ${MA.y - 200}) scale(${backOut(clamp((t - len * 0.48) / 8))})`} opacity={clamp((t - len * 0.46) / 6)}>
          <path d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#FFF6C8" stroke={K.INK} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

// P2S33: "Để lại bạn đứng ngay ngựa giữa tiếng cười. Đầy ác ý của Khải." — YOU frozen mid-room,
// Khải laughing behind. YOU dazed.
export const P2S33: React.FC<ShotProps> = ({ t, len }) => {
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x + 40, PIP.y, PIP.s, { yaw: -0.3, look: -0.5, ...faceAt(t, [[0, 'dizzy'], [len, 'dizzy']]) }) },
    { f: len * 0.5, p: { headTilt: 12 } },
    { f: len, p: { headTilt: 14 } },
  ]);
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x + 200, KH.y, KH.s, { yaw: -0.6, look: -0.9 }) },
    { f: len * 0.6, p: { x: KH.x, yaw: -0.5, look: -0.8, armR: { a: 60, b: -40 }, headTilt: 8 } },
    { f: len, p: { armR: { a: 45, b: -30 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 980]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
      <Cls t={t} />
      {/* YOU frozen centre-frame, dazed */}
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* dizzy stars */}
      <g transform={`translate(${PIP.x + 40} ${PIP.y - 300})`} opacity={0.8}>
        {[0, 1, 2].map((i) => {
          const a = t * 0.15 + (i * Math.PI * 2) / 3;
          return <circle key={i} cx={Math.cos(a) * 50} cy={Math.sin(a) * 16} r={7} fill="#FFF6C8" stroke={K.INK} strokeWidth={3} />;
        })}
      </g>
      {/* Khải laughing behind */}
      <K.Hero look={KHANH} pose={{ ...kh, x: lerp(KH.x + 200, KH.x, easeOut(clamp(t / 20))), ...faceAt(t, [[0, 'smug'], [len * 0.4, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* laugh lines from Khải */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${KH.x + 80 + i * 24} ${KH.y - 260 - i * 20} q 12 -16 24 0`} fill="none" stroke={K.PAPER} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      ))}
    </g>
  );
};

// P2S34: "Đầy ác ý của Khải." — Khải's evil laugh close-up
export const P2S34: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, headTilt: 10, armR: { a: 55, b: -38 } }) },
    { f: len * 0.5, p: { headTilt: 14, armR: { a: 65, b: -44 } } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1030]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len * 0.4, 'happy'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* evil laugh marks */}
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(${KH.x + 100 + i * 34} ${KH.y - 280 - i * 24}) rotate(${10 + i * 8}) scale(${0.7 + 0.3 * Math.sin(t * 0.25 + i * 2)})`} opacity={0.85}>
          <path d="M -20 0 Q 0 -22 20 0 Q 0 22 -20 0" fill="none" stroke="#FF8A7A" strokeWidth={5} />
          <text x={0} y={8} textAnchor="middle" fontFamily="Georgia,serif" fontSize={26} fill="#FF8A7A" fontWeight={700}>ha</text>
        </g>
      ))}
      <FloatEvil t={t} at={10} text="ác ý!" x={KH.x - 160} y={KH.y - 340} />
    </g>
  );
};

const FloatEvil: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 45);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.6})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={44} fontWeight={700} fill="#FF8A7A" stroke={K.INK} strokeWidth={6} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P2S35: "Chết mày chưa, người ta bắt thóp rồi kìa." — Khải's gleeful tease
export const P2S35: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.9, headTilt: 8, armL: { a: 50, b: -34 }, armR: { a: 50, b: -34 } }) },
    { f: len, p: { headTilt: 10 } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'dizzy'], [len, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 990]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'happy'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1400} y={320} tx={KH.x + 40} ty={KH.y - 210} text="Chết mày chưa? Người ta bắt thóp rồi kìa!" at={4} until={len - 4} t={t} fs={34} maxW={620} />
    </g>
  );
};

// P2S36: "Khải vỗ vai bạn rầm rầm." — Khải slaps YOUR shoulder repeatedly
export const P2S36: React.FC<ShotProps> = ({ t, len }) => {
  const pat = Math.sin(t * 0.6);
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.7, look: -0.9, armL: { a: 60 + pat * 15, b: -45 }, armR: { a: 30, b: -20 } }) },
    { f: len, p: { armL: { a: 65 + pat * 15, b: -48 } } },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) }) },
    { f: len * 0.5, p: { y: PIP.y - Math.abs(pat) * 6 } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'happy'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* pat impact ticks */}
      {pat > 0.7 ? (
        <g transform={`translate(${(PIP.x + KH.x) / 2 + 40} ${(PIP.y + KH.y) / 2 - 100}) scale(${backOut(clamp((t % 30) / 10))})`} opacity={0.8}>
          {[0, 1].map((i) => (
            <line key={i} x1={-20 + i * 40} y1={-30} x2={-20 + i * 40} y2={-50} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>
      ) : null}
      <Tag x={KH.x + 160} y={KH.y - 300} t={t + 8} text="vỗ vai!" w={160} />
    </g>
  );
};

// P2S37: "Chiều nay nhớ giữ bình cho cẩn thận, đừng để hớ hên." — Khải's warning, YOU nervous nod
export const P2S37: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.9, headTilt: 6, armR: { a: 40, b: -28 } }) },
    { f: len, p: { armR: { a: 50, b: -34 }, headTilt: 8 } },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'worried'], [len, 'neutral']]) }) },
    { f: len * 0.5, p: { headTilt: 10 } }, // nervous nod
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 990]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1400} y={320} tx={KH.x + 40} ty={KH.y - 210} text="Chiều nay nhớ giữ bình cẩn thận, đừng để hớ hên!" at={4} until={len - 4} t={t} fs={32} maxW={640} />
      {/* YOUR thermos on desk, guarded */}
      <g transform={`translate(${PIP.x + 55} ${PIP.y - 90}) scale(0.7)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      <g transform={`translate(${PIP.x + 55} ${PIP.y - 130})`} opacity={0.6}>
        <circle cx={0} cy={0} r={46} fill="none" stroke="#8BE0A4" strokeWidth={4} strokeDasharray="12 10" />
      </g>
    </g>
  );
};

export const p2c4Shots: ShotMap = { P2S29, P2S30, P2S31, P2S32, P2S33, P2S34, P2S35, P2S36, P2S37 };
