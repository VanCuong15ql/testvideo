import React from 'react';
import { lerp, easeInOut } from './anim';

// The cast, drawn entirely in code: one rig, and a costume (a Look) per character. Every character is built
// once here, so they look identical in every shot: that's the "drawn, not guessed" point. Original
// characters only: never a channel's own hero or anything that resembles a famous cartoon character.

export const C = {
  skin: '#F6EFE3',
  skinShade: '#E2D3BE',
  ink: '#1D2033',
  jacket: '#F2B33D',
  jacketShade: '#D4922A',
  shoe: '#2FB7A6',
  orange: '#FF8A3D',
  limb: '#EFE2CC',
};

export type Look = {
  skin: string;
  skinShade: string;
  hand: string;
  jacket: string;
  jacketShade: string;
  accent: string;
  limb: string;
  line: string;
  shoe: string;
  face: string;
  hair: string;
  /** Trousers colour; defaults to a darkened jacket. */
  pants?: string;
  pantsDark?: string;
  /** Female silhouette: wider bust, narrower waist. */
  bust?: boolean;
  /** Hip joint spacing (half-width); defaults to HIP.x = 28. Smaller = feet planted closer. */
  hipX?: number;
  /** Limb thickness multiplier for arms, legs, hands and shoes; defaults to 1. */
  bulk?: number;
  extra?: 'hood' | 'curls' | 'bunches' | 'bob' | 'suit' | 'short' | 'long' | 'twintails';
};

export type CastName = 'pip' | 'pipHood' | 'pipInk' | 'mo' | 'sis' | 'mom' | 'suit' | 'minh' | 'linh' | 'nina';

export const LOOKS: Record<CastName, Look> = {
  pip: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: C.jacket, line: C.ink, shoe: C.shoe, face: C.ink, hair: '#2B1F3A', pants: '#2E3A5C', pantsDark: '#222B47' },
  pipHood: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#2E2B3D', jacketShade: '#24212F', accent: C.jacket, limb: '#2E2B3D', line: '#121019', shoe: C.shoe, face: C.ink, hair: '#2B1F3A', pants: '#2E3A5C', pantsDark: '#222B47', extra: 'hood' },
  pipInk: { skin: '#26232F', skinShade: '#1C1A24', hand: '#26232F', jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: '#26232F', line: '#121019', shoe: C.shoe, face: '#F6EFE3', hair: '#2B1F3A', pants: '#26232F', pantsDark: '#1C1A24' },
  mo: { skin: '#C98E68', skinShade: '#B07A58', hand: '#C98E68', jacket: '#5E6E46', jacketShade: '#4C5A38', accent: '#E9C46A', limb: '#3A3446', line: '#1A1622', shoe: '#D9534F', face: C.ink, hair: '#2A1C18', extra: 'curls' },
  sis: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', limb: '#3A3446', line: '#14121C', shoe: '#F28C6A', face: C.ink, hair: '#3A2620', bust: true, extra: 'bunches' },
  mom: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#8A5A6A', jacketShade: '#704858', accent: '#E9C46A', limb: '#3A3446', line: '#14121C', shoe: '#5A4A6A', face: C.ink, hair: '#5A3226', bust: true, extra: 'bob' },
  suit: { skin: '#D9C6AE', skinShade: '#C2AE96', hand: '#D9C6AE', jacket: '#2B2F3A', jacketShade: '#20232C', accent: '#A8323E', limb: '#2B2F3A', line: '#0E0F14', shoe: '#14151A', face: C.ink, hair: '#17141A', extra: 'suit' },
  minh: { skin: '#EAC9A6', skinShade: '#D2AE86', hand: '#EAC9A6', jacket: '#55604A', jacketShade: '#434C3B', accent: '#8C6A48', limb: '#33303C', line: '#1A161E', shoe: '#231D1A', face: '#221B20', hair: '#1E1614', extra: 'short' },
  linh: { skin: '#F0D3B4', skinShade: '#D9B895', hand: '#F0D3B4', jacket: '#8B7B58', jacketShade: '#756748', accent: '#5E5440', limb: '#3B3542', line: '#191420', shoe: '#4A3E34', face: '#241C22', hair: '#2A1B16', bust: true, extra: 'long' },
  nina: { skin: '#FBE3CE', skinShade: '#EFC7AC', hand: '#FBE3CE', jacket: '#F7A8C4', jacketShade: '#DE7FA0', accent: '#FFF1B8', limb: '#FFF3E4', line: '#2A1E2E', shoe: '#FF9EC7', face: C.ink, hair: '#8A5A3B', pants: '#9B8BC4', pantsDark: '#7E6DA8', bust: true, hipX: 18, bulk: 1.15, extra: 'twintails' },
};

export type HandKind = 'open' | 'point';
export type Expr = 'neutral' | 'happy' | 'smug' | 'shock' | 'worried' | 'oops' | 'cool' | 'dizzy' | 'tired';
export type Limb = { a: number; b: number };
export type Pose = {
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  tilt: number;
  spin: number;
  headTilt: number;
  armL: Limb;
  armR: Limb;
  legL: Limb;
  legR: Limb;
  expr: Expr;
  blink: number;
  look: number;
  glasses: number;
  yaw: number;
  squash: number;
  handL: HandKind;
  handR: HandKind;
  sway: number;
  /** 0 = facing the viewer, 1 = back turned to the viewer (face hidden, back-of-head hair shown). */
  back?: number;
  /** Lateral shoe offset in px relative to the ankle; positive shifts the shoe toward screen-right. */
  shoeShift?: number;
  /** Which arm renders behind the torso; defaults to the far side of `yaw`. */
  armBack?: 'L' | 'R';
  glint?: number;
  glintColor?: string;
};

export const basePose: Pose = {
  x: 960,
  y: 700,
  scale: 1,
  facing: 1,
  tilt: 0,
  spin: 0,
  headTilt: 0,
  armL: { a: 10, b: -8 },
  armR: { a: 10, b: -8 },
  legL: { a: -6, b: 0 },
  legR: { a: 6, b: 0 },
  expr: 'neutral',
  blink: 0,
  look: 0,
  glasses: 0,
  yaw: 0,
  squash: 0,
  handL: 'open',
  handR: 'open',
  sway: 0,
  back: 0,
};

type Key = { f: number; p: Partial<Pose>; ease?: (t: number) => number };

const mixLimb = (a: Limb, b: Limb, t: number): Limb => ({ a: lerp(a.a, b.a, t), b: lerp(a.b, b.b, t) });

export const poseAt = (f: number, keys: Key[], from: Pose = basePose): Pose => {
  const full: { f: number; p: Pose; ease?: (t: number) => number }[] = [];
  let cur = from;
  for (const k of keys) {
    cur = { ...cur, ...k.p };
    full.push({ f: k.f, p: cur, ease: k.ease });
  }
  if (f <= full[0].f) return full[0].p;
  for (let i = 0; i < full.length - 1; i++) {
    const A = full[i];
    const B = full[i + 1];
    if (f <= B.f) {
      const t = (B.ease ?? easeInOut)((f - A.f) / Math.max(1e-6, B.f - A.f));
      return {
        x: lerp(A.p.x, B.p.x, t),
        y: lerp(A.p.y, B.p.y, t),
        scale: lerp(A.p.scale, B.p.scale, t),
        facing: t < 0.5 ? A.p.facing : B.p.facing,
        tilt: lerp(A.p.tilt, B.p.tilt, t),
        spin: lerp(A.p.spin, B.p.spin, t),
        headTilt: lerp(A.p.headTilt, B.p.headTilt, t),
        armL: mixLimb(A.p.armL, B.p.armL, t),
        armR: mixLimb(A.p.armR, B.p.armR, t),
        legL: mixLimb(A.p.legL, B.p.legL, t),
        legR: mixLimb(A.p.legR, B.p.legR, t),
        expr: A.p.expr,
        handL: A.p.handL,
        handR: A.p.handR,
        blink: lerp(A.p.blink, B.p.blink, t),
        look: lerp(A.p.look, B.p.look, t),
        glasses: lerp(A.p.glasses, B.p.glasses, t),
        yaw: lerp(A.p.yaw, B.p.yaw, t),
        back: lerp(A.p.back ?? 0, B.p.back ?? 0, t),
        shoeShift: lerp(A.p.shoeShift ?? 0, B.p.shoeShift ?? 0, t),
        armBack: t < 0.5 ? A.p.armBack : B.p.armBack,
        squash: lerp(A.p.squash, B.p.squash, t),
        sway: lerp(A.p.sway, B.p.sway, t),
      };
    }
  }
  return full[full.length - 1].p;
};

const UPPER_ARM = 62;
const FORE_ARM = 58;
const THIGH = 72;
const SHIN = 68;
const SHOULDER = { x: 42, y: -108 };
const HIP = { x: 28, y: 0 };
export const HEAD = { x: 0, y: -176, r: 62 };
export const LEG_LEN = THIGH + SHIN;

const rad = (d: number) => (d * Math.PI) / 180;
type P = { x: number; y: number };

export const tint = (c: string, f: number): string => {
  const n = [1, 3, 5].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16);
    return Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f)));
  });
  return `#${((n[0] << 16) | (n[1] << 8) | n[2]).toString(16).padStart(6, '0')}`;
};

const rot = (p: P, deg: number, c: P = { x: 0, y: 0 }): P => {
  const r = rad(deg);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(r) - dy * Math.sin(r), y: c.y + dx * Math.sin(r) + dy * Math.cos(r) };
};

export const turnWidth = (yaw: number) => 1 - 0.4 * Math.min(1, Math.abs(yaw));
export const limbSpread = (yaw: number) => 1 - 0.85 * Math.min(1, Math.abs(yaw));

export const joints = (pose: Pose, hipX: number = HIP.x) => {
  const side = (s: 1 | -1, limb: Limb, root: P, l1: number, l2: number, isLeg: boolean) => {
    const dir = isLeg ? pose.facing : s;
    const d1 = { x: dir * Math.sin(rad(limb.a)), y: Math.cos(rad(limb.a)) };
    const mid = { x: root.x + d1.x * l1, y: root.y + d1.y * l1 };
    const a2 = limb.a + limb.b;
    const d2 = { x: dir * Math.sin(rad(a2)), y: Math.cos(rad(a2)) };
    return { root, mid, end: { x: mid.x + d2.x * l2, y: mid.y + d2.y * l2 } };
  };
  const torsoRot = (p: P) => rot(p, pose.tilt);
  const sp = limbSpread(pose.yaw);
  const shL = { x: -SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const shR = { x: SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const armL = side(-1, pose.armL, shL, UPPER_ARM, FORE_ARM, false);
  const armR = side(1, pose.armR, shR, UPPER_ARM, FORE_ARM, false);
  const legL = side(-1, pose.legL, { x: -hipX * sp, y: 0 }, THIGH, SHIN, true);
  const legR = side(1, pose.legR, { x: hipX * sp, y: 0 }, THIGH, SHIN, true);
  const r = (o: { root: P; mid: P; end: P }) => ({ root: torsoRot(o.root), mid: torsoRot(o.mid), end: torsoRot(o.end) });
  return { armL: r(armL), armR: r(armR), legL, legR, head: torsoRot(HEAD) };
};

export const faceAt = (f: number, keys: [number, Expr][]): { expr: Expr; blink: number } => {
  let expr = keys[0][1];
  let blink = 0;
  for (let i = 0; i < keys.length; i++) {
    const [k, e] = keys[i];
    if (f >= k) expr = e;
    if (i > 0 && f >= k - 2 && f < k + 1) blink = 1;
  }
  return { expr, blink };
};

export const toWorld = (pose: Pose, p: P): P => {
  const spun = rot(p, pose.spin, { x: 0, y: -90 });
  return { x: pose.x + spun.x * pose.scale, y: pose.y + spun.y * pose.scale };
};

export const reachAngle = (pose: Pose, target: P) => {
  const sh = toWorld(pose, rot({ x: SHOULDER.x * limbSpread(pose.yaw) + pose.yaw * 6, y: SHOULDER.y }, pose.tilt));
  const world = (Math.atan2(target.x - sh.x, target.y - sh.y) * 180) / Math.PI;
  return world - pose.tilt;
};

const PUPIL = '#1B1830';
const SCLERA = '#F6EFE3';
const TEETH = '#F4EEE0';
const TONGUE = '#FF8A96';
const BLUSH = '#F0806E';

const TORSO_D = 'M -46 -112 Q 0 -124 46 -112 L 40 2 Q 0 12 -40 2 Z';
// female silhouette: wider through the bust, pinched at the waist, same hem
const TORSO_BUST_D =
  'M -48 -112 Q 0 -126 48 -112 C 54 -84 52 -58 42 -34 C 46 -12 44 4 40 8 Q 0 16 -40 8 C -44 4 -46 -12 -42 -34 C -52 -58 -54 -84 -48 -112 Z';

const Face: React.FC<{ expr: Expr; blink: number; look: number; glasses: number; yaw?: number; ink?: string; glint?: number; glintColor?: string }> = ({ expr, blink, look, glasses, yaw = 0, ink = C.ink, glint = 0, glintColor = '#8FF0FF' }) => {
  const ex = look * 8;
  const ay = Math.min(1, Math.abs(yaw));
  const farHidden = ay > 0.72;
  const farSide = yaw > 0 ? -1 : 1;
  const eyeY = HEAD.y - 4;
  const lid = expr === 'smug' || expr === 'cool' ? 0.44 : expr === 'tired' ? 0.58 : 0;
  const open = Math.max(0.08, 1 - Math.max(blink, lid));

  const eye = (cx: number) => {
    if (farHidden && Math.sign(cx) === farSide) return null;
    const px = cx + ex * 0.5;
    if (expr === 'happy') {
      return (
        <g>
          <path d={`M ${cx - 11} ${eyeY + 3} Q ${cx} ${eyeY - 10} ${cx + 11} ${eyeY + 3}`} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d={`M ${cx - 8} ${eyeY + 1} Q ${cx} ${eyeY - 5} ${cx + 8} ${eyeY + 1}`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.35} />
        </g>
      );
    }
    if (expr === 'oops') {
      return (
        <path
          d={`M ${cx - 9} ${eyeY - 6} L ${cx + 4} ${eyeY} L ${cx - 9} ${eyeY + 6}`}
          transform={cx > 0 ? `translate(${2 * cx},0) scale(-1,1)` : undefined}
          stroke={ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    if (expr === 'dizzy') {
      return (
        <g stroke={ink} strokeWidth={5} strokeLinecap="round">
          <path d={`M ${cx - 7} ${eyeY - 7} L ${cx + 7} ${eyeY + 7} M ${cx + 7} ${eyeY - 7} L ${cx - 7} ${eyeY + 7}`} />
        </g>
      );
    }
    if (blink >= 0.95) {
      return (
        <g>
          <path d={`M ${cx - 12} ${eyeY + 1} Q ${cx} ${eyeY + 8} ${cx + 12} ${eyeY + 1}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 15} Q ${cx} ${eyeY + 22} ${cx + 12} ${eyeY + 15}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
        </g>
      );
    }
    const big = expr === 'shock';
    const exy = eyeY + (lid ? 3 : 0);
    return (
      <g>
        {/* sclera + pupil + catchlight, squashed vertically as the lids close */}
        <g transform={`translate(${cx} ${exy}) scale(1 ${open}) translate(${-cx} ${-exy})`}>
          <ellipse cx={cx} cy={exy} rx={big ? 13 : 10.5} ry={big ? 14 : 11.5} fill={SCLERA} />
          <circle cx={px} cy={exy + 1.5} r={big ? 5.4 : 6} fill={PUPIL} />
          <circle cx={px - 2.4} cy={exy - 1.2} r={2} fill="#FFFFFF" opacity={0.9} />
        </g>
        {lid ? (
          <path
            d={expr === 'tired' ? `M ${cx - 13} ${eyeY - 1} Q ${cx} ${eyeY - 5} ${cx + 13} ${eyeY - 1}` : `M ${cx - 12} ${eyeY - 4} L ${cx + 12} ${eyeY - 2}`}
            stroke={ink}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />
        ) : null}
        {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 14} Q ${cx} ${eyeY + 21} ${cx + 12} ${eyeY + 14}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
      </g>
    );
  };

  const brows: Record<Expr, string> = {
    neutral: `M -30 ${eyeY - 21} Q -21 ${eyeY - 24} -13 ${eyeY - 21} M 13 ${eyeY - 21} Q 21 ${eyeY - 24} 30 ${eyeY - 21}`,
    happy: `M -31 ${eyeY - 23} Q -21 ${eyeY - 29} -12 ${eyeY - 23} M 12 ${eyeY - 23} Q 21 ${eyeY - 29} 31 ${eyeY - 23}`,
    smug: `M -34 ${eyeY - 22} L -12 ${eyeY - 20} M 12 ${eyeY - 26} L 34 ${eyeY - 30}`,
    shock: `M -32 ${eyeY - 28} Q -21 ${eyeY - 36} -10 ${eyeY - 29} M 10 ${eyeY - 29} Q 21 ${eyeY - 36} 32 ${eyeY - 28}`,
    worried: `M -32 ${eyeY - 18} L -12 ${eyeY - 26} M 12 ${eyeY - 26} L 32 ${eyeY - 18}`,
    oops: `M -32 ${eyeY - 20} L -12 ${eyeY - 16} M 12 ${eyeY - 16} L 32 ${eyeY - 20}`,
    cool: `M -34 ${eyeY - 23} L -12 ${eyeY - 22} M 12 ${eyeY - 22} L 34 ${eyeY - 25}`,
    dizzy: `M -32 ${eyeY - 20} Q -21 ${eyeY - 25} -12 ${eyeY - 20} M 12 ${eyeY - 24} Q 21 ${eyeY - 19} 32 ${eyeY - 24}`,
    tired: `M -33 ${eyeY - 17} Q -22 ${eyeY - 21} -11 ${eyeY - 19} M 11 ${eyeY - 19} Q 22 ${eyeY - 21} 33 ${eyeY - 17}`,
  };

  const mY = HEAD.y + 30;
  const mouth: Record<Expr, React.ReactNode> = {
    neutral: <path d={`M -9 ${mY} Q 0 ${mY + 4.5} 9 ${mY}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
    happy: (
      <g>
        <ellipse cx={0} cy={mY + 2} rx={14} ry={7} fill={ink} />
        <path d={`M -9 ${mY - 1} Q 0 ${mY + 2} 9 ${mY - 1} L 8 ${mY + 3} Q 0 ${mY + 5} -8 ${mY + 3} Z`} fill={TEETH} />
        <ellipse cx={0} cy={mY + 5.5} rx={6} ry={2.8} fill={TONGUE} opacity={0.9} />
      </g>
    ),
    smug: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
    shock: (
      <g>
        <ellipse cx={0} cy={mY + 3} rx={10} ry={13.5} fill={ink} />
        <path d={`M -6 ${mY - 7} Q 0 ${mY - 4} 6 ${mY - 7} L 6 ${mY - 1} Q 0 ${mY + 1} -6 ${mY - 1} Z`} fill={TEETH} opacity={0.9} />
      </g>
    ),
    worried: <path d={`M -16 ${mY + 4} Q -8 ${mY - 4} 0 ${mY + 4} Q 8 ${mY + 12} 16 ${mY + 4}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
    oops: (
      <g>
        <rect x={-18} y={mY - 6} width={36} height={16} rx={6} fill={ink} />
        <path d={`M -14 ${mY + 2} L 14 ${mY + 2}`} stroke="#fff" strokeWidth={3} />
      </g>
    ),
    cool: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
    dizzy: <path d={`M -14 ${mY + 4} Q -7 ${mY - 4} 0 ${mY + 4} Q 7 ${mY + 12} 14 ${mY + 4}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
    tired: <path d={`M -11 ${mY + 4} Q 0 ${mY} 11 ${mY + 4}`} stroke={ink} strokeWidth={4.5} fill="none" strokeLinecap="round" />,
  };

  return (
    <g transform={`translate(${yaw * 30} 0) scale(${1 - 0.28 * ay} 1)`}>
      {eye(-24)}
      {eye(24)}
      {brows[expr]
        ? brows[expr]
            .split(/(?=M\s)/)
            .map((d, k) =>
              farHidden && (k === 0 ? -1 : 1) === farSide ? null : (
                <path
                  key={k}
                  d={d}
                  stroke={ink}
                  strokeWidth={expr === 'neutral' ? 3.8 : 5}
                  opacity={expr === 'neutral' ? 0.55 : 1}
                  fill="none"
                  strokeLinecap="round"
                />
              ),
            )
        : null}
      {mouth[expr]}
      {expr === 'shock' || expr === 'oops' ? <path d={`M 52 ${HEAD.y - 30} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#8FD3FF" /> : null}
      {glint > 0.01 && blink < 0.95
        ? [-24, 24].map((cx) =>
            farHidden && Math.sign(cx) === farSide ? null : (
              <g key={`gl${cx}`} opacity={Math.min(1, glint)}>
                <circle cx={cx + ex * 0.5} cy={eyeY} r={17} fill={glintColor} opacity={0.2} />
                <circle cx={cx + ex * 0.5} cy={eyeY} r={12} fill={glintColor} opacity={0.28} />
                <ellipse cx={cx + ex * 0.5} cy={eyeY + (lid ? 3 : 0)} rx={8} ry={Math.max(2, 11 * open)} fill={glintColor} />
                <circle cx={cx + ex * 0.5 + 2.5} cy={eyeY - 3} r={2.6} fill="#FFFFFF" />
              </g>
            ),
          )
        : null}
      {glasses > 0.01 ? (
        <g opacity={glasses} transform={`translate(0 ${(1 - glasses) * -60})`}>
          <path d={`M -58 ${eyeY - 12} L 58 ${eyeY - 12}`} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <path d={`M -50 ${eyeY - 14} L -6 ${eyeY - 14} L -10 ${eyeY + 8} Q -28 ${eyeY + 18} -46 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M 6 ${eyeY - 14} L 50 ${eyeY - 14} L 46 ${eyeY + 8} Q 28 ${eyeY + 18} 10 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M -40 ${eyeY + 2} L -26 ${eyeY - 10} M 16 ${eyeY + 2} L 30 ${eyeY - 10}`} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </g>
      ) : null}
    </g>
  );
};

export const Hero: React.FC<{ pose: Pose; shadow?: number; rimId?: string; look?: Look }> = ({
  pose,
  shadow = 1,
  rimId = 'rimR',
  look = LOOKS.pipHood,
}) => {
  const L = look;
  const bulk = L.bulk ?? 1;
  const j = joints(pose, L.hipX);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const pants = L.pants ?? tint(L.jacket, 0.45);
  const pantsDark = L.pantsDark ?? tint(pants, 0.72);
  const hairLight = tint(L.hair, 1.55);
  const torsoD = L.bust ? TORSO_BUST_D : TORSO_D;

  const isCoolRim = rimId === 'rimBlue' || rimId === 'rimBlueL';
  const rimTint = isCoolRim ? '#A9C6FF' : '#FFB15A';

  const defs = (
    <defs>
      <radialGradient id={`${uid}sr`} cx="0.36" cy="0.3" r="0.95">
        <stop offset="0" stopColor={tint(L.skin, 1.1)} />
        <stop offset="0.55" stopColor={L.skin} />
        <stop offset="1" stopColor={L.skinShade} />
      </radialGradient>
      <linearGradient id={`${uid}j`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={tint(L.jacket, 1.16)} />
        <stop offset="0.5" stopColor={L.jacket} />
        <stop offset="1" stopColor={L.jacketShade} />
      </linearGradient>
      <linearGradient id={`${uid}sl`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={tint(L.limb, 1.16)} />
        <stop offset="0.5" stopColor={L.limb} />
        <stop offset="1" stopColor={tint(L.limb, 0.72)} />
      </linearGradient>
      <linearGradient id={`${uid}h`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tint(L.shoe, 1.2)} />
        <stop offset="1" stopColor={tint(L.shoe, 0.68)} />
      </linearGradient>
      <clipPath id={`${uid}fc`}>
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
      </clipPath>
      <clipPath id={`${uid}tc`}>
        <path d={torsoD} />
      </clipPath>
    </defs>
  );

  // jacketed arm: sleeve gradient, elbow shade, lit edge
  const armLimb = (o: { root: P; mid: P; end: P }, w: number) => {
    const d = `M ${o.root.x} ${o.root.y} L ${o.mid.x} ${o.mid.y} L ${o.end.x} ${o.end.y}`;
    return (
      <g>
        <path d={d} stroke={L.line} strokeWidth={w + 7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={`url(#${uid}sl)`} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={tint(L.limb, 1.4)} strokeWidth={w * 0.34} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} transform="translate(-1.6 -1.6)" />
        <circle cx={o.mid.x} cy={o.mid.y} r={w * 0.72} fill={tint(L.limb, 0.66)} opacity={0.42} />
      </g>
    );
  };

  // trouser leg: outline, pant colour, crease + lit edge, knee shade
  const leg = (o: { root: P; mid: P; end: P }) => {
    const d = `M ${o.root.x} ${o.root.y} L ${o.mid.x} ${o.mid.y} L ${o.end.x} ${o.end.y}`;
    return (
      <g>
        <path d={d} stroke={L.line} strokeWidth={19 * bulk} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={pants} strokeWidth={12 * bulk} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={pantsDark} strokeWidth={2.6 * bulk} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.55} transform="translate(-2.4 -1.4)" />
        <path d={d} stroke={tint(pants, 1.3)} strokeWidth={3.2 * bulk} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.35} transform="translate(1.8 -1.8)" />
        <circle cx={o.mid.x + 2} cy={o.mid.y} r={7 * bulk} fill={pantsDark} opacity={0.3} />
      </g>
    );
  };

  // sneaker: white-ish upper, two-tone sole, lace lines, toe cap
  const shoe = (o: { root: P; mid: P; end: P }) => {
    const cx = o.end.x + pose.facing * 3 + (pose.shoeShift ?? 0);
    const cy = o.end.y + 2;
    return (
      <g transform={`translate(${cx} ${cy}) scale(${pose.facing * bulk} ${bulk})`}>
        <path d="M -23 5 L 27 5 Q 31 5 31 9 L 29 14 Q 2 18 -25 14 Q -28 9 -23 5 Z" fill={tint(L.shoe, 0.5)} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M -21 -2 Q -23 4 -14 6 L 24 6 Q 30 2 28 -8 Q 20 -16 2 -16 L -12 -16 Q -19 -14 -21 -2 Z" fill={`url(#${uid}h)`} stroke={L.line} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M 12 -12 Q 24 -10 27 -4 L 24 4 Q 14 0 10 -8 Z" fill={tint(L.shoe, 0.78)} opacity={0.85} />
        <path d="M -19 1 L 25 1" stroke={tint(L.shoe, 0.5)} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        <path d="M -8 -12 L -2 -4 M 2 -13 L 8 -5 M 12 -12 L 17 -5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" opacity={0.6} />
        <path d="M -16 -12 Q -18 -2 -10 4" stroke="#FFFFFF" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.35} />
      </g>
    );
  };

  const hand = (o: { mid: P; end: P }, side: 1 | -1, kind: HandKind) => {
    const ang = (Math.atan2(o.end.x - o.mid.x, o.end.y - o.mid.y) * 180) / Math.PI;
    return (
      <g transform={`translate(${o.end.x} ${o.end.y}) rotate(${-ang}) scale(${bulk})`}>
        {kind === 'point' ? (
          <g>
            <rect x={-4} y={10} width={8} height={24} rx={4} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
            <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={L.hand} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={side * 10} cy={6} rx={4.5} ry={7} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
          </g>
        ) : (
          <g>
            <ellipse cx={side * 10} cy={3} rx={5.8} ry={9.2} transform={`rotate(${side * -28} ${side * 10} 3)`} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <ellipse cx={0} cy={10} rx={11.5} ry={15} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <path d="M -6 3 Q 0 1 6 4" stroke={tint(L.hand, 1.25)} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.6} />
            <path d="M -4 17 L -4 23 M 3 18 L 3 24" stroke={L.line} strokeWidth={2} opacity={0.45} strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };

  const cuff = (o: { mid: P; end: P }) => {
    const x = lerp(o.mid.x, o.end.x, 0.8);
    const y = lerp(o.mid.y, o.end.y, 0.8);
    return (
      <g>
        <circle cx={x} cy={y} r={9.2 * bulk} fill={L.jacketShade} stroke={L.line} strokeWidth={3 * bulk} />
        <path d={`M ${x - 5} ${y - 1} Q ${x} ${y + 3} ${x + 5} ${y - 1}`} stroke={tint(L.jacketShade, 1.4)} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
      </g>
    );
  };

  const kw = turnWidth(pose.yaw);
  const back = pose.back ?? 0;
  const armRBack = pose.armBack === 'R' || (pose.armBack === undefined && pose.yaw < 0);

  const torso = (
    <g transform={`rotate(${pose.tilt}) translate(${pose.yaw * 6} 0) scale(${kw} 1)`}>
      <path d={torsoD} fill={`url(#${uid}j)`} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
      <g clipPath={`url(#${uid}tc)`}>
        {/* cel shade on the shadow side + hem band */}
        <path d="M 34 -114 L 50 -112 L 46 6 L 36 10 Z" fill={L.jacketShade} opacity={0.4} />
        <path d="M -46 -110 L -34 -112 L -36 4 L -42 6 Z" fill={tint(L.jacket, 0.8)} opacity={0.22} />
        <path d="M -44 -9 Q 0 3 44 -9 L 42 5 Q 0 16 -42 5 Z" fill={L.jacketShade} opacity={0.9} />
        {L.bust ? (
          <g>
            {/* bust definition: two soft mounds + centre fold */}
            <ellipse cx={-15} cy={-98} rx={15} ry={9} fill={tint(L.jacket, 1.14)} opacity={0.4} />
            <ellipse cx={15} cy={-98} rx={15} ry={9} fill={tint(L.jacket, 1.14)} opacity={0.4} />
            <path d="M 0 -110 L 0 -88" stroke={L.jacketShade} strokeWidth={2.5} opacity={0.5} />
          </g>
        ) : null}
      </g>
      {/* collar */}
      <path d="M -38 -114 Q 0 -94 38 -114 Q 0 -102 -38 -114 Z" fill={L.jacketShade} opacity={0.95} />
      {L.extra === 'suit' ? (
        <g opacity={1 - back}>
          <path d="M -26 -116 L 0 -50 L 26 -116 Z" fill="#EDE8DE" />
          <path d="M -8 -112 L 8 -112 L 10 -98 L 6 -62 L 0 -53 L -6 -62 L -10 -98 Z" fill={L.accent} />
          <path d="M -28 -116 L 0 -50 M 28 -116 L 0 -50" stroke={L.line} strokeWidth={4} />
        </g>
      ) : L.extra === 'hood' || L.extra === 'curls' ? (
        <path d="M -22 -118 Q 0 -100 22 -118" stroke={L.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
      ) : (
        <g opacity={1 - back}>
          {/* inner shirt V + zipper + pockets */}
          <path d="M -13 -110 L 0 -88 L 13 -110 L 13 -103 L 0 -82 L -13 -103 Z" fill="#F4EEE0" opacity={0.92} />
          <path d="M 0 -84 L 0 4" stroke={L.jacketShade} strokeWidth={3.5} strokeLinecap="round" />
          <rect x={-4.5} y={-62} width={9} height={13} rx={3.5} fill={L.jacketShade} stroke={L.line} strokeWidth={2} />
          <path d="M -36 6 Q -34 16 -24 16 M 36 6 Q 34 16 24 16" stroke={L.jacketShade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      )}
    </g>
  );

  const neck = (
    <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt * 0.5} 0 ${HEAD.y + 40})`}>
      <rect x={-11} y={HEAD.y + 50} width={22} height={36} rx={10} fill={`url(#${uid}sr)`} stroke={L.line} strokeWidth={3} />
      <path d="M -9 54 Q 0 62 9 54" stroke={L.skinShade} strokeWidth={3} fill="none" opacity={0.55} />
    </g>
  );

  const head = (
    <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt} 0 ${HEAD.y + 40})`}>
      {/* back hair for the uncapped styles (pip, pipInk) */}
      {!L.extra ? (
        <path
          d="M -66 -178 C -74 -236 -36 -254 0 -254 C 36 -254 74 -236 66 -178 C 62 -146 54 -124 46 -114 L -46 -114 C -54 -124 -62 -146 -66 -178 Z"
          fill={L.hair}
        />
      ) : null}
      <g opacity={1 - back}>
        {([-1, 1] as const).map((sd) =>
          Math.abs(pose.yaw) > 0.5 && sd === (pose.yaw > 0 ? -1 : 1) ? null : (
            <g key={sd}>
              <ellipse cx={HEAD.x + sd * 58} cy={HEAD.y + 16} rx={7.5} ry={10} fill={L.skin} stroke={L.line} strokeWidth={3.5} />
              <path d={`M ${HEAD.x + sd * 57} ${HEAD.y + 12} Q ${HEAD.x + sd * 60} ${HEAD.y + 16} ${HEAD.x + sd * 57} ${HEAD.y + 20}`} stroke={L.skinShade} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            </g>
          ),
        )}
      </g>
      {/* face: round head with radial skin shading */}
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={`url(#${uid}sr)`} stroke={L.line} strokeWidth={4} />
      <g clipPath={`url(#${uid}fc)`}>
        <ellipse cx={48} cy={-158} rx={34} ry={62} fill={L.skinShade} opacity={0.4} />
        <path d="M -62 -198 C -28 -226 28 -226 62 -198 L 62 -180 C 28 -208 -28 -208 -62 -180 Z" fill={L.skinShade} opacity={0.45} />
      </g>
      <ellipse cx={-34} cy={HEAD.y + 26} rx={11} ry={6.5} fill={BLUSH} opacity={0.3} />
      <ellipse cx={34} cy={HEAD.y + 26} rx={11} ry={6.5} fill={BLUSH} opacity={0.3} />

      {/* front hair per style */}
      {!L.extra ? (
        <g>
          {/* bangs with jagged points + sheen + swaying cowlick */}
          <path
            d="M -64 -184 C -68 -230 -34 -248 0 -248 C 34 -248 68 -230 64 -184 C 56 -206 46 -216 36 -220 C 30 -204 20 -212 12 -224 C 4 -208 -6 -218 -16 -228 C -26 -214 -38 -206 -48 -198 C -56 -192 -62 -188 -64 -184 Z"
            fill={L.hair}
          />
          <g stroke={hairLight} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.6}>
            <path d="M -30 -230 Q -8 -242 16 -234" />
            <path d="M -14 -222 Q 4 -232 22 -224" />
          </g>
          <g transform={`rotate(${pose.sway * 0.5 + pose.headTilt * 0.15} 4 ${HEAD.y - 62})`}>
            <path d="M 2 -244 C -8 -260 6 -270 18 -260 C 8 -256 6 -250 8 -242 Z" fill={L.hair} />
            <path d="M 4 -252 Q 10 -260 16 -258" stroke={hairLight} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
          </g>
        </g>
      ) : null}
      {L.extra === 'bunches' ? (
        <g>
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`rotate(${pose.sway * 0.5} ${sd * 58} ${HEAD.y - 30})`}>
              <circle cx={sd * 72 - pose.yaw * 10} cy={HEAD.y - 24} r={24} fill={L.hair} stroke={L.line} strokeWidth={4} />
              <circle cx={sd * 55 - pose.yaw * 10} cy={HEAD.y - 30} r={8} fill={L.accent} />
            </g>
          ))}
          <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 22} Q -62 ${HEAD.y - 66} 0 ${HEAD.y - 66} Q 62 ${HEAD.y - 66} 60 ${HEAD.y - 22} Q 40 ${HEAD.y - 46} 14 ${HEAD.y - 40} Q 0 ${HEAD.y - 50} -14 ${HEAD.y - 40} Q -40 ${HEAD.y - 46} -60 ${HEAD.y - 22} Z`} fill={L.hair} />
        </g>
      ) : null}
      {L.extra === 'bob' ? (
        <path
          transform={`translate(${-pose.yaw * 12} 0)`}
          d={`M -74 ${HEAD.y + 34} Q -84 ${HEAD.y - 70} 0 ${HEAD.y - 72} Q 84 ${HEAD.y - 70} 74 ${HEAD.y + 34} L 56 ${HEAD.y + 34} Q 60 ${HEAD.y - 20} 40 ${HEAD.y - 40} Q 10 ${HEAD.y - 34} -16 ${HEAD.y - 48} Q -52 ${HEAD.y - 30} -56 ${HEAD.y + 34} Z`}
          fill={L.hair}
          stroke={L.line}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ) : null}
      {L.extra === 'suit' ? (
        <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 18} Q -64 ${HEAD.y - 70} 4 ${HEAD.y - 68} Q 64 ${HEAD.y - 64} 60 ${HEAD.y - 18} Q 52 ${HEAD.y - 44} 18 ${HEAD.y - 46} L 12 ${HEAD.y - 54} L 6 ${HEAD.y - 46} Q -44 ${HEAD.y - 46} -60 ${HEAD.y - 18} Z`} fill={L.hair} />
      ) : null}
      {L.extra === 'short' ? (
        <path transform={`translate(${-pose.yaw * 12} 0)`} d={`M -60 ${HEAD.y - 8} Q -66 ${HEAD.y - 74} 0 ${HEAD.y - 76} Q 66 ${HEAD.y - 74} 60 ${HEAD.y - 8} L 52 ${HEAD.y - 6} Q 48 ${HEAD.y - 44} 22 ${HEAD.y - 50} Q 2 ${HEAD.y - 40} -20 ${HEAD.y - 50} Q -46 ${HEAD.y - 44} -52 ${HEAD.y - 6} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
      ) : null}
      {L.extra === 'long' ? (
        <path transform={`translate(${-pose.yaw * 12} 0)`} d={`M -66 ${HEAD.y + 86} Q -82 ${HEAD.y - 62} 0 ${HEAD.y - 74} Q 82 ${HEAD.y - 62} 66 ${HEAD.y + 86} L 46 ${HEAD.y + 92} Q 50 ${HEAD.y - 16} 38 ${HEAD.y - 40} Q 12 ${HEAD.y - 34} -14 ${HEAD.y - 48} Q -50 ${HEAD.y - 28} -46 ${HEAD.y + 92} Z`} fill={L.hair} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
      ) : null}
      {L.extra === 'twintails' ? (
        <g>
          {([-1, 1] as const).map((sd) => (
            <g key={sd} transform={`rotate(${pose.sway * 0.6 - pose.yaw * 15} ${sd * 56} ${HEAD.y - 30})`}>
              <path
                d={`M ${sd * 48} ${HEAD.y - 60} C ${sd * 98} ${HEAD.y - 48} ${sd * 106} ${HEAD.y - 4} ${sd * 92} ${HEAD.y + 44} C ${sd * 84} ${HEAD.y + 84} ${sd * 68} ${HEAD.y + 96} ${sd * 58} ${HEAD.y + 80} C ${sd * 62} ${HEAD.y + 34} ${sd * 56} ${HEAD.y - 4} ${sd * 40} ${HEAD.y - 34} Z`}
                fill={L.hair}
                stroke={L.line}
                strokeWidth={4}
                strokeLinejoin="round"
              />
              <path
                d={`M ${sd * 62} ${HEAD.y - 26} Q ${sd * 80} ${HEAD.y + 16} ${sd * 72} ${HEAD.y + 62}`}
                stroke={hairLight}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                opacity={0.5}
              />
              <g transform={`translate(${sd * 52} ${HEAD.y - 32}) rotate(${sd * 14})`}>
                <path d="M 0 0 L -22 -11 Q -28 0 -22 11 Z" fill={L.accent} stroke={L.line} strokeWidth={3} strokeLinejoin="round" />
                <path d="M 0 0 L 22 -11 Q 28 0 22 11 Z" fill={L.accent} stroke={L.line} strokeWidth={3} strokeLinejoin="round" />
                <circle r={5.5} fill={tint(L.accent, 0.85)} stroke={L.line} strokeWidth={3} />
              </g>
            </g>
          ))}
          <path
            transform={`translate(${-pose.yaw * 12} 0)`}
            d={`M -60 ${HEAD.y - 22} Q -64 ${HEAD.y - 70} 0 ${HEAD.y - 72} Q 64 ${HEAD.y - 70} 60 ${HEAD.y - 22} Q 42 ${HEAD.y - 48} 14 ${HEAD.y - 42} Q 0 ${HEAD.y - 54} -14 ${HEAD.y - 42} Q -42 ${HEAD.y - 48} -60 ${HEAD.y - 22} Z`}
            fill={L.hair}
            stroke={L.line}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path
            transform={`translate(${-pose.yaw * 12} 0)`}
            d={`M -34 ${HEAD.y - 56} L -22 ${HEAD.y - 40} L -12 ${HEAD.y - 52} L 0 ${HEAD.y - 38} L 12 ${HEAD.y - 52} L 22 ${HEAD.y - 40} L 34 ${HEAD.y - 56} Q 18 ${HEAD.y - 46} 0 ${HEAD.y - 48} Q -18 ${HEAD.y - 46} -34 ${HEAD.y - 56} Z`}
            fill={L.hair}
          />
        </g>
      ) : null}

      {/* hair sheen on the capped styles */}
      {L.extra === 'curls' ? (
        [-150, -125, -100, -78, -55, -30].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return <circle key={deg} cx={Math.cos(a) * 54 - 7} cy={HEAD.y + Math.sin(a) * 54 - 7} r={9} fill={hairLight} opacity={0.55} />;
        })
      ) : L.extra === 'bunches' ? (
        <g stroke={hairLight} strokeWidth={3.5} fill="none" opacity={0.5} strokeLinecap="round" transform={`translate(${-pose.yaw * 14} 0)`}>
          <path d={`M -40 ${HEAD.y - 58} Q 0 ${HEAD.y - 66} 40 ${HEAD.y - 58}`} />
          <path d={`M -16 ${HEAD.y - 62} Q 0 ${HEAD.y - 68} 16 ${HEAD.y - 62}`} />
        </g>
      ) : L.extra ? (
        <g stroke={hairLight} strokeWidth={3.5} fill="none" opacity={0.5} strokeLinecap="round" transform={`translate(${-pose.yaw * 12} 0)`}>
          <path d={`M -34 ${HEAD.y - 58} Q -16 ${HEAD.y - 70} 2 ${HEAD.y - 64}`} />
          <path d={`M 8 ${HEAD.y - 66} Q 26 ${HEAD.y - 72} 38 ${HEAD.y - 58}`} />
          <path d={`M -10 ${HEAD.y - 68} Q 2 ${HEAD.y - 74} 14 ${HEAD.y - 66}`} />
        </g>
      ) : null}

      <g opacity={1 - back}>
        <Face expr={pose.expr} blink={pose.blink} look={pose.look} glasses={pose.glasses} yaw={pose.yaw} ink={L.face} glint={pose.glint} glintColor={pose.glintColor} />
      </g>

      {/* back of the head: hair cap shown instead of the face when the character has turned around */}
      <g opacity={back}>
        <path
          d="M -72 -166 C -82 -244 -40 -262 0 -262 C 40 -262 82 -244 72 -166 C 76 -114 44 -98 0 -98 C -44 -98 -76 -114 -72 -166 Z"
          fill={L.hair}
          stroke={L.line}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <g stroke={hairLight} strokeWidth={3.5} fill="none" opacity={0.5} strokeLinecap="round">
          <path d="M -32 -238 Q -12 -250 10 -242" />
          <path d="M -10 -230 Q 8 -240 26 -232" />
        </g>
        {L.extra === 'twintails' ? (
          <path d="M 0 -252 Q 7 -212 0 -128" stroke={tint(L.hair, 0.7)} strokeWidth={4} fill="none" opacity={0.7} />
        ) : null}
      </g>

      {L.extra === 'curls'
        ? [-150, -125, -100, -78, -55, -30].map((deg, k) => {
            const a = (deg * Math.PI) / 180;
            return <circle key={k} cx={Math.cos(a) * 54} cy={HEAD.y + Math.sin(a) * 54} r={24} fill={L.hair} />;
          })
        : null}
    </g>
  );

  return (
    <g>
      {defs}
      {shadow > 0 ? (
        <ellipse
          cx={pose.x}
          cy={pose.y + LEG_LEN * pose.scale + 10}
          rx={70 * pose.scale}
          ry={12 * pose.scale}
          fill={isCoolRim ? '#091126' : '#000000'}
          opacity={0.26 * shadow}
        />
      ) : null}
      <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90)`} filter={`url(#${rimId})`}>
        <g transform={`translate(0 ${LEG_LEN}) scale(${1 + 0.6 * pose.squash} ${1 - pose.squash}) translate(0 ${-LEG_LEN})`}>
          {pose.yaw < 0 ? (
            <>{leg(j.legR)}{shoe(j.legR)}{leg(j.legL)}{shoe(j.legL)}</>
          ) : (
            <>{leg(j.legL)}{shoe(j.legL)}{leg(j.legR)}{shoe(j.legR)}</>
          )}
          {armRBack ? (
            <>{armLimb(j.armR, 11 * bulk)}{cuff(j.armR)}{hand(j.armR, -1, pose.handR)}</>
          ) : (
            <>{armLimb(j.armL, 11 * bulk)}{cuff(j.armL)}{hand(j.armL, 1, pose.handL)}</>
          )}
          {torso}
          {armRBack ? (
            <>{armLimb(j.armL, 11 * bulk)}{cuff(j.armL)}{hand(j.armL, 1, pose.handL)}</>
          ) : (
            <>{armLimb(j.armR, 11 * bulk)}{cuff(j.armR)}{hand(j.armR, -1, pose.handR)}</>
          )}
          {L.extra === 'hood' ? (
            <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt * 0.5} 0 ${HEAD.y + 40})`}>
              <path
                d={`M -70 ${HEAD.y + 14} Q -80 ${HEAD.y - 74} 0 ${HEAD.y - 80} Q 80 ${HEAD.y - 74} 70 ${HEAD.y + 14} Q 52 -100 0 -106 Q -52 -100 -70 ${HEAD.y + 14} Z`}
                fill={L.jacket}
                stroke={L.line}
                strokeWidth={4}
              />
              <path
                d={`M -62 ${HEAD.y + 8} Q -68 ${HEAD.y - 62} 0 ${HEAD.y - 68} Q 68 ${HEAD.y - 62} 62 ${HEAD.y + 8}`}
                stroke={rimTint}
                strokeWidth={2.5}
                fill="none"
                opacity={0.22}
              />
              {(() => {
                const sw = pose.sway * 0.7 - pose.tilt * 0.6;
                return (
                  <g>
                    <path d={`M -12 -108 Q ${-14 + sw * 0.3} -88 ${-16 + sw} -66 M 12 -108 Q ${14 + sw * 0.3} -88 ${16 + sw} -66`} stroke={L.accent} strokeWidth={5} strokeLinecap="round" fill="none" />
                    <circle cx={-16 + sw} cy={-64} r={5.2} fill={L.accent} stroke={L.line} strokeWidth={2} />
                    <circle cx={16 + sw} cy={-64} r={5.2} fill={L.accent} stroke={L.line} strokeWidth={2} />
                  </g>
                );
              })()}
            </g>
          ) : null}
          {L.extra === 'curls' ? (
            <g transform={`rotate(${pose.tilt})`}>
              <path d="M -46 -110 Q 0 -86 46 -110" stroke="#E06A5A" strokeWidth={8} fill="none" strokeLinecap="round" />
              <rect x={-60} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
              <rect x={40} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
            </g>
          ) : null}
          {neck}
          {head}
        </g>
      </g>
    </g>
  );
};

export const Actor = Hero;

export const walkPose = (
  x: number,
  phase: number,
  ground: number | ((x: number) => number),
  scale = 0.9,
  extra: Partial<Pose> = {},
  facing: 1 | -1 = 1,
): Pose => {
  const s = Math.sin(phase);
  const g = typeof ground === 'number' ? ground : ground(x);
  return {
    ...basePose,
    x,
    y: g - LEG_LEN * scale - Math.abs(Math.cos(phase)) * 7,
    scale,
    facing,
    yaw: facing,
    tilt: 5 * facing,
    headTilt: 2 * Math.sin(phase * 2),
    sway: 10 * Math.sin(phase + 0.8),
    legL: { a: 28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2)) },
    legR: { a: -28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    armR: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    ...extra,
  };
};

export type TurnDir = 'left' | 'right' | 'front' | 'back';

/**
 * The four facing actions as ready-made pose deltas: body turn (yaw), rear view (back), gaze (look) and
 * hair swing (sway, which the long styles trail on) all move together. Merge over any base pose:
 *   poseAt(f, keys, { ...basePose, ...turnPose('left') })
 */
export const turnPose = (dir: TurnDir, extra: Partial<Pose> = {}): Partial<Pose> => {
  const base: Partial<Pose> = {
    yaw: 0,
    back: 0,
    tilt: 0,
    shoeShift: 0,
    look: 0,
    headTilt: 0,
    sway: 0,
    expr: 'neutral',
    armL: { a: 12, b: -10 },
    armR: { a: 12, b: -10 },
    // legs straight, angled out so the ankles land at the usual cast spacing even with a narrow hipX
    legL: { a: -8, b: 0 },
    legR: { a: 8, b: 0 },
  };
  switch (dir) {
    // a lean, not a turn: small yaw keeps both eyes, feet drift toward the lean side
    case 'left':
      return {
        ...base,
        yaw: -0.35,
        tilt: -5,
        shoeShift: -14,
        armBack: 'L',
        look: -0.45,
        headTilt: 4,
        sway: 0,
        armL: { a: 26, b: -14 },
        expr: 'happy',
        ...extra,
      };
    case 'right':
      return {
        ...base,
        yaw: 0.35,
        tilt: 5,
        shoeShift: 14,
        armBack: 'R',
        look: 0.45,
        headTilt: -4,
        sway: 0,
        armR: { a: 26, b: -14 },
        expr: 'happy',
        ...extra,
      };
    case 'back':
      return { ...base, back: 1, yaw: 0, look: 0, headTilt: -6, armL: { a: 20, b: -22 }, armR: { a: 20, b: -22 }, expr: 'happy', ...extra };
    default:
      return { ...base, expr: 'happy', ...extra };
  }
};

export const feetBelowHips = (scale: number) => LEG_LEN * scale;
