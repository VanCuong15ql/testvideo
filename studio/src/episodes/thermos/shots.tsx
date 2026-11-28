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

export const shots: ShotMap = {
  ...p1c1Shots,
  ...p1c2Shots,
  ...p1c3Shots,
  ...p1c4Shots,
  ...p2c1Shots,
  ...p2c2Shots,
  ...p2c3Shots,
  ...p2c4Shots,
  ...p3c1Shots,
  ...p3c2Shots,
};
