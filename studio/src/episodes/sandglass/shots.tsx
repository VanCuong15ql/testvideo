import React from 'react';
import {
  LightVeil, DrawOn,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, settle, camT, LOOKS, LEG_LEN, HEAD, joints, toWorld, reachAngle,
  Workshop, Bench, Stool, WORKSHOP, benchTop, SHOP_LAMP, stand, Tabletop, Glow, Dust, Foreground, Hourglass, TitleCard, Tag, Toast, FloatLabel, FocusRings,
  ShotProps,
} from '../../engine';

// "Chiếc đồng hồ cát trong tiệm sửa đồ cũ" — a quiet story episode: Minh keeps the old repair shop, Linh brings him
// a broken hourglass. No power look; the drama is in the light, the rain and the hands. 76 shots on the workshop set.

const MINH = LOOKS.minh;
const LINH = LOOKS.linh;
const SAND = '#D8B26E';
const SAND_DARK = '#B98E4E';
const WOOD = '#5B4038';
const WOOD_L = '#7A5747';
const WOOD_D = '#3A2826';
const BRASS = '#C9A15A';

// Minh stands behind the bench at u 0.42; Linh sits on the stool at u 0.6, w 0.55.
const MINH_STAND = stand(WORKSHOP, 0.42, 0.1);
const LINH_STOOL = WORKSHOP.P(0.6, 0.8, 0.55);

/** A seated pose: hips on the stool seat, knees forward, feet on the floor. */
const sitPose = (x: number, y: number, scale: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose,
  x,
  y: y - 40 * scale,
  scale,
  legL: { a: 78, b: -70 },
  legR: { a: 72, b: -66 },
  ...extra,
});

/** A small drawn object on the bench: a zippo, a doll, a notebook — flat shapes in the kit's style. */
const Zippo: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-16} y={-26} width={32} height={52} rx={6} fill="#B9B2A0" stroke="#6E6A60" strokeWidth={2} />
    <rect x={-16} y={-26} width={32} height={10} rx={4} fill="#D4CEC0" />
    <rect x={-4} y={-32} width={8} height={8} rx={2} fill="#8A8578" />
    <path d="M -10 -6 L 10 -6" stroke="#8A8578" strokeWidth={2} opacity={0.6} />
  </g>
);

const Doll: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-34} r={13} fill="#E2C6B0" stroke="#8A6A52" strokeWidth={1.5} />
    <path d="M -13 -40 Q 0 -52 13 -40 L 11 -34 Q 0 -44 -11 -34 Z" fill="#6A4A3A" />
    <path d="M -11 -20 L 11 -20 L 13 8 L -13 8 Z" fill="#7A9AA8" stroke="#5A7A88" strokeWidth={1.5} />
    <rect x={-8} y={8} width={6} height={16} fill="#E2C6B0" />
    <rect x={2} y={8} width={6} height={16} fill="#E2C6B0" />
  </g>
);

const Notebook: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-24} y={-34} width={48} height={68} rx={4} fill="#5A4A3E" />
    <rect x={-24} y={-34} width={10} height={68} fill="#4A3C32" />
    <path d="M -8 -18 L 16 -18 M -8 -6 L 16 -6 M -8 6 L 10 6" stroke="#8A7A62" strokeWidth={2} opacity={0.7} />
    <circle cx={18} cy={-24} r={4} fill="#8A5A50" opacity={0.5} />
  </g>
);

/** A tiny drawn screw jar / part for the shelf inserts. */
const Jar: React.FC<{ x: number; y: number; w?: number; h?: number; c?: string }> = ({ x, y, w = 18, h = 26, c = '#B9C6C2' }) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx={4} fill={c} opacity={0.75} />
    <rect x={x - w / 2 - 1} y={y - h - 6} width={w + 2} height={7} rx={3} fill={WOOD_D} />
  </g>
);

// =====================================================================
// ACT I — the shop, Minh, the things people bring (S1-S8)
// =====================================================================

// S1: wide establishing — the whole shop in the rain, Minh small behind the bench
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x + 10, y: MINH_STAND.y, scale: MINH_STAND.scale * 0.92, yaw: 0.2, look: 0.3, armL: { a: 12, b: -8 }, armR: { a: 20, b: -10 } } },
    { f: 40, p: { armR: { a: 30, b: -6 } } },
    { f: 90, p: { look: -0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), 540, kf(t, [[0, 0.82], [len, 0.88]]))}>
      <Workshop t={t} id="s1" veil={0.42} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.7} />
      <Foreground blur={10}>
        <path d="M 40 1080 Q 120 820 260 760 Q 200 900 240 1080 Z" fill="#0E0A08" />
        <path d="M 1880 1080 Q 1800 860 1700 800 Q 1760 920 1720 1080 Z" fill="#0C0806" />
      </Foreground>
    </g>
  );
};

// S2: medium — Minh under the lamp, title over the room
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.35, look: 0.5, armL: { a: 10, b: -8 }, armR: { a: 24, b: -12 } } },
    { f: 60, p: { armR: { a: 34, b: -8 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), 600, kf(t, [[0, 1.75], [len, 1.85]]))}>
      <Workshop t={t + 30} id="s2" veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <TitleCard t={t} lines={['CHIẾC ĐỒNG HỒ CÁT', 'TRONG TIỆM SỬA ĐỒ CŨ']} accent="ĐỒNG HỒ" accentT={50} size={92} y={150} />
    </g>
  );
};

// S3: close-up — his eyes, calm; lamp warm on one side
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 620 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.18, look: 0.2, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'neutral'], [50, 'tired']]) };
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1], [len, 1.06]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -420) scale(1.7)">
          <Workshop t={t + 55} id="s3" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.3} />
      <Hero look={MINH} pose={pose} rimId="rimR" shadow={0} />
      <Glow x={SHOP_LAMP().x} y={SHOP_LAMP().y - 60} r={500} o={0.2} />
    </g>
  );
};

// S4: medium — the bench with the cheap objects; he turns one in his hands
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const turn = Math.sin(clamp(t / 30) * Math.PI) * 18;
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.45, look: 0.7, armL: { a: 30, b: 20 }, armR: { a: 60, b: 40 } } },
    { f: 20, p: { armR: { a: 45, b: 30 }, look: 0.4 } },
    { f: 50, p: { armR: { a: 55, b: 35 }, look: 0.6 } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 620, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Workshop t={t + 80} id="s4" bench={false} veil={0.38} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <g transform={`translate(${hand.x} ${hand.y - 10}) rotate(${turn})`}>
        <Zippo x={0} y={0} s={0.9} />
      </g>
      <Foreground blur={10}>
        <path d="M 1500 1080 Q 1420 860 1320 780 Q 1400 920 1390 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S5: insert, low angle — the shelf of other people's things, a slow pan
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pan = kf(t, [[0, 0], [len, -30]]);
  return (
    <g transform={camT(640 + pan, 500, kf(t, [[0, 1.15], [len, 1.28]]))}>
      <Workshop t={t + 110} id="s5" veil={0.3} />
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0706" opacity={0.18} />
    </g>
  );
};

// S6: macro — the zippo, its worn chrome, his thumb
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const p = benchTop(0.42, 0.5);
  return (
    <g transform={camT(p.x, p.y - 10, kf(t, [[0, 2.6], [len, 2.9]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s6v" lights={[[p.x, p.y - 100, 500]]} o={0.4} />
      <Glow x={p.x} y={p.y - 140} r={380} o={0.3} />
      <ellipse cx={p.x} cy={p.y + 16} rx={90} ry={16} fill="#000" opacity={0.35} />
      <Zippo x={p.x} y={p.y} s={2.4} rot={-8} />
      {/* his thumb entering from the right */}
      <g filter="url(#rimR)">
        <path d={`M ${p.x + 180} ${p.y - 60} Q ${p.x + 80} ${p.y - 90} ${p.x + 30} ${p.y - 30}`} stroke={MINH.line} strokeWidth={60} fill="none" strokeLinecap="round" />
        <path d={`M ${p.x + 180} ${p.y - 60} Q ${p.x + 80} ${p.y - 90} ${p.x + 30} ${p.y - 30}`} stroke={MINH.skin} strokeWidth={48} fill="none" strokeLinecap="round" />
        <ellipse cx={p.x + 22} cy={p.y - 34} rx={22} ry={30} fill={MINH.skin} stroke={MINH.line} strokeWidth={4} transform="rotate(-20 ${p.x + 22} ${p.y - 34})" />
      </g>
    </g>
  );
};

// S7: macro — the chipped doll and the rain-stained notebook beside it
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const p = benchTop(0.3, 0.45);
  const q = benchTop(0.22, 0.5);
  return (
    <g transform={camT((p.x + q.x) / 2, (p.y + q.y) / 2 - 20, kf(t, [[0, 2.4], [len, 2.7]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s7v" lights={[[(p.x + q.x) / 2, (p.y + q.y) / 2 - 120, 560]]} o={0.4} />
      <Glow x={(p.x + q.x) / 2} y={(p.y + q.y) / 2 - 160} r={420} o={0.28} />
      <ellipse cx={p.x} cy={p.y + 14} rx={70} ry={12} fill="#000" opacity={0.3} />
      <ellipse cx={q.x} cy={q.y + 14} rx={60} ry={11} fill="#000" opacity={0.3} />
      <Doll x={p.x} y={p.y} s={1.9} />
      <Notebook x={q.x + 20} y={q.y - 6} s={1.5} rot={-12} />
    </g>
  );
};

// S8: medium, low angle — Minh works; the memory is the thing he keeps
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x + 20, y: MINH_STAND.y, scale: MINH_STAND.scale * 1.05, yaw: 0.5, look: 0.8, tilt: -3, armL: { a: 40, b: 30 }, armR: { a: 50, b: 30 } } },
    { f: 60, p: { armR: { a: 62, b: 24 }, headTilt: 4 } },
    { f: 120, p: { armR: { a: 55, b: 28 }, look: 0.5 } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), kf(t, [[0, 640], [len, 615]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <Workshop t={t + 140} id="s8" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [80, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {/* small tools on the bench near his hand */}
      <g transform={`translate(${hand.x + 60} ${hand.y + 60})`}>
        <rect x={-30} y={-6} width={60} height={12} rx={4} fill="#4E5A62" transform="rotate(-14)" />
        <circle cx={-24} cy={-8} r={8} fill="none" stroke={BRASS} strokeWidth={4} transform="rotate(-14 -24 -8)" />
      </g>
      <Foreground blur={10}>
        <path d="M 1450 1080 Q 1360 820 1240 760 Q 1330 900 1310 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// =====================================================================
// ACT II — Linh arrives with the hourglass (S9-S22)
// =====================================================================

// S9: wide — rain at the door; the chime hangs still, then moves
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const still = clamp(t / 50);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1160]]), 500, kf(t, [[0, 0.9], [len, 0.95]]))}>
      <Workshop t={t + 160} id="s9" chime={still} veil={0.4} />
      <Foreground blur={8}>
        <path d="M 60 1080 Q 160 780 320 700 Q 240 880 280 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S10: insert — the brass chime swinging, the rain behind it
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const swing = Math.sin(t / 4) * 6 * clamp(t / 20);
  return (
    <g transform={camT(1372, 420, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <rect x={-900} y={-600} width={1800} height={1400} fill="#0E0A08" opacity={0.55} />
      <g transform={`rotate(${swing} 1372 332)`}>
        <path d="M 1372 332 L 1372 348" stroke="#2A2020" strokeWidth={3} />
        <rect x={1348} y={348} width={48} height={7} rx={3} fill={WOOD} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M ${1354 + i * 12} 355 L ${1354 + i * 12} 362`} stroke="#2A2020" strokeWidth={2} />
            <rect x={1350 + i * 12} y={362} width={7} height={30 + (i % 2) * 10} rx={3} fill={BRASS} />
            <rect x={1351 + i * 12} y={364} width={2} height={26 + (i % 2) * 10} fill="#EFD9A0" opacity={0.8} />
          </g>
        ))}
      </g>
      {/* rain streaks behind */}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 1290 + rnd(31, i) * 160;
        const y = 350 + ((t * 6 + i * 37) % 200);
        return <path key={i} d={`M ${x} ${y} l -3 18`} stroke="#A9C2D2" strokeWidth={1.4} opacity={0.35} />;
      })}
      <Glow x={1372} y={400} r={200} o={0.2} />
    </g>
  );
};

// S11: wide — the door opens; Linh steps in out of the rain
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp(t / 22));
  const step = clamp((t - 18) / 30);
  const walkX = kf(t, [[18, 1420], [len, 1330]]);
  const walkY = WORKSHOP.P(0.92, 1, 0.5).y - LEG_LEN * 0.55 * step;
  const pose = poseAt(t, [
    { f: 0, p: { x: walkX, y: walkY, scale: 0.62, yaw: -0.3, look: -0.4, armL: { a: 24, b: 16 }, armR: { a: 24, b: 16 } } },
    { f: 40, p: { armL: { a: 30, b: 20 }, armR: { a: 30, b: 20 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1020]]), 540, kf(t, [[0, 0.95], [len, 1.02]]))}>
      <Workshop t={t + 180} id="s11" open={open} veil={0.4} />
      <Hero look={LINH} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [40, 'neutral']]) }} rimId="rimL" shadow={0.8} />
      <Foreground blur={10}>
        <path d="M 80 1080 Q 180 800 340 720 Q 260 900 300 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S12: medium — Linh holding the little hourglass out in both hands
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.5);
  const pose = poseAt(t, [
    { f: 0, p: { x: LINH_STOOL.x + 140, y: LINH_STOOL.y - 60, scale: 0.62, yaw: 0.3, look: 0.5, armL: { a: 70, b: 30 }, armR: { a: 70, b: 30 } } },
    { f: 30, p: { armL: { a: 62, b: 26 }, armR: { a: 62, b: 26 } } },
  ]);
  const j = joints(pose);
  const handL = toWorld(pose, j.armL.end);
  const handR = toWorld(pose, j.armR.end);
  const hx = (handL.x + handR.x) / 2;
  const hy = (handL.y + handR.y) / 2 - 10;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Workshop t={t + 200} id="s12" bench={false} veil={0.42} />
      <Hero look={LINH} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <g transform={`translate(${hx} ${hy})`}>
        <Hourglass x={0} y={0} s={1.1} t={t} flow={0} caked crack={1} glow={0.3} />
      </g>
      <Glow x={hx} y={hy - 40} r={160} o={0.3} />
    </g>
  );
};

// S13: macro — the walnut frame, the hairline crack in the glass
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const p = benchTop(0.55, 0.45);
  return (
    <g transform={camT(p.x, p.y - 30, kf(t, [[0, 3.2], [len, 3.6]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s13v" lights={[[p.x, p.y - 160, 620]]} o={0.38} />
      <Glow x={p.x} y={p.y - 200} r={480} o={0.32} />
      <ellipse cx={p.x} cy={p.y + 18} rx={110} ry={18} fill="#000" opacity={0.32} />
      <Hourglass x={p.x} y={p.y} s={2.6} t={t} flow={0} caked crack={1} glow={0.25} />
      {/* a slow tilt to catch the light on the crack */}
      <g transform={`translate(${p.x} ${p.y}) rotate(${kf(t, [[0, -4], [len, 4]])}) scale(2.6)`} opacity={0}>
        <Hourglass x={0} y={0} s={1} t={t} flow={0} caked crack={1} />
      </g>
    </g>
  );
};

// S14: extreme close-up — caked sand stuck to the inside of the glass
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const p = benchTop(0.55, 0.45);
  return (
    <g transform={camT(p.x + 14, p.y - 78, kf(t, [[0, 5.2], [len, 5.8]]))}>
      <rect x={-800} y={-600} width={1600} height={1200} fill="#1A120E" />
      <LightVeil id="s14v" lights={[[p.x + 14, p.y - 160, 500]]} o={0.4} />
      <Glow x={p.x + 14} y={p.y - 200} r={420} o={0.35} />
      {/* the upper bulb, huge */}
      <path d={`M ${p.x - 60} ${p.y - 220} C ${p.x - 60} ${p.y - 320} ${p.x - 20} ${p.y - 290} ${p.x - 12} ${p.y - 240} L ${p.x + 12} ${p.y - 240} C ${p.x + 20} ${p.y - 290} ${p.x + 60} ${p.y - 320} ${p.x + 60} ${p.y - 220} Z`} fill="#DCEAF0" opacity={0.15} />
      <path d={`M ${p.x - 60} ${p.y - 220} C ${p.x - 60} ${p.y - 320} ${p.x - 20} ${p.y - 290} ${p.x - 12} ${p.y - 240} L ${p.x + 12} ${p.y - 240} C ${p.x + 20} ${p.y - 290} ${p.x + 60} ${p.y - 320} ${p.x + 60} ${p.y - 220} Z`} fill="none" stroke="#EAF4F8" strokeWidth={4} opacity={0.5} />
      {/* caked sand clumps */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const yy = p.y - 260 + rnd(41, i) * 60;
        const xx = p.x - 40 + rnd(42, i) * 80;
        return <ellipse key={i} cx={xx} cy={yy} rx={8 + rnd(43, i) * 14} ry={6 + rnd(44, i) * 10} fill={SAND_DARK} opacity={0.9} />;
      })}
      {/* the waist and lower bulb hint */}
      <path d={`M ${p.x - 12} ${p.y - 240} C ${p.x - 20} ${p.y - 200} ${p.x - 60} ${p.y - 190} ${p.x - 60} ${p.y - 140}`} fill="none" stroke="#EAF4F8" strokeWidth={3} opacity={0.4} />
      <path d={`M ${p.x + 60} ${p.y - 220} C ${p.x + 60} ${p.y - 320} ${p.x + 20} ${p.y - 290} ${p.x + 12} ${p.y - 240}`} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.35} />
    </g>
  );
};

// S15: two-shot — she asks; Minh looks up from the bench
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 30, b: -10 }, headTilt: 6 } },
    { f: 30, p: { look: 0.7, headTilt: 2, armR: { a: 24, b: -8 } } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 130, LINH_STOOL.y, 0.62, { yaw: 0.35, look: 0.4, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }) },
    { f: 25, p: { look: 0.7, headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), 570, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Workshop t={t + 220} id="s15" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral'], [30, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
    </g>
  );
};

// S16: close-up — Linh, uncertain, the question still in her face
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1080, y: 560 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 4], [len, 2]]), ...faceAt(t, [[0, 'worried'], [60, 'neutral']]) };
  return (
    <g transform={camT(1080, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 240} id="s16" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S17: medium — he takes it and sets it on the bench under the lamp
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.55, look: 0.6, armL: { a: 40, b: 30 }, armR: { a: 70, b: 40 } } },
    { f: 30, p: { armR: { a: 50, b: 30 }, look: 0.3 } },
    { f: 60, p: { armR: { a: 30, b: -10 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  const take = clamp(t / 30);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), 610, kf(t, [[0, 1.65], [len, 1.75]]))}>
      <Workshop t={t + 260} id="s17" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {take < 0.8 ? (
        <g transform={`translate(${hand.x} ${hand.y - 30}) rotate(${-12 + take * 8})`}>
          <Hourglass x={0} y={0} s={1.3} t={t} flow={0} caked crack={1} />
        </g>
      ) : (
        <g>
          <ellipse cx={hg.x} cy={hg.y + 8} rx={60} ry={10} fill="#000" opacity={0.3} />
          <Hourglass x={hg.x} y={hg.y} s={1.5} t={t} flow={0} caked crack={1} glow={0.35} />
          <Glow x={hg.x} y={hg.y - 60} r={140} o={0.3} />
        </g>
      )}
    </g>
  );
};

// S18: macro — the hourglass turning in the lamp light, the crack and the clumps
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const rot = Math.sin(t / 18) * 6;
  return (
    <g transform={camT(hg.x, hg.y - 20, kf(t, [[0, 3.0], [len, 3.4]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s18v" lights={[[hg.x, hg.y - 140, 560]]} o={0.36} />
      <Glow x={hg.x} y={hg.y - 180} r={440} o={0.34} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={90} ry={14} fill="#000" opacity={0.3} />
      <g transform={`rotate(${rot} ${hg.x} ${hg.y})`}>
        <Hourglass x={hg.x} y={hg.y} s={2.8} t={t} flow={0} caked crack={1} glow={0.3} />
      </g>
      {/* the lamp's cone catching the glass */}
      <path d={`M ${hg.x - 160} ${hg.y - 320} L ${hg.x + 160} ${hg.y - 320} L ${hg.x + 120} ${hg.y + 60} L ${hg.x - 120} ${hg.y + 60} Z`} fill="#FFE2B0" opacity={0.06} />
    </g>
  );
};

// S19: close-up — Minh: the glass can be mended, the seam will show
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 820, y: 620 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.35, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) };
  return (
    <g transform={camT(820, 620, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -400) scale(1.7)">
          <Workshop t={t + 280} id="s19" bench={false} veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={MINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S20: extreme close-up — the hairline crack, light bending in it
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const glint = 0.5 + 0.5 * Math.sin(t / 8);
  return (
    <g transform={camT(hg.x + 22, hg.y - 120, kf(t, [[0, 6.0], [len, 6.6]]))}>
      <rect x={-600} y={-500} width={1200} height={1000} fill="#1A120E" />
      <LightVeil id="s20v" lights={[[hg.x + 22, hg.y - 200, 400]]} o={0.4} />
      <Glow x={hg.x + 22} y={hg.y - 240} r={360} o={0.4} />
      {/* glass surface */}
      <path d={`M ${hg.x - 80} ${hg.y - 200} C ${hg.x - 80} ${hg.y - 280} ${hg.x - 40} ${hg.y - 260} ${hg.x - 30} ${hg.y - 220} L ${hg.x + 30} ${hg.y - 220} C ${hg.x + 40} ${hg.y - 260} ${hg.x + 80} ${hg.y - 280} ${hg.x + 80} ${hg.y - 200} Z`} fill="#DCEAF0" opacity={0.12} />
      {/* the crack, catching light */}
      <path d={`M ${hg.x + 30} ${hg.y - 190} L ${hg.x + 10} ${hg.y - 160} L ${hg.x + 22} ${hg.y - 140} L ${hg.x - 8} ${hg.y - 110}`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7 + 0.3 * glint} strokeLinecap="round" />
      <path d={`M ${hg.x + 30} ${hg.y - 190} L ${hg.x + 10} ${hg.y - 160} L ${hg.x + 22} ${hg.y - 140} L ${hg.x - 8} ${hg.y - 110}`} stroke="#BFE0F0" strokeWidth={8} fill="none" opacity={0.15 * glint} strokeLinecap="round" />
    </g>
  );
};

// S21: close-up — Minh: the damp got in
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 900, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'neutral'], [50, 'tired']]) };
  return (
    <g transform={camT(900, 600, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-450 -380) scale(1.7)">
          <Workshop t={t + 300} id="s21" bench={false} veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={MINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S22: macro — the caked sand; dry it, sift it, pour it back
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const dish = benchTop(0.3, 0.5);
  const dry = clamp(t / len);
  return (
    <g transform={camT((hg.x + dish.x) / 2, (hg.y + dish.y) / 2 - 30, kf(t, [[0, 2.2], [len, 2.5]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s22v" lights={[[(hg.x + dish.x) / 2, (hg.y + dish.y) / 2 - 160, 620]]} o={0.38} />
      <Glow x={(hg.x + dish.x) / 2} y={(hg.y + dish.y) / 2 - 200} r={460} o={0.3} />
      {/* the white dish with damp sand */}
      <ellipse cx={dish.x} cy={dish.y + 10} rx={80} ry={14} fill="#000" opacity={0.3} />
      <ellipse cx={dish.x} cy={dish.y} rx={80} ry={18} fill="#E8E0D2" />
      <ellipse cx={dish.x} cy={dish.y - 4} rx={62} ry={11} fill="#CFC5B4" />
      {Array.from({ length: 8 }).map((_, i) => {
        const col = dry > 0.5 ? SAND : SAND_DARK;
        return <ellipse key={i} cx={dish.x - 40 + rnd(51, i) * 80} cy={dish.y - 6 + rnd(52, i) * 8} rx={10 + rnd(53, i) * 16} ry={5 + rnd(54, i) * 6} fill={col} opacity={0.85} />;
      })}
      {/* the hourglass, cap coming off */}
      <ellipse cx={hg.x} cy={hg.y + 12} rx={70} ry={11} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.2} t={t} flow={0} caked={dry < 0.5} cap={clamp((t - 40) / 30)} crack={1} glow={0.25} />
    </g>
  );
};

// =====================================================================
// ACT III — she sits, tells the story (S23-S28)
// =====================================================================

// S23: medium — Linh sits on the stool, hands clasped on the bench
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 40, p: { armL: { a: 44, b: 26 }, armR: { a: 44, b: 26 }, look: 0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1040]]), 560, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <Workshop t={t + 320} id="s23" bench={false} veil={0.4} />
      <Stool u={0.6} w={0.55} />
      <Hero look={LINH} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [50, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Foreground blur={10}>
        <path d="M 1480 1080 Q 1400 840 1300 780 Q 1380 920 1370 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S24: close-up — she tells him about the eighteenth birthday
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1100, y: 560 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.28, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [60, 5]]), ...faceAt(t, [[0, 'neutral'], [50, 'tired']]) };
  return (
    <g transform={camT(1100, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 340} id="s24" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S25: insert, warm — the hourglass with a warm glow behind it, as she remembers
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const glow = 0.4 + 0.2 * Math.sin(t / 12);
  return (
    <g transform={camT(hg.x, hg.y - 40, kf(t, [[0, 2.8], [len, 3.2]]))}>
      <rect x={-700} y={-500} width={1400} height={1000} fill="#1A120E" />
      <LightVeil id="s25v" lights={[[hg.x, hg.y - 200, 600]]} o={0.4} />
      <Glow x={hg.x} y={hg.y - 240} r={500} o={glow} />
      <Glow x={hg.x} y={hg.y - 240} r={280} o={0.3} kind="warm" />
      <ellipse cx={hg.x} cy={hg.y + 16} rx={110} ry={16} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.0} t={t} flow={0.15} caked={false} crack={1} glow={0.5} />
      {/* warm particles rising like memory */}
      {Array.from({ length: 10 }).map((_, i) => {
        const yy = hg.y - 200 + ((t * 1.5 + i * 47) % 300);
        const xx = hg.x - 60 + rnd(61, i) * 120;
        return <circle key={i} cx={xx} cy={yy} r={2 + rnd(62, i) * 3} fill="#FFE2B0" opacity={0.3 * (1 - (yy - hg.y + 200) / 300)} />;
      })}
    </g>
  );
};

// S26: close-up — half a year, and the drop; her voice thins
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1080, y: 580 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.25, look: 0.2, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 3], [len, 6]]), ...faceAt(t, [[0, 'neutral'], [60, 'tired'], [120, 'worried']]) };
  return (
    <g transform={camT(1080, 580, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 360} id="s26" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.3} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S27: close-up — she stops, looks down at her shoes
export const S27: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1050, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.2, look: -0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 4], [len, 8]]), ...faceAt(t, [[0, 'neutral'], [60, 'tired']]) };
  return (
    <g transform={camT(1050, 600, kf(t, [[0, 1], [len, 1.04]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 380} id="s27" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.32} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S28: close-up — the quiet after; she does not want to see it stop midway
export const S28: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.05 * clamp(t / len));
  const head = { x: 1020, y: 570 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.15, look: -0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 6], [len, 4]]), ...faceAt(t, [[0, 'tired'], [80, 'worried']]) };
  return (
    <g transform={camT(1020, 570, kf(t, [[0, 1], [len, 1.04]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 400} id="s28" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.35} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
      {/* the hourglass small in the foreground, out of focus */}
      <g opacity={0.4}>
        <Hourglass x={1600} y={900} s={1.2} t={t} flow={0} caked crack={1} />
      </g>
    </g>
  );
};

// =====================================================================
// ACT IV — the repair (S29-S58)
// =====================================================================

// S29: medium — Minh smiles a little and picks up his tweezers
export const S29: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 20, p: { armR: { a: 55, b: 30 }, look: 0.3 } },
    { f: 45, p: { armR: { a: 48, b: 26 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 610, kf(t, [[0, 1.65], [len, 1.75]]))}>
      <Workshop t={t + 420} id="s29" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {/* tweezers in his hand */}
      <g transform={`translate(${hand.x} ${hand.y - 8}) rotate(-20)`}>
        <path d="M -2 -20 L -8 20 M 2 -20 L 8 20" stroke="#8A8A90" strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  );
};

// S30: macro insert, high angle — the cap comes off; the damp sand pours onto the white dish
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const dish = benchTop(0.3, 0.5);
  const capOff = clamp((t - 20) / 30);
  const pour = clamp((t - 50) / 40);
  return (
    <g transform={camT((hg.x + dish.x) / 2, (hg.y + dish.y) / 2 - 60, kf(t, [[0, 2.4], [len, 2.8]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s30v" lights={[[(hg.x + dish.x) / 2, (hg.y + dish.y) / 2 - 200, 660]]} o={0.4} />
      <Glow x={(hg.x + dish.x) / 2} y={(hg.y + dish.y) / 2 - 240} r={520} o={0.32} />
      {/* the white dish */}
      <ellipse cx={dish.x} cy={dish.y + 12} rx={85} ry={15} fill="#000" opacity={0.3} />
      <ellipse cx={dish.x} cy={dish.y} rx={85} ry={19} fill="#E8E0D2" />
      <ellipse cx={dish.x} cy={dish.y - 4} rx={66} ry={12} fill="#CFC5B4" />
      {/* pouring sand */}
      {pour > 0 ? (
        <g>
          <path d={`M ${hg.x - 20} ${hg.y - 100} Q ${dish.x - 30} ${(hg.y + dish.y) / 2} ${dish.x - 10} ${dish.y - 10}`} stroke={SAND_DARK} strokeWidth={6} fill="none" opacity={0.7 * pour} />
          {Array.from({ length: 12 }).map((_, i) => {
            const yy = hg.y - 80 + ((t * 3 + i * 23) % (dish.y - hg.y + 60));
            const xx = hg.x - 16 + (dish.x - hg.x) * (yy - hg.y + 80) / (dish.y - hg.y + 80) + (rnd(71, i) - 0.5) * 8;
            return <circle key={i} cx={xx} cy={yy} r={2.5} fill={SAND_DARK} opacity={0.8 * pour} />;
          })}
        </g>
      ) : null}
      {/* the hourglass, cap lifting off */}
      <ellipse cx={hg.x} cy={hg.y + 14} rx={75} ry={12} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.4} t={t} flow={0} caked cap={capOff} crack={1} glow={0.25} />
      {/* his fingers at the edge */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x + 130} ${hg.y - 100} Q ${hg.x + 60} ${hg.y - 60} ${hg.x + 30} ${hg.y - 20}`} stroke={MINH.line} strokeWidth={36} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x + 130} ${hg.y - 100} Q ${hg.x + 60} ${hg.y - 60} ${hg.x + 30} ${hg.y - 20}`} stroke={MINH.skin} strokeWidth={28} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// S31: macro — the sand leaves the glass, grain by grain
export const S31: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const flow = clamp(t / len) * 0.9;
  return (
    <g transform={camT(hg.x, hg.y - 30, kf(t, [[0, 3.4], [len, 3.8]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s31v" lights={[[hg.x, hg.y - 160, 580]]} o={0.38} />
      <Glow x={hg.x} y={hg.y - 200} r={460} o={0.34} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={85} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.9} t={t} flow={flow} caked={false} cap={1} crack={1} glow={0.3} />
      {/* individual grains drifting */}
      {Array.from({ length: 8 }).map((_, i) => {
        const yy = hg.y - 60 + ((t * 2 + i * 31) % 110);
        const xx = hg.x + (rnd(81, i) - 0.5) * 20;
        return <circle key={i} cx={xx} cy={yy} r={1.8} fill={SAND} opacity={0.8} />;
      })}
    </g>
  );
};

// S32: top-down insert — the dish of caked sand, small clouds that used to move
export const S32: React.FC<ShotProps> = ({ t, len }) => {
  const dish = benchTop(0.3, 0.5);
  return (
    <g transform={camT(dish.x, dish.y, kf(t, [[0, 3.8], [len, 4.2]]))}>
      <Tabletop edge={1600} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s32v" lights={[[dish.x, dish.y - 200, 700]]} o={0.42} />
      <Glow x={dish.x} y={dish.y - 240} r={560} o={0.35} />
      {/* the dish from above */}
      <ellipse cx={dish.x} cy={dish.y} rx={200} ry={160} fill="#E8E0D2" />
      <ellipse cx={dish.x} cy={dish.y} rx={170} ry={135} fill="#CFC5B4" />
      {/* caked sand clumps like small clouds */}
      {Array.from({ length: 14 }).map((_, i) => {
        const cx = dish.x - 120 + rnd(91, i) * 240;
        const cy = dish.y - 90 + rnd(92, i) * 180;
        const r = 18 + rnd(93, i) * 30;
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.7} fill={SAND_DARK} opacity={0.85} />
            <ellipse cx={cx - r * 0.2} cy={cy - r * 0.15} rx={r * 0.6} ry={r * 0.4} fill={SAND} opacity={0.5} />
          </g>
        );
      })}
      {/* a few grains already loosening */}
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={`g${i}`} cx={dish.x - 100 + rnd(94, i) * 200} cy={dish.y - 80 + rnd(95, i) * 160} r={2.5} fill={SAND} opacity={0.7} />
      ))}
    </g>
  );
};

// S33: insert — the dish under the little heater; a thread of steam
export const S33: React.FC<ShotProps> = ({ t, len }) => {
  const dish = benchTop(0.3, 0.5);
  const heat = clamp(t / 40);
  return (
    <g transform={camT(dish.x, dish.y - 30, kf(t, [[0, 2.8], [len, 3.2]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s33v" lights={[[dish.x, dish.y - 180, 560]]} o={0.4} />
      <Glow x={dish.x} y={dish.y - 220} r={440} o={0.3} />
      {/* the mini heater under the dish */}
      <rect x={dish.x - 50} y={dish.y + 14} width={100} height={24} rx={6} fill="#2E3438" />
      <rect x={dish.x - 40} y={dish.y + 18} width={80} height={8} rx={3} fill={heat > 0.5 ? '#FF8A3D' : '#4A5258'} opacity={0.4 + heat * 0.6} />
      {/* the dish */}
      <ellipse cx={dish.x} cy={dish.y} rx={85} ry={18} fill="#E8E0D2" />
      <ellipse cx={dish.x} cy={dish.y - 4} rx={66} ry={11} fill="#CFC5B4" />
      {/* sand drying pale */}
      {Array.from({ length: 10 }).map((_, i) => {
        const col = heat > 0.6 ? SAND : SAND_DARK;
        return <ellipse key={i} cx={dish.x - 45 + rnd(101, i) * 90} cy={dish.y - 6 + rnd(102, i) * 8} rx={12 + rnd(103, i) * 18} ry={5 + rnd(104, i) * 6} fill={col} opacity={0.8} />;
      })}
      {/* steam thread */}
      {heat > 0.3 ? (
        <path d={`M ${dish.x} ${dish.y - 30} Q ${dish.x + 20 * Math.sin(t / 8)} ${dish.y - 80} ${dish.x - 10} ${dish.y - 140}`} stroke="#DCE9F2" strokeWidth={3} fill="none" opacity={0.25 * heat} strokeLinecap="round" />
      ) : null}
    </g>
  );
};

// S34: medium — Minh talks while he works, rain at his back
export const S34: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.45, look: 0.5, armL: { a: 20, b: -10 }, armR: { a: 55, b: 35 } } },
    { f: 60, p: { armR: { a: 48, b: 30 }, look: 0.3 } },
    { f: 120, p: { armR: { a: 58, b: 32 }, look: 0.5 } },
    { f: 180, p: { armR: { a: 50, b: 28 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 970], [len, 955]]), 590, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Workshop t={t + 440} id="s34" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [80, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {/* he works: a small motion over the dish */}
      <g transform={`translate(${hand.x + 40} ${hand.y + 40}) rotate(${-10 + Math.sin(t / 6) * 4})`}>
        <rect x={-20} y={-4} width={40} height={8} rx={3} fill="#8A6A4A" />
      </g>
      <Foreground blur={10}>
        <path d="M 1480 1080 Q 1400 840 1300 780 Q 1380 920 1370 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S35: insert, window — rain running down the window; the shop reflected
export const S35: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <rect x={-800} y={-600} width={1600} height={1200} fill="#0E0A08" opacity={0.6} />
      {/* the window frame */}
      <rect x={840} y={356} width={240} height={256} fill="#1E2A36" />
      <rect x={846} y={362} width={228} height={244} fill="#2A3A48" />
      {/* rain running down */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 850 + rnd(111, i) * 220;
        const y = 370 + ((t * 4 + i * 53) % 230);
        return <path key={i} d={`M ${x} ${y} l -2 16`} stroke="#A9C2D2" strokeWidth={1.5} opacity={0.4} />;
      })}
      {/* the shop reflected faintly */}
      <rect x={860} y={400} width={60} height={80} fill="#FFE2B0" opacity={0.08} />
      <rect x={940} y={420} width={40} height={60} fill="#FFE2B0" opacity={0.06} />
      <rect x={850} y={356} width={240} height={256} fill="none" stroke={WOOD_D} strokeWidth={8} />
      <line x1={960} y1={356} x2={960} y2={612} stroke={WOOD_D} strokeWidth={6} />
      <line x1={840} y1={484} x2={1080} y2={484} stroke={WOOD_D} strokeWidth={6} />
      <Glow x={960} y={480} r={300} o={0.15} />
    </g>
  );
};

// S36: medium, low angle — he holds the hourglass up: three minutes, no more
export const S36: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale * 1.1, yaw: 0.4, look: 0.6, armL: { a: 14, b: -6 }, armR: { a: 90, b: 20 } } },
    { f: 30, p: { armR: { a: 75, b: 15 }, headTilt: 3 } },
    { f: 70, p: { armR: { a: 82, b: 18 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 945]]), kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Workshop t={t + 460} id="s36" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [50, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={0.8} />
      {/* the hourglass raised in his hand */}
      <g transform={`translate(${hand.x} ${hand.y - 20})`}>
        <Hourglass x={0} y={0} s={1.8} t={t} flow={0} caked={false} cap={1} crack={1} glow={0.4} />
      </g>
      <Glow x={hand.x} y={hand.y - 60} r={180} o={0.35} />
      <Foreground blur={10}>
        <path d="M 1500 1080 Q 1420 860 1320 800 Q 1400 920 1390 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S37: close-up — the hourglass in his fingers, the empty bulbs
export const S37: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  return (
    <g transform={camT(hg.x + 30, hg.y - 80, kf(t, [[0, 4.4], [len, 4.8]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s37v" lights={[[hg.x + 30, hg.y - 200, 520]]} o={0.4} />
      <Glow x={hg.x + 30} y={hg.y - 240} r={420} o={0.36} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={80} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.2} t={t} flow={0} caked={false} cap={1} crack={1} glow={0.35} />
      {/* his fingers holding it */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x + 90} ${hg.y - 40} Q ${hg.x + 40} ${hg.y - 20} ${hg.x + 20} ${hg.y + 10}`} stroke={MINH.line} strokeWidth={30} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x + 90} ${hg.y - 40} Q ${hg.x + 40} ${hg.y - 20} ${hg.x + 20} ${hg.y + 10}`} stroke={MINH.skin} strokeWidth={22} fill="none" strokeLinecap="round" />
        <ellipse cx={hg.x + 16} cy={hg.y + 12} rx={14} ry={20} fill={MINH.skin} stroke={MINH.line} strokeWidth={3} transform="rotate(20 ${hg.x + 16} ${hg.y + 12})" />
      </g>
    </g>
  );
};

// S38: close-up — Linh looks up: what does it keep, then?
export const S38: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1080, y: 560 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.25, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [len, 0]]), ...faceAt(t, [[0, 'worried'], [50, 'neutral']]) };
  return (
    <g transform={camT(1080, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 480} id="s38" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S39: two-shot — Minh answers; he sets the dish of sand under the mini heater
export const S39: React.FC<ShotProps> = ({ t, len }) => {
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 30, p: { armR: { a: 55, b: 32 }, look: 0.3 } },
    { f: 60, p: { armR: { a: 40, b: 24 } } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 40, p: { look: 0.5 } },
  ]);
  const j = joints(minhPose);
  const hand = toWorld(minhPose, j.armR.end);
  const dish = benchTop(0.3, 0.5);
  const move = clamp(t / 50);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1005]]), 570, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Workshop t={t + 500} id="s39" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
      {/* the dish moving under the heater */}
      <g transform={`translate(${dish.x + (1 - move) * 60} ${dish.y})`}>
        <ellipse cx={0} cy={10} rx={80} ry={14} fill="#000" opacity={0.3} />
        <ellipse cx={0} cy={0} rx={80} ry={17} fill="#E8E0D2" />
        <ellipse cx={0} cy={-4} rx={62} ry={10} fill="#CFC5B4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx={-35 + rnd(121, i) * 70} cy={-5 + rnd(122, i) * 7} rx={10 + rnd(123, i) * 15} ry={4 + rnd(124, i) * 5} fill={SAND} opacity={0.85} />
        ))}
      </g>
      {/* the mini heater */}
      <rect x={dish.x - 40} y={dish.y + 16} width={90} height={22} rx={5} fill="#2E3438" />
      <rect x={dish.x - 30} y={dish.y + 20} width={70} height={7} rx={3} fill="#FF8A3D" opacity={0.5} />
    </g>
  );
};

// S40: insert — the dish and the heater, the sand drying pale
export const S40: React.FC<ShotProps> = ({ t, len }) => {
  const dish = benchTop(0.3, 0.5);
  const dry = clamp(t / len);
  return (
    <g transform={camT(dish.x, dish.y - 20, kf(t, [[0, 3.2], [len, 3.6]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s40v" lights={[[dish.x, dish.y - 160, 540]]} o={0.4} />
      <Glow x={dish.x} y={dish.y - 200} r={420} o={0.32} />
      {/* the mini heater */}
      <rect x={dish.x - 55} y={dish.y + 12} width={110} height={26} rx={6} fill="#2E3438" />
      <rect x={dish.x - 45} y={dish.y + 16} width={90} height={10} rx={4} fill={dry > 0.4 ? '#FF8A3D' : '#4A5258'} opacity={0.4 + dry * 0.5} />
      {/* the dish */}
      <ellipse cx={dish.x} cy={dish.y} rx={88} ry={19} fill="#E8E0D2" />
      <ellipse cx={dish.x} cy={dish.y - 4} rx={68} ry={12} fill="#CFC5B4" />
      {/* sand drying pale */}
      {Array.from({ length: 12 }).map((_, i) => {
        const col = dry > 0.5 ? SAND : SAND_DARK;
        const op = 0.7 + dry * 0.3;
        return <ellipse key={i} cx={dish.x - 50 + rnd(131, i) * 100} cy={dish.y - 6 + rnd(132, i) * 9} rx={11 + rnd(133, i) * 18} ry={4 + rnd(134, i) * 6} fill={col} opacity={op} />;
      })}
      {/* faint steam */}
      {dry > 0.3 ? <path d={`M ${dish.x + 20} ${dish.y - 20} Q ${dish.x + 40} ${dish.y - 60} ${dish.x + 10} ${dish.y - 100}`} stroke="#DCE9F2" strokeWidth={2.5} fill="none" opacity={0.2 * dry} strokeLinecap="round" /> : null}
    </g>
  );
};

// S41: close-up — Linh listening; the hard line in her face softens
export const S41: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1060, y: 570 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.2, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 4], [len, 2]]), ...faceAt(t, [[0, 'neutral'], [60, 'tired'], [100, 'happy']]) };
  return (
    <g transform={camT(1060, 570, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 520} id="s41" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S42: close-up — Minh: the value is in the times she soothed herself
export const S42: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 860, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [len, 0]]), ...faceAt(t, [[0, 'neutral'], [60, 'tired'], [120, 'happy']]) };
  return (
    <g transform={camT(860, 600, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -400) scale(1.7)">
          <Workshop t={t + 540} id="s42" bench={false} veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={MINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S43: wide — the two of them still; rain, dust, one lamp
export const S43: React.FC<ShotProps> = ({ t, len }) => {
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.35, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 30, p: { look: 0.2 } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 30, p: { look: 0.3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), 540, kf(t, [[0, 0.9], [len, 0.95]]))}>
      <Workshop t={t + 560} id="s43" bench={false} veil={0.42} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
      <Dust t={t} seed={23} x0={700} y0={300} w={500} h={400} n={25} o={0.4} />
      <Foreground blur={10}>
        <path d="M 60 1080 Q 160 800 320 720 Q 240 900 280 1080 Z" fill="#0E0A08" />
        <path d="M 1880 1080 Q 1800 860 1700 800 Q 1760 920 1720 1080 Z" fill="#0C0806" />
      </Foreground>
    </g>
  );
};

// S44: insert — the wet street beyond the glass, a scooter passing
export const S44: React.FC<ShotProps> = ({ t, len }) => {
  const scooterX = kf(t, [[0, 1400], [len, 500]]);
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <rect x={-800} y={-600} width={1600} height={1200} fill="#0E0A08" opacity={0.6} />
      {/* the window */}
      <rect x={840} y={356} width={240} height={256} fill="#1E2A36" />
      <rect x={846} y={362} width={228} height={244} fill="#2A3A48" />
      {/* wet street reflection */}
      <rect x={846} y={480} width={228} height={126} fill="#1A2430" />
      {/* scooter passing */}
      <g transform={`translate(${scooterX} 540)`} opacity={clamp((t - 10) / 15) * (1 - clamp((t - len + 30) / 15))}>
        <circle cx={-20} cy={20} r={14} fill="#0E0C14" />
        <circle cx={30} cy={20} r={14} fill="#0E0C14" />
        <path d="M -30 10 L 10 -10 L 40 10 L -10 18 Z" fill="#0E0C14" />
        <circle cx={0} cy={-14} r={5} fill="#FFE2B0" opacity={0.8} />
        <path d="M -20 -8 L -30 -20" stroke="#0E0C14" strokeWidth={4} strokeLinecap="round" />
      </g>
      {/* rain */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 850 + rnd(141, i) * 220;
        const y = 370 + ((t * 4 + i * 47) % 230);
        return <path key={i} d={`M ${x} ${y} l -2 16`} stroke="#A9C2D2" strokeWidth={1.4} opacity={0.35} />;
      })}
      <rect x={840} y={356} width={240} height={256} fill="none" stroke={WOOD_D} strokeWidth={8} />
      <line x1={960} y1={356} x2={960} y2={612} stroke={WOOD_D} strokeWidth={6} />
      <line x1={840} y1={484} x2={1080} y2={484} stroke={WOOD_D} strokeWidth={6} />
    </g>
  );
};

// S45: wide — the small room, the old-wood smell almost visible
export const S45: React.FC<ShotProps> = ({ t, len }) => {
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.3, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 60, p: { look: 0.1 } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.3, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 60, p: { look: 0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 530, kf(t, [[0, 0.85], [len, 0.9]]))}>
      <Workshop t={t + 580} id="s45" bench={false} veil={0.45} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
      <Dust t={t} seed={29} x0={600} y0={280} w={700} h={450} n={35} o={0.5} />
      <Foreground blur={10}>
        <path d="M 60 1080 Q 160 800 320 720 Q 240 900 280 1080 Z" fill="#0E0A08" />
        <path d="M 1880 1080 Q 1800 860 1700 800 Q 1760 920 1720 1080 Z" fill="#0C0806" />
      </Foreground>
    </g>
  );
};

// =====================================================================
// ACT V — the repair, continued (S46-S58)
// =====================================================================

// S46: macro insert — clear glue laid along the crack, a thin bead
export const S46: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const glue = clamp(t / len);
  return (
    <g transform={camT(hg.x + 18, hg.y - 110, kf(t, [[0, 5.0], [len, 5.5]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s46v" lights={[[hg.x + 18, hg.y - 200, 480]]} o={0.4} />
      <Glow x={hg.x + 18} y={hg.y - 240} r={400} o={0.36} />
      {/* glass surface */}
      <path d={`M ${hg.x - 70} ${hg.y - 190} C ${hg.x - 70} ${hg.y - 270} ${hg.x - 30} ${hg.y - 250} ${hg.x - 20} ${hg.y - 210} L ${hg.x + 20} ${hg.y - 210} C ${hg.x + 30} ${hg.y - 250} ${hg.x + 70} ${hg.y - 270} ${hg.x + 70} ${hg.y - 190} Z`} fill="#DCEAF0" opacity={0.12} />
      {/* the crack */}
      <path d={`M ${hg.x + 28} ${hg.y - 180} L ${hg.x + 8} ${hg.y - 150} L ${hg.x + 20} ${hg.y - 130} L ${hg.x - 10} ${hg.y - 100}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
      {/* the glue bead filling it */}
      <path d={`M ${hg.x + 28} ${hg.y - 180} L ${hg.x + 8} ${hg.y - 150} L ${hg.x + 20} ${hg.y - 130} L ${hg.x - 10} ${hg.y - 100}`} stroke="#BFE0F0" strokeWidth={6 * glue} fill="none" opacity={0.8 * glue} strokeLinecap="round" />
      {/* his hand with the glue bottle */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x + 140} ${hg.y - 80} Q ${hg.x + 70} ${hg.y - 60} ${hg.x + 40} ${hg.y - 30}`} stroke={MINH.line} strokeWidth={32} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x + 140} ${hg.y - 80} Q ${hg.x + 70} ${hg.y - 60} ${hg.x + 40} ${hg.y - 30}`} stroke={MINH.skin} strokeWidth={24} fill="none" strokeLinecap="round" />
        <ellipse cx={hg.x + 34} cy={hg.y - 32} rx={12} ry={18} fill={MINH.skin} stroke={MINH.line} strokeWidth={3} transform="rotate(15 ${hg.x + 34} ${hg.y - 32})" />
      </g>
    </g>
  );
};

// S47: macro insert — the UV lamp comes on; the glue sets
export const S47: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const uv = clamp((t - 20) / 30);
  return (
    <g transform={camT(hg.x + 18, hg.y - 110, kf(t, [[0, 5.0], [len, 5.4]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s47v" lights={[[hg.x + 18, hg.y - 200, 480]]} o={0.4} />
      {/* UV glow */}
      <Glow x={hg.x + 18} y={hg.y - 240} r={500} o={0.4 * uv} kind="cool" />
      <Glow x={hg.x + 18} y={hg.y - 240} r={300} o={0.3 * uv} />
      {/* glass surface */}
      <path d={`M ${hg.x - 70} ${hg.y - 190} C ${hg.x - 70} ${hg.y - 270} ${hg.x - 30} ${hg.y - 250} ${hg.x - 20} ${hg.y - 210} L ${hg.x + 20} ${hg.y - 210} C ${hg.x + 30} ${hg.y - 250} ${hg.x + 70} ${hg.y - 270} ${hg.x + 70} ${hg.y - 190} Z`} fill="#DCEAF0" opacity={0.12} />
      {/* the crack with glue set */}
      <path d={`M ${hg.x + 28} ${hg.y - 180} L ${hg.x + 8} ${hg.y - 150} L ${hg.x + 20} ${hg.y - 130} L ${hg.x - 10} ${hg.y - 100}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
      <path d={`M ${hg.x + 28} ${hg.y - 180} L ${hg.x + 8} ${hg.y - 150} L ${hg.x + 20} ${hg.y - 130} L ${hg.x - 10} ${hg.y - 100}`} stroke="#BFE0F0" strokeWidth={6} fill="none" opacity={0.85 * uv} strokeLinecap="round" />
      {/* the UV lamp itself */}
      <g transform={`translate(${hg.x + 160} ${hg.y - 200}) rotate(-15)`} opacity={uv}>
        <rect x={-30} y={-12} width={60} height={24} rx={6} fill="#3A3444" />
        <rect x={-24} y={-8} width={48} height={16} rx={4} fill={uv > 0.5 ? '#8A7AFF' : '#4A4460'} />
        <path d={`M -20 12 L -30 40 M 20 12 L 30 40`} stroke="#3A3444" strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
};

// S48: close-up — he holds the glass up to the lamp
export const S48: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 85, b: 20 } } },
    { f: 20, p: { armR: { a: 75, b: 15 }, look: 0.3 } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 600, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Workshop t={t + 600} id="s48" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {/* the hourglass held up to the light */}
      <g transform={`translate(${hand.x} ${hand.y - 30})`}>
        <Hourglass x={0} y={0} s={1.6} t={t} flow={0} caked={false} cap={1} crack={1} glow={0.5} />
      </g>
      <Glow x={hand.x} y={hand.y - 60} r={160} o={0.4} />
    </g>
  );
};

// S49: close-up — the crack is still there; the glass is whole
export const S49: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  return (
    <g transform={camT(hg.x + 20, hg.y - 100, kf(t, [[0, 4.2], [len, 4.6]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s49v" lights={[[hg.x + 20, hg.y - 200, 520]]} o={0.4} />
      <Glow x={hg.x + 20} y={hg.y - 240} r={440} o={0.36} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={85} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.0} t={t} flow={0} caked={false} cap={1} crack={1} glow={0.4} />
      {/* the scar catching the light */}
      <path d={`M ${hg.x + 34} ${hg.y - 170} L ${hg.x + 14} ${hg.y - 140} L ${hg.x + 26} ${hg.y - 120} L ${hg.x - 4} ${hg.y - 90}`} stroke="#FFFFFF" strokeWidth={2.5} fill="none" opacity={0.6} strokeLinecap="round" />
    </g>
  );
};

// S50: extreme close-up — the faint scar running down the glass
export const S50: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const glint = 0.4 + 0.4 * Math.sin(t / 7);
  return (
    <g transform={camT(hg.x + 24, hg.y - 130, kf(t, [[0, 6.4], [len, 7.0]]))}>
      <rect x={-500} y={-400} width={1000} height={800} fill="#1A120E" />
      <LightVeil id="s50v" lights={[[hg.x + 24, hg.y - 220, 400]]} o={0.42} />
      <Glow x={hg.x + 24} y={hg.y - 260} r={360} o={0.4} />
      {/* glass */}
      <path d={`M ${hg.x - 60} ${hg.y - 180} C ${hg.x - 60} ${hg.y - 260} ${hg.x - 25} ${hg.y - 240} ${hg.x - 15} ${hg.y - 200} L ${hg.x + 15} ${hg.y - 200} C ${hg.x + 25} ${hg.y - 240} ${hg.x + 60} ${hg.y - 260} ${hg.x + 60} ${hg.y - 180} Z`} fill="#DCEAF0" opacity={0.1} />
      {/* the scar */}
      <path d={`M ${hg.x + 26} ${hg.y - 170} L ${hg.x + 6} ${hg.y - 140} L ${hg.x + 18} ${hg.y - 120} L ${hg.x - 12} ${hg.y - 90}`} stroke="#FFFFFF" strokeWidth={3.5} fill="none" opacity={0.5 + 0.3 * glint} strokeLinecap="round" />
      <path d={`M ${hg.x + 26} ${hg.y - 170} L ${hg.x + 6} ${hg.y - 140} L ${hg.x + 18} ${hg.y - 120} L ${hg.x - 12} ${hg.y - 90}`} stroke="#BFE0F0" strokeWidth={7} fill="none" opacity={0.12 * glint} strokeLinecap="round" />
    </g>
  );
};

// S51: macro insert — the sieve, the dry sand falling through
export const S51: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const sieve = benchTop(0.4, 0.5);
  return (
    <g transform={camT((hg.x + sieve.x) / 2, (hg.y + sieve.y) / 2 - 40, kf(t, [[0, 3.4], [len, 3.8]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s51v" lights={[[(hg.x + sieve.x) / 2, (hg.y + sieve.y) / 2 - 180, 620]]} o={0.4} />
      <Glow x={(hg.x + sieve.x) / 2} y={(hg.y + sieve.y) / 2 - 220} r={480} o={0.34} />
      {/* the sieve */}
      <g transform={`translate(${sieve.x} ${sieve.y}) rotate(-8)`}>
        <ellipse cx={0} cy={0} rx={70} ry={18} fill="#8A8A90" />
        <ellipse cx={0} cy={-4} rx={60} ry={14} fill="#6E6A78" />
        {/* mesh lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1={-55 + i * 16} y1={-14} x2={-55 + i * 16} y2={6} stroke="#4A4660" strokeWidth={2} />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`v${i}`} x1={-50} y1={-12 + i * 6} x2={50} y2={-12 + i * 6} stroke="#4A4660" strokeWidth={2} />
        ))}
        {/* sand on the sieve */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={-40 + rnd(151, i) * 80} cy={-10 + rnd(152, i) * 16} r={2.5} fill={SAND} opacity={0.8} />
        ))}
        {/* falling through */}
        {Array.from({ length: 10 }).map((_, i) => {
          const yy = sieve.y + 20 + ((t * 3 + i * 19) % 80);
          const xx = sieve.x - 30 + rnd(153, i) * 60;
          return <circle key={`f${i}`} cx={xx} cy={yy} r={2} fill={SAND} opacity={0.7} />;
        })}
      </g>
      {/* the hourglass waiting */}
      <ellipse cx={hg.x} cy={hg.y + 12} rx={65} ry={10} fill="#000" opacity={0.28} />
      <Hourglass x={hg.x} y={hg.y} s={2.0} t={t} flow={0} caked={false} cap={1} crack={1} glow={0.2} />
    </g>
  );
};

// S52: macro insert — the grains sparkling in the lamp light
export const S52: React.FC<ShotProps> = ({ t, len }) => {
  const sieve = benchTop(0.4, 0.5);
  return (
    <g transform={camT(sieve.x, sieve.y - 30, kf(t, [[0, 4.6], [len, 5.0]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s52v" lights={[[sieve.x, sieve.y - 160, 540]]} o={0.42} />
      <Glow x={sieve.x} y={sieve.y - 200} r={460} o={0.4} />
      {/* the sieve surface */}
      <ellipse cx={sieve.x} cy={sieve.y} rx={130} ry={30} fill="#8A8A90" />
      <ellipse cx={sieve.x} cy={sieve.y - 4} rx={115} ry={24} fill="#6E6A78" />
      {/* sparkling grains */}
      {Array.from({ length: 20 }).map((_, i) => {
        const gx = sieve.x - 90 + rnd(161, i) * 180;
        const gy = sieve.y - 20 + rnd(162, i) * 36;
        const tw = 0.5 + 0.5 * Math.sin(t / 4 + i * 1.7);
        return <circle key={i} cx={gx} cy={gy} r={1.5 + rnd(163, i) * 2} fill="#FFE2B0" opacity={0.4 + 0.6 * tw} />;
      })}
      {/* mesh hint */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={sieve.x - 100 + i * 40} y1={sieve.y - 22} x2={sieve.x - 100 + i * 40} y2={sieve.y + 18} stroke="#4A4660" strokeWidth={1.5} opacity={0.6} />
      ))}
    </g>
  );
};

// S53: macro insert — the paper funnel, the sand running back into the bulb
export const S53: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const funnel = benchTop(0.5, 0.5);
  const pour = clamp(t / len);
  return (
    <g transform={camT((hg.x + funnel.x) / 2, (hg.y + funnel.y) / 2 - 50, kf(t, [[0, 3.0], [len, 3.4]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s53v" lights={[[(hg.x + funnel.x) / 2, (hg.y + funnel.y) / 2 - 200, 640]]} o={0.4} />
      <Glow x={(hg.x + funnel.x) / 2} y={(hg.y + funnel.y) / 2 - 240} r={500} o={0.34} />
      {/* the paper funnel */}
      <g transform={`translate(${funnel.x} ${funnel.y}) rotate(${8 + pour * 4})`}>
        <path d="M -60 -80 L 60 -80 L 10 20 L -10 20 Z" fill="#D9C8A8" stroke="#B9A888" strokeWidth={2} />
        <path d="M -60 -80 L 60 -80 L 10 20 L -10 20 Z" fill="none" stroke="#B9A888" strokeWidth={2} />
        {/* sand going in */}
        {pour > 0.2 ? (
          <g>
            <path d={`M -8 -60 L -4 18`} stroke={SAND} strokeWidth={4} fill="none" opacity={0.8} />
            {Array.from({ length: 8 }).map((_, i) => {
              const yy = funnel.y - 60 + ((t * 2.5 + i * 17) % 70);
              const xx = funnel.x - 4 + (rnd(171, i) - 0.5) * 6;
              return <circle key={i} cx={xx} cy={yy} r={2} fill={SAND} opacity={0.8} />;
            })}
          </g>
        ) : null}
      </g>
      {/* the hourglass below, filling */}
      <ellipse cx={hg.x} cy={hg.y + 14} rx={75} ry={12} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.2} t={t} flow={pour * 0.5} caked={false} cap={1} crack={1} glow={0.25} />
      {/* his hand steadying the funnel */}
      <g filter="url(#rimR)">
        <path d={`M ${funnel.x + 80} ${funnel.y - 60} Q ${funnel.x + 40} ${funnel.y - 40} ${funnel.x + 20} ${funnel.y - 10}`} stroke={MINH.line} strokeWidth={28} fill="none" strokeLinecap="round" />
        <path d={`M ${funnel.x + 80} ${funnel.y - 60} Q ${funnel.x + 40} ${funnel.y - 40} ${funnel.x + 20} ${funnel.y - 10}`} stroke={MINH.skin} strokeWidth={20} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// S54: close-up — the wooden cap pressed back on
export const S54: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const press = clamp(t / len);
  return (
    <g transform={camT(hg.x, hg.y - 80, kf(t, [[0, 4.0], [len, 4.4]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s54v" lights={[[hg.x, hg.y - 180, 520]]} o={0.4} />
      <Glow x={hg.x} y={hg.y - 220} r={440} o={0.36} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={80} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.8} t={t} flow={0.3} caked={false} cap={1 - press * 0.8} crack={1} glow={0.3} />
      {/* his thumb pressing the cap */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x + 60} ${hg.y - 160 - press * 20} Q ${hg.x + 30} ${hg.y - 140} ${hg.x + 10} ${hg.y - 120}`} stroke={MINH.line} strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x + 60} ${hg.y - 160 - press * 20} Q ${hg.x + 30} ${hg.y - 140} ${hg.x + 10} ${hg.y - 120}`} stroke={MINH.skin} strokeWidth={18} fill="none" strokeLinecap="round" />
        <ellipse cx={hg.x + 6} cy={hg.y - 118} rx={10} ry={14} fill={MINH.skin} stroke={MINH.line} strokeWidth={3} transform="rotate(10 ${hg.x + 6} ${hg.y - 118})" />
      </g>
    </g>
  );
};

// S55: close-up — the hourglass in his palm; he turns it over
export const S55: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const turn = kf(t, [[0, 0], [len * 0.6, 0], [len, 180]]);
  return (
    <g transform={camT(hg.x, hg.y - 60, kf(t, [[0, 3.8], [len, 4.2]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s55v" lights={[[hg.x, hg.y - 160, 540]]} o={0.4} />
      <Glow x={hg.x} y={hg.y - 200} r={460} o={0.36} />
      {/* his palm */}
      <ellipse cx={hg.x} cy={hg.y + 30} rx={70} ry={18} fill={MINH.skin} stroke={MINH.line} strokeWidth={3} />
      {/* the hourglass turning */}
      <g transform={`translate(${hg.x} ${hg.y - 30}) rotate(${turn})`}>
        <Hourglass x={0} y={0} s={2.4} t={t} flow={clamp((t - len * 0.5) / (len * 0.5)) * 0.8} caked={false} cap={0} crack={1} glow={0.4} />
      </g>
      {/* fingers curled under */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x - 60} ${hg.y + 20} Q ${hg.x - 30} ${hg.y + 10} ${hg.x} ${hg.y + 15}`} stroke={MINH.line} strokeWidth={18} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x - 60} ${hg.y + 20} Q ${hg.x - 30} ${hg.y + 10} ${hg.x} ${hg.y + 15}`} stroke={MINH.skin} strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// S56: macro — the first thread of sand falls
export const S56: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const flow = clamp(t / len) * 0.3;
  return (
    <g transform={camT(hg.x, hg.y - 40, kf(t, [[0, 4.4], [len, 4.8]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s56v" lights={[[hg.x, hg.y - 160, 520]]} o={0.4} />
      <Glow x={hg.x} y={hg.y - 200} r={440} o={0.38} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={80} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.0} t={t} flow={flow} caked={false} cap={0} crack={1} glow={0.45} />
      {/* the first thread catching the light */}
      <path d={`M ${hg.x} ${hg.y - 20} L ${hg.x} ${hg.y + 40}`} stroke="#FFE2B0" strokeWidth={1.5} opacity={0.6 * clamp(t / 20)} />
    </g>
  );
};

// S57: macro — the little mound growing, grain by grain
export const S57: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const flow = clamp(t / len) * 0.7;
  return (
    <g transform={camT(hg.x, hg.y - 30, kf(t, [[0, 4.8], [len, 5.2]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s57v" lights={[[hg.x, hg.y - 140, 540]]} o={0.42} />
      <Glow x={hg.x} y={hg.y - 180} r={460} o={0.4} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={85} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.2} t={t} flow={flow} caked={false} cap={0} crack={1} glow={0.5} />
      {/* the mound growing */}
      <path d={`M ${hg.x - 30} ${hg.y + 50} Q ${hg.x - 15} ${hg.y + 40 - flow * 20} ${hg.x} ${hg.y + 50 - flow * 25} Q ${hg.x + 15} ${hg.y + 40 - flow * 20} ${hg.x + 30} ${hg.y + 50} Z`} fill={SAND} opacity={0.9} />
      {/* grains still falling */}
      {Array.from({ length: 10 }).map((_, i) => {
        const yy = hg.y - 10 + ((t * 2.5 + i * 23) % 60);
        const xx = hg.x + (rnd(181, i) - 0.5) * 8;
        return <circle key={i} cx={xx} cy={yy} r={1.8} fill={SAND} opacity={0.9} />;
      })}
    </g>
  );
};

// S58: macro — the scar catching the light, not blocking the flow
export const S58: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.55, 0.45);
  const flow = 0.6 + 0.2 * Math.sin(t / 10);
  const glint = 0.5 + 0.5 * Math.sin(t / 6);
  return (
    <g transform={camT(hg.x + 16, hg.y - 100, kf(t, [[0, 5.6], [len, 6.0]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s58v" lights={[[hg.x + 16, hg.y - 180, 480]]} o={0.42} />
      <Glow x={hg.x + 16} y={hg.y - 220} r={440} o={0.4} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={85} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={3.2} t={t} flow={flow} caked={false} cap={0} crack={1} glow={0.5} />
      {/* the scar catching the light */}
      <path d={`M ${hg.x + 30} ${hg.y - 160} L ${hg.x + 10} ${hg.y - 130} L ${hg.x + 22} ${hg.y - 110} L ${hg.x - 8} ${hg.y - 80}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6 + 0.3 * glint} strokeLinecap="round" />
      {/* sand flowing past it */}
      <path d={`M ${hg.x} ${hg.y - 30} L ${hg.x} ${hg.y + 50}`} stroke={SAND} strokeWidth={2} opacity={0.7} />
    </g>
  );
};

// =====================================================================
// ACT VI — she watches, touches, understands (S59-S65)
// =====================================================================

// S59: medium — he sets it down in front of her: three minutes of yours
export const S59: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.5, 0.5);
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 80, b: 25 } } },
    { f: 25, p: { armR: { a: 50, b: 30 }, look: 0.3 } },
    { f: 50, p: { armR: { a: 30, b: -10 } } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 30, p: { look: 0.6, headTilt: 3 } },
  ]);
  const j = joints(minhPose);
  const hand = toWorld(minhPose, j.armR.end);
  const place = clamp(t / 50);
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1015]]), 570, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Workshop t={t + 620} id="s59" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'neutral'], [40, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
      {/* the hourglass being set down */}
      <g transform={`translate(${hg.x + (1 - place) * 80} ${hg.y - place * 10})`}>
        <ellipse cx={0} cy={12} rx={70} ry={11} fill="#000" opacity={0.3} />
        <Hourglass x={0} y={0} s={1.8} t={t} flow={0.4} caked={false} cap={0} crack={1} glow={0.45} />
      </g>
      <Glow x={hg.x} y={hg.y - 60} r={150} o={0.35} />
    </g>
  );
};

// S60: close-up — Linh watches the sand; her eyes are red
export const S60: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.0 * (1 + 0.05 * clamp(t / len));
  const head = { x: 1080, y: 560 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.22, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 2, ...faceAt(t, [[0, 'worried'], [40, 'neutral']]) };
  return (
    <g transform={camT(1080, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 640} id="s60" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.3} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
      {/* the hourglass small in the lower frame */}
      <g opacity={0.6}>
        <Hourglass x={700} y={900} s={1.4} t={t} flow={0.4} caked={false} cap={0} crack={1} glow={0.4} />
      </g>
    </g>
  );
};

// S61: close-up — the small smile arrives
export const S61: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1060, y: 570 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.2, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 2], [len, 0]]), ...faceAt(t, [[0, 'neutral'], [50, 'happy'], [120, 'smug']]) };
  return (
    <g transform={camT(1060, 570, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 660} id="s61" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S62: macro insert — her fingertips touch the cool glass over the faint scar
export const S62: React.FC<ShotProps> = ({ t, len }) => {
  const hg = benchTop(0.5, 0.5);
  const touch = clamp(t / 40);
  return (
    <g transform={camT(hg.x, hg.y - 60, kf(t, [[0, 4.2], [len, 4.6]]))}>
      <Tabletop edge={1400} wood="#5B4038" grain="#4A342C" lip="#3A2826" kind="wood" floor="#1A120E" floorLines="#120C09" />
      <LightVeil id="s62v" lights={[[hg.x, hg.y - 160, 520]]} o={0.42} />
      <Glow x={hg.x} y={hg.y - 200} r={440} o={0.38} />
      <ellipse cx={hg.x} cy={hg.y + 14} rx={80} ry={13} fill="#000" opacity={0.3} />
      <Hourglass x={hg.x} y={hg.y} s={2.8} t={t} flow={0.5} caked={false} cap={0} crack={1} glow={0.45} />
      {/* her fingertips touching the glass */}
      <g filter="url(#rimR)">
        <path d={`M ${hg.x - 70} ${hg.y - 120} Q ${hg.x - 40} ${hg.y - 100} ${hg.x - 20} ${hg.y - 80}`} stroke={LINH.line} strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={`M ${hg.x - 70} ${hg.y - 120} Q ${hg.x - 40} ${hg.y - 100} ${hg.x - 20} ${hg.y - 80}`} stroke={LINH.skin} strokeWidth={16} fill="none" strokeLinecap="round" />
        <ellipse cx={hg.x - 18} cy={hg.y - 78} rx={8} ry={12} fill={LINH.skin} stroke={LINH.line} strokeWidth={2.5} transform="rotate(15 ${hg.x - 18} ${hg.y - 78})" opacity={touch} />
        {/* fingertip glow on the glass */}
        {touch > 0.5 ? <circle cx={hg.x - 16} cy={hg.y - 76} r={6} fill="#BFE0F0" opacity={0.4 * (touch - 0.5) * 2} /> : null}
      </g>
    </g>
  );
};

// S63: close-up — she says the scar makes it real
export const S63: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 1040, y: 570 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.18, look: 0.3, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 1, ...faceAt(t, [[0, 'neutral'], [40, 'happy'], [100, 'smug']]) };
  return (
    <g transform={camT(1040, 570, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -380) scale(1.6)">
          <Workshop t={t + 680} id="s63" veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={LINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// S64: two-shot — Minh answers: what was broken and healed keeps a mark
export const S64: React.FC<ShotProps> = ({ t, len }) => {
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.35, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 40, p: { armR: { a: 30, b: -8 }, look: 0.5 } },
    { f: 80, p: { look: 0.3 } },
  ]);
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 40, p: { look: 0.5 } },
    { f: 80, p: { armL: { a: 44, b: 26 }, armR: { a: 44, b: 26 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1005]]), 570, kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Workshop t={t + 700} id="s64" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral'], [40, 'tired'], [100, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'neutral'], [60, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
    </g>
  );
};

// S65: close-up — Minh: what matters is that it still moves inside
export const S65: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 880, y: 600 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 1, ...faceAt(t, [[0, 'neutral'], [40, 'tired'], [80, 'happy']]) };
  return (
    <g transform={camT(880, 600, kf(t, [[0, 1], [len, 1.05]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -400) scale(1.7)">
          <Workshop t={t + 720} id="s65" bench={false} veil={0.35} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0706" opacity={0.28} />
      <Hero look={MINH} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// =====================================================================
// ACT VII — she leaves, Minh alone, the rain keeps falling (S66-S76)
// =====================================================================

// S66: wide — she pays, thanks him, steps out; the chime rings
export const S66: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp(t / 25));
  const step = clamp((t - 30) / 50);
  const walkX = kf(t, [[30, 1050], [len, 1250]]);
  const walkY = WORKSHOP.P(0.85, 1, 0.5).y - LEG_LEN * 0.55 * step;
  const linhPose = poseAt(t, [
    { f: 0, p: sitPose(LINH_STOOL.x + 60, LINH_STOOL.y, 0.66, { yaw: 0.3, look: 0.4, armL: { a: 50, b: 30 }, armR: { a: 50, b: 30 } }) },
    { f: 40, p: { yaw: 0.5, look: 0.6 } },
  ]);
  const minhPose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.35, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 40, p: { look: 0.5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1100]]), 540, kf(t, [[0, 0.95], [len, 1.0]]))}>
      <Workshop t={t + 740} id="s66" open={open} chime={step > 0.5 ? 1 : 0} veil={0.4} />
      <Hero look={MINH} pose={{ ...minhPose, ...faceAt(t, [[0, 'neutral'], [60, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={LINH} pose={{ ...linhPose, ...faceAt(t, [[0, 'happy'], [60, 'neutral']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={1} />
      <Stool u={0.6} w={0.55} />
      {/* Linh standing and walking out */}
      {step > 0 ? (
        <Hero look={LINH} pose={{
          ...basePose,
          x: walkX,
          y: walkY,
          scale: 0.62,
          yaw: 0.4,
          look: 0.3,
          armL: { a: 24, b: 16 },
          armR: { a: 24, b: 16 },
          ...faceAt(t, [[40, 'neutral']]),
        }} rimId="rimL" shadow={0.8} />
      ) : null}
      <Foreground blur={10}>
        <path d="M 80 1080 Q 180 800 340 720 Q 260 900 300 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S67: insert — the chime swinging after the door
export const S67: React.FC<ShotProps> = ({ t, len }) => {
  const swing = Math.sin(t / 5) * 8 * clamp(t / 15);
  return (
    <g transform={camT(1372, 420, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <rect x={-900} y={-600} width={1800} height={1400} fill="#0E0A08" opacity={0.55} />
      <g transform={`rotate(${swing} 1372 332)`}>
        <path d="M 1372 332 L 1372 348" stroke="#2A2020" strokeWidth={3} />
        <rect x={1348} y={348} width={48} height={7} rx={3} fill={WOOD} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <path d={`M ${1354 + i * 12} 355 L ${1354 + i * 12} 362`} stroke="#2A2020" strokeWidth={2} />
            <rect x={1350 + i * 12} y={362} width={7} height={30 + (i % 2) * 10} rx={3} fill={BRASS} />
            <rect x={1351 + i * 12} y={364} width={2} height={26 + (i % 2) * 10} fill="#EFD9A0" opacity={0.8} />
          </g>
        ))}
      </g>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 1300 + rnd(191, i) * 150;
        const y = 350 + ((t * 5 + i * 43) % 200);
        return <path key={i} d={`M ${x} ${y} l -3 18`} stroke="#A9C2D2" strokeWidth={1.4} opacity={0.35} />;
      })}
      <Glow x={1372} y={400} r={200} o={0.2} />
    </g>
  );
};

// S68: wide — the door closes; her shape fades into the rain
export const S68: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((len - t) / 30));
  const fade = clamp((t - len * 0.6) / (len * 0.4));
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1130]]), 520, kf(t, [[0, 0.9], [len, 0.95]]))}>
      <Workshop t={t + 760} id="s68" open={open} veil={0.42} />
      {/* Linh's shape fading in the doorway */}
      {fade < 1 ? (
        <g opacity={1 - fade}>
          <Hero look={LINH} pose={{
            ...basePose,
            x: 1250,
            y: WORKSHOP.P(0.85, 1, 0.5).y - LEG_LEN * 0.55,
            scale: 0.62,
            yaw: 0.4,
            look: 0.3,
            armL: { a: 24, b: 16 },
            armR: { a: 24, b: 16 },
            ...faceAt(t, [[0, 'neutral']]),
          }} rimId="rimL" shadow={0.8} />
        </g>
      ) : null}
      <Foreground blur={10}>
        <path d="M 80 1080 Q 180 800 340 720 Q 260 900 300 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S69: medium — Minh tidies the bench
export const S69: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.4, look: 0.4, armL: { a: 20, b: -10 }, armR: { a: 50, b: 30 } } },
    { f: 30, p: { armR: { a: 40, b: 24 }, look: 0.2 } },
    { f: 60, p: { armR: { a: 55, b: 32 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 610, kf(t, [[0, 1.65], [len, 1.75]]))}>
      <Workshop t={t + 780} id="s69" bench={false} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={1} />
      {/* he tidies: a cloth in his hand */}
      <g transform={`translate(${hand.x} ${hand.y - 10}) rotate(${Math.sin(t / 5) * 6})`}>
        <path d="M -20 -10 Q 0 -16 20 -10 L 18 12 Q 0 18 -18 12 Z" fill="#6A5A52" />
      </g>
    </g>
  );
};

// S70: close-up — his hand on the lamp switch; one light goes off
export const S70: React.FC<ShotProps> = ({ t, len }) => {
  const lamp = 1 - easeOut(clamp((t - 20) / 30));
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.45, look: 0.4, armL: { a: 14, b: -6 }, armR: { a: 60, b: 35 } } },
    { f: 25, p: { armR: { a: 45, b: 28 }, look: 0.2 } },
    { f: 50, p: { armR: { a: 30, b: -10 } } },
  ]);
  const j = joints(pose);
  const hand = toWorld(pose, j.armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), 620, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Workshop t={t + 800} id="s70" bench={false} lamp={lamp} veil={0.4} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [40, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <Bench lamp={lamp} />
      {/* his hand near the lamp switch */}
      <g transform={`translate(${hand.x} ${hand.y - 15})`}>
        <circle cx={0} cy={0} r={18} fill={MINH.skin} stroke={MINH.line} strokeWidth={3} />
      </g>
    </g>
  );
};

// S71: insert, low angle — the shelf of waiting things in the low light
export const S71: React.FC<ShotProps> = ({ t, len }) => {
  const lamp = 0.4;
  return (
    <g transform={camT(640, kf(t, [[0, 480], [len, 470]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Workshop t={t + 820} id="s71" lamp={lamp} veil={0.45} />
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0706" opacity={0.22} />
    </g>
  );
};

// S72: close-up — the compass with a dead needle and the music box
export const S72: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(640, 500, kf(t, [[0, 2.2], [len, 2.5]]))}>
      <rect x={-600} y={-500} width={1200} height={1000} fill="#0E0A08" opacity={0.7} />
      <LightVeil id="s72v" lights={[[640, 480, 500]]} o={0.4} />
      <Glow x={640} y={460} r={400} o={0.25} />
      {/* the shelf */}
      <rect x={500} y={340} width={292} height={290} fill="#2A1F1C" />
      {[392, 446, 500, 554, 608, 640].map((y) => (
        <g key={y}>
          <rect x={502} y={y - 6} width={292} height={9} fill={WOOD_L} />
          <rect x={502} y={y - 6} width={292} height={2} fill="#FFE2B0" opacity={0.2} />
        </g>
      ))}
      {/* compass with dead needle */}
      <circle cx={530} cy={526} r={12} fill={BRASS} />
      <circle cx={530} cy={526} r={8} fill="#EFE4C8" />
      <path d="M 530 518 L 533 526 L 530 534 L 527 526 Z" fill="#A8323E" opacity={0.6} />
      {/* music box */}
      <rect x={524} y={420} width={58} height={22} rx={3} fill="#7A4A42" />
      <rect x={524} y={420} width={58} height={5} fill="#9A6A5A" />
      <path d="M 588 432 l 10 0 l 0 -5" stroke={BRASS} strokeWidth={3} fill="none" />
      {/* photograph */}
      <rect x={640} y={404} width={42} height={38} fill="#D9C8A8" transform="rotate(-3 661 423)" />
      <rect x={646} y={410} width={30} height={26} fill="#5E4A44" transform="rotate(-3 661 423)" />
      {/* lantern glow */}
      <circle cx={612} cy={624} r={7} fill="#FFD39A" opacity={0.9} />
      <Glow x={612} y={624} r={80} o={0.4} />
    </g>
  );
};

// S73: close-up — the flaking wooden photo frame
export const S73: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(661, 423, kf(t, [[0, 3.4], [len, 3.8]]))}>
      <rect x={-500} y={-400} width={1000} height={800} fill="#0E0A08" opacity={0.7} />
      <LightVeil id="s73v" lights={[[661, 400, 400]]} o={0.4} />
      <Glow x={661} y={400} r={320} o={0.3} />
      {/* the flaking frame */}
      <rect x={640} y={404} width={42} height={38} fill="#D9C8A8" transform="rotate(-3 661 423)" />
      <rect x={646} y={410} width={30} height={26} fill="#5E4A44" transform="rotate(-3 661 423)" />
      {/* the old man in the photo */}
      <circle cx={661} cy={420} r={7} fill="#2A2020" />
      <path d="M 651 434 Q 661 424 671 434 Z" fill="#2A2020" />
      {/* flaking paint */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={640 + rnd(201, i) * 42} cy={404 + rnd(202, i) * 38} r={2 + rnd(203, i) * 3} fill="#8A7A62" opacity={0.6} />
      ))}
    </g>
  );
};

// S74: medium — Minh alone, the shelf behind him, the lamp low
export const S74: React.FC<ShotProps> = ({ t, len }) => {
  const lamp = 0.35;
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale, yaw: 0.3, look: 0.2, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 60, p: { look: 0 } },
    { f: 120, p: { headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Workshop t={t + 840} id="s74" lamp={lamp} bench={false} veil={0.48} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [60, 'tired']]) }} rimId="rimR" shadow={0.6} />
      <Bench lamp={lamp} />
      <Foreground blur={10}>
        <path d="M 1480 1080 Q 1400 840 1300 780 Q 1380 920 1370 1080 Z" fill="#0E0A08" />
      </Foreground>
    </g>
  );
};

// S75: wide — the shop at its quietest; the rain keeps on
export const S75: React.FC<ShotProps> = ({ t, len }) => {
  const lamp = 0.3;
  const pose = poseAt(t, [
    { f: 0, p: { x: MINH_STAND.x, y: MINH_STAND.y, scale: MINH_STAND.scale * 0.95, yaw: 0.2, look: 0, armL: { a: 14, b: -6 }, armR: { a: 20, b: -10 } } },
    { f: 80, p: { look: -0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), 530, kf(t, [[0, 0.85], [len, 0.9]]))}>
      <Workshop t={t + 860} id="s75" lamp={lamp} bench={false} veil={0.5} />
      <Hero look={MINH} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [80, 'tired']]) }} rimId="rimR" shadow={0.7} />
      <Bench lamp={lamp} />
      <Stool u={0.6} w={0.55} />
      <Dust t={t} seed={37} x0={600} y0={300} w={600} h={400} n={20} o={0.35} />
      <Foreground blur={10}>
        <path d="M 60 1080 Q 160 800 320 720 Q 240 900 280 1080 Z" fill="#0E0A08" />
        <path d="M 1880 1080 Q 1800 860 1700 800 Q 1760 920 1720 1080 Z" fill="#0C0806" />
      </Foreground>
    </g>
  );
};

// S76: close-up, window — rain on the glass; the last line
export const S76: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.9], [len, 2.1]]))}>
      <rect x={-800} y={-600} width={1600} height={1200} fill="#0E0A08" opacity={0.6} />
      {/* the window */}
      <rect x={840} y={356} width={240} height={256} fill="#1E2A36" />
      <rect x={846} y={362} width={228} height={244} fill="#2A3A48" />
      {/* the night city beyond */}
      <rect x={846} y={480} width={228} height={126} fill="#0E1A24" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={850 + rnd(221, i) * 200} y={490 + rnd(222, i) * 100} width={8 + rnd(223, i) * 12} height={6 + rnd(224, i) * 10} fill="#FFE2B0" opacity={0.15 + rnd(225, i) * 0.2} />
      ))}
      {/* rain on the glass */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = 850 + rnd(231, i) * 220;
        const y = 370 + ((t * 3.5 + i * 41) % 230);
        return <path key={i} d={`M ${x} ${y} l -2.5 20`} stroke="#A9C2D2" strokeWidth={1.6} opacity={0.4} />;
      })}
      {/* droplets */}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse key={`d${i}`} cx={858 + rnd(232, i) * 200} cy={380 + rnd(233, i) * 210} rx={3 + rnd(234, i) * 5} ry={5 + rnd(235, i) * 9} fill="#DCE9F2" opacity={0.18} />
      ))}
      <rect x={840} y={356} width={240} height={256} fill="none" stroke={WOOD_D} strokeWidth={8} />
      <line x1={960} y1={356} x2={960} y2={612} stroke={WOOD_D} strokeWidth={6} />
      <line x1={840} y1={484} x2={1080} y2={484} stroke={WOOD_D} strokeWidth={6} />
      {/* the last light, dimming */}
      <Glow x={960} y={480} r={280} o={0.12 + 0.08 * Math.sin(t / 20)} />
    </g>
  );
};
