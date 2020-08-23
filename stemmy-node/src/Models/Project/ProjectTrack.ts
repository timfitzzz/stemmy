import { Loop, audioEntityTypes } from '../AudioEntities';
import { Model } from '../Model';
import { Attributes } from '../Attributes';
import { ApiSync } from '../ApiSync';
import { Eventing } from '../Eventing';

export interface ProjectTrackProps {
  id?: number;
  projectId?: number;
  entityType?: audioEntityTypes;
  entityId?: number;
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

  public attachEntity(entityType: audioEntityTypes, entityId: number): void {
    this.set({ entityType, entityId });
  }
}
