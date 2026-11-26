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
  LEG_LEN,
  HEAD,
  joints,
  toWorld,
  reachAngle,
  Hero,
  walkPose,
  Classroom,
  CLS,
  Kid,
  KIDS,
  SchoolDesk,
  Study,
  STUDY,
  Desk,
  Bedroom,
  bedSit,
  BedDuvet,
  LAMP,
  TitleCard,
  Tag,
  Toast,
  FloatLabel,
  HudChip,
  LightVeil,
  DrawOn,
  Glow,
  Dust,
  Foreground,
  ShotFrame,
  DizzyStars,
  NightSky,
  Stars,
  Moon,
  Skyline,
  Haze,
  Bokeh,
  WallFrame,
  FONT,
} from '../../../engine';

// Shared kit for "What If a Red String Connected You To Your Crush?" — a 10-page school romance.
// ALEX = Pip's rig (yellow jacket), MAYA = Linh, SAM = Mo, the other girl = the sister look.
// The power: an invisible red thread tied to Alex's little finger, reaching to Maya's — it sags when
// they're free, snaps taut at ten meters, glows with feeling, cracks when the truth goes unsaid.

export const ALEX = LOOKS.pip;
export const MAYA = LOOKS.linh;
export const SAM = LOOKS.mo;
export const GIRL = LOOKS.sis;

export const INK = '#0D0A14';
export const PAPER = '#F4EEE0';
export const RED = '#E23B3B';
export const RED_DARK = '#8F1F2E';
export const RED_GLOW = '#FF6A5A';

// ---------- the red string: the episode's whole grammar ----------
/** A glowing red thread between two points. `slack` 0=taut .. 1=hanging; `glow` 0..1 brightness;
 *  `pulse` beats like a heartbeat; `gone` fades it out; `crack` shows a fracture near `crackAt` (0..1 along). */
export const RedString: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  slack?: number; glow?: number; pulse?: number; t?: number;
  gone?: number; crack?: number; crackAt?: number; width?: number;
}> = ({ x1, y1, x2, y2, slack = 0.35, glow = 0.6, pulse = 0, t = 0, gone = 0, crack = 0, crackAt = 0.5, width = 4 }) => {
  if (gone >= 1) return null;
  const o = 1 - gone;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const sag = slack * Math.min(160, len * 0.28) * (0.8 + 0.2 * Math.sin(t * 0.1));
  // perpendicular offset for the belly of the curve
  const mx = (x1 + x2) / 2 - (dy / len) * sag;
  const my = (y1 + y2) / 2 + (dx / len) * sag + sag * 0.4;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const beat = pulse > 0 ? 1 + Math.sin(t * 0.9) * 0.5 * pulse : 1;
  const w = width * beat;
  const col = glow > 0.75 ? RED_GLOW : RED;
  const op = clamp(0.35 + glow * 0.65) * o;
  // crack: two short broken ends near crackAt with a gap
  const showCrack = crack > 0.05;
  return (
    <g opacity={op}>
      {/* halo */}
      <path d={d} fill="none" stroke={RED_GLOW} strokeWidth={w * 3.2} strokeLinecap="round" opacity={0.16 * glow * beat} />
      <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" />
      {/* thread texture: a thinner highlight down the middle */}
      <path d={d} fill="none" stroke="#FFD9D2" strokeWidth={w * 0.32} strokeLinecap="round" opacity={0.5 * glow} />
      {showCrack ? (
        <g>
          {/* dark gap + frayed ends at the crack point */}
          <circle cx={lerp(lerp(x1, mx, crackAt), lerp(mx, x2, crackAt), crackAt)} cy={lerp(lerp(y1, my, crackAt), lerp(my, y2, crackAt), crackAt)} r={7 * crack} fill={INK} opacity={0.8} />
          <path d={`M ${lerp(lerp(x1, mx, crackAt), lerp(mx, x2, crackAt), crackAt) - 8} ${lerp(lerp(y1, my, crackAt), lerp(my, y2, crackAt), crackAt) - 6} l 10 -4`} stroke={RED} strokeWidth={2.5} strokeLinecap="round" />
          <path d={`M ${lerp(lerp(x1, mx, crackAt), lerp(mx, x2, crackAt), crackAt) + 8} ${lerp(lerp(y1, my, crackAt), lerp(my, y2, crackAt), crackAt) + 6} l -10 4`} stroke={RED} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      ) : null}
      {/* anchor knots */}
      <circle cx={x1} cy={y1} r={w * 0.9} fill={RED_DARK} />
      <circle cx={x2} cy={y2} r={w * 0.9} fill={RED_DARK} />
    </g>
  );
};

/** World position of a character's right hand (little-finger side). */
export const handR = (pose: Pose): { x: number; y: number } => {
  const j = joints({ ...pose });
  return toWorld({ ...pose }, j.armR.end);
};
export const handL = (pose: Pose): { x: number; y: number } => {
  const j = joints({ ...pose });
  return toWorld({ ...pose }, j.armL.end);
};
/** The little finger sits a touch below the hand centre. */
export const pinky = (p: Pose, side: 'L' | 'R' = 'R') => {
  const h = side === 'R' ? handR(p) : handL(p);
  return { x: h.x + (side === 'R' ? 6 : -6) * p.scale, y: h.y + 10 * p.scale };
};

// ---------- flat silhouette crowd ----------
export type ShadowMood = 'idle' | 'wave' | 'point' | 'thumb' | 'cheer' | 'clap' | 'whisper';
const SHADOW = '#100C1C';

export const ShadowFigure: React.FC<{ x: number; y: number; s?: number; flip?: 1 | -1; mood?: ShadowMood; t?: number; opacity?: number }> = ({ x, y, s = 1, flip = 1, mood = 'idle', t = 0, opacity = 1 }) => {
  const bob = Math.sin(t * 0.12) * 3;
  const arm = (side: 1 | -1, mode: 'hang' | 'up' | 'point' | 'thumb') => {
    const sx = side * 26;
    const sy = -168 + bob;
    const seg = (ex: number, ey: number, mx: number, my: number) => (
      <path d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`} stroke={SHADOW} strokeWidth={13} fill="none" strokeLinecap="round" />
    );
    if (mode === 'up') return seg(side * 44, -228 + bob, side * 40, -200 + bob);
    if (mode === 'point') return seg(side * 74, -212 + bob, side * 52, -196 + bob);
    if (mode === 'thumb')
      return (
        <g>
          {seg(side * 34, -224 + bob, side * 44, -198 + bob)}
          <circle cx={side * 34} cy={-228 + bob} r={8} fill={SHADOW} />
        </g>
      );
    return seg(side * 26, -96 + bob, side * 18, -140 + bob);
  };
  const moodArms: Record<ShadowMood, ['hang' | 'up' | 'point' | 'thumb', 'hang' | 'up' | 'point' | 'thumb']> = {
    idle: ['hang', 'hang'],
    wave: ['hang', 'up'],
    point: ['hang', 'point'],
    thumb: ['hang', 'thumb'],
    cheer: ['up', 'up'],
    clap: ['point', 'point'],
    whisper: ['point', 'point'],
  };
  const [al, ar] = moodArms[mood];
  const waveRot = mood === 'wave' ? Math.sin(t * 0.4) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`} opacity={opacity}>
      <path d={`M -14 -78 Q -18 -40 -16 0 M 14 -78 Q 18 -40 16 0`} stroke={SHADOW} strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d={`M -34 -172 Q 0 -182 34 -172 L 30 -70 Q 0 -60 -30 -70 Z`} fill={SHADOW} />
      <circle cx={0} cy={-198 + bob} r={26} fill={SHADOW} />
      <g transform={`rotate(${waveRot} 26 -160)`}>{arm(-1, al)}</g>
      <g transform={`rotate(${-waveRot} -26 -160)`}>{arm(1, ar)}</g>
      {mood === 'whisper' ? (
        <g stroke={SHADOW} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8}>
          <path d="M 40 -160 q 12 -4 16 6" />
          <path d="M 48 -140 q 12 -4 16 6" />
        </g>
      ) : null}
    </g>
  );
};

// ---------- speech bubbles: quoted lines get a hand-drawn comic bubble ----------
/** Render as a SIBLING after the shot's camT group (screen space, not world space). */
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

// ---------- the school hallway: lockers, notice boards, the far doors ----------
export const HALL = {
  back: { x0: 640, x1: 1280, y0: 300, y1: 720 },
  far: { x: 960, y: 690, s: 0.72 },
  mid: { x: 960, y: 780, s: 0.9 },
  near: { x: 960, y: 860, s: 1.05 },
};

export const Clock_8_12: React.FC<{ x: number; y: number; r?: number; id?: string }> = ({ x, y, r = 46, id = 'clk' }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#F4EEE0" stroke={INK} strokeWidth={5} />
    <circle r={r - 7} fill="none" stroke="#8A93AE" strokeWidth={2} />
    {[...Array(12)].map((_, i) => (
      <circle key={i} cx={Math.sin((i / 12) * Math.PI * 2) * (r - 13)} cy={-Math.cos((i / 12) * Math.PI * 2) * (r - 13)} r={2.4} fill={INK} />
    ))}
    <line x1={0} y1={8} x2={Math.sin((8.2 / 12) * Math.PI * 2) * (r * 0.5)} y2={-Math.cos((8.2 / 12) * Math.PI * 2) * (r * 0.5) + 8} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={8} x2={0} y2={-r + 20} stroke="#B4543F" strokeWidth={4} strokeLinecap="round" />
    <circle r={5} fill={INK} />
  </g>
);

const NoticeBoard: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number }> = ({ x, y, w = 200, h = 130, seed = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="#4A3A28" stroke={INK} strokeWidth={4} />
    <rect x={-w / 2 + 8} y={-h / 2 + 8} width={w - 16} height={h - 16} rx={3} fill="#C9A06A" />
    {[0, 1, 2, 3, 4].map((i) => {
      const nx = -w / 2 + 24 + ((i * 67 + seed * 31) % (w - 60));
      const ny = -h / 2 + 22 + ((i * 41 + seed * 17) % (h - 50));
      const rot = ((i * 37 + seed * 13) % 24) - 12;
      const col = ['#F4EEE0', '#F2B95C', '#8FD3FF', '#E86A92', '#9FD8A8'][i % 5];
      return (
        <g key={i} transform={`translate(${nx} ${ny}) rotate(${rot})`}>
          <rect x={-16} y={-12} width={32} height={24} fill={col} opacity={0.9} />
          <line x1={-10} y1={-4} x2={10} y2={-4} stroke="#3A3550" strokeWidth={2.5} />
          <line x1={-10} y1={3} x2={7} y2={3} stroke="#3A3550" strokeWidth={2.5} />
          <circle cx={0} cy={-13} r={3.5} fill="#B4543F" />
        </g>
      );
    })}
  </g>
);

export const LockerBank: React.FC<{ x: number; y: number; w: number; h: number; n?: number; seed?: number; open?: number }> = ({ x, y, w, h, n = 4, seed = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => {
      const lx = (-w / 2) + (i / n) * w;
      const lw = w / n;
      const isOpen = open > 0 && i === Math.floor(open * n);
      return (
        <g key={i}>
          <rect x={lx} y={-h / 2} width={lw - 4} height={h} fill={i % 2 ? '#3A3462' : '#443D70'} stroke="#221D3C" strokeWidth={4} />
          {[0, 1, 2].map((v) => (
            <rect key={v} x={lx + lw * 0.22} y={-h / 2 + 12 + v * 10} width={lw * 0.56} height={4} rx={2} fill="#221D3C" opacity={0.7} />
          ))}
          <rect x={lx + lw * 0.3} y={-h / 2 + h * 0.62} width={lw * 0.4} height={18} rx={3} fill="#2A2450" />
          <text x={lx + lw / 2} y={-h / 2 + h * 0.62 + 14} textAnchor="middle" fontSize={12} fill="#8B7BB8" fontFamily="monospace">
            {String(101 + seed * 7 + i)}
          </text>
          <rect x={lx + lw - 14} y={-h / 2 + h * 0.42} width={6} height={26} rx={3} fill="#8A93AE" />
          {isOpen ? (
            <g>
              <rect x={lx + 4} y={-h / 2 + 4} width={lw - 12} height={h - 8} fill="#141126" />
              <rect x={lx + lw - 8} y={-h / 2 + 6} width={lw - 10} height={h - 12} fill="#221D3C" transform={`skewY(${(open - Math.floor(open)) * 30})`} />
            </g>
          ) : null}
        </g>
      );
    })}
  </g>
);

/** The school hallway at dusk: perspective to (960,430), lockers, boards, dusk windows right. */
export const Hallway: React.FC<{ t?: number; id?: string; glow?: number; clock?: boolean }> = ({ t = 0, id = 'hw', glow = 1, clock = true }) => {
  const flick = 1 + Math.sin(t * 0.11 + 1.7) * 0.04;
  const shaftO = 0.16 * glow * (0.9 + Math.sin(t * 0.07) * 0.1);
  const floorLines = [840, 960, 1060].map((y) => {
    const xl = 640 - (y - 720) * 1.9;
    const xr = 1280 + (y - 720) * 1.9;
    return <line key={y} x1={xl} y1={y} x2={xr} y2={y} stroke="#0F0C1C" strokeWidth={y > 960 ? 4 : 3} opacity={0.75} />;
  });
  const grout = [-3, -2, -1, 1, 2, 3].map((i) => (
    <line key={i} x1={960 + i * 90} y1={720} x2={960 + i * 340} y2={1080} stroke="#0F0C1C" strokeWidth={2.5} opacity={0.4} />
  ));
  const wins = [
    { p: '1560,380 1780,345 1780,640 1560,690', shaft: '1560,690 1780,640 1900,1080 1100,1080' },
    { p: '1330,470 1500,448 1500,700 1330,728', shaft: '1330,728 1500,700 1650,1080 900,1080' },
    { p: '1170,545 1290,532 1290,725 1170,738', shaft: '1170,738 1290,725 1400,1080 800,1080' },
  ];
  return (
    <g>
      <polygon points="0,0 640,300 1280,300 1920,0" fill="#241F42" />
      <path d="M 700 60 L 960 330 L 1220 60" stroke="#171327" strokeWidth={14} fill="none" />
      <path d="M 780 40 L 960 300 L 1140 40" stroke="#1E1834" strokeWidth={8} fill="none" />
      <rect x={890} y={310} width={140} height={34} rx={5} fill="#1E5C3A" stroke={INK} strokeWidth={3} />
      <text x={960} y={335} textAnchor="middle" fontSize={20} fill="#9FD8A8" fontFamily="monospace" letterSpacing={4}>EXIT</text>
      <rect x={640} y={300} width={640} height={420} fill="#2E2850" />
      <rect x={668} y={430} width={140} height={290} fill="#38315E" stroke="#221D3C" strokeWidth={5} />
      <rect x={1112} y={430} width={140} height={290} fill="#38315E" stroke="#221D3C" strokeWidth={5} />
      <circle cx={790} cy={580} r={6} fill="#8A93AE" />
      <circle cx={1130} cy={580} r={6} fill="#8A93AE" />
      <LockerBank x={800} y={560} w={130} h={220} n={2} seed={1} />
      <LockerBank x={1120} y={560} w={130} h={220} n={2} seed={4} />
      <NoticeBoard x={720} y={380} w={190} h={120} seed={0} />
      <NoticeBoard x={1200} y={380} w={190} h={120} seed={3} />
      {clock ? <Clock_8_12 x={960} y={345} r={34} id={`${id}clk`} /> : null}
      <rect x={640} y={690} width={640} height={30} fill="#221D3C" />
      <polygon points="0,0 640,300 640,720 0,1080" fill="#2B2547" />
      <polygon points="1920,0 1280,300 1280,720 1920,1080" fill="#1F1A36" />
      {(() => {
        const p = '150,420 330,390 330,640 150,680';
        return (
          <g>
            <polygon points={p} fill="#8B7BB8" opacity={0.13} />
            <polygon points={p} fill="none" stroke="#141126" strokeWidth={6} />
            <line x1={240} y1={395} x2={240} y2={665} stroke="#141126" strokeWidth={4} />
            <line x1={152} y1={545} x2={328} y2={520} stroke="#141126" strokeWidth={4} />
          </g>
        );
      })()}
      {wins.map((wn, i) => (
        <g key={i}>
          <polygon points={wn.p} fill="#F2B95C" opacity={(0.55 - i * 0.14) * glow} />
          <polygon points={wn.p} fill="none" stroke="#141126" strokeWidth={6} />
          <line x1={(+wn.p.split(',')[0] + +wn.p.split(',')[4]) / 2} y1={(+wn.p.split(',')[1] + +wn.p.split(',')[5]) / 2} x2={(+wn.p.split(',')[2] + +wn.p.split(',')[6]) / 2} y2={(+wn.p.split(',')[3] + +wn.p.split(',')[7]) / 2} stroke="#141126" strokeWidth={5} />
          <line x1={(+wn.p.split(',')[0] + +wn.p.split(',')[2]) / 2} y1={(+wn.p.split(',')[1] + +wn.p.split(',')[3]) / 2} x2={(+wn.p.split(',')[4] + +wn.p.split(',')[6]) / 2} y2={(+wn.p.split(',')[5] + +wn.p.split(',')[7]) / 2} stroke="#141126" strokeWidth={4} />
        </g>
      ))}
      <polygon points="0,1080 640,720 1280,720 1920,1080" fill="#171327" />
      {wins.map((wn, i) => (
        <polygon key={i} points={wn.shaft} fill="#F2B95C" opacity={shaftO * (1 - i * 0.22)} />
      ))}
      {floorLines}
      {grout}
      <polygon points="1330,780 1500,760 1700,1080 1150,1080" fill="#F2B95C" opacity={0.07 * glow} />
      {[
        { x: 960, y: 322, r: 24 },
        { x: 960, y: 372, r: 16 },
        { x: 960, y: 428, r: 10 },
      ].map((l, i) => (
        <g key={i}>
          <line x1={l.x} y1={0} x2={l.x} y2={l.y - l.r} stroke="#171327" strokeWidth={4} />
          <ellipse cx={l.x} cy={l.y} rx={l.r * 1.5} ry={l.r * 0.45} fill="#FFE9B0" opacity={0.8 * flick} />
          <Glow x={l.x} y={l.y + 40} r={l.r * 4.5} o={0.1 * glow} />
        </g>
      ))}
      <g transform="translate(1560 120)">
        <line x1={0} y1={-60} x2={0} y2={0} stroke="#171327" strokeWidth={5} />
        <rect x={-80} y={0} width={160} height={44} rx={8} fill="#221D3C" stroke="#4A4480" strokeWidth={3} />
        <text x={0} y={31} textAnchor="middle" fontSize={24} fill="#8B7BB8" fontFamily="monospace">204</text>
      </g>
      <Glow x={1560} y={560} r={700} o={0.18 * glow} />
      <Glow x={960} y={330} r={400} o={0.08 * glow} />
      {Array.from({ length: 14 }, (_, i) => {
        const dx = 1250 + ((i * 97 + t * (8 + (i % 4) * 3)) % 420);
        const dy = 760 + ((i * 61 + t * (5 + (i % 3) * 2)) % 300);
        return <circle key={i} cx={dx} cy={dy} r={2 + (i % 3)} fill="#FFE9B0" opacity={0.25 + (i % 4) * 0.08} />;
      })}
    </g>
  );
};

/** Blurry foreground for hallway shots: locker edge + plant at frame left. */
export const HallForeground: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g opacity={0.9}>
    <rect x={-40} y={0} width={150} height={1080} fill="#141126" opacity={0.85} />
    <rect x={80} y={0} width={14} height={1080} fill="#0D0A14" />
    <g transform="translate(210 950)">
      <path d="M -34 0 L 34 0 L 26 90 L -26 90 Z" fill="#2A1E3A" />
      <g transform={`rotate(${Math.sin(t * 0.5) * 3} 0 0)`}>
        <path d="M 0 -60 Q -54 -120 -28 -176 Q -8 -128 0 -108 Q 8 -134 30 -184 Q 56 -124 0 -60 Z" fill="#2E2444" />
      </g>
    </g>
    <ellipse cx={210} cy={1040} rx={90} ry={18} fill="#0D0A14" opacity={0.5} />
  </g>
);

// ---------- the school courtyard: open air, fallen leaves, dusk ----------
/** Outdoor schoolyard: grass, paths, trees, the school building behind, low sun. ~420 units = 10 m. */
export const Courtyard: React.FC<{ t?: number; id?: string; leaves?: number }> = ({ t = 0, id = 'cy', leaves = 0.5 }) => {
  const sway = Math.sin(t * 0.06) * 6;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E2A5E" />
          <stop offset="55%" stopColor="#6E4A80" />
          <stop offset="100%" stopColor="#E08A5E" />
        </linearGradient>
        <linearGradient id={`${id}gnd`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3E4A3A" />
          <stop offset="100%" stopColor="#2A2E26" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={620} fill={`url(#${id}sky)`} />
      {/* the school building behind, warm windows coming on */}
      <rect x={560} y={300} width={800} height={320} fill="#3A3468" />
      <rect x={560} y={300} width={800} height={320} fill="none" stroke="#2A2450" strokeWidth={6} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => {
          const lit = rnd(r * 7 + c, 3) > 0.55;
          return <rect key={`${r}${c}`} x={610 + c * 120} y={340 + r * 70} width={70} height={44} fill={lit ? '#F2B95C' : '#4A4478'} opacity={lit ? 0.85 : 0.7} />;
        }),
      )}
      <rect x={880} y={480} width={160} height={140} fill="#2A2450" />
      {/* trees either side */}
      {[300, 1620].map((tx, i) => (
        <g key={i} transform={`translate(${tx} 560)`}>
          <rect x={-14} y={0} width={28} height={140} fill="#3A2C22" />
          <g transform={`rotate(${sway * (i ? -1 : 1)} 0 0)`}>
            <circle cx={0} cy={-60} r={120} fill="#4A3A52" />
            <circle cx={-60} cy={-20} r={80} fill="#54425C" />
            <circle cx={60} cy={-30} r={70} fill="#3E3048" />
          </g>
        </g>
      ))}
      {/* ground: grass + a dirt path */}
      <rect x={0} y={620} width={1920} height={460} fill={`url(#${id}gnd)`} />
      <polygon points="700,1080 880,620 1040,620 1180,1080" fill="#4A4038" />
      <polygon points="700,1080 880,620 1040,620 1180,1080" fill="none" stroke="#3A322C" strokeWidth={4} />
      {/* low sun glow + haze */}
      <Glow x={960} y={640} r={700} o={0.2} />
      <Haze y={560} h={200} o={0.3} />
      {/* fallen leaves: drifting particles + a pile */}
      {Array.from({ length: 22 }, (_, i) => {
        const lx = (i * 173 + t * (12 + (i % 4) * 5)) % 2100 - 90;
        const ly = 640 + ((i * 97 + t * (9 + (i % 3) * 4)) % 420);
        const rot = (i * 47 + t * 30) % 360;
        const c = ['#C96A3A', '#D98A4A', '#A85A30', '#E0A05A'][(i + Math.floor(t / 40)) % 4];
        return <ellipse key={i} cx={lx} cy={ly} rx={7} ry={4} fill={c} opacity={0.5 + leaves * 0.4} transform={`rotate(${rot} ${lx} ${ly})`} />;
      })}
      {/* leaf piles at two spots */}
      {[{ x: 700, y: 900, s: 1 }, { x: 1250, y: 940, s: 0.8 }].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} opacity={0.35 + leaves * 0.65}>
          {Array.from({ length: 16 }, (_, k) => (
            <ellipse key={k} cx={(rnd(k, i) - 0.5) * 150} cy={(rnd(k + 9, i) - 0.5) * 40} rx={9 + rnd(k, i + 4) * 8} ry={4 + rnd(k + 3, i) * 3} fill={['#C96A3A', '#D98A4A', '#A85A30', '#8A4A28'][k % 4]} transform={`rotate(${rnd(k + 5, i) * 360})`} />
          ))}
        </g>
      ))}
      {/* string-distance markers for the ten-meter test: painted arcs on the path */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M ${920 - i * 30} ${1020 - i * 60} q 20 -8 40 0`} stroke="#E9C46A" strokeWidth={4} fill="none" opacity={0.35} strokeDasharray="10 8" />
      ))}
      <Bokeh seed={31} n={8} x0={200} y0={200} w={1500} h={500} t={t} o={0.16} />
    </g>
  );
};

// ---------- the cafeteria ----------
/** Lunchroom: long tables, hanging lamps, serving counter, dusk windows. Characters sit/stand at tables. */
export const Cafeteria: React.FC<{ t?: number; id?: string }> = ({ t = 0, id = 'cf' }) => {
  const flick = 1 + Math.sin(t * 0.13 + 2) * 0.05;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#241F3E" />
      {/* back wall + windows */}
      <rect x={0} y={0} width={1920} height={560} fill="#322C50" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={200 + i * 540} y={120} width={300} height={220} fill="#E08A5E" opacity={0.35 - i * 0.06} />
          <rect x={200 + i * 540} y={120} width={300} height={220} fill="none" stroke="#141126" strokeWidth={8} />
          <line x1={350 + i * 540} y1={120} x2={350 + i * 540} y2={340} stroke="#141126" strokeWidth={6} />
        </g>
      ))}
      {/* serving counter far left */}
      <rect x={0} y={360} width={420} height={300} fill="#3A3050" />
      <rect x={20} y={390} width={380} height={120} fill="#4A3E66" />
      {[0, 1, 2].map((i) => <rect key={i} x={60 + i * 120} y={410} width={80} height={60} rx={8} fill={['#C96A3A', '#7A9A5A', '#D9A05A'][i]} opacity={0.8} />)}
      <rect x={0} y={640} width={420} height={60} fill="#2A2240" />
      {/* hanging lamps */}
      {[480, 960, 1440].map((lx, i) => (
        <g key={i}>
          <line x1={lx} y1={0} x2={lx} y2={180} stroke="#171327" strokeWidth={5} />
          <path d={`M ${lx - 46} 180 L ${lx + 46} 180 L ${lx + 26} 230 L ${lx - 26} 230 Z`} fill="#3E5A7A" />
          <ellipse cx={lx} cy={232} rx={30} ry={10} fill="#FFE9B0" opacity={0.9 * flick} />
          <Glow x={lx} y={300} r={260} o={0.22 * flick} />
        </g>
      ))}
      {/* tables: two rows of long tables */}
      {[0, 1].map((row) => {
        const ty = 560 + row * 200;
        return (
          <g key={row}>
            <rect x={300} y={ty} width={1320} height={26} rx={8} fill="#6A4E3A" />
            <rect x={300} y={ty} width={1320} height={8} rx={4} fill="#8A6452" opacity={0.8} />
            <rect x={360} y={ty + 26} width={22} height={120} fill="#4A3430" />
            <rect x={1538} y={ty + 26} width={22} height={120} fill="#4A3430" />
            {/* trays + food on the table */}
            {[0, 1, 2, 3].map((c) => (
              <g key={c} transform={`translate(${560 + c * 320 + row * 60} ${ty - 14})`}>
                <rect x={-70} y={-8} width={140} height={14} rx={6} fill="#8A93AE" opacity={0.8} />
                <circle cx={-30} cy={-16} r={14} fill={['#C96A3A', '#7A9A5A', '#D9A05A', '#B05A7A'][(c + row) % 4]} />
                <rect x={8} y={-20} width={50} height={12} rx={4} fill="#F4EEE0" opacity={0.85} />
              </g>
            ))}
          </g>
        );
      })}
      {/* floor */}
      <rect x={0} y={960} width={1920} height={120} fill="#1E1A30" />
      <polygon points="300,586 1620,586 1920,1080 0,1080" fill="#F2B95C" opacity={0.04} />
      <LightVeil id={`${id}veil`} lights={[[480, 300, 320], [960, 300, 320], [1440, 300, 320]]} o={0.3} />
      <Dust t={t} seed={41} x0={300} y0={150} w={1300} h={500} n={30} o={0.35} />
    </g>
  );
};

/** A kid seated behind a cafeteria table (back to camera) or standing. */
export const CafKid: React.FC<{ x: number; y: number; s?: number; look?: number; t?: number; flip?: 1 | -1 }> = ({ x, y, s = 1, look = 0, t = 0, flip = 1 }) => {
  const bob = Math.sin(t * 0.12 + x * 0.01) * 3;
  const hairC = ['#3A2420', '#2A1C18', '#1E1418', '#5A3A28', '#C9925A'][look % 5];
  const top = ['#6A8A9A', '#9A6A5A', '#7A7A4A', '#6A5A8A', '#4A6A5A'][look % 5];
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * flip} ${s})`}>
      <path d="M -60 0 Q -62 -110 0 -114 Q 62 -110 60 0 Z" fill={top} />
      <g transform="translate(0 -168)">
        <circle r={46} fill={hairC} />
        <path d={`M -46 -8 Q -50 -52 0 -54 Q 50 -52 46 -8 Q 30 -22 0 -20 Q -30 -22 -46 -8 Z`} fill={hairC} />
        <circle cx={-16} cy={-2} r={4} fill={INK} opacity={0.7} />
        <circle cx={16} cy={-2} r={4} fill={INK} opacity={0.7} />
      </g>
      {/* arm resting on the table */}
      <path d="M 30 -100 Q 60 -80 70 -40" stroke={top} strokeWidth={16} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ---------- the library ----------
/** Library aisle: tall bookshelf rows receding, warm lamps, a reading table. */
export const Library: React.FC<{ t?: number; id?: string }> = ({ t = 0, id = 'lb' }) => {
  const sway = Math.sin(t * 0.07) * 4;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#1E1A30" />
      {/* back wall + warm glow */}
      <rect x={300} y={80} width={1320} height={640} fill="#2E2850" />
      <Glow x={960} y={400} r={600} o={0.14} />
      {/* bookshelf rows: two banks flanking a central aisle */}
      {[-1, 1].map((side) => {
        const bx = side < 0 ? 80 : 1180;
        return (
          <g key={side}>
            <rect x={bx} y={120} width={620} height={560} fill="#3A2E28" />
            <rect x={bx + 16} y={140} width={588} height={520} fill="#2E241E" />
            {/* shelf boards + book spines */}
            {[0, 1, 2, 3].map((s) => {
              const sy = 190 + s * 125;
              return (
                <g key={s}>
                  <rect x={bx + 16} y={sy + 96} width={588} height={12} fill="#4A3A2C" />
                  {Array.from({ length: 14 }, (_, i) => {
                    const bw = 22 + rnd(i + s * 20, side + 5) * 26;
                    const bh = 62 + rnd(i, s + 11) * 30;
                    const gap = rnd(i + 40, s) > 0.85 ? 26 : 0;
                    const col = ['#7A4A4A', '#4A5A7A', '#8A7A4A', '#4A6A5A', '#6A4A6A', '#9A6A4A', '#3E4A62'][((i * 7 + s * 3) % 7 + 7) % 7];
                    return <rect key={i} x={bx + 30 + i * 42 + gap} y={sy + 96 - bh} width={bw} height={bh} fill={col} opacity={0.85} transform={`skewY(${(rnd(i, s + 3) - 0.5) * 3})`} />;
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* the central aisle floor + perspective lines */}
      <polygon points="820,1080 1100,1080 1040,660 880,660" fill="#3A3248" />
      <polygon points="820,1080 880,660 760,660 620,1080" fill="#332C42" />
      <polygon points="1100,1080 1040,660 1160,660 1300,1080" fill="#332C42" />
      {/* hanging reading lamps */}
      {[700, 960, 1220].map((lx, i) => (
        <g key={i}>
          <line x1={lx} y1={0} x2={lx} y2={140 + i * 10} stroke="#171327" strokeWidth={4} />
          <path d={`M ${lx - 30} ${140 + i * 10} L ${lx + 30} ${140 + i * 10} L ${lx + 18} ${172 + i * 10} L ${lx - 18} ${172 + i * 10} Z`} fill="#4A5A3A" />
          <ellipse cx={lx} cy={174 + i * 10} rx={20} ry={7} fill="#FFE9B0" opacity={0.85} />
          <Glow x={lx} y={220 + i * 10} r={180} o={0.16} />
        </g>
      ))}
      {/* reading table far end */}
      <rect x={860} y={640} width={200} height={18} rx={6} fill="#5A4632" />
      <rect x={880} y={658} width={16} height={60} fill="#3A2C22" />
      <rect x={1024} y={658} width={16} height={60} fill="#3A2C22" />
      <OpenBookMini x={930} y={634} s={0.7} />
      <OpenBookMini x={990} y={636} s={0.55} flip />
      {/* swaying plant silhouette foreground */}
      <g transform={`translate(${60 + sway} 1000)`} opacity={0.85}>
        <path d="M -30 0 L 30 0 L 22 90 L -22 90 Z" fill="#141126" />
        <path d="M 0 0 Q -50 -60 -26 -110 Q -8 -64 0 -46 Q 8 -72 28 -118 Q 52 -58 0 0 Z" fill="#181430" />
      </g>
    </g>
  );
};

const OpenBookMini: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -40 0 Q -20 -14 0 -4 Q 20 -14 40 0 L 40 12 Q 20 -2 0 8 Q -20 -2 -40 12 Z" fill="#8A5A4A" stroke={INK} strokeWidth={3} />
    <path d="M -34 4 Q -18 -4 0 4 Q 18 -4 34 4" stroke="#F4EEE0" strokeWidth={2} fill="none" opacity={0.7} />
  </g>
);

// ---------- the school gate / street ----------
/** School entrance at dusk: pillars, sign, fence, street, the string can stretch "beyond the gate". */
export const Gate: React.FC<{ t?: number; id?: string }> = ({ t = 0, id = 'gt' }) => {
  const sway = Math.sin(t * 0.08) * 5;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2C2A56" />
          <stop offset="60%" stopColor="#7A4A78" />
          <stop offset="100%" stopColor="#E08A5E" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={620} fill={`url(#${id}sky)`} />
      <Stars seed={8} x0={0} y0={0} w={1920} h={380} t={t} n={40} o={0.7} />
      <Moon x={1620} y={150} r={54} bloom={0.8} />
      {/* school facade behind the gate */}
      <rect x={560} y={220} width={800} height={400} fill="#3A3260" />
      <rect x={560} y={220} width={800} height={400} fill="none" stroke="#2A2450" strokeWidth={6} />
      {[0, 1].map((r) =>
        [0, 1, 2, 3, 4].map((c) => {
          const lit = rnd(r * 9 + c, 5) > 0.5;
          return <rect key={`${r}${c}`} x={640 + c * 140} y={300 + r * 120} width={80} height={70} fill={lit ? '#F2B95C' : '#4A4478'} opacity={lit ? 0.8 : 0.7} />;
        }),
      )}
      {/* pillars + arch sign */}
      <rect x={700} y={430} width={60} height={200} fill="#4A3F6E" />
      <rect x={1160} y={430} width={60} height={200} fill="#4A3F6E" />
      <rect x={680} y={390} width={560} height={50} rx={10} fill="#3A3260" stroke="#E9C46A" strokeWidth={4} />
      <text x={960} y={428} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fill="#E9C46A" fontStyle="italic">GREENFIELD SCHOOL</text>
      {/* iron fence between pillars and to the edges */}
      {[0, 1].map((side) => {
        const x0 = side ? 1220 : 60;
        const x1 = side ? 1860 : 700;
        return (
          <g key={side}>
            <rect x={x0} y={560} width={x1 - x0} height={14} fill="#241F3E" />
            {Array.from({ length: Math.floor((x1 - x0) / 60) }, (_, i) => (
              <rect key={i} x={x0 + 14 + i * 60} y={470} width={10} height={104} fill="#2E2850" />
            ))}
            <rect x={x0} y={500} width={x1 - x0} height={10} fill="#2E2850" />
            <rect x={x0} y={545} width={x1 - x0} height={10} fill="#2E2850" />
          </g>
        );
      })}
      {/* street */}
      <rect x={0} y={620} width={1920} height={460} fill="#3A3452" />
      <polygon points="900,620 1020,620 1300,1080 620,1080" fill="#4A4468" opacity={0.6} />
      {/* lamp posts */}
      {[420, 1500].map((lx, i) => (
        <g key={i}>
          <rect x={lx - 6} y={480} width={12} height={160} fill="#241F3E" />
          <circle cx={lx} cy={470} r={16} fill="#FFE9B0" opacity={0.9} />
          <Glow x={lx} y={500} r={200} o={0.25} />
        </g>
      ))}
      {/* trees swaying at the edges */}
      {[220, 1700].map((tx, i) => (
        <g key={i} transform={`translate(${tx} 700)`}>
          <rect x={-10} y={-60} width={20} height={140} fill="#3A2C22" />
          <g transform={`rotate(${sway * (i ? -1 : 1)} 0 -60)`}>
            <circle cx={0} cy={-110} r={90} fill="#3E3048" />
            <circle cx={-46} cy={-80} r={56} fill="#4A3A52" />
          </g>
        </g>
      ))}
      <Haze y={560} h={180} o={0.3} />
      <Bokeh seed={52} n={8} x0={200} y0={200} w={1500} h={400} t={t} o={0.15} />
    </g>
  );
};

// ---------- the little shop on the way to school (notebooks, drinks) ----------
/** Corner shop / kiosk: awning, window display of notebooks and drinks, the "errand" backdrop. */
export const Kiosk: React.FC<{ t?: number; id?: string; sign?: string }> = ({ t = 0, id = 'ks', sign = 'MINI MART' }) => {
  const flick = 0.85 + Math.sin(t * 0.2) * 0.15;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#2A2444" />
      {/* building face */}
      <rect x={360} y={140} width={1200} height={700} fill="#3E3656" />
      <rect x={360} y={140} width={1200} height={700} fill="none" stroke="#2A2450" strokeWidth={6} />
      {/* awning */}
      <g>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <polygon key={i} points={`${420 + i * 140},300 ${540 + i * 140},300 ${580 + i * 140},380 ${460 + i * 140},380`} fill={i % 2 ? '#8A4A5A' : '#F4EEE0'} opacity={0.9} />
        ))}
        <polygon points="420,380 1460,380 1520,430 360,430" fill="#241F3E" />
      </g>
      {/* sign */}
      <rect x={700} y={180} width={520} height={80} rx={12} fill="#221D3C" stroke="#E9C46A" strokeWidth={4} />
      <text x={960} y={235} textAnchor="middle" fontFamily="Georgia, serif" fontSize={44} fill="#E9C46A" fontStyle="italic">{sign}</text>
      {/* window display: notebooks + drinks */}
      <rect x={460} y={470} width={560} height={330} fill="#F2B95C" opacity={0.3 * flick} />
      <rect x={460} y={470} width={560} height={330} fill="none" stroke="#141126" strokeWidth={8} />
      <line x1={740} y1={470} x2={740} y2={800} stroke="#141126" strokeWidth={6} />
      {/* notebooks on display */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${560 + i * 60} ${720 - i * 8}) rotate(${-6 + i * 6})`}>
          <rect x={-40} y={-26} width={80} height={52} rx={5} fill={['#3E5A8C', '#8A4A4A', '#4A6A5A'][i]} stroke={INK} strokeWidth={3} />
          <rect x={-40} y={-26} width={14} height={52} rx={4} fill="#000" opacity={0.2} />
        </g>
      ))}
      {/* drink cups */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${860 + i * 46} ${740})`}>
          <path d="M -14 -34 L 14 -34 L 11 0 L -11 0 Z" fill={['#E86A92', '#3E8C86', '#E9C46A'][i]} stroke={INK} strokeWidth={3} />
          <rect x={8} y={-26} width={20} height={6} rx={3} fill={INK} opacity={0.4} transform="rotate(24)" />
        </g>
      ))}
      {/* door right */}
      <rect x={1180} y={470} width={180} height={370} fill="#2E2850" stroke="#141126" strokeWidth={8} />
      <rect x={1196} y={490} width={70} height={60} fill="#F2B95C" opacity={0.5} />
      <circle cx={1340} cy={660} r={8} fill="#E9C46A" />
      {/* sidewalk + dusk street */}
      <rect x={0} y={840} width={1920} height={240} fill="#3A3450" />
      <polygon points="360,840 1560,840 1920,1080 0,1080" fill="#4A4468" opacity={0.5} />
      <Glow x={960} y={560} r={700} o={0.16 * flick} />
    </g>
  );
};

// ---------- Alex's room at dawn: morning light version of the bedroom ----------
/** Simple morning bedroom: dawn window, bed with pillow, wardrobe, door, rug. Flat dusk style. */
export const DawnRoom: React.FC<{ t?: number; id?: string; dawn?: number }> = ({ t = 0, id = 'dr', dawn = 1 }) => {
  const sway = Math.sin(t * 0.05) * 4;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3A6E" />
          <stop offset="55%" stopColor="#B06A7A" />
          <stop offset="100%" stopColor="#F2B95C" />
        </linearGradient>
      </defs>
      {/* walls + floor */}
      <rect x={0} y={0} width={1920} height={720} fill="#4A3E58" />
      <rect x={0} y={720} width={1920} height={360} fill="#3A2E3C" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={0} y1={780 + i * 70} x2={1920} y2={780 + i * 70} stroke="#2E2434" strokeWidth={3} opacity={0.7} />
      ))}
      {/* big dawn window, left-of-center */}
      <g>
        <rect x={300} y={140} width={420} height={440} fill="#2A2438" />
        <rect x={322} y={162} width={376} height={396} fill={`url(#${id}sky)`} />
        {/* sun climbing */}
        <circle cx={480} cy={430 - dawn * 60} r={54} fill="#FFE9B0" opacity={0.9} />
        <circle cx={480} cy={430 - dawn * 60} r={90} fill="#FFE9B0" opacity={0.25} />
        {/* muntins */}
        <line x1={510} y1={162} x2={510} y2={558} stroke="#2A2438" strokeWidth={12} />
        <line x1={322} y1={360} x2={698} y2={360} stroke="#2A2438" strokeWidth={12} />
        {/* light shaft onto the floor */}
        <polygon points="322,558 698,558 980,1080 240,1080" fill="#F2B95C" opacity={0.12} />
        {/* curtains */}
        <path d={`M 300 140 q 30 ${120 + sway} 10 ${220} l -20 0 q 26 -110 -8 -220 Z`} fill="#6A4A6A" />
        <path d={`M 720 140 q -30 ${120 - sway} -10 ${220} l 20 0 q -26 -110 8 -220 Z`} fill="#6A4A6A" />
      </g>
      {/* bed, right side */}
      <g>
        <rect x={1050} y={640} width={640} height={220} rx={14} fill="#5A4A5E" stroke={INK} strokeWidth={5} />
        <rect x={1070} y={560} width={600} height={120} rx={20} fill="#E8E2D2" stroke={INK} strokeWidth={5} />
        {/* pillows */}
        <ellipse cx={1200} cy={600} rx={110} ry={42} fill="#F4EEE0" stroke={INK} strokeWidth={4} />
        <ellipse cx={1420} cy={604} rx={100} ry={38} fill="#EDE6D6" stroke={INK} strokeWidth={4} />
        {/* blanket */}
        <path d="M 1070 700 Q 1300 640 1670 690 L 1670 850 L 1070 850 Z" fill="#3E5A8C" stroke={INK} strokeWidth={5} />
        <path d="M 1070 730 Q 1300 680 1670 720" stroke="#2E4470" strokeWidth={6} fill="none" />
      </g>
      {/* wardrobe, far right */}
      <g>
        <rect x={1720} y={300} width={170} height={540} fill="#4E3A48" stroke={INK} strokeWidth={5} />
        <line x1={1805} y1={300} x2={1805} y2={840} stroke={INK} strokeWidth={4} />
        <circle cx={1790} cy={570} r={7} fill="#C9A46A" />
        <circle cx={1820} cy={570} r={7} fill="#C9A46A" />
      </g>
      {/* door, far left */}
      <g>
        <rect x={60} y={260} width={150} height={580} fill="#3E3048" stroke={INK} strokeWidth={5} />
        <circle cx={190} cy={560} r={9} fill="#C9A46A" />
        {/* light under the door */}
        <rect x={70} y={820} width={130} height={12} fill="#FFC27A" opacity={0.8} />
      </g>
      {/* posters */}
      <WallFrame x={900} y={260} w={120} h={150} art={0} />
      <WallFrame x={1080} y={300} w={100} h={120} art={2} />
      {/* rug */}
      <ellipse cx={800} cy={940} rx={280} ry={60} fill="#6A4A5E" opacity={0.8} />
      <ellipse cx={800} cy={940} rx={200} ry={42} fill="none" stroke="#8A6A80" strokeWidth={5} />
      <Glow x={510} y={400} r={500} o={0.14 * dawn} />
      <Dust t={t} seed={23} x0={322} y0={162} w={376} h={396} n={20} o={0.4} />
    </g>
  );
};

// ---------- story props ----------
export const Scissors: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* blades */}
    <path d={`M 0 0 L ${-14 - open * 8} ${-58} L ${-4 - open * 4} ${-62} L ${10} ${-6} Z`} fill="#B9C4D8" stroke={INK} strokeWidth={3} />
    <path d={`M 0 0 L ${14 + open * 8} ${-58} L ${4 + open * 4} ${-62} L ${-10} ${-6} Z`} fill="#DDE4F0" stroke={INK} strokeWidth={3} />
    {/* handles */}
    <circle cx={-16 - open * 10} cy={14} r={13} fill="none" stroke="#B4543F" strokeWidth={7} />
    <circle cx={16 + open * 10} cy={14} r={13} fill="none" stroke="#B4543F" strokeWidth={7} />
    <circle cx={0} cy={2} r={6} fill={INK} />
  </g>
);

export const Lunchbox: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-52} y={-30} width={104} height={60} rx={10} fill="#D9534F" stroke={INK} strokeWidth={4} />
    <rect x={-52} y={-30} width={104} height={18} rx={8} fill="#B83E3B" />
    <rect x={-16} y={-38} width={32} height={12} rx={6} fill="#8A93AE" />
    {open > 0 ? (
      <g opacity={open} transform={`translate(0 ${-30 - open * 26}) rotate(${-8 * open})`}>
        <rect x={-52} y={-30} width={104} height={60} rx={10} fill="#F4EEE0" stroke={INK} strokeWidth={4} />
        {/* sandwich halves */}
        <path d="M -40 -14 L -8 -22 L -8 8 L -40 0 Z" fill="#E8C89A" stroke={INK} strokeWidth={2.5} />
        <path d="M 8 -22 L 40 -14 L 40 0 L 8 8 Z" fill="#E8C89A" stroke={INK} strokeWidth={2.5} />
        <path d="M -34 -8 L -14 -12 M -34 4 L -14 0" stroke="#7A9A5A" strokeWidth={4} />
        <path d="M 14 -12 L 34 -8 M 14 0 L 34 4" stroke="#7A9A5A" strokeWidth={4} />
      </g>
    ) : null}
  </g>
);

export const Sandwich: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -44 -16 L 0 -34 L 44 -16 L 0 4 Z" fill="#E8C89A" stroke={INK} strokeWidth={3.5} />
    <path d="M -38 -12 L 0 -27 L 38 -12" stroke="#7A9A5A" strokeWidth={5} fill="none" />
    <path d="M -30 -8 L 0 -19 L 30 -8" stroke="#C96A3A" strokeWidth={4} fill="none" />
  </g>
);

export const NotebookProp: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = '#3E5A8C' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-28} width={80} height={56} rx={6} fill={color} stroke={INK} strokeWidth={4} />
    <rect x={-40} y={-28} width={14} height={56} rx={4} fill="#000" opacity={0.25} />
    <path d="M -14 -10 L 26 -10 M -14 0 L 26 0 M -14 10 L 18 10" stroke="#C9D4EE" strokeWidth={3.5} opacity={0.85} />
  </g>
);

export const DrinkCup: React.FC<{ x: number; y: number; s?: number; color?: string; steam?: number }> = ({ x, y, s = 1, color = '#E86A92', steam = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -16 -40 L 16 -40 L 12 0 L -12 0 Z" fill={color} stroke={INK} strokeWidth={3.5} />
    <rect x={10} y={-32} width={22} height={7} rx={3.5} fill="none" stroke={INK} strokeWidth={3.5} transform="rotate(24 10 -32)" />
    <ellipse cx={0} cy={-40} rx={16} ry={5} fill="#FFF" opacity={0.35} />
    {steam > 0 ? [0, 1].map((i) => {
      const k = (steam * 0.4 + i * 0.5) % 1;
      return <path key={i} d={`M ${-4 + i * 8} ${-50 - k * 24} q 6 -10 0 -18 q -6 -8 0 -16`} stroke="#FFF" strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={(1 - k) * 0.5} />;
    }) : null}
  </g>
);

/** Laptop seen from behind-ish with a glowing screen showing a search. */
export const LaptopScreen: React.FC<{ x: number; y: number; s?: number; rot?: number; query?: string; results?: string[]; t?: number; cursor?: number }> = ({ x, y, s = 1, rot = 0, query = '', results = [], t = 0, cursor = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* base */}
    <path d="M -110 60 L 110 60 L 96 78 L -96 78 Z" fill="#3A3446" stroke={INK} strokeWidth={4} />
    <rect x={-104} y={-70} width={208} height={134} rx={10} fill="#1E1A2C" stroke={INK} strokeWidth={4} />
    {/* screen glow */}
    <rect x={-96} y={-62} width={192} height={118} rx={6} fill="#10182A" />
    {/* search bar */}
    <rect x={-88} y={-56} width={176} height={26} rx={13} fill="#232C48" stroke="#3E5A8C" strokeWidth={2} />
    <text x={-78} y={-37} fontSize={15} fill="#9FC0D6" fontFamily="monospace">{query}</text>
    {Math.sin(t * 0.3) > 0 ? <rect x={-80 + query.length * 9} y={-50} width={9} height={16} fill="#9FC0D6" opacity={0.8} /> : null}
    {/* result cards */}
    {results.map((r, i) => {
      const ry = -22 + i * 26;
      const hi = cursor === i;
      return (
        <g key={i} opacity={clamp((t - i * 6) / 10)}>
          {hi ? <rect x={-88} y={ry - 9} width={176} height={22} rx={4} fill="#2E4A7A" opacity={0.7} /> : null}
          <circle cx={-72} cy={ry + 2} r={6} fill={['#E86A5A', '#E9C46A', '#8FD3FF'][i % 3]} />
          <text x={-58} y={ry + 7} fontSize={13} fill={hi ? '#FFF' : '#B9C4D8'} fontFamily="monospace">{r}</text>
        </g>
      );
    })}
    <Glow x={0} y={-10} r={180} o={0.2} />
  </g>
);

/** Maya's text message popping up on a phone screen. */
export const PhoneMsg: React.FC<{ x: number; y: number; s?: number; text: string; t?: number; from?: 'maya' | 'alex' }> = ({ x, y, s = 1, text, t = 0, from = 'maya' }) => {
  const pin = spring(t, { damping: 12, stiffness: 160 });
  const lines = text.length > 34 ? [text.slice(0, 34), text.slice(34)] : [text];
  const w = Math.max(...lines.map((l) => l.length)) * 15 + 44;
  const h = lines.length * 30 + 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * Math.max(0.01, pin)})`} opacity={clamp(pin * 2)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={from === 'maya' ? '#3E5A8C' : '#2E3A5C'} stroke={INK} strokeWidth={3.5} />
      {lines.map((l, i) => (
        <text key={i} x={0} y={-h / 2 + 26 + i * 30} textAnchor="middle" fontSize={21} fill="#F4EEE0" fontFamily="'Segoe Print','Comic Sans MS',cursive">
          {l}
        </text>
      ))}
      <circle cx={from === 'maya' ? -w / 2 + 22 : w / 2 - 22} cy={-h / 2 - 12} r={11} fill={from === 'maya' ? '#E86A92' : '#3E8C86'} stroke={INK} strokeWidth={3} />
      <text x={from === 'maya' ? -w / 2 + 22 : w / 2 - 22} y={-h / 2 - 5} textAnchor="middle" fontSize={14} fill="#FFF" fontWeight={700}>M</text>
    </g>
  );
};

// ---------- set wrappers ----------
/** Classroom + foreground classmates + a generic board (chalk "Monday" vibe). */
export const Cls: React.FC<{ t: number; id?: string; board?: React.ReactNode; laugh?: number }> = ({ t, id = 'rs', board, laugh }) => (
  <>
    <Classroom t={t + 600} id={id} board={board ?? <BoardChalk t={t} />} laugh={laugh} />
    <ClsForeground t={t} />
  </>
);

export const BoardChalk: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g fontFamily="'Segoe Print','Comic Sans MS',cursive" fill="#EDEFE6">
    <g opacity={0.16} fontSize={30}>
      <text x={470} y={240}>7 x 8 = 56</text>
      <text x={830} y={500}>1/2 + 1/4 = ?</text>
    </g>
    <text x={470} y={300} fontSize={46} opacity={0.95}>MONDAY CLASS</text>
    <path d="M 470 320 L 780 320" stroke="#EDEFE6" strokeWidth={3} opacity={0.55} />
    <text x={470} y={410} fontSize={58} opacity={0.95}>group project!</text>
    <text x={470} y={480} fontSize={40} opacity={0.8}>pick a partner</text>
    {[0, 1, 2].map((i) => {
      const k = (t * 0.4 + i * 0.33) % 1;
      return <circle key={i} cx={560 + i * 160} cy={330 - k * 40} r={4 + k * 8} fill="#EDEFE6" opacity={(1 - k) * 0.3} />;
    })}
  </g>
);

export const ClsForeground: React.FC<{ t?: number }> = ({ t = 0 }) => {
  const sway = Math.sin(t * 0.12) * 3;
  return (
    <g opacity={0.92}>
      <g transform={`translate(560 940)`}>
        <rect x={-60} y={60} width={380} height={160} fill="#141126" opacity={0.75} />
        <path d="M -40 60 L 300 60 L 320 200 L -60 200 Z" fill="#1B1730" />
        <g transform={`translate(120 ${10 + sway * 0.4})`}>
          <path d="M -78 40 Q -80 -30 0 -34 Q 80 -30 78 40 Z" fill="#241E3C" />
          <circle cx={0} cy={-72} r={46} fill="#1E1834" />
          <path d="M -48 -84 Q 0 -122 48 -84 L 40 -108 Q 0 -132 -40 -108 Z" fill="#2E2444" />
        </g>
      </g>
      <g transform={`translate(1330 950)`}>
        <rect x={-60} y={60} width={360} height={160} fill="#141126" opacity={0.7} />
        <path d="M -40 60 L 280 60 L 300 200 L -60 200 Z" fill="#1B1730" />
        <g transform={`translate(110 ${12 - sway * 0.3})`}>
          <path d="M -72 38 Q -74 -26 0 -30 Q 74 -26 72 38 Z" fill="#221C38" />
          <circle cx={0} cy={-64} r={42} fill="#1C1730" />
          <path d="M -44 -76 Q 0 -110 44 -76 L 37 -98 Q 0 -120 -37 -98 Z" fill="#2A2140" />
          <path d={`M 60 -6 L 96 ${-18 + Math.sin(t * 0.3) * 4}`} stroke="#241E3C" strokeWidth={16} strokeLinecap="round" fill="none" />
        </g>
      </g>
      <g transform="translate(1180 985) scale(0.8)" opacity={0.6}>
        <path d="M -60 30 Q -62 -22 0 -26 Q 62 -22 60 30 Z" fill="#201A34" />
        <circle cx={0} cy={-56} r={38} fill="#1A152C" />
      </g>
    </g>
  );
};

export const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, ...extra,
});

export const DebugShot: React.FC<{ id: string; text?: string }> = ({ id, text = '' }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <text x={960} y={520} textAnchor="middle" fontFamily="monospace" fontSize={34} fill="#8B7BB8">{id}</text>
    <text x={960} y={575} textAnchor="middle" fontFamily="monospace" fontSize={22} fill="#5A5478">{text.slice(0, 90)}</text>
  </g>
);

// Re-export everything scene files need through one import.
export {
  ShotProps, ShotMap, Pose, basePose, poseAt, faceAt, kf, clamp, lerp,
  easeInOut, easeOut, easeIn, backOut, shake, rnd, settle, spring, camT,
  LOOKS, LEG_LEN, HEAD, joints, toWorld, reachAngle, Hero, walkPose,
  Classroom, CLS, Kid, KIDS, SchoolDesk, Study, STUDY, Desk,
  Bedroom, bedSit, BedDuvet, LAMP,
  TitleCard, Tag, Toast, FloatLabel, HudChip, LightVeil, DrawOn, Glow, Dust,
  Foreground, ShotFrame, DizzyStars, NightSky, Stars, Moon, Skyline, Haze, Bokeh,
  WallFrame, FONT,
};
