import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from './shots';
import type { Timeline } from '../../engine';

// "What If Everything You Drew Became Real?" — page 1 preview (P1S1–P1S59, ~172 s).
// Noah discovers his drawings come alive; ends on the cliffhanger scribble.
export const drawings = defineEpisode('Drawings', {
  timeline: timeline as Timeline,
  shots,
});
