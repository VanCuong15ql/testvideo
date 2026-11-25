import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from '../crush/shots';
import type { Timeline } from '../../engine';

// Preview episode: only page 1 of the crush story (P1S1–P1S45, ~130 s).
// Reuses the full crush shot map — the timeline only references P1 ids.
export const crushP1 = defineEpisode('CrushP1', {
  timeline: timeline as Timeline,
  shots,
});
