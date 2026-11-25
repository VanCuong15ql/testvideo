import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c5 — festival day goes well; then you notice Emma with Daniel by the gate,
// and he hands her a drink. Brief: out/crush/scenes/p4c5_brief.md

const { Street, Booth, PaperBall, ShadowFigure, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, walkPose, YOU, EMMA, DANIEL } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const Fest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f5a' }) => (
  <g>
    <Street t={t} id={id} />
    <Booth t={t} sign="LUCKY DRAW" />
  </g>
);

// P4S41: she was already back to the decorations — Emma arranging, back partially turned
export const P4S41: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(1020, 800, 0.9, { yaw: -0.6, look: -0.4, armL: { a: 60, b: -26 } }) },
    { f: len * 0.5, p: { armL: { a: 70, b: -18 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <ClsFest t={t} id="f5b" />
      <K.Hero look={YOU} pose={idle(560, 850, 0.95, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* tape + paper in her hand */}
      <g transform={`translate(${1020 - 120} ${800 - 280}) rotate(-8)`}>
        <rect x={-30} y={-40} width={60} height={80} rx={5} fill="#E86A92" stroke="#0D0A14" strokeWidth={3} />
      </g>
    </g>
  );
};

// P4S42: you couldn't help smiling — Pip's soft smile
export const P4S42: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(560, 850, 0.95, { yaw: 0.5, look: 0.45, headTilt: 0 }) },
    { f: len * 0.5, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 566]]), kf(t, [[0, 1.6], [len, 1.72]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={530} r={480} o={0.14} />
      <K.Hero look={YOU} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'happy'], [len * 0.8, 'smug']]) }} rimId="rimR" shadow={0} />
      <path d={`M ${560 + 120} ${850 - 300} q 14 -12 30 0 M ${560 + 150} ${850 - 278} q 10 -9 22 0`} stroke="#E9C46A" strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  );
};

// P4S43: title — the misunderstanding
export const P4S43: React.FC<ShotProps> = ({ t }) => {
  const inK = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 540, 1)}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <g transform={`translate(960 520) scale(${0.7 + 0.3 * inK})`} opacity={inK}>
        <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={70} fill="#F2E3C9" fontStyle="italic">The Misunderstanding</text>
        <line x1={-260} y1={34} x2={260} y2={34} stroke="#E86A92" strokeWidth={4} opacity={0.8} />
      </g>
    </g>
  );
};

// P4S44: festival day — everything going well; wide festival ground
export const P4S44: React.FC<ShotProps> = ({ t, len }) => {
  const crowd = [0, 1, 2, 3].map((i) => (
    <K.Kid key={i} x={300 + i * 420 + Math.sin(t * 0.3 + i) * 20} y={880 + (i % 2) * 50} s={0.6} look={K.KIDS[i % K.KIDS.length]} />
  ));
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Fest t={t} id="f5c" />
      {crowd}
      <Glow x={960} y={500} r={640} o={0.18} />
      <Tag x={960} y={260} t={t - 6} text="festival day" />
    </g>
  );
};

// P4S45: your booth was busy — queue of kids at the counter
export const P4S45: React.FC<ShotProps> = ({ t, len }) => {
  const queue = [0, 1, 2].map((i) => (
    <K.Kid key={i} x={lerp(760, 700, i / 3) + Math.sin(t * 0.25 + i * 2) * 8} y={lerp(820, 880, i / 3)} s={0.62 - i * 0.04} look={K.KIDS[(i + 2) % K.KIDS.length]} />
  ));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 575], [len, 562]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Fest t={t} id="f5d" />
      {queue}
      <K.Hero look={YOU} pose={idle(600, 860, 0.95, { yaw: 0.5, look: 0.4, armR: { a: 55, b: -26 }, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.45} />
      <Glow x={960} y={560} r={560} o={0.18} />
      <Tag x={960} y={280} t={t - 4} text="busy!" />
    </g>
  );
};

// P4S46: Emma laughing with other students — group around her
export const P4S46: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: idle(1050, 810, 0.9, { yaw: -0.2, look: -0.3 }) },
    { f: len * 0.4, p: { headTilt: -8, armL: { a: 55, b: -24 } }, ease: easeOut },
  ]);
  const friends = [0, 1].map((i) => (
    <K.Kid key={i} x={1280 + i * 120} y={830 + i * 20} s={0.62} look={K.KIDS[(i + 1) % K.KIDS.length]} />
  ));
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 575], [len, 562]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f5e" />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) }} rimId="rimR" shadow={0.4} />
      {friends}
      <Glow x={1100} y={560} r={400} o={0.16} />
    </g>
  );
};

// P4S47: you helping people play the game — Pip at the booth explaining
export const P4S47: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(640, 860, 0.95, { yaw: 0.5, look: 0.5, armR: { a: 55, b: -26 } }) },
    { f: len * 0.4, p: { armR: { a: 70, b: -18 } }, ease: easeOut },
  ]);
  const kid = <K.Kid x={820} y={880} s={0.6} look={K.KIDS[3]} />;
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 970]]), kf(t, [[0, 575], [len, 562]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Fest t={t} id="f5f" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.45} />
      {kid}
      {/* a prize ball mid-toss */}
      <PaperBall x={720 + Math.sin(t * 0.7) * 40} y={700 - Math.abs(Math.sin(t * 0.7)) * 80} rot={t * 8} c="#E86A92" s={0.8} />
      <Glow x={960} y={560} r={520} o={0.16} />
    </g>
  );
};

// P4S48: during a break — you notice Emma with Daniel; zoom/worry shift
export const P4S48: React.FC<ShotProps> = ({ t, len }) => {
  const notice = easeOut(clamp((t - len * 0.4) / (len * 0.3)));
  const pip = poseAt(t, [
    { f: 0, p: idle(560, 850, 0.95, { yaw: 0.5, look: 0.4 }) },
    { f: len * 0.6, p: { look: 0.8, yaw: 0.7, headTilt: 4 }, ease: easeOut },
  ]);
  const emp = idle(1250, 815, 0.88, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy']]) });
  const dan = idle(1420, 800, 0.85, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 965]]), kf(t, [[0, 580], [len, 560]]), kf(t, [[0, 1.4], [len, 1.6 * (1 + notice * 0.1)]]))}>
      <Fest t={t} id="f5g" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={dan} rimId="rimR" shadow={0.4} />
      {/* sight line Pip → Emma+Daniel */}
      {notice > 0 ? <path d={`M ${640} ${660} L 1250 640`} stroke="#E86A92" strokeWidth={4} strokeDasharray="10 8" opacity={0.6 * notice} /> : null}
      {notice > 0.6 ? <Tag x={1350} y={480} t={t - len * 0.45} text="Daniel?" /> : null}
    </g>
  );
};

// P4S49: same Daniel from the school gate — flashback inset + present
export const P4S49: React.FC<ShotProps> = ({ t, len }) => {
  const flash = clamp((t - 4) / 8) * clamp((len - t) / 10);
  return (
    <g transform={camT(960, 540, 1.2)}>
      <Fest t={t} id="f5h" />
      <K.Hero look={EMMA} pose={idle(1100, 815, 0.85, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <K.Hero look={DANIEL} pose={idle(1300, 800, 0.82, { yaw: -0.6, look: -0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* memory inset: the school gate, Daniel talking to her */}
      <g opacity={flash} transform="translate(300 180) scale(0.42)">
        <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
        <Street t={t + 50} id="f5m" />
        <K.Hero look={EMMA} pose={idle(900, 830, 0.9, { yaw: 0.5, look: 0.4, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.3} />
        <K.Hero look={DANIEL} pose={idle(1150, 815, 0.85, { yaw: -0.5, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.3} />
      </g>
      <rect x={300} y={180} width={806} height={454} fill="none" stroke="#E9C46A" strokeWidth={5} opacity={flash} rx={10} />
      <Tag x={960} y={720} t={t - 6} text="the guy from the gate" />
    </g>
  );
};

// P4S50: he handed her a drink — cup travels Daniel→Emma
export const P4S50: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 4) / (len * 0.4)));
  const cx = lerp(1380, 1180, k);
  const cy = lerp(700, 660, k) - Math.sin(k * Math.PI) * 40;
  const dan = poseAt(t, [
    { f: 0, p: idle(1420, 800, 0.85, { yaw: -0.6, look: -0.5, armR: { a: 30, b: -14 } }) },
    { f: len * 0.4, p: { armR: { a: 60, b: -26 } }, ease: easeOut },
    { f: len * 0.7, p: { armR: { a: 25, b: -12 } } },
  ]);
  const emp = idle(1250, 815, 0.88, { yaw: -0.4, look: -0.4, armL: { a: 20 + k * 30, b: -14 }, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 580], [len, 562]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Fest t={t} id="f5i" />
      <K.Hero look={YOU} pose={idle(560, 850, 0.95, { yaw: 0.5, look: 0.8, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={emp} rimId="rimR" shadow={0.4} />
      <K.Hero look={DANIEL} pose={{ ...dan, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* the drink */}
      <g transform={`translate(${cx} ${cy})`} opacity={k > 0 && k < 1 ? 1 : 0.9}>
        <rect x={-14} y={-20} width={28} height={40} rx={5} fill="#E9C46A" stroke="#0D0A14" strokeWidth={3} />
        <path d="M 14 -12 q 14 2 0 18" fill="none" stroke="#0D0A14" strokeWidth={3} />
        <rect x={-10} y={-30} width={20} height={10} rx={3} fill="#E86A92" />
      </g>
      {/* Pip's shrinking hope */}
      <Glow x={1350} y={560} r={300} o={0.14} />
    </g>
  );
};

// classroom-ish fest backdrop for the decorating shots (still in classroom)
const ClsFest: React.FC<{ t: number; id?: string }> = ({ t, id = 'f5j' }) => <K.Classroom t={t + 1100} id={id} />;

export const p4c5Shots: ShotMap = {
  P4S41, P4S42, P4S43, P4S44, P4S45, P4S46, P4S47, P4S48, P4S49, P4S50,
};
