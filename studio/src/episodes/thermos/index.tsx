import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from './shots';
import type { Timeline } from '../../engine';

// "Cái Bình Giữ Nhiệt" — two students discover their swapped thermoses share every sip.
// Pages 1-3, ~298 s, Vietnamese narration + dialogue.
export const thermos = defineEpisode('Thermos', {
  timeline: timeline as Timeline,
  shots,
});
