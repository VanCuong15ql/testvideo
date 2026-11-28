import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, LOOKS, CastName, walkPose, KitDefs, SetDefs, Study, FONT } from './engine';

// Walk check for the whole cast: every look mid-stride at two opposite phases, so the gait reads on
// each body type (including narrow-hip / bulky Nina). Render it after changing walkPose or a Look:
//   npx remotion still src/index.ts CastWalk out/cast-walk.png

const Label: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3" letterSpacing={2}>
    {text}
  </text>
);

const ROWS: { phase: number; ground: number; name: string }[] = [
  { phase: 1.0, ground: 640, name: 'STRIDE A' },
  { phase: 1.0 + Math.PI, ground: 950, name: 'STRIDE B' },
];

export const CastWalk: React.FC = () => {
  const cast = Object.keys(LOOKS) as CastName[];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        <g filter="url(#blur10)">
          <Study t={0} id="castwalk" />
        </g>
        <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
        {ROWS.map((r, ri) =>
          cast.map((c, i) => {
            const x = 90 + i * 195;
            const pose: Pose = walkPose(x, r.phase, r.ground, 0.62, { expr: 'happy' }, 1);
            return (
              <g key={`${ri}-${c}`}>
                <Hero look={LOOKS[c]} pose={pose} shadow={0.6} />
                {ri === 0 ? <Label x={x} y={r.ground + 34} text={NAMES2[c]} /> : null}
              </g>
            );
          }),
        )}
        {ROWS.map((r, ri) => (
          <Label key={r.name} x={960} y={ri === 0 ? 350 : 690} text={r.name} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const NAMES2: Record<CastName, string> = { pip: 'PIP A', pipHood: 'PIP B', pipInk: 'PIP C', mo: 'MO', sis: 'SISTER', mom: 'MUM', suit: 'SUIT', minh: 'MINH', linh: 'LINH', nina: 'NINA' };
