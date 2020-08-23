export interface LoopySessionClockSettings {
  BPM?: number;
  BPMIsGuessed?: boolean;
  beatsPerBar?: 4;
  length?: number;
  lengthIsSet?: boolean;
  multiplier?: number;
  originalBPM?: number;
}

export interface LoopySessionTrack {
  decay?: number;
  loopStartTime?: number;
  originalLoopStartTime?: number;
  originalScale?: number;
  pan?: number;
  playing?: boolean;
  reverse?: boolean;
  scale?: number;
  synchronize?: boolean;
  volume?: number;
}

export interface LoopySessionMetadata {
  clock: LoopySessionClockSettings;
  tracks: LoopySessionTrack[];
}
