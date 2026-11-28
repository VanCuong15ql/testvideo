import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c3 — the retest: "đổ lại bình nhá", her mischievous "khoan đã", she drinks from
// YOUR thermos, YOU gets the honey-lemon hit, both crack up, thermoses swap back. P2S18–P2S28.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const KH = { x: 880, y: 818, s: 0.94 };
const MA = { x: 1020, y: 798, s: 0.95 };
const DESK_MID = { x: 820, y: 852 };

// P2S18: "Vậy, giờ mình đổ lại bình nhá." — YOU suggests swapping back, tentative
export const P2S18: React.FC<ShotProps> = ({ t, len }) => {
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried'], [len, 'neutral']]) }) },
    { f: len * 0.5, p: { armR: { a: 35, b: -24 } } },
    { f: len, p: {} },
  ]);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, headTilt: 4 }) },
    { f: len * 0.6, p: { headTilt: 8, look: -0.7 } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, ...faceAt(t, [[0, 'smug'], [len, 'oops']]) })} rimId="rimL" shadow={0.4} />
      <Say x={430} y={330} tx={PIP.x} ty={PIP.y - 220} text="Vậy... giờ mình đổ lại bình nhá?" at={4} until={len - 6} t={t} fs={38} />
    </g>
  );
};

// P2S19: "Minh Anh trần trừ một nhịp, ánh mắt tinh nghịch hẳn lên." — she hesitates then eyes sparkle
export const P2S19: React.FC<ShotProps> = ({ t, len }) => {
  const mischief = clamp((t - len * 0.5) / 16);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, headTilt: 2 }) },
    { f: len * 0.5, p: { headTilt: -2, look: -0.5 } },
    { f: len, p: { headTilt: -6 * mischief, look: -0.4, armR: { a: 30 * mischief, b: -20 * mischief } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1050]]), kf(t, [[0, 565], [len, 555]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'neutral'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* mischievous glint in her eye */}
      {mischief > 0.3 ? (
        <g transform={`translate(${MA.x - 18 * MA.s} ${MA.y - 175 * MA.s}) scale(${MA.s * (0.4 + mischief * 0.6)})`} opacity={mischief}>
          <path d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill="#FFF6C8" />
        </g>
      ) : null}
      <Tag x={MA.x - 120} y={MA.y - 320} t={t + len * 0.5} text="tinh nghịch!" w={180} />
    </g>
  );
};

// P2S20: "Khoan đã, nếu chưa đổi vội thì... thử thêm một lần nữa xem có đúng không?"
// — she proposes the retest, finger wag, mischievous grin
export const P2S20: React.FC<ShotProps> = ({ t, len }) => {
  const wag = Math.sin(t * 0.4) * 6;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.5, headTilt: -6, armR: { a: 50, b: -32 } }) },
    { f: len * 0.5, p: { armR: { a: 60, b: -38 }, headTilt: -8 } },
    { f: len, p: { armR: { a: 55, b: -34 } } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock'], [len, 'shock']]) });
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 980]]), kf(t, [[0, 570], [len, 555]]), kf(t, [[0, 1.35], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...you, headTilt: you.headTilt + wag * 0.3 }} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, x: ma.x + wag * 0.4, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, ...faceAt(t, [[0, 'oops'], [len, 'oops']]) })} rimId="rimL" shadow={0.4} />
      <Say x={1300} y={320} tx={MA.x + 20} ty={MA.y - 240} text="Khoan đã! Thử thêm một lần nữa xem có đúng không?" at={4} until={len - 4} t={t} fs={34} maxW={600} />
    </g>
  );
};

// P2S21: "Chưa kịp để bạn kịp phản ứng, Minh Anh mở nắp bình xám bạc của bạn và uống một hơi."
// — SHE opens YOUR thermos and chugs. YOUR grey thermos = kind 'you'.
export const P2S21: React.FC<ShotProps> = ({ t, len }) => {
  const chug = clamp((t - len * 0.45) / (len * 0.35));
  const tilt = Math.sin(chug * Math.PI) * 22;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.5, armR: { a: 55, b: -36 } }) },
    { f: len * 0.5, p: { armR: { a: 70, b: -48 }, headTilt: -8 } },
    { f: len * 0.8, p: { armR: { a: 65, b: -44 }, headTilt: 0 } },
    { f: len, p: {} },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'shock'], [len, 'shock']]) }) },
    { f: len * 0.6, p: { yaw: 0.6, look: 0.6, headTilt: -6 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  const thY = lerp(MA.y - 80, MA.y - 190, Math.sin(chug * Math.PI));
  return (
    <g transform={camT(kf(t, [[0, 1020], [len * 0.5, 980], [len, 1000]]), kf(t, [[0, 570], [len, 550]]), kf(t, [[0, 1.4], [len, 1.65]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, ...faceAt(t, [[0, 'oops'], [len, 'oops']]) })} rimId="rimL" shadow={0.4} />
      {/* YOUR thermos at her lips */}
      <g transform={`translate(${MA.x + 45 * MA.s} ${thY}) rotate(${tilt}) scale(${0.8 * MA.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} steam={0.3} />
      </g>
      {/* gulp bubbles */}
      {chug > 0.4 && chug < 0.95 ? [0, 1].map((i) => (
        <circle key={i} cx={MA.x + 60 + i * 26} cy={MA.y - 230 - i * 40 - chug * 40} r={13 - i * 4} fill={K.PAPER} stroke={K.INK} strokeWidth={3} opacity={Math.sin(chug * Math.PI)} />
      )) : null}
      {/* lemon drops flying */}
      {chug > 0.5 ? [0, 1, 2].map((i) => (
        <circle key={i} cx={MA.x - 30 + i * 36} cy={MA.y - 260 - i * 26 - chug * 20} r={8 - i * 2} fill="#F7D774" opacity={Math.sin(chug * Math.PI) * 0.9} />
      )) : null}
    </g>
  );
};

// P2S22: "Ngay khoảnh khắc ấy, bạn thấy cổ họng mình ngọt liệm vị mật ong xen lẫn chanh..." —
// YOUR reaction: honey-gold warmth + lemon spark on your face
export const P2S22: React.FC<ShotProps> = ({ t, len }) => {
  const hit = clamp((t - 6) / 14);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'shock'], [len * 0.4, 'shock'], [len, 'happy']]) }) },
    { f: len * 0.5, p: { headTilt: 6, armR: { a: 40, b: -28 } } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* warm honey glow on his face */}
      <Glow x={PIP.x} y={PIP.y - 170} r={140} kind="warm" o={0.35 * hit} />
      {/* sensation icons: honey drop + lemon + tingle lines */}
      {hit > 0.3 ? (
        <g transform={`translate(${PIP.x + 150} ${PIP.y - 300}) scale(${backOut(hit)})`} opacity={hit}>
          <path d="M 0 -30 Q 26 -6 26 10 Q 26 30 0 30 Q -26 30 -26 10 Q -26 -6 0 -30 Z" fill="#F7B95C" stroke={K.INK} strokeWidth={4} />
          <text x={0} y={14} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={24} fontWeight={700} fill={K.INK}>mật ong</text>
        </g>
      ) : null}
      {hit > 0.6 ? (
        <g transform={`translate(${PIP.x - 140} ${PIP.y - 290}) scale(${backOut(clamp((t - len * 0.3) / 12))})`} opacity={clamp((t - len * 0.28) / 10)}>
          <circle cx={0} cy={0} r={38} fill="#F7E08A" stroke={K.INK} strokeWidth={5} />
          <path d="M 0 -24 L 0 24 M -18 -12 L 18 12 M -18 12 L 18 -12" stroke="#E8C84A" strokeWidth={4} />
        </g>
      ) : null}
      {/* tingle lines down his body */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${PIP.x - 20 + i * 22} ${PIP.y - 140} q 8 30 -4 60`} fill="none" stroke="#FFE9B0" strokeWidth={4} strokeLinecap="round" opacity={hit * (0.5 + 0.3 * Math.sin(t * 0.4 + i))} />
      ))}
      <FloatSx t={t} at={len * 0.4} text="NGỌT + CHANH!" x={PIP.x + 60} y={PIP.y - 360} />
    </g>
  );
};

const FloatSx: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 45);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.6})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={42} fontWeight={700} fill="#F7D774" stroke={K.INK} strokeWidth={6} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P2S23: "kèm theo một cơn rung mình nhẹ chạy dọc sống lưng." — shiver ripple down his back
export const P2S23: React.FC<ShotProps> = ({ t, len }) => {
  const you = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.5, look: 0.4,
    ...faceAt(t, [[0, 'happy'], [len, 'happy']]),
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.5], [len, 1.65]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* shiver wave down his spine */}
      {[0, 1, 2, 3].map((i) => {
        const yy = PIP.y - 160 + i * 55;
        const wob = Math.sin(t * 0.5 - i * 0.8) * 8;
        return (
          <path key={i} d={`M ${PIP.x - 25 + wob} ${yy} q 12 10 0 22 q -12 -10 0 -22`} fill="none" stroke="#FFE9B0" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        );
      })}
      <FloatSx t={t} at={8} text="rung mình!" x={PIP.x + 160} y={PIP.y - 320} />
    </g>
  );
};

// P2S24: "Bạn bật cười khẽ, lát đầu nhìn cô ấy." — YOU chuckles, looks at her
export const P2S24: React.FC<ShotProps> = ({ t, len }) => {
  const lookAt = easeOut(clamp((t - 8) / 16));
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }) },
    { f: len * 0.6, p: { yaw: lerp(0.5, -0.3, lookAt), look: lerp(0.4, -0.5, lookAt) } },
    { f: len, p: {} },
  ]);
  const ma = idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={ma} rimId="rimL" shadow={0.4} />
      {/* giggle marks */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${PIP.x + 90 + i * 30} ${PIP.y - 240} q 10 -14 20 0`} fill="none" stroke={K.PAPER} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      ))}
      {/* sight line to her */}
      <line x1={PIP.x + 30} y1={PIP.y - 180} x2={lerp(PIP.x + 30, MA.x - 60, lookAt)} y2={lerp(PIP.y - 180, MA.y - 190, lookAt)} stroke="#FFE9B0" strokeWidth={3} strokeDasharray="10 8" opacity={lookAt * 0.7} />
    </g>
  );
};

// P2S25: "Thấy chưa, chuẩn không cần chỉnh." — YOU says it, smug
export const P2S25: React.FC<ShotProps> = ({ t, len }) => {
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'happy'], [len, 'smug']]) }) },
    { f: len, p: { headTilt: 4 } },
  ]);
  const ma = idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={ma} rimId="rimL" shadow={0.4} />
      <Say x={420} y={330} tx={PIP.x} ty={PIP.y - 220} text="Thấy chưa? Chuẩn không cần chỉnh!" at={4} until={len - 4} t={t} fs={40} />
    </g>
  );
};

// P2S26: "Minh Anh cười tươi, rạng rỡ đến mức bạn suýt quên lời treo chọc của Khải."
// — her bright laugh, sparkles, YOU dazed
export const P2S26: React.FC<ShotProps> = ({ t, len }) => {
  const laugh = Math.sin(t * 0.3) * 4;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: -8, armR: { a: 45, b: -30 }, armL: { a: 35, b: -24 } } },
    { f: len, p: { headTilt: -6 } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: -0.2, look: -0.5, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'dizzy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 570], [len, 555]]), kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...you, headTilt: you.headTilt + laugh * 0.3 }} rimId="rimR" shadow={0.5} />
      <g transform={`translate(${MA.x + laugh} ${MA.y}) scale(${MA.s})`}>
        <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      </g>
      {/* laugh sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${MA.x - 60 + i * 45} ${MA.y - 300 - (i % 2) * 30 + Math.sin(t * 0.2 + i) * 10}) scale(${0.5 + 0.3 * Math.sin(t * 0.3 + i * 1.5)})`} opacity={0.8}>
          <path d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="#FFF6C8" />
        </g>
      ))}
      {/* Khải in background, forgotten */}
      <g transform={`translate(${KH.x} ${KH.y}) scale(${KH.s * 0.85})`} opacity={0.6}>
        <K.Hero look={KHANH} pose={idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, ...faceAt(t, [[0, 'oops'], [len, 'oops']]) })} rimId="rimL" shadow={0.3} />
      </g>
    </g>
  );
};

// P2S27: "Cô ấy đặt chiếc bình xám bạc xuống bàn bạn," — she puts YOUR thermos on YOUR desk
export const P2S27: React.FC<ShotProps> = ({ t, len }) => {
  const place = easeOut(clamp((t - 8) / 18));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, armR: { a: 70, b: -48 } }) },
    { f: len * 0.6, p: { armR: { a: lerp(70, 25, place), b: lerp(-48, -18, place) } } },
    { f: len, p: { armR: { a: 20, b: -14 } } },
  ]);
  const thX = lerp(MA.x + 40, PIP.x + 55, place);
  const thY = lerp(MA.y - 160, PIP.y - 90, place);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 980]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <g transform={`translate(${thX} ${thY}) rotate(${lerp(-10, 0, place)}) scale(0.75)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {place > 0.9 ? (
        <g transform={`translate(${PIP.x + 55} ${PIP.y - 60})`} opacity={backOut(clamp((t - len * 0.7) / 10))}>
          <circle cx={0} cy={0} r={40} fill="none" stroke="#8BE0A4" strokeWidth={5} strokeDasharray="10 8" />
        </g>
      ) : null}
    </g>
  );
};

// P2S28: "cầm lại bình xanh rêu của mình." — she picks up HER green thermos
export const P2S28: React.FC<ShotProps> = ({ t, len }) => {
  const grab = easeOut(clamp((t - 6) / 16));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, armR: { a: 20, b: -14 } }) },
    { f: len * 0.6, p: { armR: { a: lerp(20, 75, grab), b: lerp(-14, -50, grab) } } },
    { f: len, p: { armR: { a: 70, b: -46 } } },
  ]);
  const thY = lerp(MA.y - 70, MA.y - 170, grab);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1020]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* HER green thermos */}
      <g transform={`translate(${MA.x + 45 * MA.s} ${thY}) rotate(${-6 - grab * 6}) scale(${0.75 * MA.s})`}>
        <Thermos x={0} y={0} kind="minh" t={t} />
      </g>
      {/* two thermoses side by side on desks — swap complete */}
      <g transform={`translate(${PIP.x + 55} ${PIP.y - 90}) scale(0.7)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
    </g>
  );
};

export const p2c3Shots: ShotMap = { P2S18, P2S19, P2S20, P2S21, P2S22, P2S23, P2S24, P2S25, P2S26, P2S27, P2S28 };
