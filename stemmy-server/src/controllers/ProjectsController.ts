import {
  Controller,
  Get,
  Description,
  PathParams,
  Status,
  Put,
  BodyParams,
  Post,
  Returns,
} from '@tsed/common';
import { Model, MongooseModel, ObjectID } from '@tsed/mongoose';
import { ProjectSchema } from '../models/ProjectSchema';
import { ProjectsService } from '../services/ProjectsService';
import { ProjectProps, trackBundle } from '../stemmy-common';
import { Summary } from '@tsed/swagger';
import { NotFound, InternalServerError } from '@tsed/exceptions';

@Controller('/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('/')
  @Summary('Get a page from the Public projects collection')
  @Status(200, { description: 'Success' })
  async getPage(
    @Description('Which page of results to return')
    @BodyParams('page')
    page: number = 1,
    @Description('How many pages of results to return')
    @BodyParams('perPage')
    perPage: number = 20
  ): Promise<ProjectSchema[]> {
    return this.projectsService.getPage(page, perPage).catch((err) => {
      throw new NotFound(
        `Projects ${page * perPage} through ${
          page * perPage + 1 - 1
        } not found: ${err}`
      );
    });
  }

  @Get('/:id')
  @Summary('get a project from its id')
  @Status(200, { description: 'Success' })
  async get(
    @Description('The project id')
    @PathParams('id')
    id: string
  ): Promise<ProjectSchema | null> {
    return this.projectsService
      .find(id)
      .then((project: ProjectSchema) => {
        if (!project) {
          throw 'Project not found';
        } else {
          return project;
        }
      })
      .catch((err) => {
        if (err === 'Project not found') {
          throw new NotFound(err);
        } else {
          throw new InternalServerError(err);
        }
      });
  }

  @Get('/:id/tracks')
  @Summary(`get a project's tracks`)
  @Status(200, { description: 'Success' })
  async getProjectTracks(
    @Description('The project id')
    @PathParams('id')
    id: string
  ): Promise<trackBundle[] | null> {
    return this.projectsService.getProjectTracks(id).catch((err) => {
      if (err === 'Project not found') {
        throw new NotFound(err);
      } else {
        throw new InternalServerError(err);
      }
    });
  }

  @Post('/create')
  @Summary('create a new project')
  @Status(200, { description: 'Success' })
  @Returns(ProjectSchema)
  async save(
    @Description('Body parameters')
    @BodyParams('params')
    params: ProjectProps
  ): Promise<ProjectSchema | null> {
    return this.projectsService.save(params).catch((err) => {
      throw new InternalServerError(err);
    });
  }

  @Post('/:id')
  @Summary('update a project')
  @Status(200, { description: 'Success' })
  async update(
    @Description('The project id')
    @PathParams('id')
    id: string,
    @Description('Body parameters')
    @BodyParams()
    params: ProjectProps
  ): Promise<ProjectSchema | null> {
    return this.projectsService.update({
      ...params,
      id,
    });
  }
}
