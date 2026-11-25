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

// ---------- the school hallway: one-point perspective to (960, 430), dusk light from the right windows ----------
// Back wall x 640-1280 y 300-720; floor runs to the bottom corners. Characters stand on the floor:
// deeper = smaller y and scale (far ~690/0.72, near ~830/1.05).
export const HALL = {
  back: { x0: 640, x1: 1280, y0: 300, y1: 720 },
  far: { x: 960, y: 690, s: 0.72 },
  mid: { x: 960, y: 770, s: 0.9 },
  near: { x: 960, y: 840, s: 1.05 },
};

export const Hallway: React.FC<{ t?: number; id?: string; glow?: number }> = ({ t = 0, id = 'hw', glow = 1 }) => {
  const flick = 1 + Math.sin(t * 0.11 + 1.7) * 0.04;
  // floor cross-lines at three depths
  const floorLines = [840, 960].map((y) => {
    const k = (y - 720) / 360;
    const xl = 640 - (y - 720) * 1.78;
    const xr = 1280 + (y - 720) * 1.78;
    return <line key={y} x1={xl} y1={y} x2={xr} y2={y} stroke="#0F0C1C" strokeWidth={3} opacity={0.7} />;
  });
  const boardLines = [0, 1, 2, 3].map((i) => {
    const y = 340 + i * 90;
    return <line key={i} x1={660} y1={y} x2={1260} y2={y} stroke="#3A3560" strokeWidth={4} opacity={0.5} />;
  });
  return (
    <g>
      {/* ceiling, walls, floor */}
      <polygon points="0,0 640,300 1280,300 1920,0" fill="#221D3C" />
      <polygon points="0,0 640,300 640,720 0,1080" fill="#2B2547" />
      <polygon points="1920,0 1280,300 1280,720 1920,1080" fill="#1F1A36" />
      <polygon points="0,1080 640,720 1280,720 1920,1080" fill="#171327" />
      {floorLines}
      {/* back wall: notice board + lockers either side */}
      <rect x={640} y={300} width={640} height={420} fill="#2E2850" />
      {boardLines}
      <rect x={700} y={330} width={220} height={140} rx={6} fill="#38315E" stroke="#4A4480" strokeWidth={3} />
      <rect x={1000} y={330} width={220} height={140} rx={6} fill="#38315E" stroke="#4A4480" strokeWidth={3} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={668 + i * 62} y={348} width={50} height={104} rx={3} fill="#4A3F6E" opacity={0.8} />
          <rect x={968 + i * 62} y={348} width={50} height={104} rx={3} fill="#4A3F6E" opacity={0.8} />
        </g>
      ))}
      {/* dusk windows on the right wall: warm rectangles receding */}
      {[
        { p: '1560,380 1760,350 1760,620 1560,660', o: 0.85 },
        { p: '1330,470 1480,450 1480,690 1330,715', o: 0.6 },
        { p: '1180,540 1280,530 1280,720 1180,730', o: 0.4 },
      ].map((wn, i) => (
        <g key={i}>
          <polygon points={wn.p} fill="#F2B95C" opacity={wn.o * 0.5 * glow} />
          <polygon points={wn.p} fill="none" stroke="#141126" strokeWidth={6} />
        </g>
      ))}
      {/* ceiling lamps receding to the vanishing point */}
      {[
        { x: 960, y: 318, r: 26 },
        { x: 960, y: 380, r: 18 },
        { x: 960, y: 452, r: 12 },
      ].map((l, i) => (
        <g key={i}>
          <ellipse cx={l.x} cy={l.y} rx={l.r * 1.5} ry={l.r * 0.5} fill="#FFE9B0" opacity={0.75 * flick} />
          <Glow x={l.x} y={l.y + 30} r={l.r * 4} o={0.1 * glow} />
        </g>
      ))}
      <Glow x={1500} y={560} r={620} o={0.16 * glow} />
    </g>
  );
};

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
