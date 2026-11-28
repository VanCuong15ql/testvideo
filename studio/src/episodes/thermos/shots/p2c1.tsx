import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c1 — break time: Minh Anh walks over holding YOUR grey thermos and asks
// what you drank. You play it cool. She describes the cold matcha hit. P2S1–P2S9.
// Set: Classroom, recess — warmer light, kids' silhouettes gone.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const MA_FAR = { x: 1420, y: 760, s: 0.8 };
const MA_MID = { x: 1050, y: 792, s: 0.9 };
const MA_NEAR = { x: 900, y: 806, s: 0.95 };

const maWalk = (t: number, len: number) =>
  poseAt(t, [
    { f: 0, p: idle(MA_FAR.x, MA_FAR.y, MA_FAR.s, { yaw: -0.4, look: -0.5 }) },
    { f: len * 0.6, p: { x: MA_MID.x, y: MA_MID.y, scale: MA_MID.s, yaw: -0.35, look: -0.55, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy']]) }, ease: easeOut },
    { f: len, p: { yaw: -0.25, look: -0.4, headTilt: -3 } },
  ]);

// P2S1: "Giờ ra chơi, Minh Anh bước tới bạn," — she walks the aisle toward you, thermos in hand
export const P2S1: React.FC<ShotProps> = ({ t, len }) => {
  const ma = maWalk(t, len);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1000]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.0], [len, 1.2]]))}>
      <Cls t={t} fg={false} />
      <K.ClsForeground t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, x: ma.x }} rimId="rimL" shadow={0.4} />
      {/* her thermos (YOURS) in her hand */}
      <g transform={`translate(${ma.x + 45 * ma.scale} ${ma.y - 130 * ma.scale}) scale(${0.6 * ma.scale}) rotate(${-6 + Math.sin(t * 0.1) * 2})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* recess light shafts */}
      <Glow x={1200} y={300} r={300} kind="warm" o={0.15} />
    </g>
  );
};

// P2S2: "tay cầm chiếc bình xám bạc của bạn, mặt hơi cao lại nhưng ánh mắt lấp lánh tò mò."
// — close on her face + thermos, curious sparkle eyes
export const P2S2: React.FC<ShotProps> = ({ t, len }) => {
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.3, look: -0.5, headTilt: -6, armR: { a: 45, b: -30 } }) },
    { f: len * 0.5, p: { headTilt: -8, armR: { a: 55, b: -36 }, look: -0.6 } },
    { f: len, p: { headTilt: -5 } },
  ]);
  const sparkle = clamp((t - len * 0.4) / 12);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1080]]), kf(t, [[0, 560], [len, 555]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <g transform={`translate(${MA_NEAR.x + 50 * MA_NEAR.s} ${MA_NEAR.y - 140 * MA_NEAR.s}) scale(${0.8 * MA_NEAR.s}) rotate(${-8 + Math.sin(t * 0.09) * 2})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* curious eye sparkles */}
      {sparkle > 0 ? [0, 1].map((i) => (
        <path key={i} d={`M ${MA_NEAR.x - 30 + i * 34} ${MA_NEAR.y - 180} l 6 -10 l 6 10 l -6 4 Z`} fill="#FFF6C8" opacity={sparkle * (0.5 + 0.5 * Math.sin(t * 0.3 + i * 2))} transform={`scale(${MA_NEAR.s}) translate(${-(MA_NEAR.x - 30 + i * 34) * (1 - MA_NEAR.s)} ${-(MA_NEAR.y - 180) * (1 - MA_NEAR.s)})`} />
      )) : null}
      <Tag x={MA_NEAR.x - 120} y={MA_NEAR.y - 320} t={t + 10} text="tò mò!" w={150} />
    </g>
  );
};

// P2S3: "Nè, bạn nãy cầu uống gì thế?" — Minh Anh asks, bubble
export const P2S3: React.FC<ShotProps> = ({ t, len }) => {
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.3, look: -0.5, headTilt: 4 }) },
    { f: len * 0.5, p: { headTilt: 8, look: -0.7 } },
    { f: len, p: {} },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.55, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 980]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1280} y={330} tx={MA_NEAR.x + 20} ty={MA_NEAR.y - 230} text="Nè! Bạn nãy cầu uống gì thế?" at={4} until={len - 4} t={t} fs={40} maxW={580} />
    </g>
  );
};

// P2S4: "Minh Anh hỏi thẳng, không vòng vo." — she leans in, direct gaze, bubble tail sharp
export const P2S4: React.FC<ShotProps> = ({ t, len }) => {
  const lean = easeOut(clamp(t / 20));
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x + 40, MA_NEAR.y, MA_NEAR.s, { yaw: -0.5, look: -0.8, headTilt: 5, armR: { a: 20, b: -14 } }) },
    { f: len * 0.6, p: { x: MA_NEAR.x - 10 * lean, yaw: -0.6, look: -0.9, headTilt: 8 } },
    { f: len, p: {} },
  ]);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.6, look: 0.6, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 970]]), kf(t, [[0, 560], [len, 555]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1300} y={310} tx={MA_NEAR.x} ty={MA_NEAR.y - 240} text="Hỏi thẳng, không vòng vo!" at={6} until={len - 6} t={t} fs={38} maxW={560} />
      {/* her hand on her hip — confident */}
      <g transform={`translate(${MA_NEAR.x + 55 * MA_NEAR.s} ${MA_NEAR.y - 60 * MA_NEAR.s})`} opacity={lean}>
        <circle cx={0} cy={0} r={16 * MA_NEAR.s} fill={MINH.skin} stroke={K.INK} strokeWidth={4} />
      </g>
    </g>
  );
};

// P2S5: "Trà sữa matcha. Bạn đáp, cố giữ vẻ bình thẳng." — YOU answers coolly
export const P2S5: React.FC<ShotProps> = ({ t, len }) => {
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral']]) }) },
    { f: len * 0.4, p: { ...faceAt(t, [[0, 'cool']]), headTilt: -3, armR: { a: 25, b: -18 } } },
    { f: len, p: { headTilt: 0 } },
  ]);
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.4, look: -0.6 }) },
    { f: len * 0.5, p: { headTilt: 6, look: -0.5 } },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      <Say x={430} y={330} tx={PIP.x} ty={PIP.y - 220} text="Trà sữa matcha." at={len * 0.15} until={len - 6} t={t} fs={42} />
    </g>
  );
};

// P2S6: "Sao thế?" — Minh Anh tilts head, tiny bubble
export const P2S6: React.FC<ShotProps> = ({ t, len }) => {
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.4, look: -0.6, headTilt: 8 }) },
    { f: len, p: { headTilt: 12, look: -0.7 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), kf(t, [[0, 560], [len, 555]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1300} y={320} tx={MA_NEAR.x + 10} ty={MA_NEAR.y - 240} text="Sao thế?" at={4} until={len - 4} t={t} fs={44} />
    </g>
  );
};

// P2S7: "Tại vì đúng lúc đó, tự nhiên mình thấy lạnh buốt từ cổ họng xuống tận bụng," —
// Minh Anh describes it: she shivers, cold aura from YOUR thermos on her desk
export const P2S7: React.FC<ShotProps> = ({ t, len }) => {
  const shiver = Math.sin(t * 0.5) * 3;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.35, look: -0.5, headTilt: -4 }) },
    { f: len * 0.5, p: { headTilt: -8, armL: { a: 25, b: -18 }, armR: { a: 30, b: -22 } } },
    { f: len, p: { headTilt: -6 } },
  ]);
  // thermos on the desk between them = YOURS (green? no — hers is green 'minh', yours grey 'you')
  const deskY = 852;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'neutral'], [len, 'neutral']]) })} rimId="rimR" shadow={0.5} />
      <g transform={`translate(${MA_NEAR.x + shiver} ${MA_NEAR.y}) scale(${MA_NEAR.s})`}>
        <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'worried'], [len, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      </g>
      {/* YOUR grey thermos on the desk between them */}
      <g transform={`translate(${(PIP.x + MA_NEAR.x) / 2 + 40} ${deskY - 60}) scale(0.7)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* cold aura rising from the thermos */}
      <Glow x={(PIP.x + MA_NEAR.x) / 2 + 40} y={deskY - 90} r={120} kind="cool" o={0.3} />
      {[0, 1].map((i) => (
        <path key={i} d={`M ${(PIP.x + MA_NEAR.x) / 2 + 20 + i * 40} ${deskY - 140} q 6 -14 0 -26`} fill="none" stroke="#BFE8FF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      ))}
      <Say x={1280} y={330} tx={MA_NEAR.x} ty={MA_NEAR.y - 240} text="thấy lạnh buốt từ cổ họng xuống tận bụng..." at={8} until={len - 8} t={t} fs={34} maxW={600} />
    </g>
  );
};

// P2S8: "xong rồi có vị matcha. Trà." — she nods, matcha swirl icon
export const P2S8: React.FC<ShotProps> = ({ t, len }) => {
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.35, look: -0.5, headTilt: 4 }) },
    { f: len * 0.5, p: { headTilt: 0, look: -0.4 } },
    { f: len, p: { headTilt: -2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1050]]), kf(t, [[0, 565], [len, 560]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      {/* matcha cup icon */}
      <g transform={`translate(${MA_NEAR.x - 130} ${MA_NEAR.y - 260}) scale(${backOut(clamp((t - 10) / 14))})`} opacity={clamp((t - 8) / 10)}>
        <rect x={-40} y={-20} width={80} height={60} rx={10} fill="#7FB069" stroke={K.INK} strokeWidth={5} />
        <path d="M 40 -10 q 24 4 0 26" fill="none" stroke={K.INK} strokeWidth={5} />
        <path d="M -16 -34 q 8 -12 0 -24 M 8 -34 q 8 -12 0 -24" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      </g>
      <Say x={1280} y={320} tx={MA_NEAR.x + 10} ty={MA_NEAR.y - 240} text="rồi có vị matcha. Trà." at={4} until={len - 4} t={t} fs={40} maxW={520} />
    </g>
  );
};

// P2S9: "Minh Anh dơ chiếc bình xám bạc lên, khẽ lắc." — she raises YOUR thermos and shakes it
export const P2S9: React.FC<ShotProps> = ({ t, len }) => {
  const lift = easeOut(clamp((t - 6) / 18));
  const shakeX = Math.sin(t * 0.9) * 6 * lift;
  const ma = poseAt(t, [
    { f: 0, p: idle(MA_NEAR.x, MA_NEAR.y, MA_NEAR.s, { yaw: -0.35, look: -0.5, armR: { a: 30, b: -20 } }) },
    { f: len * 0.5, p: { armR: { a: lerp(30, 80, lift), b: lerp(-20, -55, lift) }, look: -0.6 } },
    { f: len, p: { armR: { a: 75, b: -50 } } },
  ]);
  const thY = lerp(MA_NEAR.y - 90, MA_NEAR.y - 190, lift);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1030]]), kf(t, [[0, 570], [len, 555]]), kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Cls t={t} />
      <K.Hero look={MINH} pose={{ ...ma, ...faceAt(t, [[0, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <g transform={`translate(${MA_NEAR.x + 45 * MA_NEAR.s + shakeX} ${thY}) rotate(${-10 + shakeX * 0.8}) scale(${0.75 * MA_NEAR.s})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* shake motion ticks */}
      {lift > 0.8 ? [-1, 1].map((s) => (
        <path key={s} d={`M ${MA_NEAR.x + 90 * s} ${thY - 60} q ${12 * s} -8 ${18 * s} 0`} fill="none" stroke={K.PAPER} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      )) : null}
    </g>
  );
};

export const p2c1Shots: ShotMap = { P2S1, P2S2, P2S3, P2S4, P2S5, P2S6, P2S7, P2S8, P2S9 };
