import {
  Controller,
  Get,
  Description,
  PathParams,
  Status,
  Put,
  BodyParams,
  Post,
  Inject,
} from '@tsed/common';
import { Model, MongooseModel, ObjectID } from '@tsed/mongoose';
import { TrackSchema } from '../models/TrackSchema';
import { TracksService } from '../services/TracksService';
import { ProjectTrackProps } from '../stemmy-common';
import { Summary } from '@tsed/swagger';
import { NotFound, InternalServerError } from '@tsed/exceptions';
import { MultipartFile } from '@tsed/multipartfiles';
import { trackBundle } from '../stemmy-common';

@Controller('/tracks')
export class TracksController {
  constructor(private tracksService: TracksService) {}

  @Post('/')
  @Summary('get a page of track bundles')
  @Status(200, { description: 'Success' })
  async getPage(
    @Description('How many projects to return per page')
    @BodyParams('page')
    page: number = 0,
    @Description('Which page of results to return')
    @BodyParams('perPage')
    perPage: number = 20
  ): Promise<trackBundle[]> {
    return this.tracksService.getBundlePage(page, perPage).catch((err) => {
      throw new NotFound(
        `Bundles ${page * perPage} through ${page * perPage + 1} not found`
      );
    });
  }

  @Get('/:id')
  @Summary(
    'get a track from its id, and any audioEntity that might be associated with it'
  )
  @Status(200, { description: 'Success' })
  async get(
    @Description('The track id')
    @PathParams('id')
    id: string
  ): Promise<trackBundle | trackBundle[] | null> {
    console.log(id);
    return this.tracksService.findById(id).catch((err) => {
      throw new NotFound('Track not found');
    });
  }

  @Post('/create')
  @Summary('create a new track')
  @Status(200, { description: 'Success' })
  async save(
    @Description('Body parameters')
    @BodyParams()
    params: ProjectTrackProps
  ): Promise<TrackSchema | null> {
    return this.tracksService.save(params).catch((err) => {
      throw new InternalServerError(err);
    });
  }

  @Post('/:id')
  @Summary('update a track')
  @Status(200, { description: 'Success' })
  async update(
    @Description('The track id')
    @PathParams('id')
    id: string,
    @Description('Body parameters')
    @BodyParams()
    params: ProjectTrackProps
  ): Promise<TrackSchema | null> {
    return this.tracksService.findById(id).then(() =>
      this.tracksService.save(params).catch((err) => {
        throw new InternalServerError(err);
      })
    );
  }
}
