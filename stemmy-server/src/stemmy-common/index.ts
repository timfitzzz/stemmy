import { png } from '../models/LoopSchema';
export * from './AudioFileReader';
export * from './getFileInfoFromHeader';
export * from './wavToPng';

export enum audioEntityTypes {
  Loop,
}

export enum AudioEntitySources {
  'loopyhd',
  'web',
  'unset',
}

export enum PngShapes {
  'round',
  'flat',
}

export interface AudioEntityProps {
  id?: string;
  fileName?: string;
  pngs?: png[];
  source?: AudioEntitySources;
  audioData?: any;
}

export interface LoopProps extends AudioEntityProps {
  originalProjectId?: string;
  decay?: number;
  loopStartTime?: number;
  originalLoopStartTime?: number;
  originalScale?: number;
}

export type ProjectClockSettings = {
  BPM?: number;
  BPMIsGuessed?: boolean;
  beatsPerBar?: number;
  length?: number;
  lengthIsSet?: boolean;
  multiplier?: number;
  originalBPM?: number;
};

export interface ProjectProps {
  id?: string;
  tracks?: string[];
  clock?: ProjectClockSettings;
  name?: string;
}

export interface ProjectTrackProps {
  id?: string;
  projectId?: string;
  entityType?: audioEntityTypes;
  entityId?: string;
  pan?: number;
  playing?: boolean;
  reverse?: boolean;
  scale?: number;
  synchronize?: boolean;
  volume?: number;
}

export interface trackBundle {
  track: ProjectTrackProps;
  audioEntity?: AudioEntityProps;
}
