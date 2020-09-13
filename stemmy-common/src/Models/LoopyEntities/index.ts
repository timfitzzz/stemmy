import { LoopySessionMetadata } from './LoopySession';

export * from './LoopySession';

export type LoopyAiffInfo = [number, Buffer];
export type LoopyAiffs = LoopyAiffInfo[];
export type LoopySession = {
  name: string;
  metadata: LoopySessionMetadata;
  aiffs: LoopyAiffs;
};
