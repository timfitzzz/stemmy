import { Inject } from '@tsed/di';
import { ResolverService } from '@tsed/graphql';
import { Arg, Args, Query, Mutation, Field, ObjectType } from 'type-graphql';
import { TracksService } from '../../services/TracksService';
import { TrackSchema } from '../../models/TrackSchema';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { AddProjectInput } from '../inputs/AddProjectInput';
import { ProjectTrackProps } from '../../stemmy-common';
import { AddTrackInput } from '../inputs/AddTrackInput';
import { LoopSchema } from '../../models/LoopSchema';

@ObjectType()
abstract class trackBundle {
  @Field((type) => TrackSchema)
  track: TrackSchema;

  @Field((type) => LoopSchema)
  audioEntity?: LoopSchema;
}

@ResolverService(TrackSchema)
export class TrackResolver {
  @Inject()
  private tracksService: TracksService;

  @Query((returns) => TrackSchema)
  async track(@Arg('id', { nullable: true }) id?: string) {
    const track = await this.tracksService.findById(id);
    if (track == undefined) {
      throw new NotFound(`Track id ${id} not found`);
    }
    return track;
  }

  @Query((returns) => [trackBundle])
  async tracks(@Arg('ids', (type) => [String]) ids: string[]) {
    const tracks = await this.tracksService.findByIds(ids);
    if (tracks == undefined) {
      throw new NotFound(`One or more of provided ids not found`);
    }
  }

  @Query((returns) => [TrackSchema])
  async tracksPage(
    @Arg('page', { nullable: true })
    page: number = 1,
    @Arg('perPage', { nullable: true })
    perPage: number = 10
  ): Promise<TrackSchema[]> {
    return await this.tracksService.getPage(page, perPage).catch((err) => {
      throw new NotFound(
        `Tracks ${(page - 1) * perPage + 1} through ${page * perPage} not found`
      );
    });
  }

  @Mutation((returns) => TrackSchema)
  async createTrack(
    @Arg('params', (type) => AddTrackInput) params: ProjectTrackProps
  ): Promise<TrackSchema | null> {
    return await this.tracksService.save(params);
  }
}
