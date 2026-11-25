import React from 'react';
import { ShotMap, ShotProps, Pose } from '../../../engine';
import * as K from './common';

// Scene p4c4 — bandage, "be careful next time", and the shadow with hands on cheeks,
// worried, then reaching toward your hand. Brief: out/crush/scenes/p4c4_brief.md

const { Classroom, ShadowFigure, Bandage, Glow, Tag, camT, kf, clamp, lerp, easeOut, easeInOut, poseAt, faceAt, YOU, EMMA } = K;

const idle = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({ ...K.basePose, x, y, scale: s, ...extra });

const PIP = { x: 640, y: 830, s: 1.0 };
const EMP = { x: 1100, y: 815, s: 0.95 };
const SH = { x: 1330, y: 880 };

const Cls: React.FC<{ t: number; id?: string }> = ({ t, id = 'f4a' }) => <Classroom t={t + 1050} id={id} />;

// P4S31: she checks your finger, brings a bandage — close two-shot, bandage appears
export const P4S31: React.FC<ShotProps> = ({ t, len }) => {
  const bandK = easeOut(clamp((t - len * 0.45) / 10));
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5, armL: { a: 55, b: -28 } } },
    { f: len * 0.6, p: { armL: { a: 60, b: -30 } } },
  ]);
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armR: { a: 40, b: -30 } }) },
    { f: len * 0.5, p: { armR: { a: 35, b: -25 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 568]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Cls t={t} id="f4b" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.4} />
      {/* the bandage, appearing in her other hand */}
      <g opacity={bandK} transform={`translate(${EMP.x - 90} ${EMP.y - 140}) rotate(-10)`}>
        <Bandage x={0} y={0} s={1.1} />
      </g>
      {/* her bag on the floor */}
      <g transform={`translate(${EMP.x + 120} ${EMP.y + 80})`} opacity={0.9}>
        <rect x={-40} y={-30} width={80} height={60} rx={10} fill="#8B5A9E" stroke="#0D0A14" strokeWidth={3} />
        <path d="M -20 -30 Q 0 -50 20 -30" fill="none" stroke="#0D0A14" strokeWidth={5} />
      </g>
    </g>
  );
};

// P4S32: "Here. Be careful next time." — she applies it, small scold
export const P4S32: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5, armL: { a: 60, b: -30 }, armR: { a: 55, b: -28 } } },
    { f: len * 0.5, p: { headTilt: 6 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armR: { a: 30, b: -24 }, ...faceAt(t, [[0, 'worried'], [len * 0.6, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f4c" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.4} />
      {/* bandage now on his finger */}
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
    </g>
  );
};

// P4S33: "Thanks." — Pip grateful
export const P4S33: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armR: { a: 40, b: -30 } }) },
    { f: len * 0.4, p: { headTilt: -6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 978]]), kf(t, [[0, 580], [len, 575]]), kf(t, [[0, 1.5], [len, 1.56]]))}>
      <Cls t={t} id="f4d" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [len * 0.5, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x - 160, EMP.y + 20, EMP.s * 1.05, { yaw: 0.6, look: 0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
    </g>
  );
};

// P4S34: she smiled — Emma's warm smile
export const P4S34: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5, headTilt: 0 } },
    { f: len * 0.5, p: { headTilt: -5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 990], [len, 980]]), kf(t, [[0, 575], [len, 568]]), kf(t, [[0, 1.55], [len, 1.68]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#171327" />
      <Glow x={960} y={540} r={480} o={0.15} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'smug']]) }} rimId="rimR" shadow={0} />
      <Glow x={EMP.x - 160} y={EMP.y - 220} r={240} o={0.15} />
    </g>
  );
};

// P4S35: "You're supposed to help me finish the booth, not injure yourself." — playful scold
export const P4S35: React.FC<ShotProps> = ({ t, len }) => {
  const emp = poseAt(t, [
    { f: 0, p: { x: EMP.x - 160, y: EMP.y + 20, scale: EMP.s * 1.05, yaw: 0.6, look: 0.5, armR: { a: 45, b: -20 } } },
    { f: len * 0.4, p: { armR: { a: 65, b: -26 }, headTilt: 5 }, ease: easeOut },
  ]);
  const pip = idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy'], [len * 0.5, 'oops']]) });
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 972]]), kf(t, [[0, 580], [len, 570]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f4e" />
      <K.Hero look={YOU} pose={pip} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={{ ...emp, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.4} />
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
    </g>
  );
};

// P4S36: you laughed — Pip's laugh
export const P4S36: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, headTilt: 0 }) },
    { f: len * 0.4, p: { headTilt: -9, armL: { a: 50, b: -24 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.52]]))}>
      <Cls t={t} id="f4f" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [len * 0.4, 'oops']]) }} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x - 160, EMP.y + 20, EMP.s * 1.05, { yaw: 0.6, look: 0.5, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
    </g>
  );
};

// P4S37: however, her shadow had both hands on its cheeks — worried face
export const P4S37: React.FC<ShotProps> = ({ t, len }) => {
  const worry = clamp((t - len * 0.3) / 10);
  return (
    <g transform={camT(kf(t, [[0, 1060], [len, 1045]]), kf(t, [[0, 600], [len, 588]]), kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Cls t={t} id="f4g" />
      {/* Emma + Pip small below */}
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.4} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      {/* the shadow behind Emma, hands on cheeks, huge worry lines */}
      <ShadowFigure x={SH.x} y={SH.y} s={0.9} flip={-1} mood="cry" t={t} opacity={worry} />
      {/* hands-on-cheeks: draw two circles at face sides */}
      <g opacity={worry} transform={`translate(${SH.x} ${SH.y}) scale(0.9 -0.9)`}>
        <circle cx={-46} cy={-215} r={13} fill="#100C1C" />
        <circle cx={46} cy={-215} r={13} fill="#100C1C" />
      </g>
      {/* worry ticks */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${SH.x - 140 + i * 30} ${SH.y - 340 - i * 16} q 12 14 0 28`} stroke="#8FD3FF" strokeWidth={5} fill="none" opacity={0.7 * worry} />
      ))}
      <Glow x={SH.x} y={SH.y - 140} r={260} o={0.14 * worry} />
    </g>
  );
};

// P4S38: it looked extremely worried — closer on worried shadow
export const P4S38: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t * 1.1) * 4;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 2.1], [len, 2.3]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#141126" />
      <Glow x={960} y={500} r={520} o={0.14} />
      <g transform={`translate(${shake} 0)`}>
        <ShadowFigure x={SH.x} y={SH.y} s={1.2} flip={-1} mood="cry" t={t} />
      </g>
      {/* big worry sweat drops */}
      {[0, 1].map((i) => (
        <path key={i} d={`M ${SH.x - 80 + i * 160} ${SH.y - 330} q 8 14 0 22 q -8 -8 0 -22`} fill="#8FD3FF" opacity={0.8} />
      ))}
      <Tag x={SH.x - 260} y={300} t={t - 4} text="very worried" />
    </g>
  );
};

// P4S39: it carefully reached toward your hand — shadow arm extends
export const P4S39: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeInOut(clamp((t - len * 0.3) / (len * 0.5)));
  const rx = lerp(SH.x - 120, PIP.x + 180, reach);
  const ry = lerp(SH.y - 200, PIP.y - 210, reach);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 968]]), kf(t, [[0, 585], [len, 570]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Cls t={t} id="f4h" />
      <K.Hero look={YOU} pose={idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4, armR: { a: 30, b: -24 }, ...faceAt(t, [[0, 'happy'], [len * 0.6, 'shock']]) })} rimId="rimR" shadow={0.5} />
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.4, look: -0.4, ...faceAt(t, [[0, 'happy']]) })} rimId="rimR" shadow={0.35} />
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
      {/* the shadow reaching — arm stretched toward Pip's bandaged hand */}
      <ShadowFigure x={rx} y={SH.y} s={0.7} flip={-1} mood="idle" t={t} opacity={0.9} />
      <path d={`M ${SH.x - 60} ${SH.y - 190} Q ${(SH.x + rx) / 2} ${SH.y - 160} ${rx} ${ry + 60}`} stroke="#100C1C" strokeWidth={14} fill="none" strokeLinecap="round" opacity={reach} />
      {reach > 0.7 ? <Glow x={rx} y={ry} r={120} o={0.15} /> : null}
    </g>
  );
};

// P4S40: you glanced at Emma — is she watching? she isn't
export const P4S40: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: idle(PIP.x, PIP.y, PIP.s, { yaw: 0.4, look: 0.4 }) },
    { f: len * 0.5, p: { yaw: -0.5, look: -0.5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 985], [len, 975]]), kf(t, [[0, 580], [len, 572]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Cls t={t} id="f4i" />
      <K.Hero look={YOU} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [len * 0.6, 'worried']]) }} rimId="rimR" shadow={0.5} />
      {/* Emma turned away, back to camera, decorating */}
      <K.Hero look={EMMA} pose={idle(EMP.x, EMP.y, EMP.s, { yaw: -0.9, look: -0.6, armL: { a: 55, b: -26 }, ...faceAt(t, [[0, 'neutral']]) })} rimId="rimR" shadow={0.35} />
      <Bandage x={PIP.x + 60} y={PIP.y - 200} s={0.9} rot={-15} />
      {/* eyeline from Pip to Emma's back */}
      <path d={`M ${PIP.x + 60} ${PIP.y - 280} L ${EMP.x - 40} ${EMP.y - 260}`} stroke="#8B7BB8" strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
    </g>
  );
};

export const p4c4Shots: ShotMap = {
  P4S31, P4S32, P4S33, P4S34, P4S35, P4S36, P4S37, P4S38, P4S39, P4S40,
};
