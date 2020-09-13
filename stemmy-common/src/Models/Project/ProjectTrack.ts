import mongoose from 'mongoose';
import { Loop, audioEntityTypes } from '../AudioEntities';
import { Model } from '../Model';
import { Attributes } from '../Attributes';
import { ApiSync } from '../ApiSync';
import { Eventing } from '../Eventing';

export interface ProjectTrackProps {
  id?: string;
  //projectId?: string;
  entityType?: audioEntityTypes;
  entityId?: string;
  pan?: number;
  playing?: boolean;
  reverse?: boolean;
  scale?: number;
  synchronize?: boolean;
  volume?: number;
}

export class ProjectTrack extends Model<ProjectTrackProps> {
  static buildProjectTrack(props: ProjectTrackProps) {
    return new ProjectTrack(
      new Attributes<ProjectTrackProps>(props),
      new ApiSync<ProjectTrackProps>('tracks'),
      new Eventing()
    );
  }

  public attachEntity(entityType: audioEntityTypes, entityId: string): void {
    if (entityType === audioEntityTypes.Loop)
      this.set({ entityType, entityId });
  }
}
