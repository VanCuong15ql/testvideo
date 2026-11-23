import React from 'react';
import { makeRoom, Box, S3 } from '../room';
import { RoomShell, BackWindow, Pendant, pendantLight, WallLight, FloorShadow, WallClock } from '../furnish';
import { Glow, LightVeil, Dust, Cone } from '../light';
import { rnd } from '../anim';

// The old repair shop on a rainy November afternoon: a back wall of shelves full of other people's things, a window
// with the rain in it, a door and its brass wind chime, a long workbench under a desk lamp, and a stool for whoever
// comes in. Built with the room kit.
//
// The bench is a separate component, because it stands between Minh and the camera: draw <Workshop bench={false}>,
// then Minh at stand(WORKSHOP, u, 0.10), then <Bench /> (which hides his legs), then whoever sits in front.
//
// Coordinates: the back wall is 470-1450 x 300-760. The bench top is v 0.78, from u 0.06 to 0.68 and w 0.15 to 0.31;
// benchTop(u, d) is a point on it (d 0 back edge, 1 front edge). The desk lamp sits at u 0.60, w 0.24; the window is
// 840-1080 x 356-612; the door is 1298-1442; the shelf unit is 496-800 x 344-646.

export const WORKSHOP = makeRoom({ x: 960, y: 470 }, { x0: 470, x1: 1450, y0: 300, y1: 760 }, 3.4);
export const BENCH_TOP = 0.78;
const W = {
  wall: '#3E3431',
  side: '#332B29',
  floor: '#2B211D',
  wood: '#5B4038',
  woodLight: '#7A5747',
  woodDark: '#3A2826',
  panel: '#2A1F1C',
  brass: '#C9A15A',
  metal: '#6E6A78',
  line: '#1A1210',
};

/** A point on the bench top: u across the bench, d 0 (back edge) to 1 (front edge). */
export const benchTop = (u: number, d: number) => WORKSHOP.P(u, BENCH_TOP, 0.16 + 0.14 * d);
/** Where the desk lamp stands. */
export const SHOP_LAMP = () => WORKSHOP.P(0.6, BENCH_TOP, 0.24);

export const Workshop: React.FC<{ t: number; id?: string; veil?: number; lamp?: number; pendant?: number; open?: number; chime?: number; bench?: boolean }> = ({
  t, id = 'shop', veil = 0.45, lamp = 1, pendant = 1, open = 0, chime = 0, bench = true,
}) => {
  const R = WORKSHOP;
  const { P, Q } = R;
  const L = SHOP_LAMP();
  const shade = { x: L.x - 54, y: L.y - 108 };
  const wind = Math.sin(t / 26) * 1.6 + chime * Math.sin(t / 5.5) * 9;
  const rain = (x0: number, y0: number, w: number, h: number, n: number, seed: number) =>
    Array.from({ length: n }).map((_, i) => {
      const x = x0 + 8 + rnd(seed, i) * (w - 16);
      const y = y0 + ((t * 5 + i * 41 + rnd(seed + 1, i) * h) % h);
      return <path key={`r${seed}-${i}`} d={`M ${x} ${y} l -3 20`} stroke="#A9C2D2" strokeWidth={1.6} opacity={0.42} />;
    });
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall={W.wall} side={W.side} floorC={W.floor} lines="#1A120F" />

      {/* ---- the window, rain on it ---- */}
      <BackWindow r={R} id={`${id}win`} t={t} x0={840} x1={1080} y0={356} y1={612} sun={{ x: 1030, y: 600 }} cols={2} curtains={false} night />
      <g clipPath={`url(#${id}wc)`}>{rain(840, 356, 240, 256, 26, 3)}</g>
      <defs>
        <clipPath id={`${id}wc`}>
          <rect x={840} y={356} width={240} height={256} />
        </clipPath>
        <clipPath id={`${id}dc`}>
          <rect x={1310} y={344} width={120} height={210} />
        </clipPath>
      </defs>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={`d${i}`} cx={858 + rnd(9, i) * 200} cy={380 + rnd(10, i) * 210} rx={3 + rnd(11, i) * 5} ry={5 + rnd(12, i) * 9} fill="#DCE9F2" opacity={0.18} />
      ))}
      {/* a pot of brushes on the sill */}
      {(() => {
        const p = P(0.9, 0.62, 0.02);
        return (
          <g>
            <path d={`M ${p.x - 15} ${p.y} L ${p.x - 12} ${p.y - 40} L ${p.x + 12} ${p.y - 40} L ${p.x + 15} ${p.y} Z`} fill="#7A5A44" />
            {[-6, 0, 7].map((dx, i) => (
              <path key={i} d={`M ${p.x + dx} ${p.y - 40} L ${p.x + dx + i * 3 - 4} ${p.y - 82 - i * 8}`} stroke={i % 2 ? W.brass : W.woodLight} strokeWidth={3} strokeLinecap="round" />
            ))}
          </g>
        );
      })()}

      {/* ---- the shelf unit of other people's things ---- */}
      <rect x={496} y={344} width={304} height={302} fill={W.line} />
      <rect x={502} y={350} width={292} height={290} fill={W.panel} />
      {[392, 446, 500, 554, 608, 640].map((y) => (
        <g key={y}>
          <rect x={502} y={y - 6} width={292} height={9} fill={W.woodLight} />
          <rect x={502} y={y - 6} width={292} height={2} fill={S3.warm} opacity={0.35} />
        </g>
      ))}
      {[502, 700, 786].map((x) => (
        <rect key={x} x={x} y={350} width={8} height={290} fill={W.woodDark} />
      ))}
      {/* top: jars and a biscuit tin */}
      {[[530, 372, '#C98E58'], [558, 376, '#9FB49A'], [584, 370, '#D9C69A']].map(([x, y, c], i) => (
        <g key={`j${i}`}>
          <rect x={Number(x) - 9} y={Number(y) - 18} width={18} height={18} rx={4} fill={String(c)} />
          <rect x={Number(x) - 10} y={Number(y) - 24} width={20} height={6} rx={2} fill={W.woodDark} />
        </g>
      ))}
      <rect x={634} y={356} width={52} height={32} rx={4} fill="#8A5A50" />
      <rect x={634} y={356} width={52} height={6} fill="#A97466" />
      <circle cx={660} cy={372} r={3} fill={W.brass} />
      {/* 2nd shelf: a music box, a photograph of the old man */}
      <rect x={524} y={420} width={58} height={22} rx={3} fill="#7A4A42" />
      <rect x={524} y={420} width={58} height={5} fill="#9A6A5A" />
      <path d="M 588 432 l 10 0 l 0 -5" stroke={W.brass} strokeWidth={3} fill="none" />
      <rect x={640} y={404} width={42} height={38} fill="#D9C8A8" transform="rotate(-3 661 423)" />
      <rect x={646} y={410} width={30} height={26} fill="#5E4A44" transform="rotate(-3 661 423)" />
      <circle cx={661} cy={420} r={7} fill="#2A2020" />
      <path d="M 651 434 Q 661 424 671 434 Z" fill="#2A2020" />
      {/* 3rd shelf: a doll, a zippo, notebooks */}
      <circle cx={527} cy={474} r={10} fill="#E2C6B0" />
      <path d="M 519 482 L 535 482 L 532 500 L 522 500 Z" fill="#7A9AA8" />
      <rect x={566} y={486} width={13} height={20} rx={3} fill="#B9B2A0" />
      <rect x={566} y={486} width={13} height={5} fill="#D4CEC0" />
      <rect x={606} y={486} width={42} height={8} fill="#5A4A3E" />
      <rect x={610} y={478} width={38} height={8} fill="#6A5A4A" />
      <rect x={614} y={470} width={34} height={8} fill="#7A6A56" />
      {/* 4th shelf: a compass with a dead needle, a box of screws, rolled paper */}
      <circle cx={530} cy={526} r={12} fill={W.brass} />
      <circle cx={530} cy={526} r={8} fill="#EFE4C8" />
      <path d="M 530 518 L 533 526 L 530 534 L 527 526 Z" fill="#A8323E" />
      <rect x={564} y={518} width={40} height={24} rx={3} fill={W.wood} />
      <rect x={564} y={518} width={40} height={5} fill={W.woodLight} />
      <path d="M 622 540 L 660 528" stroke="#D9C8A8" strokeWidth={9} strokeLinecap="round" />
      <path d="M 626 538 L 656 528" stroke="#B9A888" strokeWidth={4} strokeLinecap="round" />
      {/* 5th shelf: books, a vase, a radio */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`b${i}`} x={520 + i * 9} y={572 - i * 2} width={8} height={30 + i * 2} fill={['#6A4A52', '#4E5B4A', '#8A6A3A', '#5A4A6A'][i]} />
      ))}
      <path d="M 640 604 Q 634 580 640 568 Q 646 580 640 604 Z" fill="#8A7A6A" />
      <rect x={676} y={572} width={56} height={34} rx={4} fill="#6A5A48" />
      <rect x={682} y={578} width={26} height={18} rx={2} fill="#3A3028" />
      <circle cx={716} cy={588} r={5} fill={W.brass} />
      {/* the bottom: a crate of spare parts, a lantern */}
      <rect x={512} y={610} width={60} height={28} fill={W.wood} />
      <rect x={512} y={610} width={60} height={6} fill={W.woodLight} />
      <path d="M 600 638 L 600 616 Q 612 604 624 616 L 624 638 Z" fill="#7A6A4A" />
      <circle cx={612} cy={624} r={7} fill="#FFD39A" opacity={0.9} />

      {/* ---- the door and its wind chime ---- */}
      <rect x={1292} y={320} width={156} height={440} fill={W.line} />
      <rect x={1298} y={326} width={144} height={434} fill={W.woodDark} />
      <rect x={1310} y={344} width={120} height={210} fill="#1E2A36" />
      <g clipPath={`url(#${id}dc)`}>
        <rect x={1310} y={344} width={120} height={210} fill="#2A3A48" />
        <rect x={1310} y={344} width={120} height={210} fill="#0E1A24" opacity={0.35 + 0.3 * open} />
        {rain(1310, 344, 120, 210, 16, 21)}
        <rect x={1310} y={344} width={120} height={210} fill="#CFE6F4" opacity={0.12 + 0.28 * open} />
      </g>
      <rect x={1310} y={344} width={120} height={210} fill="none" stroke={W.woodLight} strokeWidth={7} />
      <rect x={1310} y={566} width={120} height={162} fill={W.wood} />
      <rect x={1320} y={578} width={100} height={54} fill="none" stroke={W.woodDark} strokeWidth={4} />
      <rect x={1320} y={648} width={100} height={66} fill="none" stroke={W.woodDark} strokeWidth={4} />
      <circle cx={1416} cy={516} r={6} fill={W.brass} />
      {/* the chime: a wooden bar and four brass tubes */}
      <g transform={`rotate(${wind} 1372 332)`}>
        <path d="M 1372 332 L 1372 348" stroke="#2A2020" strokeWidth={2} />
        <rect x={1348} y={348} width={48} height={7} rx={3} fill={W.wood} />
        {[0, 1, 2, 3].map((i) => (
          <g key={`ch${i}`}>
            <path d={`M ${1354 + i * 12} 355 L ${1354 + i * 12} 362`} stroke="#2A2020" strokeWidth={1.5} />
            <rect x={1350 + i * 12} y={362} width={7} height={30 + (i % 2) * 10} rx={3} fill={W.brass} />
            <rect x={1351 + i * 12} y={364} width={2} height={26 + (i % 2) * 10} fill="#EFD9A0" opacity={0.8} />
          </g>
        ))}
      </g>

      {/* ---- the pegboard on the left wall ---- */}
      <polygon points={Q([[0, 0.18, 0.26], [0, 0.46, 0.26], [0, 0.46, 0.62], [0, 0.18, 0.62]])} fill="#2E2620" stroke={W.woodDark} strokeWidth={4} />
      {[0.31, 0.38, 0.45, 0.52, 0.59].map((w, i) => {
        const a = P(0, 0.21, w);
        const b = P(0, 0.4, w);
        const k = R.s(w) / R.s(0.4);
        return (
          <g key={`tool${i}`}>
            <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={i % 2 ? W.metal : '#8A6A4A'} strokeWidth={5 * k} strokeLinecap="round" />
            {i === 0 ? <path d={`M ${a.x - 9 * k} ${a.y} L ${a.x + 9 * k} ${a.y}`} stroke={W.metal} strokeWidth={9 * k} strokeLinecap="round" /> : null}
            {i === 2 ? <path d={`M ${b.x - 8 * k} ${b.y} L ${b.x + 8 * k} ${b.y}`} stroke="#A98A6A" strokeWidth={11 * k} strokeLinecap="round" /> : null}
            {i === 4 ? <circle cx={b.x} cy={b.y} r={5 * k} fill="none" stroke={W.metal} strokeWidth={4 * k} /> : null}
          </g>
        );
      })}

      <WallClock x={1190} y={382} r={30} t={t} />

      {bench ? <Bench lamp={lamp} /> : null}

      <Pendant r={R} u={0.36} w={0.3} v={0.2} t={t} cone={0.2} glow={0.3} />
      <WallLight r={R} u={0} v={0.36} w={0.64} o={0.5} />

      <LightVeil
        id={`${id}veil`}
        lights={[
          [960, 480, 250],
          pendantLight(R, 0.36, 0.3, 0.2),
          [shade.x, shade.y + 60, 230],
          [1372, 470, 140],
          [P(0, 0.36, 0.64).x + 40, P(0, 0.36, 0.64).y, 230],
        ]}
        o={veil}
      />
      <Glow x={960} y={500} r={330} o={0.22} kind="cool" />
      <Glow x={shade.x} y={shade.y + 20} r={300} o={0.26 * lamp} />
      <Dust t={t} seed={17} x0={L.x - 320} y0={shade.y} w={520} h={420} n={30} o={0.45} />
      <rect x={-1500} y={-1500} width={5000} height={4500} fill="#120B08" opacity={0.1} />
    </g>
  );
};

/**
 * The workbench, the desk lamp and the things on it. Draw it after Minh (it hides his legs) and before anyone who
 * sits in front of it. `lamp` dims the key light (0..1): the last shot turns it down.
 */
export const Bench: React.FC<{ lamp?: number }> = ({ lamp = 1 }) => {
  const R = WORKSHOP;
  const { P, Q } = R;
  const L = SHOP_LAMP();
  const shade = { x: L.x - 54, y: L.y - 108 };
  return (
    <g>
      <FloorShadow r={R} u={[0.04, 0.7]} w={[0.14, 0.32]} o={0.45} />
      {[0.09, 0.63].map((u) => (
        <Box key={`leg${u}`} r={R} u={[u, u + 0.04]} v={[0.82, 1]} w={[0.27, 0.29]} front={W.woodDark} side={W.line} />
      ))}
      <Box r={R} u={[0.15, 0.6]} v={[0.93, 0.95]} w={[0.17, 0.27]} front={W.woodDark} top={W.wood} side={W.line} />
      <Box r={R} u={[0.07, 0.67]} v={[0.82, 0.88]} w={[0.17, 0.29]} front={W.wood} side={W.woodDark} />
      <Box r={R} u={[0.06, 0.68]} v={[BENCH_TOP, 0.82]} w={[0.15, 0.31]} front={W.woodLight} top={W.wood} side={W.woodDark} rim />
      <polygon points={Q([[0.06, BENCH_TOP, 0.31], [0.68, BENCH_TOP, 0.31], [0.68, BENCH_TOP, 0.33], [0.06, BENCH_TOP, 0.33]])} fill={W.woodDark} />
      {/* a crate of jars under the bench */}
      {(() => {
        const p = P(0.2, 0.9, 0.26);
        return (
          <g>
            <rect x={p.x - 42} y={p.y} width={84} height={40} fill={W.wood} />
            <rect x={p.x - 42} y={p.y} width={84} height={6} fill={W.woodLight} />
          </g>
        );
      })()}
      {/* a white dish, a jar of screws, a vise, a rag on the bench */}
      {(() => {
        const d = benchTop(0.3, 0.38);
        const j = benchTop(0.18, 0.55);
        const v = benchTop(0.52, 0.28);
        return (
          <g>
            <ellipse cx={d.x} cy={d.y + 3} rx={46} ry={15} fill="#000" opacity={0.3} />
            <ellipse cx={d.x} cy={d.y} rx={46} ry={14} fill="#E8E0D2" />
            <ellipse cx={d.x} cy={d.y - 2} rx={36} ry={9} fill="#CFC5B4" />
            <rect x={j.x - 16} y={j.y - 38} width={32} height={38} rx={6} fill="#B9C6C2" opacity={0.7} />
            <rect x={j.x - 18} y={j.y - 42} width={36} height={7} rx={3} fill="#5A5A52" />
            <path d={`M ${v.x - 22} ${v.y} L ${v.x + 22} ${v.y} L ${v.x + 18} ${v.y - 34} L ${v.x - 18} ${v.y - 34} Z`} fill="#4E5A62" />
            <rect x={v.x - 6} y={v.y - 40} width={12} height={12} fill="#8A8A90" />
            <path d={`M ${v.x + 30} ${v.y + 2} Q ${v.x + 50} ${v.y - 6} ${v.x + 70} ${v.y + 6} L ${v.x + 64} ${v.y + 18} Q ${v.x + 46} ${v.y + 12} ${v.x + 30} ${v.y + 18} Z`} fill="#6A5A52" />
          </g>
        );
      })()}
      {/* the desk lamp: the key light */}
      <g>
        <ellipse cx={L.x} cy={L.y + 8} rx={40} ry={12} fill="#000" opacity={0.35} />
        <ellipse cx={L.x} cy={L.y + 3} rx={38} ry={11} fill="#2E3438" />
        <path d={`M ${L.x} ${L.y} L ${L.x - 16} ${L.y - 62} L ${shade.x + 8} ${shade.y + 16}`} stroke="#22282C" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={`M ${L.x - 6} ${L.y - 22} l -10 -6`} stroke="#4A5258" strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${shade.x - 44} ${shade.y + 16} L ${shade.x + 44} ${shade.y + 16} L ${shade.x + 26} ${shade.y - 30} L ${shade.x - 26} ${shade.y - 30} Z`} fill="#2A3034" stroke="#161A1C" strokeWidth={3} />
        <ellipse cx={shade.x} cy={shade.y + 16} rx={44} ry={8} fill="#FFE2B0" opacity={0.35 + 0.65 * lamp} />
        <Cone d={`M ${shade.x - 40} ${shade.y + 18} L ${shade.x + 40} ${shade.y + 18} L ${shade.x + 220} ${L.y + 40} L ${shade.x - 220} ${L.y + 40} Z`} o={0.4 * lamp} />
        <Glow x={shade.x} y={shade.y + 30} r={260} o={0.5 * lamp} />
      </g>
    </g>
  );
};

/**
 * The stool the customer sits on, in front of the bench. Draw it, then the seated character, so the body sits on
 * the seat. The seat's top point is WORKSHOP.P(u, 0.8, w).
 */
export const Stool: React.FC<{ u?: number; w?: number; s?: number }> = ({ u = 0.6, w = 0.55, s = 1 }) => {
  const R = WORKSHOP;
  const seat = R.P(u, 0.8, w);
  const foot = R.P(u, 1, w);
  const k = (R.s(w) / R.s(0.45)) * s;
  return (
    <g>
      <ellipse cx={foot.x + 6} cy={foot.y + 4} rx={52 * k} ry={11 * k} fill="#000" opacity={0.4} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <path d={`M ${seat.x + sd * 30 * k} ${seat.y + 6} L ${foot.x + sd * 40 * k} ${foot.y}`} stroke={W.woodDark} strokeWidth={8 * k} strokeLinecap="round" />
          <path d={`M ${seat.x + sd * 26 * k} ${seat.y - 2} L ${foot.x + sd * 20 * k} ${foot.y}`} stroke={W.woodDark} strokeWidth={6 * k} strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx={seat.x} cy={seat.y + 4} rx={44 * k} ry={13 * k} fill={W.wood} />
      <ellipse cx={seat.x} cy={seat.y - 2} rx={44 * k} ry={13 * k} fill={W.woodLight} />
      <path d={`M ${seat.x - 36 * k} ${seat.y - 8 * k} Q ${seat.x} ${seat.y - 20 * k} ${seat.x + 36 * k} ${seat.y - 8 * k}`} stroke={S3.warm} strokeWidth={2.5} fill="none" opacity={0.5} />
    </g>
  );
};
