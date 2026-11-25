import React from 'react';
import { defineEpisode } from '../../engine';
import timeline from './timeline.json';
import { shots } from './shots';
import type { Timeline } from '../../engine';

// "What If Your Crush's Shadow Revealed Her Secret Feelings?" — a long story episode (5 script pages,
// 35 scenes, ~13 min). Each scene lives in shots/p{n}c{m}.tsx; the voice is the multi-page Gemini take.
export const crush = defineEpisode('Crush', {
  timeline: timeline as Timeline,
  shots,
});
