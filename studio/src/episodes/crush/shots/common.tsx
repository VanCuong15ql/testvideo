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
  rnd,
  settle,
  camT,
  LOOKS,
  LEG_LEN,
  HEAD,
  joints,
  toWorld,
  reachAngle,
  Hero,
  Actor,
  walkPose,
  Classroom,
  CLS,
  Kid,
  KIDS,
  SchoolDesk,
  Study,
  STUDY,
  Desk,
  Stairwell,
  Bedroom,
  Kitchen,
  Rooftop,
  Workshop,
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
} from '../../../engine';

// Shared kit for the crush story scenes. "You" is Pip; the crush is Linh; friends are Mo and the sister;
// the teacher is the suit. The story's gimmick is the shadow that acts on its own — ShadowFigure draws it.

export const YOU = LOOKS.pip;
export const EMMA = LOOKS.linh;
export const FRIEND = LOOKS.mo;
export const SIS = LOOKS.sis;
export const TEACHER = LOOKS.suit;
export const DANIEL = LOOKS.minh;

export const INK = '#0D0A14';

// ---------- the shadow: a flat silhouette that acts on its own ----------
export type ShadowMood = 'idle' | 'wave' | 'heart' | 'laugh' | 'cry' | 'think' | 'shrug' | 'cheer' | 'point' | 'thumb' | 'nod' | 'clap';

const SHADOW = '#100C1C';

type ArmMode = 'hang' | 'up' | 'point' | 'thumb';

/** A flat black silhouette person, feet at (x, y), about 190 units tall at s=1. Moods move the arms and props. */
export const ShadowFigure: React.FC<{
  x: number;
  y: number;
  s?: number;
  flip?: 1 | -1;
  mood?: ShadowMood;
  t?: number;
  opacity?: number;
}> = ({ x, y, s = 1, flip = 1, mood = 'idle', t = 0, opacity = 1 }) => {
  const bob = Math.sin(t * 0.12) * 3;
  const arm = (side: 1 | -1, mode: ArmMode) => {
    // a thick limb from the shoulder; modes: hang, up, point (diagonal up-out), thumb (fist up)
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
  const moodArms: Record<ShadowMood, [ArmMode, ArmMode]> = {
    idle: ['hang', 'hang'],
    wave: ['hang', 'up'],
    heart: ['up', 'up'],
    laugh: ['hang', 'thumb'],
    cry: ['hang', 'hang'],
    think: ['hang', 'hang'],
    shrug: ['up', 'up'],
    cheer: ['up', 'up'],
    point: ['hang', 'point'],
    thumb: ['hang', 'thumb'],
    nod: ['hang', 'hang'],
    clap: ['point', 'point'],
  };
  const [al, ar] = moodArms[mood];
  const nod = mood === 'nod' ? Math.sin(t * 0.5) * 5 : 0;
  const waveRot = mood === 'wave' ? Math.sin(t * 0.4) * 14 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`} opacity={opacity} style={{ filter: 'drop-shadow(0 0 7px rgba(139,123,184,0.4))' }}>
      {/* legs */}
      <path d={`M -14 -78 Q -18 -40 -16 0 M 14 -78 Q 18 -40 16 0`} stroke={SHADOW} strokeWidth={15} fill="none" strokeLinecap="round" />
      {/* torso + head, one silhouette */}
      <path d={`M -34 -172 Q 0 -182 34 -172 L 30 -70 Q 0 -60 -30 -70 Z`} fill={SHADOW} />
      <g transform={`translate(0 ${nod})`}>
        <circle cx={0} cy={-198 + bob} r={26} fill={SHADOW} />
      </g>
      <g transform={`rotate(${waveRot} 26 -160)`}>{arm(-1, al)}</g>
      <g transform={`rotate(${-waveRot} -26 -160)`}>{arm(1, ar)}</g>
      {/* mood props */}
      {mood === 'heart' ? (
        <path d={`M 0 ${-262 + bob} c -10 -12 -26 -4 -20 8 c 4 8 20 16 20 16 c 0 0 16 -8 20 -16 c 6 -12 -10 -20 -20 -8 Z`} fill="#E86A92" />
      ) : null}
      {mood === 'laugh' ? (
        <g stroke={SHADOW} strokeWidth={6} fill="none" strokeLinecap="round">
          <path d={`M -30 ${-206 + bob} q 8 10 0 18`} />
          <path d={`M 30 ${-206 + bob} q -8 10 0 18`} />
        </g>
      ) : null}
      {mood === 'cry' ? (
        <g stroke="#8FD3FF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.9}>
          <path d={`M -14 ${-190 + bob} q -3 12 0 18`} />
          <path d={`M 14 ${-190 + bob} q 3 12 0 18`} />
        </g>
      ) : null}
      {mood === 'think' ? <circle cx={30} cy={-196 + bob} r={9} fill={SHADOW} /> : null}
      {mood === 'clap' ? <path d={`M 0 ${-196 + bob} c -8 -10 -22 -2 -16 8 c 4 7 16 12 16 12 c 0 0 12 -5 16 -12 c 6 -10 -8 -18 -16 -8 Z`} fill="#8B7BB8" opacity={0.8} /> : null}
    </g>
  );
};

// ---------- placeholder shot: keeps the board reviewable before an agent fills a scene ----------
export const DebugShot: React.FC<{ id: string; text?: string }> = ({ id, text = '' }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
    <text x={960} y={520} textAnchor="middle" fontFamily="monospace" fontSize={34} fill="#8B7BB8">{id}</text>
    <text x={960} y={575} textAnchor="middle" fontFamily="monospace" fontSize={22} fill="#5A5478">{text.slice(0, 90)}</text>
  </g>
);

// ---------- the school hallway: rich multi-layer set ----------
// Depth layers (back → front): far wall (clock, notice boards, doors) → side windows with light
// shafts → floor tiles + warm reflections → mid character plane → foreground locker edge + plant.
// One-point perspective to (960, 430). Characters: far ~690/0.72, mid ~780/0.9, near ~860/1.05.
export const HALL = {
  back: { x0: 640, x1: 1280, y0: 300, y1: 720 },
  far: { x: 960, y: 690, s: 0.72 },
  mid: { x: 960, y: 780, s: 0.9 },
  near: { x: 960, y: 860, s: 1.05 },
};

/** Wall clock frozen at 8:12 — the "exactly 8:12 Monday morning" detail. */
export const Clock8_12: React.FC<{ x: number; y: number; r?: number; id?: string }> = ({ x, y, r = 46, id = 'clk' }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs>
      <radialGradient id={`${id}face`} cx="0.4" cy="0.35" r="0.9">
        <stop offset="0%" stopColor="#F4EEE0" />
        <stop offset="100%" stopColor="#C9BFA8" />
      </radialGradient>
    </defs>
    <circle r={r} fill={`url(#${id}face)`} stroke={INK} strokeWidth={5} />
    <circle r={r - 7} fill="none" stroke="#8A93AE" strokeWidth={2} />
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={0} y1={-r + 10} x2={0} y2={-r + 18} stroke={INK} strokeWidth={4} transform={`rotate(${i * 90})`} />
    ))}
    {[...Array(12)].map((_, i) => (
      <circle key={i} cx={Math.sin((i / 12) * Math.PI * 2) * (r - 13)} cy={-Math.cos((i / 12) * Math.PI * 2) * (r - 13)} r={2.4} fill={INK} />
    ))}
    {/* 8:12 — hour hand just past 8, minute on the 12 */}
    <line x1={0} y1={8} x2={Math.sin((8.2 / 12) * Math.PI * 2) * (r * 0.5)} y2={-Math.cos((8.2 / 12) * Math.PI * 2) * (r * 0.5) + 8} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={8} x2={0} y2={-r + 20} stroke="#B4543F" strokeWidth={4} strokeLinecap="round" />
    <circle r={5} fill={INK} />
  </g>
);

/** Pinned notice board: cork panel, scattered notes, a photo, a star sticker. */
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

/** A bank of lockers receding in perspective: doors, vents, numbers, handles. */
const LockerBank: React.FC<{ x: number; y: number; w: number; h: number; n?: number; seed?: number }> = ({ x, y, w, h, n = 4, seed = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: n }, (_, i) => {
      const lx = (-w / 2) + (i / n) * w;
      const lw = w / n;
      return (
        <g key={i}>
          <rect x={lx} y={-h / 2} width={lw - 4} height={h} fill={i % 2 ? '#3A3462' : '#443D70'} stroke="#221D3C" strokeWidth={4} />
          {/* vent slits */}
          {[0, 1, 2].map((v) => (
            <rect key={v} x={lx + lw * 0.22} y={-h / 2 + 12 + v * 10} width={lw * 0.56} height={4} rx={2} fill="#221D3C" opacity={0.7} />
          ))}
          {/* number plate */}
          <rect x={lx + lw * 0.3} y={-h / 2 + h * 0.62} width={lw * 0.4} height={18} rx={3} fill="#2A2450" />
          <text x={lx + lw / 2} y={-h / 2 + h * 0.62 + 14} textAnchor="middle" fontSize={12} fill="#8B7BB8" fontFamily="monospace">
            {String(101 + seed * 7 + i)}
          </text>
          {/* handle */}
          <rect x={lx + lw - 14} y={-h / 2 + h * 0.42} width={6} height={26} rx={3} fill="#8A93AE" />
        </g>
      );
    })}
  </g>
);

export const Hallway: React.FC<{ t?: number; id?: string; glow?: number; clock?: boolean }> = ({ t = 0, id = 'hw', glow = 1, clock = true }) => {
  const flick = 1 + Math.sin(t * 0.11 + 1.7) * 0.04;
  const shaftO = 0.16 * glow * (0.9 + Math.sin(t * 0.07) * 0.1);
  // floor cross-lines at three depths (perspective grout)
  const floorLines = [840, 960, 1060].map((y) => {
    const xl = 640 - (y - 720) * 1.9;
    const xr = 1280 + (y - 720) * 1.9;
    return <line key={y} x1={xl} y1={y} x2={xr} y2={y} stroke="#0F0C1C" strokeWidth={y > 960 ? 4 : 3} opacity={0.75} />;
  });
  // vertical grout lines converging toward vanishing point
  const grout = [-3, -2, -1, 1, 2, 3].map((i) => (
    <line key={i} x1={960 + i * 90} y1={720} x2={960 + i * 340} y2={1080} stroke="#0F0C1C" strokeWidth={2.5} opacity={0.4} />
  ));
  // dusk windows on the right wall receding + their light shafts on the floor
  const wins = [
    { p: '1560,380 1780,345 1780,640 1560,690', shaft: '1560,690 1780,640 1900,1080 1100,1080' },
    { p: '1330,470 1500,448 1500,700 1330,728', shaft: '1330,728 1500,700 1650,1080 900,1080' },
    { p: '1170,545 1290,532 1290,725 1170,738', shaft: '1170,738 1290,725 1400,1080 800,1080' },
  ];
  return (
    <g>
      {/* ===== LAYER: ceiling + far wall ===== */}
      <polygon points="0,0 640,300 1280,300 1920,0" fill="#241F42" />
      {/* ceiling pipes receding to vanishing point */}
      <path d="M 700 60 L 960 330 L 1220 60" stroke="#171327" strokeWidth={14} fill="none" />
      <path d="M 780 40 L 960 300 L 1140 40" stroke="#1E1834" strokeWidth={8} fill="none" />
      {/* EXIT sign above far doors */}
      <rect x={890} y={310} width={140} height={34} rx={5} fill="#1E5C3A" stroke={INK} strokeWidth={3} />
      <text x={960} y={335} textAnchor="middle" fontSize={20} fill="#9FD8A8" fontFamily="monospace" letterSpacing={4}>EXIT</text>
      {/* far wall */}
      <rect x={640} y={300} width={640} height={420} fill="#2E2850" />
      {/* far doors either side of exit */}
      <rect x={668} y={430} width={140} height={290} fill="#38315E" stroke="#221D3C" strokeWidth={5} />
      <rect x={1112} y={430} width={140} height={290} fill="#38315E" stroke="#221D3C" strokeWidth={5} />
      <circle cx={790} cy={580} r={6} fill="#8A93AE" />
      <circle cx={1130} cy={580} r={6} fill="#8A93AE" />
      {/* lockers flanking the doors */}
      <LockerBank x={800} y={560} w={130} h={220} n={2} seed={1} />
      <LockerBank x={1120} y={560} w={130} h={220} n={2} seed={4} />
      {/* notice boards on the far wall */}
      <NoticeBoard x={720} y={380} w={190} h={120} seed={0} />
      <NoticeBoard x={1200} y={380} w={190} h={120} seed={3} />
      {/* the 8:12 clock, dead center high on the far wall */}
      {clock ? <Clock8_12 x={960} y={345} r={34} id={`${id}clk`} /> : null}
      {/* baseboard */}
      <rect x={640} y={690} width={640} height={30} fill="#221D3C" />

      {/* ===== LAYER: side walls ===== */}
      <polygon points="0,0 640,300 640,720 0,1080" fill="#2B2547" />
      <polygon points="1920,0 1280,300 1280,720 1920,1080" fill="#1F1A36" />
      {/* left wall: one tall cool window high on the wall */}
      {(() => {
        const p = '150,420 330,390 330,640 150,680';
        const cx = (150 + 330 + 330 + 150) / 4, cy = (390 + 390 + 640 + 680) / 4;
        return (
          <g>
            <polygon points={p} fill="#8B7BB8" opacity={0.13} />
            <polygon points={p} fill="none" stroke="#141126" strokeWidth={6} />
            <line x1={240} y1={395} x2={240} y2={665} stroke="#141126" strokeWidth={4} />
            <line x1={152} y1={545} x2={328} y2={520} stroke="#141126" strokeWidth={4} />
          </g>
        );
      })()}
      {/* right wall windows + mullions + sills */}
      {wins.map((wn, i) => (
        <g key={i}>
          <polygon points={wn.p} fill="#F2B95C" opacity={(0.55 - i * 0.14) * glow} />
          <polygon points={wn.p} fill="none" stroke="#141126" strokeWidth={6} />
          {/* mullion cross */}
          <line x1={(+wn.p.split(',')[0] + +wn.p.split(',')[4]) / 2} y1={(+wn.p.split(',')[1] + +wn.p.split(',')[5]) / 2} x2={(+wn.p.split(',')[2] + +wn.p.split(',')[6]) / 2} y2={(+wn.p.split(',')[3] + +wn.p.split(',')[7]) / 2} stroke="#141126" strokeWidth={5} />
          <line x1={(+wn.p.split(',')[0] + +wn.p.split(',')[2]) / 2} y1={(+wn.p.split(',')[1] + +wn.p.split(',')[3]) / 2} x2={(+wn.p.split(',')[4] + +wn.p.split(',')[6]) / 2} y2={(+wn.p.split(',')[5] + +wn.p.split(',')[7]) / 2} stroke="#141126" strokeWidth={4} />
          {/* sill */}
          <polygon points={`${wn.p.split(',')[0]},${wn.p.split(',')[5]} ${wn.p.split(',')[2]},${wn.p.split(',')[7]} ${+wn.p.split(',')[2] + 26},${+wn.p.split(',')[7] + 14} ${+wn.p.split(',')[0] + 26},${+wn.p.split(',')[5] + 14}`} fill="#171327" opacity={0.8} />
        </g>
      ))}

      {/* ===== LAYER: floor ===== */}
      <polygon points="0,1080 640,720 1280,720 1920,1080" fill="#171327" />
      {/* warm window light washing the floor */}
      {wins.map((wn, i) => (
        <polygon key={i} points={wn.shaft} fill="#F2B95C" opacity={shaftO * (1 - i * 0.22)} />
      ))}
      {floorLines}
      {grout}
      {/* long warm reflections of the windows on the tiles */}
      <polygon points="1330,780 1500,760 1700,1080 1150,1080" fill="#F2B95C" opacity={0.07 * glow} />

      {/* ===== LAYER: ceiling lamps receding ===== */}
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
      {/* hanging sign near camera: "ROOM 204" */}
      <g transform="translate(1560 120)">
        <line x1={0} y1={-60} x2={0} y2={0} stroke="#171327" strokeWidth={5} />
        <rect x={-80} y={0} width={160} height={44} rx={8} fill="#221D3C" stroke="#4A4480" strokeWidth={3} />
        <text x={0} y={31} textAnchor="middle" fontSize={24} fill="#8B7BB8" fontFamily="monospace">204</text>
      </g>

      {/* ===== LAYER: atmosphere ===== */}
      <Glow x={1560} y={560} r={700} o={0.18 * glow} />
      <Glow x={960} y={330} r={400} o={0.08 * glow} />
      {/* dust motes drifting in the biggest light shaft */}
      {Array.from({ length: 14 }, (_, i) => {
        const dx = 1250 + ((i * 97 + t * (8 + (i % 4) * 3)) % 420);
        const dy = 760 + ((i * 61 + t * (5 + (i % 3) * 2)) % 300);
        return <circle key={i} cx={dx} cy={dy} r={2 + (i % 3)} fill="#FFE9B0" opacity={0.25 + (i % 4) * 0.08} />;
      })}
    </g>
  );
};

/** Foreground depth layer: blurry locker edge + plant silhouette at frame left. */
export const HallForeground: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g opacity={0.9}>
    {/* out-of-focus locker doors crowding the left edge */}
    <rect x={-40} y={0} width={150} height={1080} fill="#141126" opacity={0.85} />
    <rect x={80} y={0} width={14} height={1080} fill="#0D0A14" />
    <rect x={-20} y={180} width={180} height={900} fill="#1E1834" opacity={0.6} />
    {/* potted plant silhouette */}
    <g transform="translate(210 950)">
      <path d="M -34 0 L 34 0 L 26 90 L -26 90 Z" fill="#2A1E3A" />
      <path d="M 0 0 Q -60 -70 -30 -130 Q -10 -80 0 -60 Q 10 -90 34 -140 Q 66 -70 0 0 Z" fill="#241B33" />
      <path d="M 0 0 Q -30 -50 -16 -96" stroke="#2E2444" strokeWidth={6} fill="none" />
      <path d="M 0 0 Q 34 -46 22 -88" stroke="#2E2444" strokeWidth={6} fill="none" />
      {/* sway */}
      <g transform={`rotate(${Math.sin(t * 0.5) * 3} 0 0)`} opacity={0.9}>
        <path d="M 0 -60 Q -54 -120 -28 -176 Q -8 -128 0 -108 Q 8 -134 30 -184 Q 56 -124 0 -60 Z" fill="#2E2444" />
      </g>
    </g>
    {/* floor shadow of the foreground plant */}
    <ellipse cx={210} cy={1040} rx={90} ry={18} fill="#0D0A14" opacity={0.5} />
  </g>
);

// ---------- story props: Emma's notebook and Pip's backpack ----------
export const Notebook: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-34} y={-24} width={68} height={48} rx={5} fill="#3E5A8C" stroke={INK} strokeWidth={3} />
    <rect x={-34} y={-24} width={14} height={48} rx={4} fill="#2E4470" />
    <path d="M -12 -8 L 22 -8 M -12 2 L 22 2 M -12 12 L 16 12" stroke="#C9D4EE" strokeWidth={3} opacity={0.8} />
    {open > 0 ? <rect x={-30} y={-20} width={60} height={40} rx={4} fill="#E8ECF7" opacity={open} transform="skewY(-6)" /> : null}
  </g>
);

export const Backpack: React.FC<{ x: number; y: number; s?: number; rot?: number; slip?: number }> = ({ x, y, s = 1, rot = 0, slip = 0 }) => (
  <g transform={`translate(${x} ${y + slip * 26}) rotate(${rot + slip * 24}) scale(${s})`}>
    <rect x={-30} y={-34} width={60} height={72} rx={14} fill="#D9534F" stroke={INK} strokeWidth={4} />
    <rect x={-30} y={-34} width={60} height={16} rx={8} fill="#B83E3B" />
    <path d="M -16 -34 Q 0 -58 16 -34" fill="none" stroke={INK} strokeWidth={6} />
    <rect x={-20} y={8} width={40} height={14} rx={5} fill="#B83E3B" />
  </g>
);

// ---------- rainy-day kit: umbrella, rain streaks, the school entrance street ----------
export const Umbrella: React.FC<{ x: number; y: number; s?: number; tilt?: number; color?: string }> = ({ x, y, s = 1, tilt = 0, color = '#3E6FB8' }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
    {/* canopy: half-dome scalloped edge */}
    <path d="M -70 0 Q -70 -78 0 -78 Q 70 -78 70 0 Q 52 -14 35 -2 Q 18 -14 0 -2 Q -18 -14 -35 -2 Q -52 -14 -70 0 Z" fill={color} stroke={INK} strokeWidth={4} />
    <path d="M 0 -78 L 0 0" stroke={INK} strokeWidth={3} opacity={0.5} />
    <path d="M -35 -2 Q -18 -14 0 -2 Q 18 -14 35 -2" fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
    {/* shaft + handle */}
    <path d="M 0 0 L 0 66" stroke="#8A93AE" strokeWidth={6} strokeLinecap="round" />
    <path d="M 0 66 q 0 16 14 16" fill="none" stroke="#8A93AE" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const Rain: React.FC<{ t?: number; n?: number; o?: number; slant?: number }> = ({ t = 0, n = 90, o = 0.5, slant = -0.22 }) => {
  const drops = Array.from({ length: n }, (_, i) => {
    const px = (i * 197.3 + Math.sin(i * 12.9) * 90) % 2100 - 100;
    const sp = 900 + (i % 5) * 140;
    const y = ((i * 173.7 + t * sp) % 1300) - 100;
    const x = px + y * slant;
    return <line key={i} x1={x} y1={y} x2={x + slant * 26} y2={y + 26} stroke="#9FC0D6" strokeWidth={3} opacity={o * (0.4 + (i % 3) * 0.2)} />;
  });
  return <g>{drops}</g>;
};

/** Dusk street outside school: awning roof at top, wet ground, puddles, rain haze. */
export const Street: React.FC<{ t?: number; id?: string }> = ({ t = 0, id = 'st' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3E3A6E" />
        <stop offset="55%" stopColor="#7A5A8E" />
        <stop offset="100%" stopColor="#D98A5E" />
      </linearGradient>
      <linearGradient id={`${id}wet`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4A4468" />
        <stop offset="100%" stopColor="#241F3E" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={560} fill={`url(#${id}sky)`} />
    {/* building silhouettes */}
    <rect x={0} y={180} width={420} height={380} fill="#2A2450" />
    <rect x={1500} y={140} width={420} height={420} fill="#322A56" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={80 + i * 110} y={240 + (i % 2) * 60} width={52} height={70} fill="#F2B95C" opacity={0.5} />
        <rect x={1560 + i * 110} y={210 + (i % 2) * 70} width={52} height={70} fill="#F2B95C" opacity={0.45} />
      </g>
    ))}
    {/* the school entrance: door + awning roof where they shelter */}
    <rect x={760} y={330} width={400} height={230} fill="#3A3260" />
    <rect x={830} y={400} width={260} height={160} rx={6} fill="#F2B95C" opacity={0.4} />
    <rect x={830} y={400} width={260} height={160} rx={6} fill="none" stroke="#141126" strokeWidth={8} />
    <rect x={700} y={310} width={520} height={34} rx={8} fill="#4A3F6E" />
    <text x={960} y={336} textAnchor="middle" fontFamily="Georgia, serif" fontSize={26} fill="#E9C46A" fontStyle="italic">SCHOOL</text>
    {/* wet ground */}
    <rect x={0} y={560} width={1920} height={520} fill={`url(#${id}wet)`} />
    {/* reflections of the door light */}
    <polygon points="830,560 1090,560 1180,1080 740,1080" fill="#F2B95C" opacity={0.08} />
    {/* puddles */}
    {[[400, 900, 150], [1250, 980, 190], [700, 1020, 110]].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.16} fill="#8B7BB8" opacity={0.25} />
    ))}
    <Glow x={960} y={500} r={600} o={0.14} />
  </g>
);

// ---------- festival kit: the class game booth + a paper ball ----------
export const Booth: React.FC<{ t?: number; id?: string; sign?: string }> = ({ t = 0, id = 'bt', sign = 'LUCKY DRAW' }) => {
  const bulbs = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g>
      {/* back panel + counter */}
      <rect x={560} y={300} width={800} height={380} fill="#3A3260" />
      <rect x={560} y={300} width={800} height={380} fill="none" stroke="#4A4480" strokeWidth={6} />
      {/* bunting */}
      <path d="M 520 320 Q 960 420 1400 320" fill="none" stroke="#8B7BB8" strokeWidth={4} />
      {bulbs.map((i) => {
        const x = 600 + i * 103;
        const y = 330 + Math.sin((i / 7) * Math.PI) * 55;
        const on = Math.sin(t * 0.15 + i * 1.3) > -0.2;
        return <circle key={i} cx={x} cy={y + 14} r={9} fill={on ? '#FFE9B0' : '#6A5A80'} opacity={on ? 0.95 : 0.5} />;
      })}
      {/* the sign they decorated */}
      <rect x={780} y={360} width={360} height={90} rx={10} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={4} transform="rotate(-2 960 405)" />
      <text x={960} y={418} textAnchor="middle" fontFamily="Georgia, serif" fontSize={44} fill="#3A3550" transform="rotate(-2 960 405)">{sign}</text>
      {/* counter */}
      <rect x={540} y={640} width={840} height={34} fill="#8A6452" />
      <rect x={540} y={640} width={840} height={6} fill="#F2B95C" opacity={0.5} />
      <rect x={580} y={674} width={60} height={120} fill="#4A3430" />
      <rect x={1280} y={674} width={60} height={120} fill="#4A3430" />
      {/* prize balls + tickets on the counter */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={700 + i * 60} cy={625} r={16} fill={['#E86A92', '#3E8E5A', '#E9C46A', '#3E6FB8'][i]} stroke="#0D0A14" strokeWidth={3} />
      ))}
      <Glow x={960} y={520} r={560} o={0.15} />
    </g>
  );
};

export const PaperBall: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = '#F4EEE0' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={22} fill={c} stroke="#0D0A14" strokeWidth={3} />
    <path d="M -12 -8 L 10 12 M -4 -16 L 16 4 M -16 2 L 6 18" stroke="#8A93AE" strokeWidth={3} fill="none" opacity={0.7} />
  </g>
);

export const Bandage: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-26} y={-9} width={52} height={18} rx={6} fill="#F4EEE0" stroke="#0D0A14" strokeWidth={2.5} />
    <rect x={-18} y={-9} width={8} height={18} fill="#D9A0A0" opacity={0.7} />
    <rect x={10} y={-9} width={8} height={18} fill="#D9A0A0" opacity={0.7} />
  </g>
);

/** Chalk writing for the classroom board: "QUESTION 5" + the algebra Emma asks about.
 *  Drop into <Classroom board={...}/> — writing area is x 426-1054, y 196-524. */
export const Question5Board: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g fontFamily="'Segoe Print','Comic Sans MS',cursive" fill="#EDEFE6">
    {/* earlier faded working, still on the board */}
    <g opacity={0.14} fontSize={30}>
      <text x={470} y={240}>a + b = c</text>
      <text x={830} y={500}>12 ÷ 4 = 3</text>
    </g>
    {/* the question of the day */}
    <text x={470} y={290} fontSize={42} opacity={0.95}>QUESTION 5</text>
    <path d="M 470 308 L 760 308" stroke="#EDEFE6" strokeWidth={3} opacity={0.55} />
    <text x={470} y={400} fontSize={58} opacity={0.95}>3x + 7 = 22</text>
    <text x={470} y={470} fontSize={38} opacity={0.8}>x = ?</text>
    {/* Emma's pencilled scratch, half-erased */}
    <g opacity={0.3} fontSize={26} fontFamily="monospace">
      <text x={880} y={380} transform="rotate(-4 880 380)">3x = 15?</text>
      <text x={880} y={420} transform="rotate(-4 880 420)">x = 5!</text>
    </g>
    {/* chalk dust puff when "written" */}
    {[0, 1, 2].map((i) => {
      const k = (t * 0.4 + i * 0.33) % 1;
      return <circle key={i} cx={560 + i * 160} cy={310 - k * 40} r={4 + k * 8} fill="#EDEFE6" opacity={(1 - k) * 0.3} />;
    })}
  </g>
);

/** Foreground depth layer for classroom shots: blurry desk edge + chair back at frame bottom. */
export const ClsForeground: React.FC = () => (
  <g opacity={0.9}>
    <rect x={-30} y={930} width={700} height={200} fill="#141126" opacity={0.7} />
    <rect x={1300} y={940} width={660} height={200} fill="#141126" opacity={0.7} />
    {/* a classmate's shoulder + head silhouette, back to camera, bottom corners */}
    <g transform="translate(140 1010)" opacity={0.85}>
      <circle cx={0} cy={-60} r={52} fill="#1E1834" />
      <path d="M -70 60 Q -72 -10 0 -14 Q 72 -10 70 60 Z" fill="#241E3C" />
      <path d="M -58 -70 Q 0 -110 58 -70 L 50 -96 Q 0 -122 -50 -96 Z" fill="#2E2444" />
    </g>
    <g transform="translate(1800 1020) scale(-1 1)" opacity={0.8}>
      <circle cx={0} cy={-56} r={48} fill="#1E1834" />
      <path d="M -64 56 Q -66 -8 0 -12 Q 66 -8 64 56 Z" fill="#241E3C" />
      <path d="M -52 -64 Q 0 -100 52 -64 L 45 -88 Q 0 -110 -45 -88 Z" fill="#2E2444" />
    </g>
  </g>
);

// Re-export everything scene files might need, so each module has a single import line.
export {
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
  rnd,
  settle,
  camT,
  LOOKS,
  LEG_LEN,
  HEAD,
  joints,
  toWorld,
  reachAngle,
  Hero,
  Actor,
  walkPose,
  Classroom,
  CLS,
  Kid,
  KIDS,
  SchoolDesk,
  Study,
  STUDY,
  Desk,
  Stairwell,
  Bedroom,
  Kitchen,
  Rooftop,
  Workshop,
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
};
