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
} from '../../../engine';

// Shared kit for "What If Everything You Drew Became Real?" page 1.
// Noah = Pip's rig in the mustard jacket; Ethan = Mo; the teacher = the suit; a classmate = Linh.
// The power: pencil drawings become real. Every "drawn" prop pops in with a spring, a ring and ticks —
// the sketch-to-real grammar the whole episode learns in this page.

export const NOAH = LOOKS.pip;
export const ETHAN = LOOKS.mo;
export const TEACHER = LOOKS.suit;
export const CLASSMATE = LOOKS.linh;

export const INK = '#0D0A14';
export const PAPER = '#F4EEE0';
export const SKETCH = '#CFC4AE';

// ---------- flat silhouette people: classmates on desks, crowd shots ----------
type ShadowMood = 'idle' | 'wave' | 'point' | 'thumb' | 'cheer' | 'clap';
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
    </g>
  );
};

export const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, ...extra,
});

// ---------- the classroom, dressed for a Monday math lesson ----------
/** Chalk content for the board: fractions warm-up, half-erased. */
export const MathBoard: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g fontFamily="'Segoe Print','Comic Sans MS',cursive" fill="#EDEFE6">
    <g opacity={0.16} fontSize={30}>
      <text x={470} y={240}>7 x 8 = 56</text>
      <text x={830} y={500}>1/2 + 1/4 = ?</text>
    </g>
    <text x={470} y={300} fontSize={46} opacity={0.95}>MONDAY MATH</text>
    <path d="M 470 320 L 780 320" stroke="#EDEFE6" strokeWidth={3} opacity={0.55} />
    <text x={470} y={410} fontSize={58} opacity={0.95}>3/4 + 1/4 = ?</text>
    <text x={470} y={480} fontSize={40} opacity={0.8}>show your work!</text>
    {[0, 1, 2].map((i) => {
      const k = (t * 0.4 + i * 0.33) % 1;
      return <circle key={i} cx={560 + i * 160} cy={330 - k * 40} r={4 + k * 8} fill="#EDEFE6" opacity={(1 - k) * 0.3} />;
    })}
  </g>
);

/** The classroom stack: set + board + the blurry foreground classmates. */
export const Cls: React.FC<{ t: number; id?: string; board?: React.ReactNode; laugh?: number }> = ({ t, id = 'dw', board, laugh }) => (
  <>
    <Classroom t={t + 600} id={id} board={board ?? <MathBoard t={t} />} laugh={laugh} />
    <ClsForeground t={t} />
  </>
);

/** Blurred classmates' shoulders/desks at frame bottom — copied pattern from the crush scenes. */
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

// ---------- the power's grammar: a drawing pops into real ----------
/** Expanding ring + motion ticks when a drawing becomes real. p runs 0..1 through the pop. */
export const AppearFx: React.FC<{ x: number; y: number; p: number; r?: number; color?: string }> = ({ x, y, p, r = 90, color = '#E9C46A' }) => {
  if (p <= 0 || p >= 1) return null;
  const e = easeOut(p);
  return (
    <g>
      <circle cx={x} cy={y} r={r * (0.3 + e * 1.4)} fill="none" stroke={color} strokeWidth={5} opacity={(1 - p) * 0.9} />
      <circle cx={x} cy={y} r={r * (0.2 + e * 0.9)} fill={color} opacity={(1 - p) * 0.12} />
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.6;
        const d = r * (0.5 + e * 1.1);
        return <line key={i} x1={x + Math.cos(a) * d * 0.8} y1={y + Math.sin(a) * d * 0.8} x2={x + Math.cos(a) * d} y2={y + Math.sin(a) * d} stroke={color} strokeWidth={4} strokeLinecap="round" opacity={(1 - p) * 0.8} />;
      })}
    </g>
  );
};

/** A drawn thing mid-pop: sketch ghost (pencil lines) resolves into the solid prop. */
export const Materialize: React.FC<{ x: number; y: number; p: number; s?: number; rot?: number; children: React.ReactNode; ghost?: React.ReactNode }> = ({ x, y, p, s = 1, rot = 0, children, ghost }) => {
  const sc = s * (0.55 + 0.45 * spring(p, { damping: 9, stiffness: 140 }));
  const o = clamp(p * 2.4);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc}) translate(${-x} ${-y})`} opacity={o}>
      {children}
      {p < 0.55 && ghost ? <g opacity={(1 - p / 0.55) * 0.9}>{ghost}</g> : null}
    </g>
  );
};

// ---------- speech bubbles: quoted lines get a hand-drawn comic bubble ----------
/** A comic speech bubble in screen space (the 1920x1080 frame). Render it as a SIBLING after the
 *  shot's camT group so it doesn't inherit the camera. x,y = bubble centre, tx,ty = tail tip on the
 *  speaker's head (screen px), at/until = shot-clock frames, t = current shot clock. */
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
  // greedy word wrap on an estimated glyph width
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
  // tail on the edge facing the speaker, tip slightly short of the head
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
      {/* sketchy second pass, keeps the hand-drawn feel */}
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

// ---------- the notebook and pencil ----------
/** Noah's math notebook, closed or open; `doodle` draws the tiny hamburger he sketched. */
export const Note: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number; doodle?: boolean; t?: number }> = ({ x, y, s = 1, rot = 0, open = 0, doodle = false, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* cover */}
    <rect x={-46} y={-32} width={92} height={64} rx={7} fill="#3E5A8C" stroke={INK} strokeWidth={4} />
    <rect x={-46} y={-32} width={16} height={64} rx={5} fill="#2E4470" />
    {/* spiral hint */}
    {[-24, -8, 8, 24].map((yy) => <circle key={yy} cx={-33} cy={yy} r={4} fill="none" stroke="#8B7BB8" strokeWidth={3} />)}
    {open > 0 ? (
      <g opacity={open}>
        <rect x={-42} y={-28} width={84} height={56} rx={4} fill={PAPER} stroke={INK} strokeWidth={3} transform="skewY(-4)" />
        {/* graph grid */}
        {[0, 1, 2, 3].map((i) => <line key={i} x1={-34 + i * 20} y1={-24} x2={-34 + i * 20} y2={26} stroke="#B9C4D8" strokeWidth={1.4} />)}
        {[0, 1].map((i) => <line key={i} x1={-38} y1={-16 + i * 20} x2={38} y2={-16 + i * 20} stroke="#B9C4D8" strokeWidth={1.4} />)}
        {doodle ? (
          <g stroke={SKETCH} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.95}>
            <path d="M 8 -18 q 12 -8 24 0 q -12 8 -24 0 Z" />
            <path d="M 10 -12 q 11 6 22 0" />
            <path d="M 14 -16 l 3 4 M 20 -17 l 3 4 M 26 -16 l 3 4" />
          </g>
        ) : null}
      </g>
    ) : null}
  </g>
);

export const Pencil: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => {
  const jig = Math.sin(t * 0.9) * 2;
  return (
    <g transform={`translate(${x + jig * 0.4} ${y}) rotate(${rot + jig}) scale(${s})`}>
      {/* sharpened tip */}
      <path d="M -10 -7 L 0 0 L -10 7 Z" fill="#E8C89A" stroke={INK} strokeWidth={2.5} />
      <path d="M -6 -3.4 L 0 0 L -6 3.4 Z" fill="#3A3550" />
      {/* body */}
      <rect x={-46} y={-9} width={36} height={18} rx={3} fill="#E9C46A" stroke={INK} strokeWidth={2.5} />
      <rect x={-46} y={-9} width={10} height={18} fill="#D4922A" />
      {/* ferrule + eraser */}
      <rect x={-12} y={-9} width={8} height={18} fill="#8A93AE" />
      <rect x={-4} y={-9} width={12} height={18} rx={3} fill="#E86A92" stroke={INK} strokeWidth={2.5} />
    </g>
  );
};

// ---------- the things he draws (all original, flat dusk style) ----------
export const Hamburger: React.FC<{ x: number; y: number; s?: number; rot?: number; steam?: number }> = ({ x, y, s = 1, rot = 0, steam = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* bottom bun */}
    <path d="M -62 10 Q -66 -18 -30 -22 L 30 -22 Q 66 -18 62 10 Q 30 22 -30 22 Q -62 22 -62 10 Z" fill="#E8A94E" stroke={INK} strokeWidth={4} />
    {/* patty */}
    <rect x={-58} y={-2} width={116} height={16} rx={8} fill="#6B4226" stroke={INK} strokeWidth={3.5} />
    {/* lettuce + tomato */}
    <path d="M -60 -8 q 15 -10 30 0 q 15 -10 30 0 q 15 -10 30 0 q 15 -10 30 0 l 0 8 l -120 0 Z" fill="#7FB069" stroke={INK} strokeWidth={3} />
    <rect x={-52} y={-22} width={104} height={10} rx={5} fill="#E86A5A" stroke={INK} strokeWidth={3} />
    {/* top bun */}
    <path d="M -58 -20 Q -60 -52 0 -52 Q 60 -52 58 -20 Q 30 -8 -30 -8 Q -58 -8 -58 -20 Z" fill="#F0BC6A" stroke={INK} strokeWidth={4} />
    {/* sesame */}
    {[-30, -10, 10, 30].map((sx, i) => <ellipse key={i} cx={sx} cy={-38 - (i % 2) * 8} rx={5} ry={3} fill="#FFF3D6" transform={`rotate(${i * 30} ${sx} -38)`} />)}
    {steam ? [0, 1].map((i) => {
      const k = (steam * 0.5 + i * 0.5) % 1;
      return <path key={i} d={`M ${-14 + i * 28} ${-64 - k * 26} q 8 -12 0 -22 q -8 -10 0 -20`} stroke="#FFE9B0" strokeWidth={4} fill="none" strokeLinecap="round" opacity={(1 - k) * 0.6} />;
    }) : null}
  </g>
);

export const RedBall: React.FC<{ x: number; y: number; r?: number; t?: number }> = ({ x, y, r = 26, t = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#D9534F" stroke={INK} strokeWidth={4} />
    <path d={`M ${-r} 0 Q 0 ${-r * 0.5} ${r} 0`} stroke="#8F2F2B" strokeWidth={3} fill="none" opacity={0.6} />
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.28} ry={r * 0.16} fill="#F4A79E" opacity={0.8} transform={`rotate(-30)`} />
    {/* spin seam drifting with t */}
    <path d={`M ${-r * 0.9} ${Math.sin(t * 0.4) * 3} q ${r * 0.9} ${-r * 0.4} ${r * 1.8} 0`} stroke="#8F2F2B" strokeWidth={2.5} fill="none" opacity={0.5} />
  </g>
);

export const PhoneD: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-34} y={-64} width={68} height={128} rx={12} fill="#1E1A2C" stroke={INK} strokeWidth={4} />
    <rect x={-26} y={-54} width={52} height={104} rx={7} fill="#3E6FB8" opacity={0.85} />
    <rect x={-26} y={-54} width={52} height={104} rx={7} fill="none" stroke="#8FD3FF" strokeWidth={2} opacity={0.5 + Math.sin(t * 0.2) * 0.2} />
    <circle cx={0} cy={56} r={6} fill="#8A93AE" />
    <rect x={-10} y={-60} width={20} height={4} rx={2} fill="#8A93AE" />
  </g>
);

export const Sneakers: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-18, 22].map((ox, i) => (
      <g key={i} transform={`translate(${ox} ${i * 6}) rotate(${i ? -4 : 3})`}>
        <path d="M -34 -18 Q -38 6 -20 12 L 26 14 Q 40 10 38 -8 Q 30 -22 8 -22 L -18 -22 Q -30 -20 -34 -18 Z" fill="#F4EEE0" stroke={INK} strokeWidth={3.5} />
        <path d="M -34 -6 L 38 -6 L 38 2 L -34 2 Z" fill="#3E8C86" />
        <path d="M -20 -18 L -14 -2 M -6 -19 L 0 -3 M 8 -19 L 14 -3" stroke="#8A93AE" strokeWidth={3} />
        <rect x={-38} y={-22} width={12} height={10} rx={4} fill="#D9534F" />
      </g>
    ))}
  </g>
);

export const Crown: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => {
  const glint = 0.6 + Math.sin(t * 0.3) * 0.4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -46 14 L -46 -12 L -28 -2 L -14 -22 L 0 -6 L 14 -22 L 28 -2 L 46 -12 L 46 14 Q 0 24 -46 14 Z" fill="#E9C46A" stroke={INK} strokeWidth={4} />
      <rect x={-46} y={8} width={92} height={10} fill="#D4922A" />
      {[-34, 0, 34].map((cx, i) => <circle key={i} cx={cx} cy={-6} r={5} fill={['#E86A92', '#8FD3FF', '#E86A5A'][i]} opacity={0.9} />)}
      <circle cx={0} cy={-26} r={4} fill="#8FD3FF" opacity={glint} />
      <Glow x={0} y={0} r={90} o={0.1 + glint * 0.08} />
    </g>
  );
};

export const CarD: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const wheel = (wx: number) => (
    <g key={wx} transform={`translate(${wx} 14)`}>
      <circle r={17} fill="#1E1A2C" stroke={INK} strokeWidth={4} />
      <circle r={7} fill="#8A93AE" />
      <g transform={`rotate(${t * 8} ${wx} 14)`}>
        <line x1={wx - 14} y1={14} x2={wx + 14} y2={14} stroke="#8A93AE" strokeWidth={3} />
        <line x1={wx} y1={0} x2={wx} y2={28} stroke="#8A93AE" strokeWidth={3} />
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* body */}
      <path d="M -52 8 L -52 -8 Q -50 -22 -36 -24 L -20 -26 Q -8 -40 8 -40 L 26 -38 Q 42 -34 46 -20 L 50 -10 Q 54 -4 52 8 L 52 14 L -52 14 Z" fill="#D9534F" stroke={INK} strokeWidth={4} />
      {/* windows */}
      <path d="M -14 -26 L -4 -36 L 8 -36 L 2 -26 Z" fill="#8FD3FF" opacity={0.85} />
      <path d="M 10 -36 L 24 -34 L 34 -24 L 8 -26 Z" fill="#8FD3FF" opacity={0.85} />
      {/* headlight */}
      <circle cx={48} cy={-2} r={5} fill="#FFE9B0" />
      {wheel(-30)}
      {wheel(34)}
    </g>
  );
};

export const WatchD: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const mins = (t * 0.15) % 60;
  const hrs = ((t * 0.05) % 12) + 8; // roughly 10:15-ish drifting
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-16} y={-58} width={32} height={22} rx={6} fill="#3A3446" stroke={INK} strokeWidth={3} />
      <rect x={-16} y={36} width={32} height={22} rx={6} fill="#3A3446" stroke={INK} strokeWidth={3} />
      <circle r={34} fill="#EFE2CC" stroke={INK} strokeWidth={4} />
      <circle r={27} fill="none" stroke="#8A93AE" strokeWidth={2} />
      <line x1={0} y1={0} x2={Math.sin((hrs / 12) * Math.PI * 2) * 15} y2={-Math.cos((hrs / 12) * Math.PI * 2) * 15} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin((mins / 60) * Math.PI * 2) * 22} y2={-Math.cos((mins / 60) * Math.PI * 2) * 22} stroke="#B4543F" strokeWidth={3} strokeLinecap="round" />
      <circle r={3.5} fill={INK} />
    </g>
  );
};

export const DogD: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: 1 | -1 }> = ({ x, y, s = 1, t = 0, flip = 1 }) => {
  const wag = Math.sin(t * 0.5) * 14;
  const bob = Math.abs(Math.sin(t * 0.5)) * 4;
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${s * flip} ${s})`}>
      {/* tail */}
      <path d={`M -34 -34 Q -52 ${-44 + wag * 0.4} -58 ${-30 + wag}`} stroke="#8A5A3A" strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx={0} cy={-18} rx={40} ry={22} fill="#C98E5A" stroke={INK} strokeWidth={4} />
      {/* legs */}
      {[-24, 24].map((lx, i) => <rect key={i} x={lx - 6} y={-12} width={12} height={26} rx={5} fill="#B07A48" stroke={INK} strokeWidth={3} />)}
      {/* head */}
      <g transform="translate(38 -40)">
        <circle r={20} fill="#C98E5A" stroke={INK} strokeWidth={4} />
        <path d="M -12 -16 Q -26 -34 -8 -38 Q 4 -40 -2 -22 Z" fill="#8A5A3A" stroke={INK} strokeWidth={3} />
        <circle cx={10} cy={-4} r={4.5} fill={INK} />
        <ellipse cx={16} cy={6} rx={6} ry={5} fill="#3A2620" />
      </g>
      {/* ear */}
      <path d="M 26 -52 Q 20 -70 34 -62 Q 40 -56 34 -50 Z" fill="#8A5A3A" stroke={INK} strokeWidth={3} />
    </g>
  );
};

export const Dino: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: 1 | -1; mood?: 'walk' | 'snarl' | 'calm' }> = ({ x, y, s = 1, t = 0, flip = 1, mood = 'walk' }) => {
  const step = Math.sin(t * 0.35);
  const snarl = mood === 'snarl' ? Math.sin(t * 0.8) * 4 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * flip} ${s})`}>
      {/* tail */}
      <path d="M -52 -60 Q -110 -70 -128 -34 Q -96 -44 -58 -38 Z" fill="#5E8C4A" stroke={INK} strokeWidth={4} />
      {/* body */}
      <ellipse cx={-10} cy={-56} rx={52} ry={34} fill="#6FA055" stroke={INK} strokeWidth={4} />
      {/* belly */}
      <ellipse cx={-6} cy={-44} rx={36} ry={20} fill="#A8C47E" opacity={0.8} />
      {/* legs */}
      <rect x={-34} y={-30} width={14} height={34} rx={6} fill="#5E8C4A" stroke={INK} strokeWidth={3} transform={`rotate(${step * 8} -27 -30)`} />
      <rect x={18} y={-30} width={14} height={34} rx={6} fill="#5E8C4A" stroke={INK} strokeWidth={3} transform={`rotate(${-step * 8} 25 -30)`} />
      {/* neck + head */}
      <path d="M 30 -70 Q 52 -96 62 -92" stroke="#6FA055" strokeWidth={22} fill="none" strokeLinecap="round" />
      <g transform={`translate(66 -96) rotate(${snarl * 0.4})`}>
        <ellipse cx={0} cy={0} rx={26} ry={17} fill="#6FA055" stroke={INK} strokeWidth={4} />
        <path d="M 18 -8 L 38 0 L 18 8 Z" fill="#5E8C4A" stroke={INK} strokeWidth={3} />
        <path d="M 26 2 l 6 5 M 20 8 l 5 5" stroke="#F4EEE0" strokeWidth={3} strokeLinecap="round" />
        <circle cx={-6} cy={-4} r={4.5} fill={INK} />
        <circle cx={-7.5} cy={-5.5} r={1.5} fill="#F4EEE0" />
        {/* little spikes */}
        {[ -14, 0, 12].map((sx, i) => <path key={i} d={`M ${sx} -14 l 4 -10 l 6 8 Z`} fill="#4A7038" stroke={INK} strokeWidth={2.5} />)}
      </g>
      {/* arm */}
      <path d={`M 24 -52 q 14 ${10 + step * 4} 10 ${26}`} stroke="#5E8C4A" strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const BikeD: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => {
  const wheel = (wx: number) => (
    <g key={wx} transform={`translate(${wx} 0)`}>
      <circle r={26} fill="none" stroke={INK} strokeWidth={6} />
      <circle r={20} fill="none" stroke="#8A93AE" strokeWidth={2.5} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + t * 0.9;
        return <line key={i} x1={0} y1={0} x2={Math.cos(a) * 20} y2={Math.sin(a) * 20} stroke="#8A93AE" strokeWidth={2} />;
      })}
      <circle r={5} fill="#8A93AE" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {wheel(-52)}
      {wheel(52)}
      {/* frame */}
      <path d="M -52 0 L -14 -34 L 30 -30 L 52 0 M -14 -34 L -6 0 L 30 -30 L 34 0" stroke="#3E8C86" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* seat + bars */}
      <path d="M -22 -38 L -6 -38" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M 30 -30 L 38 -52 L 50 -50" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* battery pack (electric) */}
      <rect x={-30} y={-30} width={16} height={10} rx={3} fill="#8FD3FF" stroke={INK} strokeWidth={2.5} />
      <Glow x={0} y={0} r={110} o={0.06} />
    </g>
  );
};

export const UmbrellaD: React.FC<{ x: number; y: number; s?: number; t?: number; tilt?: number }> = ({ x, y, s = 1, t = 0, tilt = 0 }) => {
  const sway = Math.sin(t * 0.4) * 4;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt + sway * 0.4}) scale(${s})`}>
      <path d="M -64 0 Q -64 -70 0 -70 Q 64 -70 64 0 Q 48 -12 32 -2 Q 16 -12 0 -2 Q -16 -12 -32 -2 Q -48 -12 -64 0 Z" fill="#8B7BB8" stroke={INK} strokeWidth={4} />
      <path d="M 0 -70 L 0 0 M -32 -2 L -16 -12 M 32 -2 L 16 -12" stroke={INK} strokeWidth={2.5} opacity={0.5} />
      <path d="M 0 0 L 0 56" stroke="#8A93AE" strokeWidth={6} strokeLinecap="round" />
      <path d="M 0 56 q 0 14 12 14" fill="none" stroke="#8A93AE" strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={-74} r={6} fill="#E9C46A" stroke={INK} strokeWidth={3} />
    </g>
  );
};

export const TrophyD: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const glint = 0.5 + Math.sin(t * 0.35) * 0.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* cup */}
      <path d="M -34 -58 L 34 -58 L 26 -8 Q 0 4 -26 -8 Z" fill="#E9C46A" stroke={INK} strokeWidth={4} />
      {/* handles */}
      <path d="M -34 -50 Q -58 -48 -52 -26 Q -48 -12 -30 -16" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M 34 -50 Q 58 -48 52 -26 Q 48 -12 30 -16" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      {/* rim + stem + base */}
      <rect x={-38} y={-66} width={76} height={10} rx={4} fill="#F4D98A" stroke={INK} strokeWidth={3} />
      <rect x={-8} y={-4} width={16} height={16} fill="#D4922A" stroke={INK} strokeWidth={3} />
      <rect x={-30} y={8} width={60} height={14} rx={4} fill="#B8862E" stroke={INK} strokeWidth={3.5} />
      {/* star emblem */}
      <path d="M 0 -44 l 5 11 l 12 1 l -9 8 l 3 12 l -11 -6 l -11 6 l 3 -12 l -9 -8 l 12 -1 Z" fill="#FFF3D6" opacity={0.9} />
      <Glow x={0} y={-30} r={100} o={0.08 + glint * 0.08} />
    </g>
  );
};

// ---------- blocking for page 1: the classroom, Noah at his desk ----------
export const NOAH_POS = { x: 980, y: 815, s: 0.98 };
export const NOAH_DESK = 980;
export const ETHAN_POS = { x: 690, y: 800, s: 0.9 };
export const CLASSMATE_POS = { x: 1330, y: 795, s: 0.88 };
export const TEACHER_POS = { x: 1180, y: 720, s: 0.85 };
export const KID_POS = [
  { x: 520, y: 760, s: 0.72, look: KIDS[0] },
  { x: 760, y: 745, s: 0.7, look: KIDS[1] },
  { x: 1240, y: 748, s: 0.7, look: KIDS[2] },
  { x: 1480, y: 735, s: 0.66, look: KIDS[3] },
];

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
};
