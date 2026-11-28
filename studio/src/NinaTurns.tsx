import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, basePose, Pose, LOOKS, turnPose, TurnDir, KitDefs, SetDefs, Study, FONT, LEG_LEN } from './engine';

// Preview sheet for the four facing actions on one character: TURN LEFT / LOOK FRONT / TURN RIGHT /
// TURN BACK. Render it after changing turnPose or the back-of-head hair:
//   npx remotion still src/index.ts NinaTurns out/nina-turns.png

const Label: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#F6EFE3" letterSpacing={2}>
    {text}
  </text>
);
const P = (o: Partial<Pose>): Pose => ({ ...basePose, ...o });

const SHOW: { dir: TurnDir; name: string }[] = [
  { dir: 'front', name: 'LOOK FRONT' },
  { dir: 'left', name: 'TURN LEFT' },
  { dir: 'right', name: 'TURN RIGHT' },
  { dir: 'back', name: 'TURN BACK' },
];

export const NinaTurns: React.FC = () => {
  // synced stance: ankles ~40px out, whatever the hip width (same rule as CastSheet)
  const hipX = LOOKS.nina.hipX ?? 28;
  const legA = (Math.asin(Math.min(1, Math.max(-1, (40 - hipX) / LEG_LEN))) * 180) / Math.PI;
  const stance = { legL: { a: -legA, b: 0 }, legR: { a: legA, b: 0 } };
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        <g filter="url(#blur10)">
          <Study t={0} id="ninaturns" />
        </g>
        <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
        {SHOW.map((s, i) => {
          const x = 250 + i * 475;
          return (
            <g key={s.dir}>
              <Hero look={LOOKS.nina} pose={P({ x, y: 800, scale: 0.98, ...turnPose(s.dir, stance) })} shadow={0.6} />
              <Label x={x} y={990} text={s.name} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
