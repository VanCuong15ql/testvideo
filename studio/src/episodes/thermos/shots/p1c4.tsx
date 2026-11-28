import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c4 — the rule clicks: a diagram shows thermos A → person B sharing taste.
// Then Khải clocks your red face, you shut him down, and the episode ends on a subscribe card.
// P1S21–P1S28.

const { Thermos, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, YOU, KHANH, MINH, idle, Cls } = K;

const PIP = K.CLS_YOU;
const KH = { x: 880, y: 818, s: 0.94 };
const MA = { x: 1180, y: 780, s: 0.9 };

// P1S21: "Hệ ai uống nước từ chiếc bình đang cầm nhầm, người kia sẽ cảm nhận y hệt vị," —
// YOU smug, diagram line draws: YOUR thermos → arrow → MINH's face
export const P1S21: React.FC<ShotProps> = ({ t, len }) => {
  const draw = clamp((t - 10) / 50);
  const you = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug'], [len, 'smug']]), armR: { a: 30, b: -22 } });
  const cx = kf(t, [[0, 980], [len * 0.6, 900], [len, 960]]);
  return (
    <g transform={camT(cx, kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Cls t={t} fg={false} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* diagram overlay, screen-space-ish inside world */}
      <g opacity={clamp((t - 8) / 14)}>
        {/* YOUR thermos */}
        <g transform={`translate(420 380) scale(0.9)`}>
          <Thermos x={0} y={0} kind="you" t={t} />
        </g>
        <text x={420} y={470} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={30} fill={K.PAPER} stroke={K.INK} strokeWidth={4} paintOrder="stroke">bình xanh rêu</text>
        {/* arrow */}
        <line x1={540} y1={380} x2={lerp(540, 780, easeOut(draw))} y2={380} stroke="#FFE9B0" strokeWidth={6} strokeLinecap="round" />
        {draw > 0.85 ? <path d="M 780 380 l -22 -12 v 24 Z" fill="#FFE9B0" /> : null}
        {/* her face chip */}
        <g transform={`translate(${lerp(980, 980, 1)} 380) scale(${0.8 * clamp((t - 40) / 14)})`} opacity={clamp((t - 40) / 14)}>
          <circle cx={0} cy={0} r={52} fill="#FBE3CE" stroke={K.INK} strokeWidth={5} />
          <circle cx={-16} cy={-6} r={5} fill={K.INK} />
          <circle cx={16} cy={-6} r={5} fill={K.INK} />
          <path d="M -14 18 Q 0 30 14 18" fill="none" stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
          {/* twintails hint */}
          <circle cx={-40} cy={-20} r={14} fill="#8A5A3B" stroke={K.INK} strokeWidth={4} />
          <circle cx={40} cy={-20} r={14} fill="#8A5A3B" stroke={K.INK} strokeWidth={4} />
        </g>
        <text x={980} y={470} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={30} fill={K.PAPER} stroke={K.INK} strokeWidth={4} paintOrder="stroke">Minh Anh</text>
        {/* shared sensation tag */}
        {draw > 0.9 ? (
          <g transform={`translate(660 300) scale(${backOut(clamp((t - 55) / 12))})`} opacity={clamp((t - 55) / 10)}>
            <rect x={-180} y={-40} width={360} height={80} rx={16} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={34} fontWeight={700} fill={K.INK}>CẢM NHẬN Y HỆT</text>
          </g>
        ) : null}
      </g>
      <ClsForegroundOnly />
    </g>
  );
};

const ClsForegroundOnly: React.FC = () => <K.ClsForeground t={0} />;

// P1S22: "nhiệt độ và cảm giác tức thì," — sensation icons orbit the diagram: cold, tingling, caffeine
export const P1S22: React.FC<ShotProps> = ({ t, len }) => {
  const icons = [
    { x: 660, y: 240, c: '#BFE8FF', d: 'snow' },
    { x: 820, y: 210, c: '#FFE9B0', d: 'spark' },
    { x: 500, y: 220, c: '#FFB08A', d: 'zap' },
  ];
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1], [len, 1.08]]))}>
      <Cls t={t} fg={false} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.3} />
      {icons.map((ic, i) => {
        const on = backOut(clamp((t - 8 - i * 8) / 14));
        const bob = Math.sin(t * 0.12 + i * 2) * 8;
        return (
          <g key={i} transform={`translate(${ic.x} ${ic.y + bob}) scale(${on})`} opacity={clamp(on)}>
            <circle cx={0} cy={0} r={44} fill={ic.c} stroke={K.INK} strokeWidth={5} opacity={0.95} />
            {ic.d === 'snow' ? (
              <path d="M 0 -18 L 0 18 M -14 -9 L 14 9 M -14 9 L 14 -9" stroke={K.INK} strokeWidth={5} strokeLinecap="round" />
            ) : ic.d === 'spark' ? (
              <path d="M 0 -20 L 6 -6 L 20 0 L 6 6 L 0 20 L -6 6 L -20 0 L -6 -6 Z" fill={K.INK} />
            ) : (
              <path d="M 8 -20 L -10 4 L 0 4 L -8 20 L 10 -4 L 0 -4 Z" fill={K.INK} />
            )}
          </g>
        );
      })}
      <text x={960} y={330} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={46} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={7} paintOrder="stroke" opacity={clamp((t - 20) / 12)}>
        nhiệt độ · tê bút · chát · caffeine
      </text>
    </g>
  );
};

// P1S23: "như tê bút," — macro insert: a tongue/tingle? keep abstract: numbing ripple on skin chip
export const P1S23: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} fg={false} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      {/* abstract "tingle" card: concentric ripples */}
      <g transform="translate(960 520)">
        {[0, 1, 2, 3].map((i) => {
          const rr = ((t * 0.8 + i * 40) % 160);
          return <circle key={i} cx={0} cy={0} r={rr} fill="none" stroke="#BFE8FF" strokeWidth={5} opacity={clamp(1 - rr / 160) * 0.7} />;
        })}
        <circle cx={0} cy={0} r={52} fill="#FBE3CE" stroke={K.INK} strokeWidth={6} />
        <path d="M -20 8 Q 0 26 20 8" fill="none" stroke={K.INK} strokeWidth={5} strokeLinecap="round" />
        <circle cx={-16} cy={-8} r={5} fill={K.INK} />
        <circle cx={16} cy={-8} r={5} fill={K.INK} />
      </g>
      <Tag x={960} y={700} t={t + 10} text="TÊ BÚT — TÊ RÂN" w={300} />
    </g>
  );
};

// P1S24: "trong vòng 10 giây, bất kể khoảng cách trong trường." — big "10 GIÂY" counter + school map dots
export const P1S24: React.FC<ShotProps> = ({ t, len }) => {
  const count = kf(t, [[0, 10], [len * 0.8, 0], [len, 0]]);
  return (
    <g transform={camT(960, 540, 1)}>
      <Cls t={t} fg={false} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      {/* countdown */}
      <g transform="translate(960 430)">
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia,serif" fontSize={170} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={10} paintOrder="stroke">
          {Math.max(0, Math.ceil(count))}
        </text>
        <text x={0} y={70} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={44} fontWeight={700} fill="#FFE9B0" stroke={K.INK} strokeWidth={6} paintOrder="stroke">GIÂY</text>
      </g>
      {/* school map: two dots connected */}
      <g transform="translate(960 700)" opacity={clamp((t - 15) / 15)}>
        <rect x={-420} y={-80} width={840} height={160} rx={20} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
        <circle cx={-260} cy={0} r={26} fill="#9AA4AE" stroke={K.INK} strokeWidth={4} />
        <circle cx={260} cy={0} r={26} fill="#4E7A4E" stroke={K.INK} strokeWidth={4} />
        <line x1={-230} y1={0} x2={230} y2={0} stroke={K.INK} strokeWidth={5} strokeDasharray="14 10" />
        <text x={-260} y={60} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={28} fill={K.INK}>bạn</text>
        <text x={260} y={60} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={28} fill={K.INK}>Minh Anh</text>
        <text x={0} y={-110} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={34} fontWeight={700} fill={K.INK}>bất kể khoảng cách trong trường</text>
      </g>
    </g>
  );
};

// P1S25: "Bạn nuốt vội ngụm trà sữa. Mặt tìm đập thình thịt," — YOU gulps, cheeks puff, heart race
export const P1S25: React.FC<ShotProps> = ({ t, len }) => {
  const gulp = clamp((t - 8) / 12);
  const pose = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.4, look: 0.4, headTilt: -4,
    armR: { a: 60, b: -40 },
    ...faceAt(t, [[0, 'shock'], [len * 0.5, 'happy'], [len, 'smug']]),
  });
  const thX = PIP.x + 55, thY = lerp(PIP.y - 60, PIP.y - 170, Math.sin(gulp * Math.PI));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={{ ...pose, y: PIP.y - Math.sin(gulp * Math.PI) * 8 }} rimId="rimR" shadow={0.5} />
      <g transform={`translate(${thX} ${thY}) rotate(${-10 + gulp * 18}) scale(0.78)`}>
        <Thermos x={0} y={0} kind="minh" t={t} />
      </g>
      {/* gulp bubbles */}
      {gulp > 0.3 && gulp < 1 ? [0, 1].map((i) => (
        <circle key={i} cx={PIP.x + 70 + i * 30} cy={PIP.y - 220 - i * 40 - gulp * 50} r={14 - i * 4} fill={K.PAPER} stroke={K.INK} strokeWidth={3} opacity={Math.sin(gulp * Math.PI)} />
      )) : null}
      {/* racing heart lines */}
      {[0, 1, 2].map((i) => {
        const ht = (t * 1.4 + i * 16) % 48;
        return <path key={i} d={`M ${PIP.x + 110 + ht} ${PIP.y - 260 - ht * 0.6} c 8 -10 20 -10 20 0 c 0 10 -20 22 -20 22 c 0 0 -20 -12 -20 -22 c 0 -10 12 -10 20 0`} fill="none" stroke="#F28C9A" strokeWidth={4} opacity={clamp(1 - ht / 48) * 0.8} transform={`scale(0.6)`} />;
      })}
    </g>
  );
};

// P1S26: "Khải nheo mắt nhìn bạn, rồi nhìn sang Minh Anh, nhặt mẹp." — Khải suspicious, looks between
export const P1S26: React.FC<ShotProps> = ({ t, len }) => {
  const lookYou = t < len * 0.5 ? -0.7 : 0.7;
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.5, look: -0.8, armR: { a: 25, b: -18 }, headTilt: 6 }) },
    { f: len * 0.5, p: { look: 0.8, yaw: -0.2, headTilt: -4 } },
    { f: len, p: { look: 0.6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Cls t={t} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len * 0.4, 'neutral'], [len, 'worried']]) }} rimId="rimL" shadow={0.4} />
      {/* YOU small in frame, still smug */}
      <g transform={`translate(${PIP.x} ${PIP.y}) scale(${PIP.s * 0.8})`} opacity={0.9}>
        <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'smug'], [len, 'smug']]) })} rimId="rimR" shadow={0.4} />
      </g>
      {/* suspicion ticks */}
      <Tag x={KH.x - 160} y={KH.y - 300} t={t + 10} text="hửm?" w={140} />
    </g>
  );
};

// P1S27: "Sao mặt mày đỏ như tôm luộc thế?" — Khải asks, bubble
export const P1S27: React.FC<ShotProps> = ({ t, len }) => {
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.8, headTilt: -4, armL: { a: 30, b: -22 } }) },
    { f: len, p: { armL: { a: 40, b: -28 }, headTilt: -8 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'smug'], [len, 'worried']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Say x={1350} y={340} tx={KH.x + 30} ty={KH.y - 200} text="Sao mặt mày đỏ như tôm luộc thế?" at={4} until={len - 6} t={t} fs={38} maxW={560} />
    </g>
  );
};

// P1S28: "Uống nhầm thuốc băng lực à? Im đi Khải... cúi gằm" + subscribe card —
// Khải's second jab, YOU shuts him down, end card.
export const P1S28: React.FC<ShotProps> = ({ t, len }) => {
  const shut = clamp((t - len * 0.55) / 10);
  const kh = poseAt(t, [
    { f: 0, p: idle(KH.x, KH.y, KH.s, { yaw: -0.6, look: -0.8, armR: { a: 40, b: -26 } }) },
    { f: len * 0.5, p: { armR: { a: 60, b: -36 }, headTilt: 8 } },
    { f: len * 0.6, p: { yaw: -0.3, look: -0.4 } }, // Khải silenced
    { f: len, p: {} },
  ]);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'neutral']]) }) },
    { f: len * 0.55, p: { yaw: -0.2, look: -0.3, headTilt: -10, armR: { a: 50, b: -35 } } }, // head down, dismissive
    { f: len, p: { headTilt: -12 } },
  ]);
  const card = clamp((t - len * 0.62) / 16);
  return (
    <g transform={camT(kf(t, [[0, 980], [len * 0.6, 960], [len, 960]]), kf(t, [[0, 575], [len, 560]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      <K.Hero look={KHANH} pose={{ ...kh, ...faceAt(t, [[0, 'smug'], [len * 0.5, 'happy'], [len, 'oops']]) }} rimId="rimL" shadow={0.4} />
      {t < len * 0.6 ? (
        <Say x={1350} y={330} tx={KH.x + 30} ty={KH.y - 200} text="Uống nhầm thuốc băng lực à?" at={2} until={len * 0.55} t={t} fs={36} maxW={540} />
      ) : null}
      {t > len * 0.58 && t < len * 0.72 ? (
        <Say x={500} y={330} tx={PIP.x} ty={PIP.y - 200} text="Im đi, Khải!" at={len * 0.58} until={len * 0.72} t={t} fs={40} />
      ) : null}
      {/* subscribe end card */}
      {card > 0 ? (
        <g transform={`translate(960 500) scale(${backOut(card)})`} opacity={clamp(card * 1.5)}>
          <rect x={-430} y={-160} width={860} height={320} rx={26} fill={K.PAPER} stroke={K.INK} strokeWidth={7} />
          <text x={0} y={-60} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={52} fontWeight={700} fill={K.INK}>ĐĂNG KÝ KÊNH</text>
          <text x={0} y={10} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={38} fill="#7A6A55">để không bỏ lỡ tập sau!</text>
          {/* bell */}
          <g transform="translate(0 110)">
            <path d="M -40 -10 Q -40 -50 0 -50 Q 40 -50 40 -10 L 52 6 L -52 6 Z" fill="#FFE9B0" stroke={K.INK} strokeWidth={5} />
            <circle cx={0} cy={18} r={8} fill={K.INK} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

export const p1c4Shots: ShotMap = { P1S21, P1S22, P1S23, P1S24, P1S25, P1S26, P1S27, P1S28 };
