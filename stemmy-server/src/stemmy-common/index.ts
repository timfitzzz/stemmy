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

export abstract class AudioEntityProps {
  id?: string;
  fileName?: string;
  pngs?: png[];
  source?: AudioEntitySources;
  audioData?: any;
}

export abstract class LoopProps extends AudioEntityProps {
  originalProjectId?: string;
  decay?: number;
  loopStartTime?: number;
  originalLoopStartTime?: number;
  originalScale?: number;
}

export abstract class ProjectClockSettings {
  BPM?: number;
  BPMIsGuessed?: boolean;
  beatsPerBar?: number;
  length?: number;
  lengthIsSet?: boolean;
  multiplier?: number;
  originalBPM?: number;
}

export abstract class ProjectProps {
  id?: string;
  tracks?: string[];
  clock?: ProjectClockSettings;
  name?: string;
}

export abstract class ProjectTrackProps {
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

export abstract class trackBundle {
  track: ProjectTrackProps;
  audioEntity?: AudioEntityProps;
}
