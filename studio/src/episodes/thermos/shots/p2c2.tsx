import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c2 — Minh Anh reveals she sipped lemon-honey from YOUR thermos; Khải wedges in;
// you tell him to scram and ask her to swap the thermoses back. P2S10–P2S17.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const KH = { x: 880, y: 818, s: 0.94 };
const MA = { x: 1000, y: 800, s: 0.95 };

// P2S10: "Còn cái này là của cậu, hồi nãy mình nhắp thử một chút nước chanh mật ong." —
// she holds up YOUR thermos (the grey one) — wait, SHE holds her own green? Story: Minh Anh
// drank from HIS thermos earlier — the thermos on her desk is his grey 'you'.
export const P2S10: React.FC<ShotProps> = ({ t, len }) => {
  const show = easeOut(clamp((t - 8) / 16));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5, armR: { a: 40, b: -26 } }) },
    { f: len * 0.5, p: { armR: { a: lerp(40, 85, show), b: lerp(-26, -55, show) }, headTilt: -5 } },
    { f: len, p: { armR: { a: 80, b: -50 } } },
  ]);
  const thY = lerp(MA.y - 100, MA.y - 200, show);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'oops'], [len, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* YOUR grey thermos raised — the one she sipped */}
      <g transform={`translate(${MA.x + 45 * MA.s} ${thY}) rotate(${-8 - show * 8}) scale(${0.8 * MA.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* lemon-honey hint: yellow drop icon */}
      {show > 0.7 ? (
        <g transform={`translate(${MA.x - 130} ${MA.y - 280}) scale(${backOut(clamp((t - len * 0.6) / 12))})`} opacity={clamp((t - len * 0.55) / 10)}>
          <path d="M 0 -34 Q 30 -6 30 12 Q 30 34 0 34 Q -30 34 -30 12 Q -30 -6 0 -34 Z" fill="#F7D774" stroke={K.INK} strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={28} fontWeight={700} fill={K.INK}>chua</text>
        </g>
      ) : null}
      <Say x={1280} y={320} tx={MA.x + 30} ty={MA.y - 230} text="Còn cái này là của cậu — mình nhắp thử nước chanh mật ong." at={6} until={len - 6} t={t} fs={32} maxW={620} />
    </g>
  );
};

// P2S11: "Bạn chớp mắt." — YOUR blink + double-take
export const P2S11: React.FC<ShotProps> = ({ t, len }) => {
  const you = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.55, look: 0.55,
    ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'neutral'], [len * 0.45, 'shock'], [len, 'neutral']]),
    blink: kf(t, [[0, 0], [len * 0.4, 0], [len * 0.4 + 4, 1], [len * 0.4 + 9, 0], [len, 0]]),
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) })} rimId="rimL" shadow={0.4} />
      <FloatBlink t={t} x={PIP.x + 140} y={PIP.y - 260} />
    </g>
  );
};

const FloatBlink: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const on = t > 6 && t < 60 ? 1 : 0;
  if (!on) return null;
  const o = clamp(1 - (t - 6) / 50);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={52} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={7} paintOrder="stroke">Hả?</text>
    </g>
  );
};

// P2S12: "Đúng là lúc nãy bạn thoáng thấy vị chua dịu... tưởng mình bị ảo giác vì thiếu ngủ."
// — flashback overlay: lemon slice + "ảo giác?" thought bubble over YOU
export const P2S12: React.FC<ShotProps> = ({ t, len }) => {
  const fb = clamp((t - 10) / 16);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'neutral'], [len, 'oops']]) });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5 })} rimId="rimL" shadow={0.4} />
      {/* thought bubble: lemon slice + zzz */}
      <g transform={`translate(${PIP.x + 160} ${PIP.y - 300}) scale(${backOut(fb)})`} opacity={fb}>
        <ellipse cx={0} cy={0} rx={130} ry={90} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
        <circle cx={-30} cy={-10} r={34} fill="#F7E08A" stroke={K.INK} strokeWidth={4} />
        <path d="M -30 -10 L -30 10 M -44 -10 L -16 -10 M -44 4 L -16 4" stroke="#F7D774" strokeWidth={3} />
        <text x={40} y={20} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={30} fontWeight={700} fill={K.INK}>chua?</text>
        <text x={40} y={58} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={24} fill="#7A6A55">ảo giác?</text>
        <circle cx={-120} cy={60} r={14} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
        <circle cx={-140} cy={85} r={8} fill={K.PAPER} stroke={K.INK} strokeWidth={3} />
      </g>
      {/* lemon slice drifting */}
      <g transform={`translate(${PIP.x - 120 + Math.sin(t * 0.1) * 10} ${PIP.y - 340 + Math.cos(t * 0.13) * 8}) rotate(${t * 2}) scale(${fb * 0.7})`} opacity={fb * 0.8}>
        <circle cx={0} cy={0} r={44} fill="#F7E08A" stroke={K.INK} strokeWidth={5} />
        <circle cx={0} cy={0} r={30} fill="#FBEFB0" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 28} y2={Math.sin(a) * 28} stroke="#E8C84A" strokeWidth={3} />;
        })}
      </g>
    </g>
  );
};

// P2S13: "Khải tự nhiên chen vào," — Khải slides in from the right, arms crossed
export const P2S13: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp(t / 18));
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x + 300, KH.y, KH.s, { yaw: -0.6, look: -0.8, armL: { a: 20, b: -14 }, armR: { a: 25, b: -18 } }) },
    { f: len * 0.6, p: { x: KH.x, yaw: -0.55, look: -0.7, armL: { a: 35, b: -26 }, armR: { a: 35, b: -26 } } },
    { f: len, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 990]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5 })} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={{ ...kh, x: lerp(KH.x + 300, KH.x, slide), ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      <Tag x={KH.x + 140} y={KH.y - 300} t={t + 8} text="chen vào!" w={170} />
    </g>
  );
};

// P2S14: "chống cằm nhìn hai người như đang xem phim truyền hình." — Khôi chin-on-hand spectator
export const P2S14: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.7, look: -0.9, headTilt: 14, armR: { a: 80, b: -70 } }) },
    { f: len * 0.5, p: { look: -0.7, headTilt: 12 } },
    { f: len, p: { headTilt: 14 } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) });
  const ma = idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 980]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={ma} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* "movie" frame hint: little clapper icon */}
      <g transform={`translate(${KH.x + 150} ${KH.y - 290}) scale(${backOut(clamp((t - 10) / 12))})`} opacity={clamp((t - 8) / 10)}>
        <rect x={-36} y={-22} width={72} height={44} rx={6} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
        <path d="M -36 -22 l 14 -12 l 14 12 l 14 -12 l 14 12" fill="none" stroke={K.INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

// P2S15: "Thế tức là hai người đang làm chuột bạch cho nhau bằng bình nước," — Khải's line 1
export const P2S15: React.FC<ShotProps> = ({ t, len }) => {
  const kh = idle(KH.x, KH.y, KH.s, { yaw: -0.7, look: -0.9, headTilt: 10, armL: { a: 40, b: -28 }, armR: { a: 40, b: -28 }, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) });
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5 })} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={kh} rimId="rimL" shadow={0.4} />
      <Say x={1400} y={330} tx={KH.x + 40} ty={KH.y - 210} text="Tức là hai người làm chuột bạch cho nhau bằng bình nước?" at={4} until={len - 4} t={t} fs={34} maxW={640} />
    </g>
  );
};

// P2S16: "hay là để tao thử uống ké xem có bị lây không?" — Khải reaches for the thermos, mischievous
export const P2S16: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 6) / 20));
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.7, look: -0.9, armR: { a: 40, b: -28 } }) },
    { f: len * 0.6, p: { yaw: -0.9, look: -1, armR: { a: lerp(40, 95, reach), b: lerp(-28, -60, reach) }, headTilt: 12 } },
    { f: len, p: { armR: { a: 90, b: -55 } } },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'worried']]) }) },
    { f: len * 0.7, p: { yaw: 0.7, look: 0.7, armL: { a: 45, b: -32 }, ...faceAt(t, [[0, 'shock']]) } },
    { f: len, p: {} },
  ]);
  const thX = lerp(MA.x - 100, KH.x + 60, reach * 0.8);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 980]]), kf(t, [[0, 570], [len, 555]]), kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={idle(MA.x, MA.y, MA.s, { yaw: -0.35, look: -0.5 })} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* YOUR thermos sliding toward Khải */}
      <g transform={`translate(${thX} ${lerp(MA.y - 110, KH.y - 130, reach * 0.8)}) rotate(${-6 + reach * -10}) scale(0.7)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      <Say x={1420} y={320} tx={KH.x + 50} ty={KH.y - 210} text="hay để tao thử uống ké xem có bị lây không?" at={4} until={len - 4} t={t} fs={32} maxW={640} />
    </g>
  );
};

// P2S17: "Cút ra chỗ khác đi ông thần. Bạn... gạt tay Khải, rồi quay lại nhìn Minh Anh."
// — YOU slaps Khải's hand away, turns to Minh Anh
export const P2S17: React.FC<ShotProps> = ({ t, len }) => {
  const slap = clamp((t - 8) / 8);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.4, armR: { a: 30, b: -20 }, ...faceAt(t, [[0, 'shock'], [len * 0.3, 'shock'], [len, 'shock']]) }) },
    { f: len * 0.4, p: { yaw: 0.65, look: 0.65, armR: { a: lerp(30, 90, slap), b: lerp(-20, -50, slap) }, headTilt: -6 } },
    { f: len * 0.7, p: { yaw: -0.2, look: -0.4 } }, // turns to Minh Anh
    { f: len, p: { look: -0.5 } },
  ]);
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.8, look: -1, armR: { a: 90, b: -55 } }) },
    { f: len * 0.4, p: { armR: { a: 40, b: -28 }, yaw: -0.4 } },
    { f: len, p: { ...faceAt(t, [[0, 'smug'], [len * 0.4, 'oops'], [len, 'oops']]) } },
  ]);
  const ma = idle(MA.x, MA.y, MA.s, { yaw: -0.4, look: -0.6, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 990]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={ma} rimId="rimL" shadow={0.4} />
      <K.Hero look={KHANH} pose={kh} rimId="rimL" shadow={0.4} />
      <Say x={420} y={330} tx={PIP.x} ty={PIP.y - 220} text="Cút ra chỗ khác đi, ông thần!" at={2} until={len * 0.45} t={t} fs={40} />
      {/* slap impact stars */}
      {slap > 0.5 && slap < 1 ? (
        <g transform={`translate(${(PIP.x + KH.x) / 2 + 60} ${(PIP.y + KH.y) / 2 - 120}) scale(${backOut(slap)})`} opacity={clamp(slap * 2)}>
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + 0.5;
            return <line key={i} x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 55} y2={Math.sin(a) * 55} stroke="#FFE9B0" strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
    </g>
  );
};

export const p2c2Shots: ShotMap = { P2S10, P2S11, P2S12, P2S13, P2S14, P2S15, P2S16, P2S17 };
