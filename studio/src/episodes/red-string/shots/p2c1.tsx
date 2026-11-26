import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p2c1 — the hallway argument begins: Maya storms off, the string stretches
// behind her, then SNAPS Alex across the hall into a locker. "OW!" / "stop following
// me!" / "literally attached to me!"
//
// DESIGN — set: Hallway (perspective, lockers, dusk windows). Depth: far wall/lockers
// background, mid plane characters, HallForeground locker+plant. Blocking: Maya walks
// left-to-right away, Alex right-to-left toward camera-right locker; the string is a
// long sagging line between them. Keyframes: walk cycles, string tension kf, locker
// impact shake + door swing.

const {
  ALEX, MAYA, SAM, Hallway, HallForeground, HALL, LockerBank, RedString,
  Tag, FloatLabel, Glow, Say, Toast,
  camT, kf, clamp, lerp, easeOut, easeInOut, easeIn, backOut, settle, spring, shake, rnd,
  poseAt, faceAt, joints, toWorld, pinky, idle, walkPose,
} = K;

/** Hero placed at hallway depth (HALL.mid = y 780 s .9). */
const at = (x: number, y = HALL.mid.y, s = HALL.mid.s, extra: Partial<Pose> = {}) => idle(x, y, s, extra);

// P2S1: Alex watching Maya walk off — he thinks it's a prank; she isn't laughing
export const P2S1: React.FC<ShotProps> = ({ t, len }) => {
  const mayaX = kf(t, [[0, 700], [len, 1180]], easeInOut);
  const maya = walkPose(mayaX, t * 0.4, HALL.mid.y, HALL.mid.s, { look: 1, expr: 'neutral' }, 1);
  const alex = poseAt(t, [
    { f: 0, p: at(520, HALL.mid.y, HALL.mid.s, { yaw: 0.4, look: 0.6, headTilt: 3 }) },
    { f: len * 0.6, p: { look: 0.7, headTilt: 5 } },
    { f: len, p: { look: 0.65 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 600], [len, 585]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Hallway t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'neutral'], [len * 0.7, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* string trailing behind Maya, slack */}
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky({ ...alex }, 'L').x} y2={pinky({ ...alex }, 'L').y} slack={0.45} glow={0.8} t={t} width={4} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S2: "But Maya wasn't laughing" — her face, flat, arms already crossing
export const P2S2: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: at(1000, HALL.mid.y, HALL.mid.s * 1.15, { yaw: -0.3, look: -0.5, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }) },
    { f: len * 0.6, p: { armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 }, headTilt: 4 } },
    { f: len, p: { armL: { a: 55, b: -30 }, armR: { a: -55, b: 30 }, headTilt: 5 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 965]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Hallway t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.5, 'smug'], [len * 0.8, 'neutral']]) }} rimId="rimR" shadow={0.55} />
      {/* Alex small in the far background, still smiling hopefully */}
      <K.Hero look={ALEX} pose={at(560, HALL.far.y, HALL.far.s, { yaw: 0.5, look: 0.6 })} rimId="rimR" shadow={0.4} />
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky(at(560, HALL.far.y, HALL.far.s), 'L').x} y2={pinky(at(560, HALL.far.y, HALL.far.s), 'L').y} slack={0.5} glow={0.7} t={t} width={3.5} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S3: she tries walking away — slow walk left, testing the string
export const P2S3: React.FC<ShotProps> = ({ t, len }) => {
  const mayaX = kf(t, [[0, 1050], [len, 880]], easeInOut);
  const maya = walkPose(mayaX, t * 0.38, HALL.mid.y, HALL.mid.s, { look: 1, expr: 'neutral' }, -1);
  const alex = at(620, HALL.mid.y, HALL.mid.s, { yaw: 0.4, look: 0.7 });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 990]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Hallway t={t} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.5} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.8, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky(alex, 'L').x} y2={pinky(alex, 'L').y} slack={0.4} glow={0.85} t={t} width={4} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S4: the string stretches behind her — tension builds, it hums
export const P2S4: React.FC<ShotProps> = ({ t, len }) => {
  const mayaX = kf(t, [[0, 950], [len, 780]], easeInOut);
  const maya = walkPose(mayaX, t * 0.4, HALL.mid.y, HALL.mid.s, { look: 1, expr: 'neutral' }, -1);
  const alex = at(640, HALL.mid.y, HALL.mid.s, { yaw: 0.4, look: 0.7 });
  const tension = clamp((mayaX - 780) / 200);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Hallway t={t} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.5} />
      <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.5} />
      {/* stretching taut, glowing harder */}
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky(alex, 'L').x} y2={pinky(alex, 'L').y} slack={lerp(0.4, 0.1, tension)} glow={0.7 + tension * 0.5} pulse={tension * 0.8} t={t} width={4} />
      <FloatLabel x={900} y={350} t={t} text="STRETCH..." size={44} color={K.RED_GLOW} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S5: another step — she's committed now, leaning into it
export const P2S5: React.FC<ShotProps> = ({ t, len }) => {
  const mayaX = kf(t, [[0, 830], [len, 640]], easeInOut);
  const maya = walkPose(mayaX, t * 0.42, HALL.mid.y, HALL.mid.s, { look: 1, expr: 'smug' }, -1);
  const alex = at(660, HALL.mid.y, HALL.mid.s, { yaw: 0.4, look: 0.7 });
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 975]]), kf(t, [[0, 575], [len, 570]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
      <Hallway t={t} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.5} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky(alex, 'L').x} y2={pinky(alex, 'L').y} slack={0.12} glow={0.95} pulse={0.9} t={t} width={4.5} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S6: then another — string at breaking point, vibration lines
export const P2S6: React.FC<ShotProps> = ({ t, len }) => {
  const mayaX = kf(t, [[0, 700], [len, 560]], easeInOut);
  const maya = walkPose(mayaX, t * 0.45, HALL.mid.y, HALL.mid.s, { look: 1, expr: 'smug' }, -1);
  const alex = at(680, HALL.mid.y, HALL.mid.s, { yaw: 0.4, look: 0.75 });
  const vib = 1 + Math.sin(t * 1.4) * 0.15;
  return (
    <g transform={camT(kf(t, [[0, 970], [len, 965]]), kf(t, [[0, 570], [len, 568]]), kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Hallway t={t} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.5} />
      <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.5} />
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky(alex, 'L').x} y2={pinky(alex, 'L').y} slack={0.04} glow={1.2} pulse={vib} t={t} width={5.5} />
      {/* strain marks along the string */}
      {[0, 1, 2, 3].map((i) => {
        const k = (t * 0.4 + i * 0.25) % 1;
        const sx = lerp(pinky({ ...maya }, 'R').x, pinky(alex, 'L').x, 0.3 + i * 0.15);
        const sy = lerp(pinky({ ...maya }, 'R').y, pinky(alex, 'L').y, 0.3 + i * 0.15) - 20 - k * 20;
        return <path key={i} d={`M ${sx} ${sy} l 8 -12`} stroke={K.RED_GLOW} strokeWidth={4} strokeLinecap="round" opacity={(1 - k) * 0.9} />;
      })}
      <HallForeground t={t} />
    </g>
  );
};

// P2S7: SNAP — Alex hurled across the hallway toward the lockers, motion streaks
export const P2S7: React.FC<ShotProps> = ({ t, len }) => {
  const snapAt = len * 0.25;
  const p = easeIn(clamp((t - snapAt) / (len * 0.6)));
  const ax = lerp(680, 1480, p);
  const alex = walkPose(ax, t * 0.9, HALL.near.y, HALL.near.s, { look: 1, expr: 'dizzy', tilt: 8, armL: { a: -40, b: 30 }, armR: { a: -50, b: 40 } }, 1);
  const maya = at(560, HALL.mid.y, HALL.mid.s, { yaw: -0.3, look: 0.5, expr: 'shock' });
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1150]]), kf(t, [[0, 580], [len, 600]]), kf(t, [[0, 1.5], [len, 1.85]]))}>
      <Hallway t={t} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'smug'], [snapAt, 'shock']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.55} />
      {/* the string whipping taut then slack-whipping */}
      <RedString x1={pinky({ ...maya }, 'R').x} y1={pinky({ ...maya }, 'R').y} x2={pinky({ ...alex }, 'L').x} y2={pinky({ ...alex }, 'L').y} slack={lerp(0.05, 0.2, p)} glow={1.3} pulse={1 - p} t={t} width={6} />
      {/* streak lines behind Alex */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1={ax - 140 - i * 50} y1={820 - i * 50} x2={ax - 320 - i * 60} y2={820 - i * 50} stroke="#F4EEE0" strokeWidth={6} opacity={p * (0.5 - i * 0.12)} strokeLinecap="round" />
      ))}
      <HallForeground t={t} />
    </g>
  );
};

// P2S8: he CRASHES into a locker — impact: shake, locker door swings, books? no — clang
export const P2S8: React.FC<ShotProps> = ({ t, len }) => {
  const hitAt = len * 0.3;
  const p = clamp((t - hitAt) / 10);
  const alex = poseAt(t, [
    { f: 0, p: at(1400, HALL.near.y + 10, HALL.near.s, { yaw: 0.6, look: 1, tilt: 6, expr: 'dizzy', squash: 0.15 }) },
    { f: hitAt + 8, p: { x: 1430, y: HALL.near.y + 26, tilt: 10, squash: -0.1 }, ease: backOut },
    { f: len, p: { y: HALL.near.y + 30, squash: settle((t - hitAt - 8) / 30, 0.06), look: 0.9 } },
  ]);
  const maya = at(700, HALL.mid.y, HALL.mid.s, { yaw: -0.4, look: 0.6, expr: 'shock' });
  const sh = shake(t, hitAt, 14, 16);
  return (
    <g transform={camT(kf(t, [[0, 1200], [len, 1260]]), kf(t, [[0, 600], [len, 615]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Hallway t={t} />
      {/* the locker bank he hits — right wall lockers */}
      <g transform="translate(1620 700)">
        <LockerBank x={0} y={0} w={300} h={380} n={3} seed={7} open={p > 0.4 ? 0.4 : 0} />
      </g>
      <g transform={`translate(${sh.x} ${sh.y})`}>
        <K.Hero look={MAYA} pose={maya} rimId="rimR" shadow={0.5} />
        <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'dizzy'], [hitAt + 10, 'shock']]) }} rimId="rimR" shadow={0.55} />
      </g>
      {/* CLANG burst */}
      {p < 1 && p > 0 ? (
        <g transform={`translate(1560 ${640 - p * 60}) scale(${0.6 + p * 1.4})`} opacity={1 - p}>
          {Array.from({ length: 6 }, (_, i) => {
            const a = -Math.PI / 2 + (i - 2.5) * 0.4;
            return <path key={i} d={`M ${Math.cos(a) * 30} ${Math.sin(a) * 30} L ${Math.cos(a) * 80} ${Math.sin(a) * 80}`} stroke="#FFE9B0" strokeWidth={6} strokeLinecap="round" />;
          })}
          <FloatLabel x={0} y={-60} t={0} text="CLANG!" size={48} color="#FFE9B0" />
        </g>
      ) : null}
      {/* string slack now, dangling */}
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky(maya, 'R').x} y2={pinky(maya, 'R').y} slack={0.55} glow={0.7} t={t} width={4} />
      <HallForeground t={t} />
    </g>
  );
};

// P2S9: "OW! Could you walk a little slower?" — Alex on the floor by the locker, rubbing his head
export const P2S9: React.FC<ShotProps> = ({ t, len }) => {
  const alex = poseAt(t, [
    { f: 0, p: at(1400, HALL.near.y + 60, HALL.near.s * 0.9, { yaw: 0.5, look: 0.8, tilt: 14, expr: 'dizzy', armR: { a: 80, b: -40 } }) },
    { f: len * 0.5, p: { tilt: 10, armR: { a: 70, b: -35 }, expr: 'worried' } },
    { f: len, p: { tilt: 8 } },
  ]);
  const maya = at(820, HALL.mid.y, HALL.mid.s, { yaw: -0.3, look: 0.7, armL: { a: 50, b: -30 }, armR: { a: 50, b: -30 } });
  return (<>
    <g transform={camT(kf(t, [[0, 1180], [len, 1160]]), kf(t, [[0, 610], [len, 600]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Hallway t={t} />
      <g transform="translate(1560 700)">
        <LockerBank x={0} y={0} w={300} h={380} n={3} seed={7} open={0.4} />
      </g>
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={ALEX} pose={{ ...alex, ...faceAt(t, [[0, 'dizzy'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.55} />
      {/* DizzyStars over his head */}
      <K.DizzyStars x={1400} y={560} t={t} rx={90} ry={40} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky(maya, 'R').x} y2={pinky(maya, 'R').y} slack={0.6} glow={0.6} t={t} width={4} />
      <HallForeground t={t} />
    </g>
    <Say x={760} y={300} tx={1300} ty={620} text="OW! Could you walk a little slower?" at={6} until={len - 8} t={t} maxW={600} fs={38} />
  </>);
};

// P2S10: Maya crosses her arms — done with this
export const P2S10: React.FC<ShotProps> = ({ t, len }) => {
  const maya = poseAt(t, [
    { f: 0, p: at(1050, HALL.mid.y, HALL.mid.s * 1.1, { yaw: -0.25, look: -0.5, headTilt: 4 }) },
    { f: len * 0.5, p: { armL: { a: 60, b: -40 }, armR: { a: -60, b: 40 }, headTilt: 6 } },
    { f: len, p: { armL: { a: 65, b: -45 }, armR: { a: -65, b: 45 } } },
  ]);
  const alex = at(1350, HALL.near.y + 60, HALL.near.s * 0.9, { yaw: 0.5, look: 0.9, tilt: 10, expr: 'worried' });
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1070]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Hallway t={t} />
      <K.Hero look={ALEX} pose={alex} rimId="rimR" shadow={0.5} />
      <K.Hero look={MAYA} pose={{ ...maya, ...faceAt(t, [[0, 'neutral'], [len * 0.4, 'smug']]) }} rimId="rimR" shadow={0.55} />
      <RedString x1={pinky({ ...alex }, 'L').x} y1={pinky({ ...alex }, 'L').y} x2={pinky({ ...maya }, 'R').x} y2={pinky({ ...maya }, 'R').y} slack={0.55} glow={0.6} t={t} width={4} />
      <HallForeground t={t} />
    </g>
  );
};

export const p2c1Shots: ShotMap = {
  P2S1, P2S2, P2S3, P2S4, P2S5, P2S6, P2S7, P2S8, P2S9, P2S10,
};
