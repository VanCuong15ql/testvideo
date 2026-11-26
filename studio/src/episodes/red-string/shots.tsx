import { ShotMap } from '../../engine';
import { p1c1Shots } from './shots/p1c1';
import { p1c2Shots } from './shots/p1c2';
import { p1c3Shots } from './shots/p1c3';
import { p1c4Shots } from './shots/p1c4';
import { p2c1Shots } from './shots/p2c1';
import { p2c2Shots } from './shots/p2c2';
import { p2c3Shots } from './shots/p2c3';
import { p2c4Shots } from './shots/p2c4';
import { p3c1Shots } from './shots/p3c1';
import { p3c2Shots } from './shots/p3c2';
import { p3c3Shots } from './shots/p3c3';
import { p3c4Shots } from './shots/p3c4';
import { p4c1Shots } from './shots/p4c1';
import { p4c2Shots } from './shots/p4c2';
import { p4c3Shots } from './shots/p4c3';
import { p4c4Shots } from './shots/p4c4';
import { p5c1Shots } from './shots/p5c1';
import { p5c2Shots } from './shots/p5c2';
import { p5c3Shots } from './shots/p5c3';
import { p6c1Shots } from './shots/p6c1';
import { p6c2Shots } from './shots/p6c2';
import { p6c3Shots } from './shots/p6c3';
import { p7c1Shots } from './shots/p7c1';
import { p7c2Shots } from './shots/p7c2';
import { p7c3Shots } from './shots/p7c3';
import { p8c1Shots } from './shots/p8c1';
import { p8c2Shots } from './shots/p8c2';
import { p8c3Shots } from './shots/p8c3';
import { p9c1Shots } from './shots/p9c1';
import { p9c2Shots } from './shots/p9c2';
import { p9c3Shots } from './shots/p9c3';
import { p10c1Shots } from './shots/p10c1';
import { p10c2Shots } from './shots/p10c2';
import { p10c3Shots } from './shots/p10c3';
import { p10c4Shots } from './shots/p10c4';

// "What If a Red String Connected You To Your Crush?" — 10 pages, 306 shots.
export const shots: ShotMap = {
  ...p1c1Shots, ...p1c2Shots, ...p1c3Shots, ...p1c4Shots,
  ...p2c1Shots, ...p2c2Shots, ...p2c3Shots, ...p2c4Shots,
  ...p3c1Shots, ...p3c2Shots, ...p3c3Shots, ...p3c4Shots,
  ...p4c1Shots, ...p4c2Shots, ...p4c3Shots, ...p4c4Shots,
  ...p5c1Shots, ...p5c2Shots, ...p5c3Shots,
  ...p6c1Shots, ...p6c2Shots, ...p6c3Shots,
  ...p7c1Shots, ...p7c2Shots, ...p7c3Shots,
  ...p8c1Shots, ...p8c2Shots, ...p8c3Shots,
  ...p9c1Shots, ...p9c2Shots, ...p9c3Shots,
  ...p10c1Shots, ...p10c2Shots, ...p10c3Shots, ...p10c4Shots,
};
