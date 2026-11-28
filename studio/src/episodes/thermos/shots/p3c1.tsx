import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c1 — afternoon paranoia → evening at home → the phone buzzes with "Ngủ chưa?"
// P3S1–P3S9. Sets: Classroom tail → Bedroom night → Phone close-ups.

const { Thermos, ChatScreen, Phone, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, YOU, MINH, idle, Cls, Bedroom, BEDROOM, bedTop, WINDOW, bedSit } = K;

const PIP = { x: 620, y: 838, s: 1.0 };
const BED_YOU = { x: 940, y: 800, s: 1.0 };

// P3S1: "Suốt buổi chiều, bạn cẩn thận tuyệt đối," — classroom, YOU hugs his thermos protectively
export const P3S1: React.FC<ShotProps> = ({ t, len }) => {
  const guard = 0.5 + 0.5 * Math.sin(t * 0.15);
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armL: { a: 30 + guard * 15, b: -24 }, armR: { a: 30 + guard * 15, b: -24 }, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) }) },
    { f: len, p: {} },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 575], [len, 565]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* thermos hugged to chest */}
      <g transform={`translate(${PIP.x + 10} ${PIP.y - 110}) scale(0.65) rotate(${-4 + Math.sin(t * 0.1) * 2})`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      {/* paranoid eye dart left-right */}
      <g transform={`translate(${PIP.x + 160} ${PIP.y - 260})`} opacity={0.9}>
        <ellipse cx={0} cy={0} rx={46} ry={26} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
        <circle cx={lerp(-14, 14, (Math.sin(t * 0.25) + 1) / 2)} cy={0} r={9} fill={K.INK} />
      </g>
      <Tag x={PIP.x - 160} y={PIP.y - 330} t={t + 10} text="cẩn thận!" w={170} />
    </g>
  );
};

// P3S2: "chỉ dám uống nước lọc khi chắc chắn Minh Anh không cầm bình của bạn." —
// water bottle + "nước lọc" tag, Minh Anh's empty desk across the room
export const P3S2: React.FC<ShotProps> = ({ t, len }) => {
  const you = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'worried'], [len, 'worried']]) }) },
    { f: len * 0.5, p: { armR: { a: 45, b: -30 } } },
    { f: len, p: {} },
  ]);
  const lookAcross = easeOut(clamp((t - len * 0.3) / (len * 0.4)));
  return (
    <g transform={camT(kf(t, [[0, 980], [len * 0.6, 1080], [len, 1080]]), kf(t, [[0, 575], [len, 570]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
      <Cls t={t} />
      <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.5} />
      {/* plain water bottle in hand */}
      <g transform={`translate(${PIP.x + 55} ${lerp(PIP.y - 80, PIP.y - 160, 0.5 + 0.5 * Math.sin(t * 0.2))}) rotate(${-8 + Math.sin(t * 0.15) * 3}) scale(0.6)`}>
        <rect x={-24} y={-60} width={48} height={110} rx={12} fill="#BFE0F0" stroke={K.INK} strokeWidth={4} opacity={0.9} />
        <rect x={-14} y={-74} width={28} height={18} rx={6} fill="#5C7A94" stroke={K.INK} strokeWidth={4} />
        <rect x={-16} y={-30} width={10} height={50} rx={5} fill="#FFFFFF" opacity={0.5} />
      </g>
      {/* sight line to Minh Anh's empty desk */}
      <line x1={PIP.x + 40} y1={PIP.y - 190} x2={lerp(PIP.x + 40, 1340, lookAcross)} y2={lerp(PIP.y - 190, 720, lookAcross)} stroke="#FFE9B0" strokeWidth={3} strokeDasharray="12 10" opacity={lookAcross * 0.7} />
      <g transform={`translate(1340 720) scale(${0.6})`} opacity={lookAcross}>
        <rect x={-95} y={-14} width={190} height={16} rx={4} fill="#8A6242" stroke={K.INK} strokeWidth={4} />
        <rect x={-85} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
        <rect x={71} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
        {/* her green thermos gone — empty spot */}
        <circle cx={30} cy={-50} r={30} fill="none" stroke={K.PAPER} strokeWidth={3} strokeDasharray="8 8" opacity={0.6} />
      </g>
      <Tag x={PIP.x - 170} y={PIP.y - 340} t={t + 12} text="nước lọc thôi!" w={200} />
    </g>
  );
};

// P3S3: "Tàn học, bạn về nhà, tắm rửa xong xui, leo lên giường định ngủ sớm." —
// transition: school door → bedroom, YOU climbs into bed
export const P3S3: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 960], [len * 0.4, 960], [len, 940]]);
  const zoom = kf(t, [[0, 1.0], [len * 0.5, 1.0], [len, 1.15]]);
  const inBed = easeOut(clamp((t - len * 0.55) / (len * 0.45)));
  const pose = poseAt(t, [
    { f: 0, p: idle(BED_YOU.x, BED_YOU.y, BED_YOU.s, { yaw: 0.4, look: 0.3, ...faceAt(t, [[0, 'tired'], [len * 0.5, 'tired'], [len, 'tired']]) }) },
    { f: len * 0.6, p: { y: lerp(BED_YOU.y, bedSit(0.4).y, inBed), headTilt: 10 * inBed } },
    { f: len, p: { headTilt: 14 } },
  ]);
  return (
    <g transform={camT(cx, kf(t, [[0, 560], [len, 520]]), zoom)}>
      <Bedroom t={t + 300} />
      {/* window moon */}
      <circle cx={WINDOW.moon.x} cy={WINDOW.moon.y} r={26} fill="#F6EFDF" opacity={0.9} />
      <circle cx={WINDOW.moon.x - 8} cy={WINDOW.moon.y - 6} r={22} fill="#1B1830" opacity={0.9} />
      {/* YOU sitting on bed edge then lying */}
      <K.Hero look={YOU} pose={{ ...pose, back: inBed * 0.4 }} rimId="rimR" shadow={0.4} />
      {/* blanket hint */}
      {inBed > 0.3 ? <K.BedDuvet from={0.1} knees={inBed} /> : null}
      {/* "zzz" */}
      {inBed > 0.5 ? [0, 1].map((i) => {
        const zt = (t * 0.4 + i * 30) % 60;
        return <text key={i} x={BED_YOU.x + 80 + zt * 0.8} y={BED_YOU.y - 260 - zt * 1.4} fontFamily="Georgia,serif" fontSize={30 + zt * 0.4} fill={K.PAPER} opacity={clamp(1 - zt / 60) * 0.8}>z</text>;
      }) : null}
      <Tag x={400} y={220} t={t + 14} text="về nhà · tắm · lên giường" w={320} />
    </g>
  );
};

// P3S4: "Điện thoại rung lên một cái, tin nhắn từ Minh Anh." — phone buzzes on nightstand
export const P3S4: React.FC<ShotProps> = ({ t, len }) => {
  const buzz = t > len * 0.45 ? Math.sin((t - len * 0.45) * 0.8) * 4 : 0;
  const glowOn = clamp((t - len * 0.5) / 10);
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1120]]), kf(t, [[0, 560], [len, 555]]), kf(t, [[0, 2.2], [len, 2.4]]))}>
      <Bedroom t={t + 400} />
      {/* nightstand + phone */}
      <rect x={1050} y={720} width={220} height={20} rx={4} fill="#4A3E50" stroke={K.INK} strokeWidth={4} />
      <rect x={1080} y={740} width={16} height={60} fill="#3A3040" stroke={K.INK} strokeWidth={3} />
      <rect x={1300} y={740} width={16} height={60} fill="#3A3040" stroke={K.INK} strokeWidth={3} />
      <g transform={`translate(1160 ${700 + buzz}) rotate(${-4 + buzz * 0.5})`}>
        <Phone x={0} y={0} w={130} on={glowOn} caller="MINH ANH" f={t} />
      </g>
      {/* buzz vibration lines */}
      {buzz !== 0 ? [0, 1].map((i) => (
        <path key={i} d={`M ${1140 - i * 30} ${640 - i * 16} q -10 14 0 28`} fill="none" stroke="#FFE9B0" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      )) : null}
      {/* screen glow */}
      <Glow x={1160} y={680} r={120} kind="cool" o={0.3 * glowOn} />
      <Tag x={1160} y={400} t={t + 16} text="tin nhắn!" w={190} />
    </g>
  );
};

// P3S5: "Ngủ chưa?" — chat close-up, first message bubble pops
export const P3S5: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 500} veil={0.6} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.5} />
      <g transform="translate(960 540) scale(1.6)">
        <ChatScreen x={0} y={0} w={460} t={t} msgs={[{ from: 'minh', text: 'Ngủ chưa?', at: 6 }]} />
      </g>
      <Glow x={960} y={540} r={400} kind="cool" o={0.15} />
    </g>
  );
};

// P3S6: "Tớ vừa pha một cốc cacao nóng, siêu nhiều đường." — second message + cocoa cup icon
export const P3S6: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: len * 0.4 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 550} veil={0.6} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.5} />
      <g transform="translate(960 540) scale(1.5)">
        <ChatScreen x={0} y={0} w={520} t={t} msgs={msgs} />
      </g>
      {/* cocoa cup icon */}
      {t > len * 0.5 ? (
        <g transform={`translate(1350 300) scale(${backOut(clamp((t - len * 0.5) / 14))})`} opacity={clamp((t - len * 0.48) / 10)}>
          <rect x={-50} y={-30} width={100} height={70} rx={12} fill="#6E4A2E" stroke={K.INK} strokeWidth={5} />
          <path d="M 50 -16 q 26 4 0 30" fill="none" stroke={K.INK} strokeWidth={5} />
          <path d="M -20 -48 q 8 -12 0 -24 M 8 -48 q 8 -12 0 -24" fill="none" stroke="#FFE9B0" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
          <text x={0} y={20} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={26} fontWeight={700} fill={K.PAPER}>cacao!</text>
        </g>
      ) : null}
    </g>
  );
};

// P3S7: "Bạn mỉm cười, gõ lại. Chưa, sao tự nhiên pha cacao khuya thế?" —
// YOU's reply appears as 'me' bubble
export const P3S7: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: len * 0.15 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: len * 0.55 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 600} veil={0.6} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.5} />
      {/* YOU in bed, phone glow on face */}
      <g transform={`translate(${BED_YOU.x - 200} ${BED_YOU.y + 40}) scale(${BED_YOU.s * 0.9})`}>
        <K.Hero look={YOU} pose={idle(BED_YOU.x - 200, BED_YOU.y + 40, BED_YOU.s * 0.9, { yaw: 0.6, look: 0.7, back: 0.3, ...faceAt(t, [[0, 'tired'], [len * 0.5, 'happy'], [len, 'happy']]) })} rimId="rimR" shadow={0.3} />
      </g>
      <Glow x={BED_YOU.x - 120} y={BED_YOU.y - 60} r={140} kind="cool" o={0.25} />
      <g transform="translate(1050 540) scale(1.35)">
        <ChatScreen x={0} y={0} w={480} t={t} msgs={msgs} />
      </g>
    </g>
  );
};

// P3S8: "Thử nghiệm khoa học thôi, cậu sẵn sàng chưa? Chưa." —
// her reply + your "Chưa" + cocoa cup again
export const P3S8: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 40 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: len * 0.3 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: len * 0.55 },
    { from: 'me', text: 'Chưa.', at: len * 0.8 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 650} veil={0.6} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.5} />
      <g transform="translate(960 540) scale(1.4)">
        <ChatScreen x={0} y={0} w={500} t={t} msgs={msgs} />
      </g>
      {/* flask icon for "thử nghiệm khoa học" */}
      {t > len * 0.5 ? (
        <g transform={`translate(260 320) scale(${backOut(clamp((t - len * 0.5) / 14))})`} opacity={clamp((t - len * 0.48) / 10)}>
          <path d="M -20 -50 L 20 -50 L 20 -20 Q 44 6 44 30 Q 44 56 0 56 Q -44 56 -44 30 Q -44 6 -20 -20 Z" fill="#BFE8FF" stroke={K.INK} strokeWidth={5} opacity={0.9} />
          <path d="M -30 20 Q 0 40 30 20 L 30 34 Q 0 54 -30 34 Z" fill="#7FB069" opacity={0.8} />
          <circle cx={-10} cy={40} r={5} fill={K.PAPER} />
          <circle cx={8} cy={46} r={4} fill={K.PAPER} />
          <circle cx={0} cy={30} r={4} fill={K.PAPER} />
        </g>
      ) : null}
    </g>
  );
};

// P3S9: "Chưa kịp nhắn thêm câu nào, mà người điện thoại sáng lên lần nữa." —
// screen lights up again, new notification glow
export const P3S9: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: len * 0.5 },
    { from: 'me', text: 'Chưa.', at: len * 0.7 },
  ];
  const relight = clamp((t - len * 0.6) / 12);
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 700} veil={0.5} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      <g transform="translate(960 540) scale(1.35)">
        <ChatScreen x={0} y={0} w={500} t={t} msgs={msgs} />
      </g>
      {/* screen relight pulse */}
      {relight > 0 ? (
        <g transform="translate(960 540)">
          <rect x={-400} y={-300} width={800} height={600} rx={30} fill="none" stroke="#BFE8FF" strokeWidth={6} opacity={relight * (0.5 + 0.5 * Math.sin(t * 0.3))} />
        </g>
      ) : null}
      <Glow x={960} y={540} r={420} kind="cool" o={0.2 * relight} />
      <Tag x={960} y={200} t={t + len * 0.6} text="sáng lên lần nữa!" w={280} />
    </g>
  );
};

export const p3c1Shots: ShotMap = { P3S1, P3S2, P3S3, P3S4, P3S5, P3S6, P3S7, P3S8, P3S9 };
