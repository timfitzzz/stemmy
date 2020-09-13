import { Inject } from '@tsed/di';
import { ResolverService } from '@tsed/graphql';
import { Arg, Args, Query, Mutation } from 'type-graphql';
import { ProjectsService } from '../../services/ProjectsService';
import { ProjectSchema } from '../../models/ProjectSchema';
import { ProjectProps } from '../../stemmy-common';
import { InternalServerError } from '@tsed/exceptions';

@ResolverService(ProjectSchema)
export class ProjectResolver {
  @Inject()
  private projectsService: ProjectsService;

  @Query((returns) => ProjectSchema)
  async project(@Arg('id', { nullable: true }) id?: string) {
    const project = await this.projectsService.find(id);
    if (project == undefined) {
      throw new Error(id);
    }
    console.log(project);
    return project;
  }

  @Query((returns) => [ProjectSchema])
  async allProjects() {
    const projects = await this.projectsService.find();
    if (projects == undefined) {
      throw new Error('No projects');
    }
    return projects;
  }

  @Mutation()
  async addProject(
    @Arg('params', (type) => ProjectSchema) params: ProjectSchema
  ): Promise<ProjectSchema | null> {
    const project = this.projectsService.save(params).catch((err) => {
      throw new InternalServerError(err);
    });
    return project;
  }
}
