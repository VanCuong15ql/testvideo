import { ShotMap } from '../../engine';
import { p1c1Shots } from './shots/p1c1';
import { p1c2Shots } from './shots/p1c2';
import { p1c3Shots } from './shots/p1c3';
import { p1c4Shots } from './shots/p1c4';
import { p1c5Shots } from './shots/p1c5';
import { p1c6Shots } from './shots/p1c6';

// Page 1 only for now: P1S1–P1S59 (~172 s). Pages 2-4 get their own scenes later.
export const shots: ShotMap = {
  ...p1c1Shots,
  ...p1c2Shots,
  ...p1c3Shots,
  ...p1c4Shots,
  ...p1c5Shots,
  ...p1c6Shots,
};
