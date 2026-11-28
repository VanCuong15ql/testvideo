import React from 'react';
import {
  ShotProps,
  ShotMap,
  Pose,
  basePose,
  poseAt,
  faceAt,
  kf,
  clamp,
  lerp,
  easeInOut,
  easeOut,
  easeIn,
  backOut,
  shake,
  rnd,
  settle,
  spring,
  camT,
  LOOKS,
  Hero,
  Actor,
  walkPose,
  Classroom,
  CLS,
  Kid,
  KIDS,
  SchoolDesk,
  Bedroom,
  BEDROOM,
  bedTop,
  bedSit,
  BedDuvet,
  LAMP,
  WINDOW,
  Phone,
  TitleCard,
  Tag,
  Toast,
  FloatLabel,
  LightVeil,
  DrawOn,
  Glow,
  Dust,
  Foreground,
  ShotFrame,
  Sparkle,
  UI,
} from '../../../engine';

// Shared kit for the thermos story. "You" is the student (Pip); best friend Khải is Mo;
// the crush Minh Anh is Nina. Sets: Classroom for pages 1-2, Bedroom + Phone for page 3.

export const YOU = LOOKS.pipHood;
export const KHANH = LOOKS.mo;
export const MINH = LOOKS.nina;

export const INK = '#0D0A14';
export const PAPER = '#F6EFDF';

export const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, ...extra,
});

// ---------- speech bubbles: quoted lines get a hand-drawn comic bubble ----------
/** Comic speech bubble in screen space (1920x1080). Render as a SIBLING after the shot's
 *  camT group. x,y = bubble centre, tx,ty = tail tip on the speaker's head (screen px),
 *  at/until = shot-clock frames, t = current shot clock. */
export const Say: React.FC<{
  x: number; y: number; tx: number; ty: number;
  text: string; at: number; until: number; t: number;
  maxW?: number; fs?: number;
}> = ({ x, y, tx, ty, text, at, until, t, maxW = 520, fs = 44 }) => {
  if (t < at - 2 || t > until + 2) return null;
  const pin = spring(t - at, { damping: 11, stiffness: 170 });
  const pout = clamp((until - t) / 8);
  const sc = Math.max(0.01, pin * (0.72 + 0.28 * pout));
  const o = clamp(pin * 2.5) * pout;
  const cw = fs * 0.52;
  const per = Math.max(8, Math.floor(maxW / cw));
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(/\s+/)) {
    if (cur && (cur + ' ' + w).length > per) { lines.push(cur); cur = w; } else { cur = cur ? cur + ' ' + w : w; }
  }
  if (cur) lines.push(cur);
  const w = Math.max(...lines.map((l) => l.length)) * cw + fs * 1.15;
  const h = lines.length * fs * 1.26 + fs * 1.0;
  const wob = t - at > 14 ? Math.sin((t - at) * 0.16) * 1.3 + Math.sin((t - at) * 0.061) * 0.7 : 0;
  const down = ty > y;
  const ey = down ? h / 2 : -h / 2;
  const lx = clamp(tx - x, -w * 0.3, w * 0.3);
  const tipx = tx - x;
  const tipy = ty - y - (down ? 8 : -8);
  const bw = fs * 0.62;
  const tail = `M ${lx - bw} ${ey} L ${tipx} ${tipy} L ${lx + bw} ${ey} Q ${lx} ${ey + (down ? fs * 0.34 : -fs * 0.34)} ${lx - bw} ${ey} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${wob}) scale(${sc})`} opacity={o}>
      <path d={tail} fill={PAPER} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={fs * 0.55} fill={PAPER} stroke={INK} strokeWidth={5} />
      <rect x={-w / 2 + 3} y={-h / 2 + 2} width={w - 6} height={h - 4} rx={fs * 0.5} fill="none" stroke={INK} strokeWidth={1.6} opacity={0.25} />
      {lines.map((l, i) => (
        <text key={i} x={0} y={-h / 2 + fs * 0.98 + i * fs * 1.26} textAnchor="middle"
          fontFamily="'Segoe Print','Comic Sans MS',cursive" fontSize={fs} fontWeight={700} fill={INK}>
          {l}
        </text>
      ))}
    </g>
  );
};

// ---------- the thermos: the story's hero prop ----------
export type ThermosKind = 'you' | 'minh';
/** "you" = grey-silver with a fat-cat sticker; "minh" = moss green with a tiny coffee-cup sticker.
 *  Drawn upright, ~150 units tall at s=1, centred at (x,y) = middle of the body. */
export const Thermos: React.FC<{ x: number; y: number; s?: number; rot?: number; kind?: ThermosKind; t?: number; steam?: number }> = ({
  x, y, s = 1, rot = 0, kind = 'you', t = 0, steam = 0,
}) => {
  const green = kind === 'minh';
  const body = green ? '#4E7A4E' : '#9AA4AE';
  const bodyD = green ? '#3D6240' : '#7C8792';
  const cap = green ? '#2F4A33' : '#5C6670';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {/* lid */}
      <rect x={-26} y={-76} width={52} height={20} rx={8} fill={cap} stroke={INK} strokeWidth={4} />
      <rect x={-14} y={-86} width={28} height={14} rx={6} fill={cap} stroke={INK} strokeWidth={4} />
      {/* body */}
      <path d="M -30 -56 L -34 -10 Q -34 6 -22 6 L 22 6 Q 34 6 34 -10 L 30 -56 Z" fill={body} stroke={INK} strokeWidth={4} />
      <path d="M -34 -44 L 34 -44 L 34 -30 L -34 -30 Z" fill={bodyD} opacity={0.55} />
      {/* highlight */}
      <rect x={-22} y={-50} width={8} height={48} rx={4} fill="#FFFFFF" opacity={0.28} />
      {/* sticker */}
      {green ? (
        <g transform="translate(0 0)">
          <rect x={-16} y={-26} width={32} height={26} rx={5} fill="#F6EFDF" stroke={INK} strokeWidth={2.5} />
          <path d="M -9 -8 L -9 -14 Q -9 -17 -6 -17 L -4 -20 L -2 -17 L 2 -17 L 4 -20 L 6 -17 Q 9 -17 9 -14 L 9 -8 Z" fill="#C96F4A" stroke={INK} strokeWidth={2} />
          <rect x={-7} y={-8} width={14} height={10} rx={2} fill="#8A5A3B" />
        </g>
      ) : (
        <g>
          <circle cx={0} cy={-13} r={17} fill="#F6EFDF" stroke={INK} strokeWidth={2.5} />
          <circle cx={-6} cy={-17} r={2.6} fill={INK} />
          <circle cx={6} cy={-17} r={2.6} fill={INK} />
          <path d="M -5 -8 Q 0 -4 5 -8" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M -14 -21 L -19 -25 M 14 -21 L 19 -25" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
      {steam ? (
        <g opacity={steam}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M ${-8 + i * 8} -92 q ${i % 2 ? 6 : -6} -12 0 -22`} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.7 - i * 0.18} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ---------- classroom blocking (pages 1-2) ----------
// "You" sits front-left by the window; Khải sits beside; Minh Anh sits across the room.
export const CLS_YOU = { x: 640, y: 830, s: 1.0 };
export const CLS_KHANH = { x: 880, y: 812, s: 0.94 };
export const CLS_MINH_NEAR = { x: 1120, y: 790, s: 0.9 };
export const CLS_MINH_FAR = { x: 1330, y: 742, s: 0.78 };

/** Classroom stack: engine set + optional chalk board + foreground silhouettes. */
export const Cls: React.FC<{ t: number; id?: string; board?: React.ReactNode; fg?: boolean }> = ({ t, id = 'th', board, fg = true }) => (
  <>
    <Classroom t={t + 400} id={id} board={board} />
    {fg ? <ClsForeground t={t} /> : null}
  </>
);

/** Blurred seated classmates at the frame edges for depth. */
export const ClsForeground: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={0.9}>
    <g transform={`translate(60 1080) scale(0.9)`}>
      <ellipse cx={0} cy={0} rx={90} ry={14} fill="#0E0A1C" opacity={0.5} />
      <circle cx={0} cy={-120} r={34} fill="#2A2233" />
      <path d="M -46 -96 Q 0 -140 46 -96 L 60 0 L -60 0 Z" fill="#2A2233" />
    </g>
    <g transform={`translate(1880 1090) scale(-0.85 0.85)`}>
      <ellipse cx={0} cy={0} rx={90} ry={14} fill="#0E0A1C" opacity={0.5} />
      <circle cx={0} cy={-120} r={34} fill="#241E2E" />
      <path d="M -46 -96 Q 0 -140 46 -96 L 60 0 L -60 0 Z" fill="#241E2E" />
    </g>
  </g>
);

// ---------- page 3: phone chat UI ----------
export type ChatMsg = { from: 'me' | 'minh'; text: string; at: number; typing?: number };
/** A chat screen drawn in world space: header + message bubbles that pop in at `at` frames. */
export const ChatScreen: React.FC<{ x: number; y: number; w?: number; msgs: ChatMsg[]; t: number; name?: string }> = ({ x, y, w = 460, msgs, t, name = 'Minh Anh' }) => {
  const h = 90 + msgs.length * 86 + 30;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={26} fill="#1B1830" stroke="#3A3358" strokeWidth={4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={58} rx={26} fill="#262146" />
      <rect x={-w / 2} y={-h / 2 + 30} width={w} height={28} fill="#262146" />
      <circle cx={-w / 2 + 34} cy={-h / 2 + 29} r={17} fill="#F7A8C4" stroke="#FFF1B8" strokeWidth={3} />
      <text x={-w / 2 + 62} y={-h / 2 + 37} fontFamily="'Segoe Print',cursive" fontSize={26} fill="#F6EFDF" fontWeight={700}>{name}</text>
      <text x={w / 2 - 30} y={-h / 2 + 37} textAnchor="end" fontFamily="'Segoe Print',cursive" fontSize={20} fill="#8B84A8">online</text>
      {msgs.map((m, i) => {
        const my = -h / 2 + 58 + i * 86 + 34;
        const on = spring(t - m.at, { damping: 14, stiffness: 200 });
        if (t < m.at - 2) return null;
        const mine = m.from === 'me';
        const bw = Math.min(w - 90, Math.max(120, m.text.length * 15 + 36));
        const bx = mine ? w / 2 - 26 - bw : -w / 2 + 26;
        const dots = m.typing && t < m.at + m.typing ? '...' : '';
        return (
          <g key={i} transform={`translate(${bx + bw / 2} ${my}) scale(${Math.max(0.01, on)})`} opacity={clamp(on * 2)}>
            <rect x={-bw / 2} y={-26} width={bw} height={52} rx={18} fill={mine ? '#4E6E9E' : '#342D55'} stroke={mine ? '#6E8EC0' : '#4A4270'} strokeWidth={3} />
            <text x={mine ? bw / 2 - 20 : -bw / 2 + 20} y={6} textAnchor={mine ? 'end' : 'start'} fontFamily="'Segoe Print',cursive" fontSize={23} fill="#F6EFDF" fontWeight={600}>
              {m.text}{dots}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export {
  ShotProps, ShotMap, Pose, poseAt, faceAt, kf, clamp, lerp, easeInOut, easeOut, easeIn, backOut,
  shake, rnd, settle, spring, camT, LOOKS, Hero, Actor, walkPose, Classroom, CLS, Kid, KIDS,
  SchoolDesk, Bedroom, BEDROOM, bedTop, bedSit, BedDuvet, LAMP, WINDOW, Phone, TitleCard, Tag, Toast, FloatLabel,
  LightVeil, DrawOn, Glow, Dust, Foreground, ShotFrame, Sparkle, UI,
};
