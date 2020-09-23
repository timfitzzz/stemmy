import { Inject, Service } from '@tsed/common';
import { MongooseModel, Ref, MongooseDocument } from '@tsed/mongoose';
import { BadRequest } from '@tsed/exceptions';
import { $log } from '@tsed/logger';

import { TrackSchema } from '../models/TrackSchema';
import {
  ProjectTrackProps,
  trackBundle,
  AudioEntityProps,
} from '../stemmy-common';
import { audioEntityTypes } from '../stemmy-common';
import { LoopSchema } from '../models/LoopSchema';
import { LoopsService } from './LoopsService';
import { resolve } from 'path';
import { isDate } from 'util';

export function convertTrackSchemaToProjectTrackProps(
  track: TrackSchema
): ProjectTrackProps {
  const projectTrack: ProjectTrackProps = Object.assign(
    {},
    //@ts-ignore
    track.toObject(),
    {
      projectId: track.projectId || '',
      id: track._id,
      entityId: track.entityId as string,
    }
  );
  return projectTrack;
}

@Service()
export class TracksService {
  @Inject(TrackSchema)
  private Track: MongooseModel<TrackSchema>;
  @Inject(LoopsService)
  private LoopsService: LoopsService;

  async getPage(page: number, perPage: number): Promise<TrackSchema[]> {
    return await this.Track.find(
      {},
      {},
      { skip: (page - 1) * perPage, limit: perPage }
    );
  }

  // async getTrackBundlePage(page: number, perPage: number): Promise<trackBundle[]> {
  //   const tracksPage = this.getPage(page, perPage);
  // }

  async getBundleById(id: string): Promise<trackBundle> {
    return new Promise(async (resolve, reject) => {
      const track = await this.Track.findById(id).exec();
      let entity;
      if (track && track.entityId) {
        switch (track.entityType) {
          case audioEntityTypes.Loop: {
            entity =
              (await this.LoopsService.find(track.entityId)) || undefined;
            break;
          }
          default: {
            entity = {};
            break;
          }
        }
        const convertedTrack = convertTrackSchemaToProjectTrackProps(track);
        const returnObject = {
          track: convertedTrack,
          audioEntity: entity,
        };
        resolve(returnObject);
      } else if (track) {
        resolve({ track: convertTrackSchemaToProjectTrackProps(track) });
      } else {
        resolve();
      }
    });
  }

  async findById(id: string | undefined): Promise<trackBundle | null> {
    if (id) {
      return this.getBundleById(id);
    } else {
      return new Promise(async (resolve) => resolve(null));
    }
  }

  async findByIds(ids: string[]): Promise<trackBundle[]> {
    return Promise.all<trackBundle>(
      ids.map(async (id: string) => {
        return await this.getBundleById(id);
      })
    );
  }

  async getBundlesById(ids: string[]): Promise<trackBundle[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let bundles: trackBundle[] = [];
        ids.forEach(async (id) => {
          bundles.push(await this.getBundleById(id));
          if (bundles.length === ids.length) {
            resolve(bundles);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async getBundlePage(page: number, perPage: number): Promise<trackBundle[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let bundles: trackBundle[] = [];
        const tracks = (await this.getPage(page, perPage)) || [];
        tracks.forEach(async (track, index) => {
          const loop = (await this.LoopsService.find(
            track.entityId as string
          )) as LoopSchema;
          bundles.push({
            track: convertTrackSchemaToProjectTrackProps(track),
            audioEntity: loop ? loop : undefined,
          });

          if (tracks.indexOf(track) === tracks.length - 1) {
            resolve(bundles);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async save(props: ProjectTrackProps): Promise<TrackSchema | null> {
    if (props && typeof props.entityType !== undefined) {
      const newTrack: TrackSchema = {
        ...props,
        projectId: props.projectId as string,
        pan: props.pan || trackDefaults.pan,
        playing: props.playing || trackDefaults.playing,
        reverse: props.reverse || trackDefaults.reverse,
        scale: props.scale || trackDefaults.scale,
        synchronize: props.synchronize || trackDefaults.synchronize,
        volume: props.volume || trackDefaults.volume,
        entityId: (props.entityId as unknown) as string,
        entityType: props.entityType as audioEntityTypes,
        _id: (props.id as unknown) as string,
      };

      return await this.Track.create(newTrack);
    }
    return null;
  }
}

const trackDefaults = {
  pan: 0,
  playing: false,
  reverse: false,
  scale: 1,
  synchronize: true,
  volume: 1,
};
