import React from 'react';
import { ShotProps, Pose, Expr, Look } from '../../../engine';
import * as K from './common';

// Spec-driven shot builder for the back half of red-string. Each shot is a data spec
// rendered by <Auto/>: set + camera keys + figures (walk or pose keys) + the red
// string + optional props/fx/bubbles. Keeps 250+ shots writable in compact tables.

const {
  ALEX, MAYA, SAM, GIRL, LOOKS,
  Hallway, HallForeground, HALL, Cafeteria, CafKid, Library, Gate, Courtyard, Kiosk,
  DawnRoom, Cls, Bedroom, bedSit, BedDuvet, LAMP, RedString, Lunchbox, Sandwich, NotebookProp, DrinkCup,
  LaptopScreen, PhoneMsg, Scissors, DizzyStars,
  Tag, FloatLabel, Glow, Say, Toast,
  camT, kf, clamp, lerp, easeInOut, easeOut, easeIn, backOut, settle, spring, shake, rnd,
  poseAt, faceAt, idle, walkPose, joints, toWorld, pinky,
  INK, PAPER, RED, RED_DARK, RED_GLOW, FONT,
} = K;

export type LookKey = 'alex' | 'maya' | 'sam' | 'girl' | 'teacher' | 'mom';
export const LOOK: Record<LookKey, Look> = {
  alex: ALEX, maya: MAYA, sam: SAM, girl: GIRL, teacher: LOOKS.suit, mom: LOOKS.mom,
};

type Pt = [number, number];
type Anchor = { f: number; side?: 'L' | 'R' } | { p: Pt };

export type Fig = {
  k: LookKey;
  x: number;
  y?: number;
  s?: number;
  flip?: 1 | -1;
  /** walk x from→to across the shot (uses walkPose) */
  walk?: [number, number];
  /** facing for walkers (default: direction of travel) */
  dir?: 1 | -1;
  /** pose keyframes as [fracOfLen, Partial<Pose>] */
  keys?: [number, Partial<Pose>][];
  /** expression keys as [fracOfLen, Expr] */
  exprs?: [number, Expr][];
  /** static pose extras (merged last) */
  pose?: Partial<Pose>;
  /** hide the figure (for string-only shots) */
  hide?: boolean;
};

export type SaySpec = {
  text: string;
  fig?: number;          // bubble floats above this figure
  at?: number;           // frac of len (default 0.05)
  until?: number;        // frac of len (default 0.95)
  side?: 'above' | 'right' | 'left';
  maxW?: number;
  fs?: number;
};

export type Spec = {
  set?: 'hallway' | 'cafeteria' | 'library' | 'gate' | 'courtyard' | 'kiosk' | 'dawn' | 'classroom' | 'bedroom' | 'none';
  cam?: [number, number, number, number][]; // [frac, cx, cy, zoom]
  figs?: Fig[];
  str?: {
    a: Anchor; b: Anchor;
    slack?: number | number[];
    glow?: number | number[];
    pulse?: number;
    width?: number;
    crack?: number | number[];
    crackAt?: number;
    gone?: number | number[];
  };
  props?: React.ReactNode;   // world-space, inside cam group
  propsFn?: (t: number) => React.ReactNode; // animated props
  fx?: {
    shakeAt?: number;       // absolute frame of impact
    shakeAmp?: number;
    burstAt?: number;       // starburst at string midpoint
    hearts?: boolean;
    streaks?: boolean;
    dizzyFig?: number;      // DizzyStars over fig index
    dark?: number;          // extra vignette darkness 0..1
    tag?: string;
  };
  say?: SaySpec[];
};

const SETS: Record<string, React.FC<{ t: number; id?: string }>> = {
  hallway: ({ t }) => <><Hallway t={t} /><HallForeground t={t} /></>,
  cafeteria: ({ t }) => <Cafeteria t={t} />,
  library: ({ t }) => <Library t={t} />,
  gate: ({ t }) => <Gate t={t} />,
  courtyard: ({ t }) => <Courtyard t={t} />,
  kiosk: ({ t }) => <Kiosk t={t} />,
  dawn: ({ t }) => <DawnRoom t={t} />,
  classroom: ({ t }) => <Cls t={t} />,
  bedroom: ({ t }) => <Bedroom t={t + 20} clock="23:47" lamp={0.55} duvet={false} />,
};

const anchorPt = (a: Anchor, poses: (Pose | null)[]): Pt => {
  if ('p' in a) return a.p;
  const p = poses[a.f];
  if (!p) return [960, 540];
  const w = pinky(p, a.side ?? 'R');
  return [w.x, w.y];
};

export const Auto: React.FC<ShotProps & { spec: Spec }> = ({ t, len, spec }) => {
  const figs = spec.figs ?? [];
  const poses: (Pose | null)[] = figs.map((fg) => {
    if (fg.hide) return null;
    const y = fg.y ?? 830;
    const s = fg.s ?? 0.95;
    let base: Pose;
    if (fg.walk) {
      const p = clamp(t / Math.max(1, len));
      const dir: 1 | -1 = fg.dir ?? (fg.walk[1] >= fg.walk[0] ? 1 : -1);
      base = walkPose(lerp(fg.walk[0], fg.walk[1], easeInOut(p)), t * 0.42, y, s, {}, dir);
    } else {
      base = idle(fg.x, y, s, { yaw: fg.flip === -1 ? -0.35 : 0.35, look: fg.flip === -1 ? -0.3 : 0.3 });
    }
    // frac pose keys → absolute frame keys
    const keys: { f: number; p: Partial<Pose>; ease?: (u: number) => number }[] = [
      { f: 0, p: {} },
      ...(fg.keys ?? []).map(([fr, p]) => ({ f: Math.round(fr * len), p })),
    ];
    let pose = poseAt(t, keys, base);
    if (fg.exprs) pose = { ...pose, ...faceAt(t, fg.exprs.map(([fr, e]) => [fr * len, e] as [number, Expr])) };
    if (fg.pose) pose = { ...pose, ...fg.pose };
    return pose;
  });

  // camera: drop generic slow zoom drift (range < 0.35) — zoom only for motivated moves
  const camIn = spec.cam ?? [[0, 960, 545, 1.5], [1, 960, 545, 1.55]];
  const zs = camIn.map((c) => c[3]);
  const cam = Math.max(...zs) - Math.min(...zs) < 0.35
    ? camIn.map((c) => [c[0], c[1], c[2], zs[0]] as [number, number, number, number])
    : camIn;
  const cx = kf(t, cam.map(([fr, x]) => [fr * len, x] as [number, number]));
  const cy = kf(t, cam.map(([fr, , y]) => [fr * len, y] as [number, number]));
  const cz = kf(t, cam.map(([fr, , , z]) => [fr * len, z] as [number, number]));

  const str = spec.str;
  let strEl: React.ReactNode = null;
  if (str) {
    const [ax, ay] = anchorPt(str.a, poses);
    const [bx, by] = anchorPt(str.b, poses);
    const slack = Array.isArray(str.slack) ? lerp(str.slack[0], str.slack[1], clamp(t / len)) : (str.slack ?? 0.35);
    const glow = Array.isArray(str.glow) ? lerp(str.glow[0], str.glow[1], clamp(t / len)) : (str.glow ?? 0.7);
    const gone = Array.isArray(str.gone) ? lerp(str.gone[0], str.gone[1], clamp(t / len)) : (str.gone ?? 0);
    strEl = (
      <RedString x1={ax} y1={ay} x2={bx} y2={by} slack={slack} glow={glow} pulse={str.pulse ?? 0}
        t={t} width={str.width ?? 4} crack={Array.isArray(str.crack) ? lerp(str.crack[0], str.crack[1], clamp(t / len)) : (str.crack ?? 0)} crackAt={str.crackAt ?? 0.5} gone={gone} />
    );
  }

  // fx
  const sh = spec.fx?.shakeAt != null ? shake(t, spec.fx.shakeAt, 12, spec.fx.shakeAmp ?? 14) : { x: 0, y: 0 };
  let burst: React.ReactNode = null;
  if (spec.fx?.burstAt != null) {
    const bp = clamp((t - spec.fx.burstAt) / 14);
    if (bp > 0 && bp < 1) {
      burst = (
        <g transform={`translate(1075 700) scale(${0.4 + bp * 1.6})`} opacity={1 - bp}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <path key={i} d={`M ${Math.cos(a) * 20} ${Math.sin(a) * 20} L ${Math.cos(a) * 70} ${Math.sin(a) * 70}`} stroke="#FFE9B0" strokeWidth={7} strokeLinecap="round" />;
          })}
          <circle r={26} fill="#FFF" opacity={0.8} />
        </g>
      );
    }
  }
  const hearts = spec.fx?.hearts ? [0, 1, 2].map((i) => {
    const k = (t * 0.5 + i * 0.33) % 1;
    return <path key={i} d={`M ${980 + i * 90} ${660 - k * 170} c -8 -10 -20 -4 -15 6 c 3 6 15 12 15 12 c 0 0 12 -6 15 -12 c 5 -10 -7 -16 -15 -6 Z`} fill="#E86A92" opacity={(1 - k) * 0.7} />;
  }) : null;
  const streaks = spec.fx?.streaks ? [0, 1, 2, 3, 4].map((i) => {
    const a = (i / 5) * Math.PI * 2 + t * 0.05;
    const r0 = 120 + (i % 3) * 40;
    return <line key={i} x1={960 + Math.cos(a) * r0} y1={700 + Math.sin(a) * r0 * 0.7} x2={960 + Math.cos(a) * (r0 + 70)} y2={700 + Math.sin(a) * (r0 + 70) * 0.7} stroke="#F4EEE0" strokeWidth={5} opacity={0.35} strokeLinecap="round" />;
  }) : null;

  const Bg = spec.set && spec.set !== 'none' ? SETS[spec.set] : null;

  // world→screen for bubbles
  const w2s = (wx: number, wy: number): Pt => [(wx - cx) * cz + 960, (wy - cy) * cz + 540];

  return (
    <>
      <g transform={camT(cx, cy, cz)}>
        {Bg ? <Bg t={t} /> : null}
        <g transform={`translate(${sh.x} ${sh.y})`}>
          {streaks}
          {hearts}
          {burst}
          {poses.map((p, i) => p && figs[i] && !figs[i].hide ? (
            <K.Hero key={i} look={LOOK[figs[i].k]} pose={p} rimId="rimR" shadow={0.5} />
          ) : null)}
          {spec.fx?.dizzyFig != null && poses[spec.fx.dizzyFig] ? (
            <DizzyStars x={poses[spec.fx.dizzyFig]!.x} y={poses[spec.fx.dizzyFig]!.y - 240 * (poses[spec.fx.dizzyFig]!.scale || 1)} t={t} rx={80} ry={36} />
          ) : null}
          {strEl}
          {spec.props}
          {spec.propsFn?.(t)}
        </g>
        {spec.fx?.dark ? <rect x={0} y={0} width={1920} height={1080} fill="#0A0710" opacity={spec.fx.dark} /> : null}
        {spec.fx?.tag ? <Tag x={960} y={120} t={t} text={spec.fx.tag} /> : null}
      </g>
      {(spec.say ?? []).map((s, i) => {
        const at = Math.round((s.at ?? 0.05) * len);
        const until = Math.round((s.until ?? 0.95) * len);
        let bx = 960, by = 300, tx = 960, ty = 500;
        if (s.fig != null && poses[s.fig]) {
          const p = poses[s.fig]!;
          const head = toWorld(p, joints(p).head);
          const chest = toWorld(p, { x: 0, y: -110 * p.scale });
          const [, sy] = w2s(p.x, p.y - 330 * p.scale);
          const [txx, tyy] = w2s(chest.x, chest.y);
          bx = 960 + (s.side === 'left' ? -260 : s.side === 'right' ? 260 : 0);
          by = sy;
          tx = txx; ty = tyy;
          void head;
        }
        return <Say key={i} x={bx} y={by} tx={tx} ty={ty} text={s.text} at={at} until={until} t={t} maxW={s.maxW ?? 560} fs={s.fs ?? 40} />;
      })}
    </>
  );
};

/** Shot factory: spec → ShotMap entry. */
export const S = (spec: Spec) => {
  const C: React.FC<ShotProps> = (p) => <Auto {...p} spec={spec} />;
  return C;
};

export { camT, kf, clamp, lerp, easeInOut, easeOut, easeIn, backOut, settle, spring, shake, rnd, poseAt, faceAt, idle, walkPose, joints, toWorld, pinky, LOOKS, HALL, INK, PAPER, RED, RED_DARK, RED_GLOW, FONT, Tag, FloatLabel, Glow, Say, Toast, Lunchbox, Sandwich, NotebookProp, DrinkCup, bedSit, BedDuvet, LAMP, LaptopScreen, PhoneMsg, Scissors, DizzyStars, CafKid, ALEX, MAYA, SAM, GIRL };
