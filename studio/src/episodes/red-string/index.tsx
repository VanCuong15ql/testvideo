import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from './shots';
import type { Timeline } from '../../engine';

// "What If a Red String Connected You To Your Crush?" — Alex finds a magical red
// thread tied to his pinky that reaches to Maya's. 10 pages, ~13.4 min.
export const redString = defineEpisode('Red-string', {
  timeline: timeline as Timeline,
  shots,
});
