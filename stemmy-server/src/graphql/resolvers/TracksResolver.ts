import { Inject } from '@tsed/di';
import { ResolverService } from '@tsed/graphql';
import { Arg, Args, Query, Mutation } from 'type-graphql';
import { TracksService } from '../../services/TracksService';
import { TrackSchema } from '../../models/TrackSchema';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { AddProjectInput } from '../inputs/AddProjectInput';
import { trackBundle, ProjectTrackProps } from '../../stemmy-common';
import { AddTrackInput } from '../inputs/AddTrackInput';

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
