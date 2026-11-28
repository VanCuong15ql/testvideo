import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c1 — Monday morning rush: grab the green thermos, run out, arrive at class
// out of breath, slam it on the desk and notice it's not yours. P1S1–P1S8.
// Sets: Bedroom (grab + door) then Classroom (desks, Khải beside you).

const { Bedroom, BEDROOM, bedTop, WINDOW, Thermos, TitleCard, Tag, Glow, camT, kf, clamp, lerp, easeOut, backOut, settle, poseAt, faceAt, walkPose, easeIn, shake, YOU, KHANH, idle, Cls, ClsForeground } = K;

// ---------- bedroom blocking ----------
const BED_YOU = { x: 900, y: 780, s: 0.95 };
const DOOR = { x: 1420, y: 760 };

// ---------- classroom blocking ----------
const PIP = { x: 620, y: 838, s: 1.0 };
const KH = { x: 880, y: 818, s: 0.94 };

// P1S1: "Sáng thứ hai" — title over the bedroom, Pip half out of bed reaching for the thermos
export const P1S1: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 8) / 18));
  const pose = poseAt(t, [
    { f: 0, p: idle(BED_YOU.x, BED_YOU.y, BED_YOU.s, { yaw: 0.4, look: 0.4, armR: { a: 10, b: -8 } }) },
    { f: len * 0.55, p: { armR: { a: 55, b: -35 }, look: 0.7, headTilt: 6 }, ease: easeOut },
    { f: len, p: { armR: { a: 60, b: -38 } } },
  ]);
  const thX = lerp(1010, 940, reach);
  const thY = lerp(560, 700, reach);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Bedroom t={t + 60} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [len * 0.6, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      {/* the thermos on the nightstand, arcing into his hand */}
      <Thermos x={thX} y={thY - reach * 30} s={0.8} kind="minh" rot={reach * -18} t={t} />
      <TitleCard t={t} lines={['SÁNG THỨ HAI', ''] as [string, string]} y={150} size={96} />
    </g>
  );
};

// P1S2: "vớ vội chiếc bình giữ nhiệt màu xanh rêu" — close on hands grabbing it, green body fills frame
export const P1S2: React.FC<ShotProps> = ({ t, len }) => {
  const grab = easeOut(clamp((t - 6) / 10));
  const shakeT = t > len * 0.7 ? Math.sin((t - len * 0.7) * 0.9) * 4 * (1 - (t - len * 0.7) / (len * 0.3)) : 0;
  return (
    <g transform={camT(985, 640, kf(t, [[0, 2.6], [len * 0.5, 2.9], [len, 3.1]]))}>
      <Bedroom t={t + 120} />
      {/* giant thermos insert */}
      <g transform={`translate(960 ${660 + shakeT}) scale(2.4)`}>
        <Thermos x={0} y={0} s={1} kind="minh" t={t} steam={0.4} />
      </g>
      {/* his hands slap onto it */}
      <g transform={`translate(${960 - grab * 60} ${700 + grab * 10})`} opacity={grab}>
        <rect x={-90} y={-26} width={70} height={52} rx={20} fill={YOU.skin} stroke={K.INK} strokeWidth={5} transform="rotate(-18)" />
        <rect x={20} y={-30} width={70} height={52} rx={20} fill={YOU.skinShade} stroke={K.INK} strokeWidth={5} transform="rotate(14)" />
      </g>
      <Tag x={1560} y={240} t={t + 12} text="BÌNH GIỮ NHIỆT" w={220} />
    </g>
  );
};

// P1S3: "lao ra khỏi nhà vì trễ giờ kiểm tra" — sprint through the door, motion lines
export const P1S3: React.FC<ShotProps> = ({ t, len }) => {
  const run = walkPose(0, t * 0.32, 800, 1.05, { expr: 'shock' });
  const x = kf(t, [[0, 320], [len * 0.8, 1420], [len, 1560]]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1180]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 1.1], [len, 1.25]]))}>
      <Bedroom t={t + 200} />
      {/* door frame on the right */}
      <rect x={1380} y={380} width={26} height={470} fill="#3A2E28" stroke={K.INK} strokeWidth={4} />
      <rect x={1520} y={380} width={26} height={470} fill="#3A2E28" stroke={K.INK} strokeWidth={4} />
      <rect x={1380} y={380} width={166} height={26} fill="#3A2E28" stroke={K.INK} strokeWidth={4} />
      <K.Hero look={YOU} pose={{ ...run, x, y: 800, scale: 1.05 }} rimId="rimR" shadow={0.5} />
      {/* speed lines */}
      {[-30, -10, 14, 36].map((o, i) => (
        <line key={i} x1={x - 120 - i * 26} y1={640 + o * 4} x2={x - 200 - i * 40} y2={640 + o * 4} stroke="#FFE9B0" strokeWidth={5} strokeLinecap="round" opacity={0.5 * clamp(1 - Math.abs(x - 1420) / 500)} />
      ))}
      <Tag x={300} y={220} t={t + 10} text="TRỄ GIỜ KIỂM TRA!" w={240} />
    </g>
  );
};

// P1S4: "Đến lớp, bạn thở dốc" — classroom wide, Pip slides into his seat gasping
export const P1S4: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp(t / (len * 0.5)));
  const x = lerp(1500, PIP.x, slide);
  const pose = poseAt(t, [
    { f: 0, p: { ...idle(x, PIP.y, PIP.s, { yaw: 0.8, look: 0.8, armL: { a: 20, b: -14 }, armR: { a: 30, b: -20 } }), ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) } },
    { f: len * 0.5, p: { x: PIP.x, yaw: 0.4, look: 0.3, armL: { a: 40, b: -30 }, armR: { a: 50, b: -35 }, headTilt: 8 } },
    { f: len, p: { headTilt: 4, armR: { a: 46, b: -32 } } },
  ]);
  // heave: chest bounce
  const heave = Math.sin(clamp((t - len * 0.3) / (len * 0.4)) * Math.PI) * 6;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 950]]), kf(t, [[0, 590], [len, 575]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Cls t={t} />
      {/* his desk */}
      <SchoolDeskWrap x={PIP.x} y={PIP.y + 60} />
      <g transform={`translate(0 ${-heave})`}>
        <K.Hero look={YOU} pose={{ ...pose, x }} rimId="rimR" shadow={0.5} />
      </g>
      {/* thermos in hand lowering to desk */}
      <g transform={`translate(${x + 60 + slide * -10} ${lerp(560, 760, slide)}) rotate(${lerp(-30, 8, slide)}) scale(0.75)`}>
        <Thermos x={0} y={0} kind="minh" t={t} />
      </g>
      {/* breath puffs */}
      {[0, 1].map((i) => {
        const bt = (t * 0.9 + i * 22) % 44;
        return <circle key={i} cx={x + 70 + bt * 1.6} cy={PIP.y - 190 - bt * 0.8} r={8 + bt * 0.3} fill="#FFFFFF" opacity={clamp(1 - bt / 44) * 0.55} />;
      })}
    </g>
  );
};

const SchoolDeskWrap: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-95} y={-14} width={190} height={16} rx={4} fill="#8A6242" stroke={K.INK} strokeWidth={4} />
    <rect x={-85} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
    <rect x={71} y={2} width={14} height={70} fill="#6E4C30" stroke={K.INK} strokeWidth={3} />
  </g>
);

// P1S5: "đặt phịch chiếc bình lên bàn" — thermos SLAMS down, papers jump, dust puff
export const P1S5: React.FC<ShotProps> = ({ t, len }) => {
  const slam = clamp((t - 4) / 8);
  const y = lerp(560, 712, easeIn(slam));
  const impact = t > 12 ? Math.exp(-(t - 12) / 10) : 0;
  const pose = idle(PIP.x, PIP.y, PIP.s, {
    yaw: 0.4, look: 0.3,
    armR: { a: lerp(60, 18, easeOut(slam)), b: lerp(-40, -10, easeOut(slam)) },
    ...faceAt(t, [[0, 'shock'], [14, 'shock'], [len, 'neutral']]),
  });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 585], [len, 575]]), kf(t, [[0, 1.5], [len * 0.4, 1.62], [len, 1.55]]))}>
      <Cls t={t} />
      <SchoolDeskWrap x={PIP.x} y={PIP.y + 60} />
      {(() => { const sh = shake(t, 12, 10, 5 * impact); return <K.Hero look={YOU} pose={{ ...pose, x: pose.x + sh.x, y: pose.y + sh.y }} rimId="rimR" shadow={0.5} />; })()}
      {/* the thermos falls and lands */}
      <g transform={`translate(${PIP.x + 62} ${y}) rotate(${lerp(-14, 4, slam)}) scale(0.75)`}>
        <Thermos x={0} y={0} kind="minh" t={t} />
      </g>
      {/* impact star + paper jump */}
      {impact > 0.05 ? (
        <g opacity={impact} transform={`translate(${PIP.x + 62} 690)`}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 + 0.4;
            return <line key={i} x1={Math.cos(a) * 30} y1={Math.sin(a) * 30} x2={Math.cos(a) * (55 + 40 * (1 - impact))} y2={Math.sin(a) * (55 + 40 * (1 - impact))} stroke="#FFE9B0" strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
      {/* notebook jumping */}
      <g transform={`translate(${PIP.x - 60} ${688 - impact * 26}) rotate(${-8 - impact * 14})`}>
        <rect x={-46} y={-20} width={92} height={40} rx={5} fill="#3E5A8C" stroke={K.INK} strokeWidth={3.5} />
        <rect x={-40} y={-15} width={80} height={30} rx={3} fill={K.PAPER} stroke={K.INK} strokeWidth={2} />
      </g>
      <FloatTag t={t} at={16} text="ĐẶT PHỊCH!" x={PIP.x + 40} y={560} />
    </g>
  );
};

const FloatTag: React.FC<{ t: number; at: number; text: string; x: number; y: number }> = ({ t, at, text, x, y }) => {
  if (t < at) return null;
  const o = clamp(1 - (t - at) / 40);
  return (
    <g transform={`translate(${x} ${y - (t - at) * 0.8})`} opacity={o}>
      <text x={0} y={0} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={44} fontWeight={700} fill="#FFE9B0" stroke={K.INK} strokeWidth={6} paintOrder="stroke">{text}</text>
    </g>
  );
};

// P1S6: "nhận ra một chi tiết hơi sai" — close-up: the green thermos, sticker zoom, ? pop
export const P1S6: React.FC<ShotProps> = ({ t, len }) => {
  const zoom = kf(t, [[0, 3.2], [len * 0.6, 4.2], [len, 4.4]]);
  const q = t > len * 0.45 ? backOut(clamp((t - len * 0.45) / 12)) : 0;
  return (
    <g transform={camT(985, 700, zoom)}>
      <Cls t={t} fg={false} />
      {/* giant thermos on the desk */}
      <g transform="translate(985 640)">
        <Thermos x={0} y={0} s={2.6} kind="minh" t={t} steam={0.3} />
      </g>
      {/* zoom ring on the sticker */}
      <circle cx={985} cy={640 - 13 * 2.6} r={46 * q} fill="none" stroke="#FFE9B0" strokeWidth={5} opacity={q} strokeDasharray="10 8" />
      {q > 0.6 ? (
        <g transform={`translate(${985 + 120} ${640 - 160}) scale(${q})`}>
          <circle cx={0} cy={0} r={44} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
          <text x={0} y={18} textAnchor="middle" fontFamily="Georgia,serif" fontSize={56} fill={K.INK} fontWeight={700}>?</text>
        </g>
      ) : null}
      <FloatTag t={t} at={len * 0.5} text="SAI??" x={985} y={380} />
    </g>
  );
};

// P1S7: "Bình của bạn vốn màu xám bạc có dán sticker mèo mập" — flashback insert: HIS thermos
export const P1S7: React.FC<ShotProps> = ({ t, len }) => {
  const inK = easeOut(clamp(t / 12));
  const w = lerp(0, 620, inK);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Cls t={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0E0A1C" opacity={0.35 * inK} />
      {/* memory card */}
      <g transform={`translate(960 520)`} opacity={inK}>
        <rect x={-w / 2} y={-190} width={w} height={380} rx={18} fill={K.PAPER} stroke={K.INK} strokeWidth={6} />
        {w > 300 ? (
          <g transform="translate(0 10) scale(1.9)">
            <Thermos x={0} y={0} kind="you" t={t} />
          </g>
        ) : null}
        {w > 480 ? (
          <text x={0} y={150} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={40} fontWeight={700} fill={K.INK}>BÌNH CỦA BẠN</text>
        ) : null}
        {w > 540 ? (
          <text x={0} y={196} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={30} fill="#7A6A55">xám bạc · sticker mèo mập</text>
        ) : null}
      </g>
    </g>
  );
};

// P1S8: "còn bên này màu xanh rêu... sticker cốc cà phê" — back to the wrong one, sticker close-up
export const P1S8: React.FC<ShotProps> = ({ t, len }) => {
  const zoom = kf(t, [[0, 2.4], [len * 0.5, 3.0], [len, 3.1]]);
  return (
    <g transform={camT(985, 690, zoom)}>
      <Cls t={t} fg={false} />
      <g transform="translate(985 640)">
        <Thermos x={0} y={0} s={2.6} kind="minh" t={t} />
      </g>
      {/* sticker callout */}
      <g transform={`translate(1250 480) scale(${backOut(clamp((t - 10) / 14))})`} opacity={clamp((t - 8) / 10)}>
        <rect x={-190} y={-52} width={380} height={104} rx={16} fill={K.PAPER} stroke={K.INK} strokeWidth={5} />
        <text x={0} y={-8} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={34} fontWeight={700} fill={K.INK}>cốc cà phê?</text>
        <text x={0} y={34} textAnchor="middle" fontFamily="'Segoe Print',cursive" fontSize={26} fill="#7A6A55">không phải mèo mập!</text>
        <line x1={-150} y1={52} x2={-60} y2={110} stroke={K.INK} strokeWidth={4} />
      </g>
    </g>
  );
};

export const p1c1Shots: ShotMap = { P1S1, P1S2, P1S3, P1S4, P1S5, P1S6, P1S7, P1S8 };
