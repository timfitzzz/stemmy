import { Inject, Service, Injectable } from '@tsed/common';
import { MongooseModel, Ref } from '@tsed/mongoose';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { $log } from '@tsed/logger';

import { ProjectSchema } from '../models/ProjectSchema';
import { ProjectProps, ProjectClockSettings } from '../stemmy-common';
import { TracksService } from './TracksService';
import { trackBundle } from '../stemmy-common';
import mongoose from 'mongoose';
import { rejects } from 'assert';
import { resolve } from 'path';
import { TrackSchema } from '../models/TrackSchema';

@Service()
export class ProjectsService {
  @Inject(ProjectSchema)
  private Project: MongooseModel<ProjectSchema>;
  @Inject(TracksService)
  private TracksService: TracksService;

  async find(
    id?: string[] | string
  ): Promise<ProjectSchema | ProjectSchema[] | null> {
    if (id) {
      if (Array.isArray(id)) {
        return await this.Project.find({
          $in: id.map((individualId) => {
            return mongoose.Types.ObjectId(individualId);
          }),
        });
      } else {
        return await this.Project.findById(id).exec();
      }
    } else {
      return await this.Project.find().exec();
    }
  }

  async getProjectTracks(id: string): Promise<trackBundle[] | null> {
    return await new Promise(async (res, rej) => {
      try {
        const project = await this.Project.findById(id);
        if (!project) {
          rej('Project not found');
        } else {
          if (project.tracks == undefined || project.tracks == null) {
            res([]);
          } else if (project.tracks.length === 0) {
            res([]);
          } else {
            if (project.tracks) {
              const trackBundles = await this.TracksService.getBundlesById(
                project.tracks.map((track) => track as string)
              );
              res(trackBundles);
            }
          }
        }
      } catch (err) {
        rej(err);
      }
    });
  }

  async getPage(page: number, perPage: number): Promise<ProjectSchema[]> {
    return await this.Project.find(
      {},
      {},
      { skip: (page - 1) * perPage, limit: perPage }
    );
  }

  // TODO: Get userid as prop to filter only user's drafts
  async getDraftsPage(page: number, perPage: number): Promise<ProjectSchema[]> {
    return await this.Project.find(
      { draft: true },
      {},
      { skip: (page - 1) * perPage, limit: perPage}
    );
  }
  
  async getAllDrafts(): Promise<ProjectSchema[]> {
    return await this.Project.find(
      { draft: true },
    )
  }

  async save(props: ProjectProps): Promise<ProjectSchema | null> {
    if (props) {
      const newProject: ProjectProps = {
        ...props,
        clock: props.clock || defaultProjectClock(),
        tracks:
          (props.tracks &&
            props.tracks.map((trackId) => {
              return (trackId as unknown) as string;
            })) ||
          [],
      };

      let newProjectDocument = await this.Project.create(newProject);
      return newProjectDocument;
    }
    return null;
  }

  async addTrackToProject(
    projectId: string,
    trackId: string
  ): Promise<ProjectSchema | null> {
    let track = await this.TracksService.findById(trackId);

    if (track) {
      let project = await this.Project.findById(projectId);
      if (project) {
        project.tracks = [...project.tracks!, trackId];
        await project.save();
        return project;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async update(props: ProjectProps): Promise<ProjectSchema | null> {
    if (props) {
      const updateObject: ProjectSchema = {
        ...props,
        tracks:
          (props.tracks &&
            props.tracks.map((trackId) => {
              return (trackId as unknown) as string;
            })) ||
          [],
        _id: (props.id as unknown) as string,
      };

      return this.Project.findOneAndUpdate({ _id: props.id }, updateObject, {
        new: true,
      });
    } else {
      return null;
    }
  }
}

function defaultProjectClock(): ProjectClockSettings {
  return {
    BPM: 89,
    BPMIsGuessed: false,
    beatsPerBar: 4,
    length: 0,
    lengthIsSet: false,
    multiplier: 1,
    originalBPM: 89,
  };
}
