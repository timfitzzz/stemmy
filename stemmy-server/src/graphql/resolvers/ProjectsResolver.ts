import { Inject } from '@tsed/di';
import { ResolverService } from '@tsed/graphql';
import { Arg, Args, Query, Mutation } from 'type-graphql';
import { ProjectsService } from '../../services/ProjectsService';
import { ProjectSchema } from '../../models/ProjectSchema';
import { ProjectProps } from '../../stemmy-common';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { AddProjectInput } from '../inputs/AddProjectInput';

@ResolverService(ProjectSchema)
export class ProjectResolver {
  @Inject()
  private projectsService: ProjectsService;

  @Query((returns) => ProjectSchema)
  async project(@Arg('id', { nullable: true }) id?: string) {
    const project = await this.projectsService.find(id);
    if (project == undefined) {
      throw new NotFound(`Project id ${id} not found`);
    }
    return project;
  }

  @Query((returns) => [ProjectSchema])
  async projectsPage(
    @Arg('page', { nullable: true })
    page: number = 1,
    @Arg('perPage', { nullable: true })
    perPage: number = 20
  ): Promise<ProjectSchema[]> {
    return await this.projectsService.getPage(page, perPage).catch((err) => {
      throw new NotFound(
        `Projects ${(page - 1) * perPage + 1} through ${
          page * perPage
        } not found`
      );
    });
  }

  @Query((returns) => [ProjectSchema])
  async allProjects() {
    const projects = await this.projectsService.find();
    if (projects == undefined) {
      throw new Error('No projects');
    }
    return projects;
  }

  @Mutation((returns) => ProjectSchema)
  async createProject(
    @Arg('params', (type) => AddProjectInput) params: ProjectProps
  ): Promise<ProjectSchema | null> {
    const project = this.projectsService.save(params).catch((err) => {
      throw new InternalServerError(err);
    });
    return project;
  }

  @Mutation((returns) => ProjectSchema)
  async updateProject(
    @Arg('id')
    id: string,
    @Arg('params', (type) => AddProjectInput)
    params: ProjectProps
  ): Promise<ProjectSchema | null> {
    return this.projectsService.update({
      ...params,
      id,
    });
  }
}
