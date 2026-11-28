import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p3c2 — the countdown "3, 2, 1, uống đây", a minute of nothing, then the twist:
// she never drank from the thermos — she's holding YOUR grey one. "Chúc ngủ ngon, người bị đánh úp."
// P3S10–P3S18. Sets: Bedroom + ChatScreen + a cutaway of Minh Anh's room.

const { Thermos, ChatScreen, Phone, Say, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, YOU, MINH, idle, Bedroom, WINDOW } = K;

const BED_YOU = { x: 940, y: 800, s: 1.0 };

// P3S10: "3, 2, 1, uống đây." — countdown numbers slam on screen over the chat
export const P3S10: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: len * 0.3 },
    { from: 'minh', text: '2...', at: len * 0.5 },
    { from: 'minh', text: '1, uống đây!', at: len * 0.7 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 750} veil={0.55} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      {/* YOU in bed, tense, phone in hand */}
      <g transform={`translate(${BED_YOU.x - 220} ${BED_YOU.y + 30}) scale(${BED_YOU.s * 0.85})`}>
        <K.Hero look={YOU} pose={idle(BED_YOU.x - 220, BED_YOU.y + 30, BED_YOU.s * 0.85, { yaw: 0.6, look: 0.7, back: 0.3, ...faceAt(t, [[0, 'tired'], [len * 0.3, 'worried'], [len, 'shock']]) })} rimId="rimR" shadow={0.3} />
      </g>
      {/* countdown numerals */}
      {[3, 2, 1].map((n, i) => {
        const at = len * (0.3 + i * 0.2);
        if (t < at - 2 || t > at + 40) return null;
        const sc = backOut(clamp((t - at) / 10));
        const o = clamp(1 - (t - at - 30) / 10);
        return (
          <g key={n} transform={`translate(${960 + (i - 1) * 160} ${260}) scale(${sc})`} opacity={o}>
            <text x={0} y={0} textAnchor="middle" fontFamily="Georgia,serif" fontSize={140} fontWeight={700} fill="#FFE9B0" stroke={K.INK} strokeWidth={10} paintOrder="stroke">{n}</text>
          </g>
        );
      })}
      <g transform="translate(1180 540) scale(1.3)">
        <ChatScreen x={0} y={0} w={460} t={t} msgs={msgs} />
      </g>
      {/* anticipation glow on YOU's chest — the "link" waiting to fire */}
      <Glow x={BED_YOU.x - 220} y={BED_YOU.y - 40} r={120} kind="warm" o={0.25 * clamp((t - len * 0.7) / 10)} />
    </g>
  );
};

// P3S11: "Bạn nín thở chờ đợi, nhưng suốt một phút trôi qua," — YOU holds breath, clock spins
export const P3S11: React.FC<ShotProps> = ({ t, len }) => {
  const hold = t > len * 0.3 ? clamp((t - len * 0.3) / 20) : 0;
  const spin = (t * 30) % 360;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 930]]), kf(t, [[0, 545], [len, 535]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Bedroom t={t + 800} veil={0.5} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.4} />
      {/* YOU sitting up in bed, holding breath, phone on chest */}
      <g transform={`translate(${BED_YOU.x - 260} ${BED_YOU.y + 20}) scale(${BED_YOU.s * 0.9})`}>
        <K.Hero look={YOU} pose={idle(BED_YOU.x - 260, BED_YOU.y + 20, BED_YOU.s * 0.9, {
          yaw: 0.5, look: 0.6, back: 0.3,
          ...faceAt(t, [[0, 'worried'], [len * 0.4, 'shock'], [len, 'worried']]),
          headTilt: 8 * hold,
        })} rimId="rimR" shadow={0.3} />
      </g>
      {/* phone on his chest */}
      <g transform={`translate(${BED_YOU.x - 260} ${BED_YOU.y - 60}) rotate(8)`}>
        <Phone x={0} y={0} w={110} on={0.7} caller="MINH ANH" f={t} />
      </g>
      {/* held breath: puff frozen */}
      <ellipse cx={BED_YOU.x - 230} cy={BED_YOU.y - 140} rx={10 + hold * 8} ry={14 + hold * 10} fill="#BFE8FF" opacity={0.3 + hold * 0.3} />
      {/* clock spin */}
      <g transform={`translate(1600 200)`} opacity={hold}>
        <circle cx={0} cy={0} r={54} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
        <line x1={0} y1={0} x2={0} y2={-38} stroke="#B4543F" strokeWidth={5} strokeLinecap="round" transform={`rotate(${spin} 0 0)`} />
        <line x1={0} y1={0} x2={26} y2={0} stroke={K.INK} strokeWidth={4} strokeLinecap="round" transform={`rotate(${spin * 12} 0 0)`} />
        <circle cx={0} cy={0} r={5} fill={K.INK} />
      </g>
      <FloatTime t={t} at={len * 0.4} text="1 phút..." x={1600} y={300} />
    </g>
  );
};

const FloatTime: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 50);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={40} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={6} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P3S12: "chẳng có vị ngọt ngào hay hơi ấm nào của cacao lan tới cả." —
// anticlimax: empty glass with a sad face, "không có gì" text
export const P3S12: React.FC<ShotProps> = ({ t, len }) => {
  const droop = easeOut(clamp(t / 20));
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 850} veil={0.5} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.5} />
      {/* empty cocoa mug, steam gone, sad face */}
      <g transform="translate(960 520)">
        <rect x={-80} y={-40} width={160} height={140} rx={16} fill="#4A3E50" stroke={K.INK} strokeWidth={6} />
        <path d="M 80 -10 q 30 6 0 44" fill="none" stroke={K.INK} strokeWidth={6} />
        {/* empty inside */}
        <ellipse cx={0} cy={-40} rx={80} ry={14} fill="#2A2233" stroke={K.INK} strokeWidth={4} />
        {/* sad face on mug */}
        <circle cx={-26} cy={10} r={8} fill={K.PAPER} opacity={0.9} />
        <circle cx={26} cy={10} r={8} fill={K.PAPER} opacity={0.9} />
        <path d={`M -24 ${30 + droop * 8} Q 0 ${30 - droop * 8} 24 ${30 + droop * 8}`} fill="none" stroke={K.PAPER} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        {/* crossed-out steam */}
        <g transform="translate(0 -70) rotate(-15)" opacity={0.7}>
          <path d="M -20 0 q 10 -18 0 -36 M 0 0 q 10 -18 0 -36 M 20 0 q 10 -18 0 -36" fill="none" stroke="#8B84A8" strokeWidth={5} strokeLinecap="round" />
          <line x1={-50} y1={-60} x2={50} y2={20} stroke="#FF8A7A" strokeWidth={6} strokeLinecap="round" />
        </g>
      </g>
      <text x={960} y={760} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={52} fontWeight={700} fill={K.PAPER} stroke={K.INK} strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 15) / 14)}>
        KHÔNG CÓ GÌ CẢ...
      </text>
      {/* question marks */}
      {[0, 1].map((i) => (
        <text key={i} x={960 + (i - 0.5) * 140} y={420 - i * 30} textAnchor="middle" fontFamily="Georgia,serif" fontSize={60} fill={K.PAPER} opacity={0.6 * clamp((t - 20 - i * 10) / 10)}>?</text>
      ))}
    </g>
  );
};

// P3S13: "Bạn cau mày, gõ nhanh. Ủa, có thấy gì đâu?" — YOU frowns, types fast
export const P3S13: React.FC<ShotProps> = ({ t, len }) => {
  const type = clamp((t - len * 0.3) / (len * 0.5));
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.75 },
  ];
  const you = idle(BED_YOU.x - 220, BED_YOU.y + 30, BED_YOU.s * 0.9, {
    yaw: 0.5, look: 0.6, back: 0.3,
    ...faceAt(t, [[0, 'worried'], [len * 0.4, 'worried'], [len, 'worried']]),
    headTilt: 6,
  });
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 900} veil={0.55} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      <g transform={`translate(${BED_YOU.x - 220} ${BED_YOU.y + 30}) scale(${BED_YOU.s * 0.9})`}>
        <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.3} />
      </g>
      {/* typing dots on 'me' side before send */}
      {type > 0 && type < 0.9 ? (
        <g transform="translate(1420 700)" opacity={type}>
          <rect x={-60} y={-24} width={120} height={48} rx={16} fill="#4E6E9E" stroke="#6E8EC0" strokeWidth={3} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-24 + i * 24} cy={0} r={6} fill={K.PAPER} opacity={0.5 + 0.5 * Math.sin(t * 0.5 + i * 1.2)} />
          ))}
        </g>
      ) : null}
      <g transform="translate(960 540) scale(1.35)">
        <ChatScreen x={0} y={0} w={520} t={t} msgs={msgs} />
      </g>
      <Tag x={960} y={180} t={t + len * 0.4} text="cau mày!" w={170} />
    </g>
  );
};

// P3S14: "Bình của cậu hết tác dụng rồi à?" — her teasing reply pops
export const P3S14: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.5 },
    { from: 'minh', text: 'Bình của cậu hết tác dụng rồi à?', at: len * 0.75 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 950} veil={0.55} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      {/* zoom on the new message */}
      <g transform="translate(960 540) scale(1.45)">
        <ChatScreen x={0} y={0} w={540} t={t} msgs={msgs} />
      </g>
      {/* smirk emoji reaction */}
      {t > len * 0.7 ? (
        <g transform={`translate(1250 850) scale(${backOut(clamp((t - len * 0.7) / 12))})`} opacity={clamp((t - len * 0.68) / 10)}>
          <circle cx={0} cy={0} r={40} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
          <path d="M -16 -8 Q -8 -16 0 -8 Q 8 -16 16 -8" fill="none" stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
          <circle cx={-10} cy={4} r={4} fill={K.INK} />
          <circle cx={10} cy={4} r={4} fill={K.INK} />
          <path d="M -10 18 Q 0 26 10 18" fill="none" stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

// P3S15: "Tin nhắn trả lời hiện lên gần như ngay lập tức, kèm biểu tượng cười đắt thắng." —
// instant reply + smug emoji, screen flash
export const P3S15: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.45 },
    { from: 'minh', text: 'Bình của cậu hết tác dụng rồi à?', at: len * 0.6 },
    { from: 'minh', text: 'Không hề~', at: len * 0.8 },
  ];
  const flash = t > len * 0.75 && t < len * 0.85 ? (t - len * 0.75) / (len * 0.1) : 0;
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 1000} veil={0.5} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      <g transform="translate(960 540) scale(1.4)">
        <ChatScreen x={0} y={0} w={540} t={t} msgs={msgs} />
      </g>
      {/* smug emoji */}
      {t > len * 0.78 ? (
        <g transform={`translate(1350 800) scale(${backOut(clamp((t - len * 0.78) / 12))})`} opacity={clamp((t - len * 0.76) / 10)}>
          <circle cx={0} cy={0} r={44} fill={K.PAPER} stroke={K.INK} strokeWidth={4} />
          <path d="M -18 -10 Q -9 -20 0 -10 Q 9 -20 18 -10" fill="none" stroke={K.INK} strokeWidth={4.5} strokeLinecap="round" />
          <circle cx={-11} cy={4} r={4.5} fill={K.INK} />
          <circle cx={11} cy={4} r={4.5} fill={K.INK} />
          <path d="M -12 20 Q 0 30 12 20" fill="none" stroke={K.INK} strokeWidth={4.5} strokeLinecap="round" />
          {/* smug eyebrow */}
          <path d="M -18 -18 L -6 -14 M 18 -18 L 6 -14" stroke={K.INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      {/* screen flash on reply */}
      {flash > 0 ? <rect x={0} y={0} width={1920} height={1080} fill="#BFE8FF" opacity={flash * 0.12} /> : null}
      <Tag x={960} y={180} t={t + len * 0.7} text="cười đắt thắng!" w={260} />
    </g>
  );
};

// P3S16: "Không hề, chỉ là tớ không... Không hề uống từ cái bình đó." —
// her messages continue, YOU's face goes pale
export const P3S16: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.35 },
    { from: 'minh', text: 'Bình của cậu hết tác dụng rồi à?', at: len * 0.5 },
    { from: 'minh', text: 'Không hề, chỉ là tớ không...', at: len * 0.7 },
    { from: 'minh', text: 'Không hề uống từ cái bình đó.', at: len * 0.85 },
  ];
  const pale = easeOut(clamp((t - len * 0.6) / 20));
  const you = idle(BED_YOU.x - 220, BED_YOU.y + 30, BED_YOU.s * 0.9, {
    yaw: 0.5, look: 0.6, back: 0.3,
    ...faceAt(t, [[0, 'worried'], [len * 0.5, 'shock'], [len, 'shock']]),
    headTilt: -4 * pale,
  });
  return (
    <g transform={camT(960, 540, 1)}>
      <Bedroom t={t + 1050} veil={0.5} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.45} />
      <g transform={`translate(${BED_YOU.x - 220} ${BED_YOU.y + 30}) scale(${BED_YOU.s * 0.9})`}>
        <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.3} />
      </g>
      {/* pale wash on his face */}
      <ellipse cx={BED_YOU.x - 220} cy={BED_YOU.y - 160} rx={60} ry={50} fill="#BFE8FF" opacity={pale * 0.15} />
      <g transform="translate(960 540) scale(1.4)">
        <ChatScreen x={0} y={0} w={560} t={t} msgs={msgs} />
      </g>
      <FloatDread t={t} at={len * 0.75} text="hả?!" x={BED_YOU.x - 100} y={BED_YOU.y - 320} />
    </g>
  );
};

const FloatDread: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 45);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.5})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={52} fontWeight={700} fill="#FF8A7A" stroke={K.INK} strokeWidth={7} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P3S17: "Tớ đang cầm bình xám bạc của cậu đây." — THE TWIST: cutaway to Minh Anh's room,
// she holds YOUR grey thermos, cocoa mug beside her
export const P3S17: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = easeOut(clamp(t / 18));
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.3 },
    { from: 'minh', text: 'Bình của cậu hết tác dụng rồi à?', at: len * 0.45 },
    { from: 'minh', text: 'Không hề, chỉ là tớ không...', at: len * 0.6 },
    { from: 'minh', text: 'Không hề uống từ cái bình đó.', at: len * 0.72 },
    { from: 'minh', text: 'Tớ đang cầm bình xám bạc của cậu đây.', at: len * 0.85 },
  ];
  return (
    <g transform={camT(960, 540, 1)}>
      {/* MINH ANH's room — same bedroom set but warmer lamp */}
      <Bedroom t={t + 1100} lamp={1} clock="23:47" />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.35} />
      {/* Minh Anh sitting on bed, holding YOUR grey thermos + cocoa mug */}
      <g transform={`translate(960 ${lerp(700, 640, reveal)}) scale(${1.15 * reveal + 0.01})`} opacity={reveal}>
        <K.Hero look={MINH} pose={idle(960, 720, 1.1, {
          yaw: -0.3, look: -0.4, back: 0.2,
          ...faceAt(t, [[0, 'smug'], [len, 'smug']]),
          armR: { a: 65, b: -45 },
        })} rimId="rimL" shadow={0.4} />
      </g>
      {/* YOUR grey thermos in her hands — the twist prop */}
      {reveal > 0.4 ? (
        <g transform={`translate(${960 + 60} ${560 - reveal * 40}) scale(${0.9}) rotate(${-8 + Math.sin(t * 0.1) * 2})`} opacity={reveal}>
          <Thermos x={0} y={0} kind="you" t={t} />
        </g>
      ) : null}
      {/* cocoa mug beside her */}
      {reveal > 0.5 ? (
        <g transform={`translate(${960 - 140} ${640}) scale(0.8)`} opacity={reveal}>
          <rect x={-40} y={-24} width={80} height={60} rx={10} fill="#6E4A2E" stroke={K.INK} strokeWidth={4} />
          <path d="M 40 -12 q 20 4 0 26" fill="none" stroke={K.INK} strokeWidth={4} />
          <path d="M -14 -38 q 6 -10 0 -20 M 6 -38 q 6 -10 0 -20" fill="none" stroke="#FFE9B0" strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
        </g>
      ) : null}
      {/* chat overlay small at corner */}
      <g transform="translate(1560 850) scale(0.8)" opacity={0.9}>
        <ChatScreen x={0} y={0} w={380} t={t} msgs={msgs.slice(-3)} name="Minh Anh" />
      </g>
      <FloatTwist t={t} at={len * 0.5} text="TWIST!" x={960} y={200} />
    </g>
  );
};

const FloatTwist: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 60);
  const sc = backOut(clamp((t - at) / 14));
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="Georgia,serif" fontSize={90} fontWeight={700} fontStyle="italic" fill="#F28C9A" stroke={K.INK} strokeWidth={9} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P3S18: "Chúc ngủ ngon nha, người bị đánh úp." — final beat: YOU in bed, defeated,
// her last message + a smug goodnight; maybe his thermos visible on nightstand (safe now)
export const P3S18: React.FC<ShotProps> = ({ t, len }) => {
  const msgs: K.ChatMsg[] = [
    { from: 'minh', text: 'Ngủ chưa?', at: 4 },
    { from: 'minh', text: 'Tớ vừa pha một cốc cacao nóng, siêu nhiều đường~', at: 30 },
    { from: 'me', text: 'Chưa, sao tự nhiên pha cacao khuya thế?', at: 60 },
    { from: 'minh', text: 'Thử nghiệm khoa học thôi, cậu sẵn sàng chưa?', at: 90 },
    { from: 'me', text: 'Chưa.', at: 120 },
    { from: 'minh', text: '3...', at: 150 },
    { from: 'minh', text: '2...', at: 170 },
    { from: 'minh', text: '1, uống đây!', at: 190 },
    { from: 'me', text: 'Ủa, có thấy gì đâu?', at: len * 0.25 },
    { from: 'minh', text: 'Bình của cậu hết tác dụng rồi à?', at: len * 0.4 },
    { from: 'minh', text: 'Không hề, chỉ là tớ không...', at: len * 0.55 },
    { from: 'minh', text: 'Không hề uống từ cái bình đó.', at: len * 0.68 },
    { from: 'minh', text: 'Tớ đang cầm bình xám bạc của cậu đây.', at: len * 0.8 },
    { from: 'minh', text: 'Chúc ngủ ngon nha, người bị đánh úp~', at: len * 0.92 },
  ];
  const defeat = easeOut(clamp(t / 24));
  const you = idle(BED_YOU.x - 220, BED_YOU.y + 30, BED_YOU.s * 0.9, {
    yaw: 0.5, look: 0.4, back: 0.4,
    ...faceAt(t, [[0, 'dizzy'], [len * 0.5, 'tired'], [len, 'tired']]),
    headTilt: 14 * defeat,
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Bedroom t={t + 1200} lamp={0.8} clock="23:59" />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.4} />
      {/* YOU slumped in bed, phone dimmed */}
      <g transform={`translate(${BED_YOU.x - 220} ${BED_YOU.y + 30 + defeat * 20}) scale(${BED_YOU.s * 0.9})`}>
        <K.Hero look={YOU} pose={you} rimId="rimR" shadow={0.3} />
      </g>
      {/* his thermos on the nightstand — safe, guarded */}
      <g transform={`translate(${BED_YOU.x + 160} ${BED_YOU.y - 120}) scale(0.6)`}>
        <Thermos x={0} y={0} kind="you" t={t} />
      </g>
      <g transform={`translate(${BED_YOU.x + 160} ${BED_YOU.y - 160})`} opacity={0.6}>
        <circle cx={0} cy={0} r={44} fill="none" stroke="#8BE0A4" strokeWidth={4} strokeDasharray="12 10" />
      </g>
      {/* chat small */}
      <g transform="translate(1500 880) scale(0.75)" opacity={0.85}>
        <ChatScreen x={0} y={0} w={400} t={t} msgs={msgs.slice(-4)} name="Minh Anh" />
      </g>
      {/* final "goodnight" banner */}
      {t > len * 0.9 ? (
        <g transform={`translate(960 160) scale(${backOut(clamp((t - len * 0.9) / 16))})`} opacity={clamp((t - len * 0.88) / 10)}>
          <text x={0} y={0} textAnchor="middle" fontFamily="Georgia,serif" fontSize={64} fontStyle="italic" fill={K.PAPER} stroke={K.INK} strokeWidth={8} paintOrder="stroke">Chúc ngủ ngon!</text>
        </g>
      ) : null}
      {/* fade to black at very end */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={clamp((t - len + 20) / 30) * 0.85} />
    </g>
  );
};

export const p3c2Shots: ShotMap = { P3S10, P3S11, P3S12, P3S13, P3S14, P3S15, P3S16, P3S17, P3S18 };
