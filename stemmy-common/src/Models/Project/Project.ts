import mongoose from 'mongoose';
import { ProjectTrack } from './ProjectTrack';
import { Model } from '../Model';
import { ApiSync } from '../ApiSync';
import { Attributes } from '../Attributes';
import { Eventing } from '../Eventing';

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

export class Project extends Model<ProjectProps> {
  static buildProject(props: ProjectProps): Project {
    return new Project(
      new Attributes<ProjectProps>(props),
      new ApiSync<ProjectProps>('projects'),
      new Eventing()
    );
  }

  static getPlaceholder(): Project {
    return new Project(
      new Attributes<ProjectProps>({}),
      new ApiSync<ProjectProps>(''),
      new Eventing()
    );
  }

  addProjectTracks(tracks: ProjectTrack[]): void {
    let trackIds: string[] = this.get('tracks') || [];
    tracks.map((track: ProjectTrack) => {
      const trackId = track.get('id');
      if (trackId) {
        if (trackIds.indexOf(trackId) === -1) {
          trackIds.push(trackId);
        }
        this.set({
          tracks: trackIds,
        });
      }
    });
  }
}
