import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c2 — Khải clocks the wrong thermos and starts teasing; "you" looks across the room
// and sees Minh Anh holding YOUR grey-silver thermos. P1S9–P1S16.
// Set: Classroom. Blocking: YOU front-left, KHANH beside, MINH across the room (right, smaller).

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const KH = { x: 880, y: 818, s: 0.94 };
const MA_NEAR = { x: 1150, y: 786, s: 0.88 };
const MA_FAR = { x: 1340, y: 748, s: 0.76 };

// P1S9: "Cho một người sang. Ê, hôm nay đổi phong cách à," — Khải leans over, eyebrow up
export const P1S9: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.55, look: -0.6, headTilt: 4, armR: { a: 30, b: -20 } }) },
    { f: len * 0.4, p: { yaw: -0.7, look: -0.8, headTilt: 8, armR: { a: 55, b: -35 } } },
    { f: len, p: { armR: { a: 40, b: -26 } } },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.15], [len, 1.25]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug'], [len, 'smug']]) }} rimId="rimL" shadow={0.4} />
      {/* Khải's speech bubble */}
      <Say x={1350} y={330} tx={960} ty={560} text="Ê! Hôm nay đổi phong cách à?" at={len * 0.08} until={len * 0.92} t={t} fs={40} />
    </g>
  );
};

// P1S10: "nhìn giống đồ của Minh Anh ngồi dãy bên kia thế." — Khải points across the room
export const P1S10: React.FC<ShotProps> = ({ t, len }) => {
  const pointK = easeOut(clamp((t - 6) / 14));
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.7, armR: { a: 20, b: -14 } }) },
    { f: len * 0.5, p: { yaw: -0.65, look: -0.9, armR: { a: lerp(20, 80, pointK), b: lerp(-14, -10, pointK) }, headTilt: 6 } },
    { f: len, p: { armR: { a: 70, b: -12 } } },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'worried']]) }) },
    { f: len * 0.6, p: { yaw: 0.75, look: 0.9, headTilt: 5 } },
    { f: len, p: {} },
  ]);
  // camera pans right toward Minh Anh's row
  const cx = kf(t, [[0, 980], [len * 0.6, 1080], [len, 1150]]);
  return (
    <g transform={camT(cx, kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.1], [len, 1.28]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* distant Minh Anh silhouette holding a grey thermos */}
      <g transform={`translate(${MA_FAR.x} ${MA_FAR.y - 190 * MA_FAR.s}) scale(${MA_FAR.s})`}>
        <K.Hero look={MINH} pose={idle(MA_FAR.x, MA_FAR.y, MA_FAR.s, { yaw: -0.3, look: -0.4 })} rimId="rimL" shadow={0.3} />
      </g>
      <g transform={`translate(${MA_FAR.x + 30 * MA_FAR.s} ${MA_FAR.y - 120 * MA_FAR.s}) scale(${0.5 * MA_FAR.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      <Say x={1420} y={300} tx={940} ty={560} text="Giống đồ của Minh Anh dãy bên kia!" at={len * 0.15} until={len * 0.9} t={t} fs={38} maxW={560} />
    </g>
  );
};

// P1S11: "Bạn liếc sang dãy bàn kế bên. Minh Anh," — whip pan to her desk, name tag
export const P1S11: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 960], [len * 0.4, 1050], [len, 1180]]);
  const zoom = kf(t, [[0, 1.05], [len * 0.5, 1.5], [len, 1.6]]);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.35, look: -0.55, headTilt: 3 }) },
    { f: len * 0.6, p: { yaw: -0.2, look: -0.4 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(cx, kf(t, [[0, 580], [len, 570]]), zoom)}>
      <Cls t={t} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      {/* her desk + YOUR thermos on it */}
      <g transform={`translate(${MA_NEAR.x} ${MA_NEAR.y + 62}) scale(${MA_NEAR.s})`}>
        <rect x={-95} y={-14} width={190} height={16} rx={4} fill="#8A6242" stroke={K.INK} strokeWidth={4} />
        <rect x={-85} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
        <rect x={71} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
      </g>
      <g transform={`translate(${MA_NEAR.x + 40 * MA_NEAR.s} ${MA_NEAR.y - 60 * MA_NEAR.s}) scale(${0.7 * MA_NEAR.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      <Tag x={MA_NEAR.x} y={MA_NEAR.y - 260 * MA_NEAR.s} t={t + 8} text="MINH ANH" w={190} />
    </g>
  );
};

// P1S12: "người bạn thầm thích suốt hai học kỳ, đang cầm chiếc bình xám bạc... của bạn" —
// slow push on Minh Anh + thermos, heart sparkle
export const P1S12: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 1150], [len * 0.5, 1180], [len, 1210]]);
  const zoom = kf(t, [[0, 1.4], [len, 1.75]]);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.3, look: -0.5, armR: { a: 30, b: -20 } }) },
    { f: len * 0.5, p: { armR: { a: 45, b: -30 }, headTilt: -3 } },
    { f: len, p: { look: -0.3 } },
  ]);
  const heartOn = clamp((t - len * 0.3) / 14);
  return (
    <g transform={camT(cx, 575, zoom)}>
      <Cls t={t} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy'], [len, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      {/* she holds YOUR thermos up */}
      <g transform={`translate(${MA_NEAR.x + 55 * MA_NEAR.s * zoom * 0.6} ${MA_NEAR.y - 150 * MA_NEAR.s}) scale(${0.85 * MA_NEAR.s}) rotate(${-8 + Math.sin(t * 0.08) * 3})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {heartOn > 0 ? (
        <g transform={`translate(${MA_NEAR.x - 40} ${MA_NEAR.y - 300}) scale(${heartOn})`} opacity={heartOn * 0.9}>
          <path d="M 0 20 C -30 -10 -10 -40 0 -22 C 10 -40 30 -10 0 20 Z" fill="#F28C9A" stroke={K.INK} strokeWidth={4} />
        </g>
      ) : null}
      <FloatTag2 t={t} at={len * 0.35} text="THẦM THÍCH ♥" x={MA_NEAR.x - 160} y={MA_NEAR.y - 330} />
    </g>
  );
};

const FloatTag2: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 50);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.6})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={36} fontWeight={700} fill="#F7A8C4" stroke={K.INK} strokeWidth={5} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P1S13: "nghiêng đầu nhìn chầm chầm vào nó với vẻ mặt đầy nghi vấn." — her suspicious stare
export const P1S13: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 1180], [len, 1200]]);
  const zoom = kf(t, [[0, 1.6], [len, 1.8]]);
  const squint = clamp((t - len * 0.3) / 20);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.35, look: -0.6, headTilt: 8 * squint, armR: { a: 40, b: -26 } }) },
    { f: len * 0.6, p: { headTilt: 10 * squint, look: -0.7 } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(cx, 570, zoom)}>
      <Cls t={t} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'worried'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      <g transform={`translate(${MA_NEAR.x + 55 * MA_NEAR.s} ${MA_NEAR.y - 150 * MA_NEAR.s}) scale(${0.85 * MA_NEAR.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* question mark over her head */}
      <g transform={`translate(${MA_NEAR.x - 90} ${MA_NEAR.y - 320}) scale(${backOut(clamp((t - 6) / 12))})`} opacity={clamp((t - 4) / 10)}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia,serif" fontSize={90} fill={K.PAPER} stroke={K.INK} strokeWidth={6} paintOrder="stroke" fontWeight={700}>?</text>
      </g>
    </g>
  );
};

// P1S14: "Chưa kịp giải thích, bạn mở nắp bình xanh rêu và tu một ngụm lớn trà sữa matcha đá lạnh."
// — YOU chugs from the GREEN (wrong) thermos. Big sip, cheeks puff, matcha-green splash.
export const P1S14: React.FC<ShotProps> = ({ t, len }) => {
  const sip = clamp((t - len * 0.35) / (len * 0.3));
  const tilt = Math.sin(sip * Math.PI) * 24;
  const pose = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, armR: { a: 30, b: -20 }, ...faceAt(t, [[0, 'worried'], [len * 0.3, 'neutral']]) }) },
    { f: len * 0.4, p: { armR: { a: 65, b: -45 }, headTilt: -6 } },
    { f: len * 0.7, p: { armR: { a: 70, b: -50 }, headTilt: -10, look: 0.1 } },
    { f: len, p: { armR: { a: 45, b: -30 }, headTilt: 0, ...faceAt(t, [[0, 'neutral'], [len * 0.8, 'happy']]) } },
  ]);
  const thY = lerp(PIP.y - 60, PIP.y - 190, Math.sin(sip * Math.PI));
  return (
    <g transform={camT(kf(t, [[0, 960], [len * 0.5, 940], [len, 960]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0.5} />
      {/* thermos to lips */}
      <g transform={`translate(${PIP.x + 55} ${thY}) rotate(${tilt}) scale(0.8)`}>
        <Thermos x={0} y={0} kind="minh" t={t} steam={0.4} />
      </g>
      {/* matcha splash drops when he chugs */}
      {sip > 0.4 && sip < 0.95 ? [0, 1, 2].map((i) => (
        <circle key={i} cx={PIP.x + 30 + i * 18} cy={PIP.y - 200 - i * 22 - sip * 30} r={7 - i} fill="#7FB069" opacity={0.85 * Math.sin(sip * Math.PI)} />
      )) : null}
      {/* gulp bubble */}
      {sip > 0.5 ? (
        <g transform={`translate(${PIP.x - 80} ${PIP.y - 240}) scale(${backOut(clamp((t - len * 0.5) / 10))})`} opacity={clamp((t - len * 0.48) / 8)}>
          <circle cx={0} cy={0} r={26} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle" fontFamily="Georgia,serif" fontSize={30} fill={K.INK} fontWeight={700}>ực</text>
        </g>
      ) : null}
    </g>
  );
};

// P1S15: "Ngay lập tức, thư kỳ lạ xảy ra." — title card interlude over classroom
export const P1S15: React.FC<ShotProps> = ({ t, len }) => {
  const inK = easeOut(clamp(t / 12));
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.4 * inK} />
      <g transform={`translate(960 500) scale(${0.75 + 0.25 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={64} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={8} paintOrder="stroke">NGAY LẬP TỨC...</text>
        <text x={0} y={80} textAnchor="middle" fontFamily="Georgia,serif" fontSize={44} fontStyle="italic" fill="#8BE0A4" stroke={K.INK} strokeWidth={5} paintOrder="stroke">một điều kỳ lạ xảy ra</text>
      </g>
      {/* faint magic sparkles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${700 + i * 130} ${380 + (i % 2) * 120}) scale(${0.6 + 0.4 * Math.sin(t * 0.2 + i)})`} opacity={0.6 * inK}>
          <path d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#BFE8FF" />
        </g>
      ))}
    </g>
  );
};

// P1S16: "Trong miệng bạn mát lạnh vị matcha." — extreme close on YOU's face, eyes closed, cool content
export const P1S16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = idle(PIP.x, PIP.y - 60, PIP.s * 1.5, {
    yaw: 0.1, look: 0,
    headTilt: 4,
    ...faceAt(t, [[0, 'happy'], [len, 'happy']]),
  });
  const cool = kf(t, [[0, 0], [len * 0.4, 1], [len, 1]]);
  return (
    <g transform={camT(PIP.x, PIP.y - 140, kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={YOU} pose={pose} rimId="rimR" shadow={0} />
      {/* cold-blue aura + little snowflakes */}
      <Glow x={PIP.x} y={PIP.y - 160} r={220} kind="cool" o={0.25 * cool} />
      {cool > 0.3 ? [0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${PIP.x + 90 + i * 40} ${PIP.y - 260 - i * 30 + Math.sin(t * 0.15 + i * 2) * 8})`} opacity={cool * 0.8}>
          <path d="M 0 -12 L 0 12 M -10 -6 L 10 6 M -10 6 L 10 -6" stroke="#BFE8FF" strokeWidth={4} strokeLinecap="round" />
        </g>
      )) : null}
      <FloatTag2 t={t} at={10} text="mát lạnh · vị matcha" x={PIP.x + 220} y={PIP.y - 330} />
    </g>
  );
};

export const p1c2Shots: ShotMap = { P1S9, P1S10, P1S11, P1S12, P1S13, P1S14, P1S15, P1S16 };
