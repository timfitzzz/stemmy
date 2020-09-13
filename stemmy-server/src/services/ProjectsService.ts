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
          console.log('project not found');
          rej('Project not found');
        } else {
          console.log(`found project: `, project);
          if (project.tracks == undefined || project.tracks == null) {
            console.log(`no tracks property on project`);
            res([]);
          } else if (project.tracks.length === 0) {
            console.log(`tracks property is empty array`);
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
        console.log('caught error: ', err);
        rej(err);
      }
    });
  }

  async getPage(page: number, perPage: number): Promise<ProjectSchema[]> {
    return await this.Project.find(
      {},
      {},
      { skip: page * perPage, limit: perPage }
    );
    this.Project.find();
  }

  async save(props: ProjectProps): Promise<ProjectSchema | null> {
    if (props) {
      const newProject: ProjectSchema = {
        ...props,
        clock: props.clock || defaultProjectClock(),
        tracks:
          (props.tracks &&
            props.tracks.map((trackId) => {
              return (trackId as unknown) as string;
            })) ||
          [],
        _id: (props.id as unknown) as string,
      };

      if (props.clock) {
      }

      return await this.Project.create(newProject);
    }
    return null;
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
