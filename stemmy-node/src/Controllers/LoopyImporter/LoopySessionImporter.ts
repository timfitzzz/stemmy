import { ApiSync } from '../../Models/ApiSync';
import { Attributes } from '../../Models/Attributes';
import { Eventing } from '../../Models/Eventing';

import {
  LoopySession,
  LoopySessionTrack,
  LoopyAiffs,
  LoopyAiffInfo,
} from '../../Models/LoopyEntities';
import { Project, ProjectTrack, ProjectProps } from '../../Models/Project';
import {
  Loop,
  AudioEntitySources,
  audioEntityTypes,
} from '../../Models/AudioEntities';
import fs from 'fs';
import { resolve } from 'path';
import { WSAEHOSTDOWN } from 'constants';

type importCheckpoints = {
  projectSaved: boolean;
  loopsSaved: boolean;
  tracksSaved: boolean;
};

const wait: (ms: number) => Promise<void> = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class LoopySessionImporter {
  project: Project = Project.getPlaceholder();
  tracks: ProjectTrack[];
  loops: Loop[];
  done: Boolean = false;

  isProjectInitiallySaved(): Boolean {
    return !!this.project.get('id');
  }

  areLoopsSaved(): Boolean {
    let unsavedLoops = this.loops.filter((loop: Loop) => {
      return !!loop.get('id');
    });
    let response: Boolean =
      unsavedLoops.length > 0 &&
      this.loops.length === this.loopySession.metadata.tracks.length;
    console.log(`loops are ${!response ? 'not ' : ''}saved`);
    return response;
  }

  areProjectTracksSaved(): Boolean {
    let unsavedProjectTracks = [];
    return (
      (unsavedProjectTracks = this.tracks.filter((track: ProjectTrack) => {
        return !!track.get('id');
      })).length > 0 &&
      this.tracks.length === this.loopySession.metadata.tracks.length
    );
  }

  constructor(public loopySession: LoopySession, public aiffOutPath: string) {
    this.loops = new Array(this.loopySession.metadata.tracks.length);
    this.tracks = new Array(this.loopySession.metadata.tracks.length);
    this.aiffOutPath = resolve(aiffOutPath);
  }

  import(callback?: () => void): void {
    console.log(this.areLoopsSaved(), ' is status of loop saveage');
    // create and save project
    this.createAndSaveProject((projectId: number) => {
      console.log('saved project: id ', projectId);
      // once project is created and saved, generate and save loops
      this.createAndSaveLoops(() => {
        console.log(
          'saved loops: ',
          ...this.loops.map((loop) => loop.get('id'))
        );
        // once loops are generated and saved, generate and save project tracks
        this.createAndSaveProjectTracks(() => {
          console.log(
            'saved project tracks: ',
            ...this.tracks.map((track) => track.get('id'))
          );
          // once project tracks are generated and saved, attach to project.
          this.project.addProjectTracks(this.tracks);
          console.log(
            'attached tracks to project: ',
            ...(this.project.get('tracks') || [])
          );
          // once project tracks are attached to project, save project.
          const saveHandler = this.project.on('save', () => {
            // once project is saved, mark as done and optionally run callback
            this.done = true;
            console.log('saved project: ', this.project);
            this.project.remove('save', saveHandler);
            if (callback) {
              callback();
            }
          });
        });
      });
    });
  }

  createAndSaveProject(callback: (projectId: number) => void): void {
    const projectProps: ProjectProps = {
      name: this.loopySession.name,
      clock: this.loopySession.metadata.clock,
      tracks: [],
    };
    this.project = Project.buildProject(projectProps);
    const saveHandler = this.project.on('save', () => {
      console.log('project save handler called');
      this.project.remove('save', saveHandler);
      callback(this.project.get('id') || -1);
    });
    this.project.save();
  }

  createAndSaveLoops(callback: () => void): void {
    const loopyTrackMetadata: LoopySessionTrack[] = this.loopySession.metadata
      .tracks;
    const loopyAiffs: LoopyAiffs = this.loopySession.aiffs;
    const savedLoops: number[] = [];

    loopyTrackMetadata.forEach(
      (loopyTrack: LoopySessionTrack, index: number) => {
        const loopyAiff = this.loopySession.aiffs.filter((v: LoopyAiffInfo) => {
          if (v[0] === index) {
            return true;
          }
        })[0];
        console.log(loopyAiff);
        this.saveAiff(
          loopyAiff[1],
          `p${this.project.get('id')}-${index}.aiff`,
          (outPath: string) => {
            console.log('back from saving loop');
            const stemmyLoopProps = {
              originalProjectId: this.project.get('id') || -1,
              decay: loopyTrack.decay,
              loopStartTime: loopyTrack.loopStartTime,
              originalLoopStartTime: loopyTrack.originalLoopStartTime,
              originalScale: loopyTrack.originalScale,
              filePath: outPath,
              source: AudioEntitySources['loopyhd'],
            };
            console.log(stemmyLoopProps);
            this.loops[index] = new Loop(stemmyLoopProps);
            const saveHandler = this.loops[index].on('save', () => {
              this.loops[index].remove('save', saveHandler);
              console.log('loop save handler called');
              savedLoops.push(index);

              console.log(savedLoops);
            });
            console.log('created save handler');
            this.loops[index].save();
          }
        );
      }
    );

    const waitToCallback = () => {
      wait(500).then(() => {
        if (this.areLoopsSaved()) {
          callback();
        } else {
          waitToCallback();
        }
      });
    };

    waitToCallback();
  }

  createAndSaveProjectTracks(callback: () => void): void {
    const loopyTrackMetadata = this.loopySession.metadata.tracks;
    loopyTrackMetadata.forEach((track: LoopySessionTrack, index: number) => {
      const { pan, playing, reverse, scale, synchronize, volume } = track;
      const stemmyProjectTrack = ProjectTrack.buildProjectTrack({
        projectId: this.project.get('id'),
        entityType: audioEntityTypes.Loop,
        entityId: this.loops[index].get('id'),
        pan,
        playing,
        reverse,
        scale,
        synchronize,
        volume,
      });
      const saveHandler = stemmyProjectTrack.on('save', () => {
        this.tracks[index] = stemmyProjectTrack;
        stemmyProjectTrack.remove('save', saveHandler);
      });
      stemmyProjectTrack.save();
    });

    const waitToCallback = () => {
      wait(500).then(() => {
        if (this.areProjectTracksSaved()) {
          callback();
        } else {
          waitToCallback();
        }
      });
    };

    callback();
  }

  // TODO: Genericize
  saveAiff(
    aiff: Buffer,
    aiffName: string,
    callback: (outPath: string) => void,
    saved: Boolean = false
  ): void {
    let waitcount = 0;
    const outPath = this.aiffOutPath + '/' + aiffName;
    console.log(aiff);
    fs.writeFile(outPath, aiff, 'utf-8', (err) => {
      saved = true;
      if (err) {
        console.log(err);
      }
      console.log('fs callback');
      callback(outPath);
    });
  }
}
