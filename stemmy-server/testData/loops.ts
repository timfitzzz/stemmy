// @ts-ignore
import fs from 'fs';
import { LoopProps } from '../src/stemmy-common';
import { resolve } from 'path';

export const testLoop: LoopProps = {
  decay: 0,
  loopStartTime: 0,
  originalLoopStartTime: -1,
  originalScale: 0,
  source: 2,
};

export const testLoopFile = resolve(
  './testData/19 Feb 2020, 4%3A06.loopysession/Media/Track 0.aiff'
);
