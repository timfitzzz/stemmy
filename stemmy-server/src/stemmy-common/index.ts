import { Property } from '@tsed/common';
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
  @Property()
  id?: string;

  @Property()
  tracks?: string[];

  @Property()
  clock?: ProjectClockSettings;

  @Property()
  name?: string;

  @Property()
  draft: boolean;
}

export abstract class ProjectTrackProps {
  @Property()
  id?: string;

  @Property()
  projectId: string;

  @Property()
  entityType?: audioEntityTypes;

  @Property()
  entityId?: string;

  @Property()
  pan?: number;

  @Property()
  playing?: boolean;

  @Property()
  reverse?: boolean;

  @Property()
  scale?: number;

  @Property()
  synchronize?: boolean;

  @Property()
  volume?: number;
}

export abstract class trackBundle {
  track: ProjectTrackProps;
  audioEntity?: AudioEntityProps;
}
