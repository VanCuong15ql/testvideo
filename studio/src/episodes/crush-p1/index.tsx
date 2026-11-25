import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from '../crush/shots';
import type { Timeline } from '../../engine';

// Preview episode: only page 1 of the crush story (P1S1–P1S45, ~130 s).
// Reuses the full crush shot map — the timeline only references P1 ids.
// Touch this file whenever crush/shots changes so slug detection picks crush-p1
// (it beats crush by the not-a-prefix rule) and CI renders the page-1 preview.
export const crushP1 = defineEpisode('CrushP1', {
  timeline: timeline as Timeline,
  shots,
});
