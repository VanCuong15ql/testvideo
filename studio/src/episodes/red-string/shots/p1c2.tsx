import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p1c2 — Monday morning in Alex's room: buttoning his shirt, he notices the
// delicate red thread on his LEFT hand, pulls (nothing), scissors again, then follows
// the thread with his eyes as it slips through the bedroom door. Ends heading out.
//
// DESIGN — set: DawnRoom (dawn window, bed, wardrobe, door). Depth: window/light shaft
// background, bed midground, Alex foreground. Props: shirt half-buttoned, thread macro,
// scissors, door ajar with the thread's glow in the crack. Keyframes: pose keys on the
// routine (button, look, reach), camera push on the hand, thread follows POV line.

const {
  ALEX, INK, DawnRoom, RedString, Scissors,
  Tag, FloatLabel, Glow, Say,
  camT, kf, clamp, lerp, easeOut, easeInOut, backOut, settle, spring,
  poseAt, faceAt, joints, toWorld, handL, pinky, idle, walkPose,
} = K;

/** Alex standing in the dawn room, mid-morning-routine. feet y=880. */
const AlexStand: React.FC<{ pose: Pose; t?: number }> = ({ pose, t = 0 }) => (
  <K.Hero look={ALEX} pose={pose} rimId="rimR" shadow={0.55} />
);

// P1S11: morning routine — he buttons his shirt by the window, morning light on him
export const P1S11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1150, 880, 0.95, { yaw: -0.25, look: -0.4, armL: { a: 40, b: -20 }, armR: { a: 55, b: -30 }, headTilt: 3 }) },
    { f: len * 0.5, p: { armR: { a: 48, b: -26 }, look: -0.3 } },
    { f: len, p: { armR: { a: 42, b: -22 }, look: -0.2, headTilt: 1 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len * 0.6, 1030], [len, 1010]]), kf(t, [[0, 580], [len, 565]]), kf(t, [[0, 1.5], [len, 1.5]]))}>
      <DawnRoom t={t} dawn={0.85} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.8, 'tired']]) }} t={t} />
      {/* shirt half-buttoned: a few buttons + open collar */}
      <g transform="translate(1120 700) rotate(-4)">
        <rect x={-14} y={-60} width={28} height={120} rx={8} fill="#F2B33D" opacity={0.0} />
      </g>
      <Glow x={510} y={400} r={420} o={0.2} />
      <Tag x={960} y={170} t={t} text="MONDAY MORNING" />
    </g>
  );
};

// P1S12: macro insert — the delicate red thread wrapped on his little finger, blanket-fiber doubt
export const P1S12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1100, 880, 0.95, { yaw: -0.2, look: -0.5, armL: { a: 65, b: -35 } }) },
    { f: len * 0.6, p: { armL: { a: 72, b: -42 }, look: -0.55 } },
    { f: len, p: { look: -0.5 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1070]]), kf(t, [[0, 700], [len, 695]]), kf(t, [[0, 2.6], [len, 2.6]]))}>
      <DawnRoom t={t} dawn={0.85} />
      <AlexStand pose={pose} t={t} />
      {/* the thread in macro: a thin red coil around the pinky, catching dawn light */}
      <g transform={`translate(${fp.x} ${fp.y}) rotate(-18)`}>
        <ellipse rx={16} ry={10} fill="none" stroke={K.RED} strokeWidth={3.5} />
        <ellipse rx={16} ry={10} fill="none" stroke={K.RED_GLOW} strokeWidth={1.5} opacity={0.7} transform="translate(1 -1)" />
        <path d="M -16 -10 Q 0 -18 16 -10" stroke="#FFD9D2" strokeWidth={1.2} fill="none" opacity={0.8} />
      </g>
      <RedString x1={fp.x + 14} y1={fp.y - 8} x2={fp.x + 150} y2={fp.y - 60} slack={0.3} glow={0.7} t={t} width={2.5} />
      <FloatLabel x={1300} y={300} t={t} text="...just a loose fiber?" size={44} color="#C9BFA8" />
    </g>
  );
};

// P1S13: he lifts the hand to the window light — squints, the thread stays red (not a fiber)
export const P1S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1050, 880, 0.95, { yaw: -0.3, look: -0.6, armL: { a: 70, b: -40 }, headTilt: 5 }) },
    { f: len * 0.5, p: { armL: { a: 95, b: -55 }, headTilt: 8, look: -0.7 } },
    { f: len, p: { headTilt: 6, armL: { a: 88, b: -50 } } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 560], [len, 548]]), kf(t, [[0, 1.7], [len, 1.7]]))}>
      <DawnRoom t={t} dawn={0.9} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'worried']]) }} t={t} />
      {/* hand lifted into the window light: thread glows against the sky */}
      <Glow x={fp.x} y={fp.y} r={120} o={0.5} kind="red" />
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 200} y2={fp.y - 140} slack={0.15} glow={0.95} pulse={0.4} t={t} width={3} />
      {/* a couple of "fiber" dust motes that turn out NOT to be it */}
      {[0, 1].map((i) => (
        <circle key={i} cx={fp.x + 60 + i * 40} cy={fp.y - 60 - i * 30} r={2.5} fill="#C9BFA8" opacity={0.5 + Math.sin(t * 0.2 + i) * 0.2} />
      ))}
      <FloatLabel x={1400} y={320} t={t - 8} text="RED. Not gray." size={46} color={K.RED_GLOW} />
    </g>
  );
};

// P1S14: he pulls — nothing happens. Arm extends, thread just stretches a little then settles
export const P1S14: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1050, 880, 0.95, { yaw: -0.2, look: -0.5, armL: { a: 70, b: -40 } }) },
    { f: len * 0.4, p: { armL: { a: 105, b: -60 }, look: -0.4 }, ease: easeOut },
    { f: len * 0.7, p: { armL: { a: 85, b: -45 }, look: -0.5, headTilt: 4 } },
    { f: len, p: { headTilt: 2 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const pull = easeOut(clamp((t - len * 0.35) / 12));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 985]]), kf(t, [[0, 545], [len, 535]]), kf(t, [[0, 1.8], [len, 1.8]]))}>
      <DawnRoom t={t} dawn={0.9} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} t={t} />
      {/* the thread stretches then just... hangs there. shrug lines */}
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + lerp(120, 260, pull)} y2={fp.y - lerp(80, 200, pull)} slack={lerp(0.3, 0.08, pull)} glow={0.8} t={t} width={3.5} />
      {pull > 0.7 ? <FloatLabel x={1350} y={300} t={t} text="...nothing." size={52} color="#8B7BB8" /> : null}
    </g>
  );
};

// P1S15: scissors — he grabs them from the nightstand/drawer, blades open on the thread
export const P1S15: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1050, 880, 0.95, { yaw: -0.2, look: -0.5, armL: { a: 80, b: -45 } }) },
    { f: len * 0.5, p: { armR: { a: 60, b: -35 }, look: -0.4 } },
    { f: len, p: { armR: { a: 55, b: -30 } } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const rp = toWorld({ ...pose }, joints({ ...pose }).armR.end);
  const snip = clamp((t - len * 0.6) / 10);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 975]]), kf(t, [[0, 535], [len, 525]]), kf(t, [[0, 1.9], [len, 1.9]]))}>
      <DawnRoom t={t} dawn={0.9} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} t={t} />
      {/* scissors in his right hand, closing on the thread */}
      <g transform={`translate(${rp.x} ${rp.y})`}>
        <K.Scissors x={0} y={0} s={1.3} rot={-40 + snip * 15} open={0.5 - snip * 0.4} />
      </g>
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 130} y2={fp.y - 70} slack={0.22} glow={0.85} t={t} width={3.5} />
    </g>
  );
};

// P1S16: SNIP — nothing. The blades close on the thread and it stays whole; he follows it with eyes
export const P1S16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1050, 880, 0.95, { yaw: -0.2, look: -0.5, armL: { a: 80, b: -45 } }) },
    { f: len * 0.4, p: { squash: 0.06, look: -0.4 } },
    { f: len * 0.75, p: { squash: -0.04, headTilt: 6, look: 0.2 }, ease: backOut },
    { f: len, p: { look: 0.35, headTilt: 4 } },
  ]);
  const fp = pinky({ ...pose }, 'L');
  const rp = toWorld({ ...pose }, joints({ ...pose }).armR.end);
  const snip = clamp((t - len * 0.45) / 8);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 525], [len, 515]]), kf(t, [[0, 2.0], [len, 2.0]]))}>
      <DawnRoom t={t} dawn={0.9} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'shock'], [len * 0.8, 'worried']]) }} t={t} />
      <g transform={`translate(${rp.x} ${rp.y})`}>
        <K.Scissors x={0} y={0} s={1.3} rot={-40} open={0.5 - snip * 0.4} />
      </g>
      {/* thread unharmed — glows brighter, mocking him */}
      <RedString x1={fp.x} y1={fp.y} x2={fp.x + 140} y2={fp.y - 80} slack={0.2} glow={1} pulse={snip} t={t} width={4} />
      {/* his gaze tracking the thread toward the door */}
      <path d={`M ${fp.x} ${fp.y - 40} Q 800 420 420 480`} stroke="#8FD3FF" strokeWidth={3} fill="none" opacity={0.35} strokeDasharray="8 10" />
      <FloatLabel x={1300} y={300} t={t - len * 0.3} text="STILL THERE." size={48} color={K.RED_GLOW} />
    </g>
  );
};

// P1S17: he follows it with his eyes — POV along the thread to the bedroom door, it slips through the crack
export const P1S17: React.FC<ShotProps> = ({ t, len }) => {
  const camX = kf(t, [[0, 960], [len * 0.6, 700], [len, 560]]);
  const threadOut = easeInOut(clamp((t - len * 0.5) / 16));
  return (
    <g transform={camT(camX, kf(t, [[0, 560], [len, 500]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
      <DawnRoom t={t} dawn={0.9} />
      {/* Alex small at right, head turned tracking the thread */}
      <g transform="translate(1350 880)">
        <K.Hero look={ALEX} pose={idle(0, 880, 0.95, { yaw: 0.5, look: -0.8, headTilt: -6 })} rimId="rimR" shadow={0.5} />
      </g>
      {/* the thread as a leading line across the room to the door */}
      <RedString x1={1200} y1={800} x2={lerp(1200, 160, threadOut)} y2={lerp(800, 560, threadOut)} slack={0.1} glow={0.9} pulse={0.5} t={t} width={4} />
      {/* it slips under the door — glow in the crack */}
      <rect x={70} y={810} width={130} height={14} fill="#FFC27A" opacity={0.4 + threadOut * 0.5} />
      <circle cx={140} cy={560} r={8 + threadOut * 10} fill={K.RED_GLOW} opacity={0.4 * threadOut} />
      <Tag x={960} y={180} t={t} text="FOLLOW THE THREAD" />
    </g>
  );
};

// P1S18: Alex stares after it — medium shot, hand still raised, door ajar with red glow
export const P1S18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1100, 880, 0.95, { yaw: 0.2, look: -0.7, armL: { a: 75, b: -42 }, headTilt: -4 }) },
    { f: len * 0.5, p: { look: -0.8, headTilt: -6 } },
    { f: len, p: { look: -0.75 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1010]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.6], [len, 1.6]]))}>
      <DawnRoom t={t} dawn={0.9} />
      {/* door swung open a crack, red glow spilling out */}
      <g>
        <rect x={60} y={260} width={150} height={580} fill="#3E3048" stroke={INK} strokeWidth={5} transform={`skewY(${-14}) translate(0 60)`} />
        <rect x={70} y={300} width={130} height={480} fill="#241F3E" />
        <Glow x={140} y={600} r={160} o={0.5} kind="red" />
        <RedString x1={140} y1={560} x2={140} y2={300} slack={0.1} glow={1} t={t} width={4} />
      </g>
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.7, 'worried']]) }} t={t} />
      {/* the thread still on his finger, taut toward the door */}
      <RedString x1={pinky({ ...pose }, 'L').x} y1={pinky({ ...pose }, 'L').y} x2={240} y2={640} slack={0.08} glow={1} pulse={0.6} t={t} width={4} />
    </g>
  );
};

// P1S19: "Okay... that's definitely not normal." — dialogue bubble over his stunned face
export const P1S19: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: idle(1100, 880, 0.95, { yaw: 0.15, look: -0.7, headTilt: -3 }) },
    { f: len * 0.5, p: { headTilt: 2, look: -0.6 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (<>
    <g transform={camT(kf(t, [[0, 1040], [len, 1020]]), kf(t, [[0, 530], [len, 520]]), kf(t, [[0, 1.7], [len, 1.7]]))}>
      <DawnRoom t={t} dawn={0.9} />
      <AlexStand pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [len * 0.5, 'worried']]) }} t={t} />
      <RedString x1={pinky({ ...pose }, 'L').x} y1={pinky({ ...pose }, 'L').y} x2={300} y2={620} slack={0.1} glow={0.95} pulse={0.5} t={t} width={4} />
    </g>
    {/* speech bubble in screen space, tail on Alex's head (~screen pos of world 1100,640 at this cam) */}
    <Say x={1150} y={240} tx={1150} ty={430} text="Okay... that's definitely not normal." at={8} until={len - 6} t={t} maxW={560} fs={42} />
  </>);
};

// P1S20: he follows it downstairs and out — door opens, he steps through, string leads the way
export const P1S20: React.FC<ShotProps> = ({ t, len }) => {
  const enter = easeInOut(clamp((t - len * 0.3) / 24));
  const px = lerp(1100, 320, enter);
  const pose = walkPose(px, t * 0.35, 880, 0.95, { look: -0.6, expr: 'worried' }, -1);
  const fp = pinky({ ...pose }, 'L');
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 880]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.6], [len, 1.6]]))}>
      <DawnRoom t={t} dawn={0.95} />
      {/* door opening as he reaches it */}
      <rect x={40} y={240} width={190} height={620} fill="#2E2438" opacity={enter} transform={`translate(${enter * 90} 0)`} />
      <K.Hero look={ALEX} pose={pose} rimId="rimR" shadow={0.55} />
      {/* the thread leading out the door, taut */}
      <RedString x1={fp.x} y1={fp.y} x2={lerp(240, -60, enter)} y2={lerp(640, 500, enter)} slack={0.06} glow={1} pulse={0.4} t={t} width={4} />
      <Tag x={960} y={170} t={t} text="OUT THE DOOR..." />
      <FloatLabel x={960} y={950} t={t - len * 0.3} text="...all the way to school." size={46} color={K.RED_GLOW} />
    </g>
  );
};

export const p1c2Shots: ShotMap = {
  P1S11, P1S12, P1S13, P1S14, P1S15, P1S16, P1S17, P1S18, P1S19, P1S20,
};
