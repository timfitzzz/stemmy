import { Inject } from '@tsed/di';
import { ResolverService } from '@tsed/graphql';
import { Arg, Args, Query, Mutation } from 'type-graphql';
import { LoopsService } from '../../services/LoopsService';
import { LoopSchema } from '../../models/LoopSchema';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { AddProjectInput } from '../inputs/AddProjectInput';

@ResolverService(LoopSchema)
export class LoopResolver {
  @Inject()
  private loopsService: LoopsService;

  @Query((returns) => LoopSchema)
  async loop(@Arg('id', { nullable: true }) id: string) {
    const loop = await this.loopsService.findById(id);
    if (loop == undefined) {
      throw new NotFound(`Loop id ${id} not found`);
    }
    return loop;
  }

  @Query((returns) => [LoopSchema])
  async loopsPage(
    @Arg('page', { nullable: true })
    page: number = 1,
    @Arg('perPage', { nullable: true })
    perPage: number = 10
  ): Promise<LoopSchema[]> {
    return await this.loopsService.getPage(page, perPage).catch((err) => {
      throw new NotFound(
        `Loops ${(page - 1) * perPage + 1} through ${page * perPage} not found`
      );
    });
  }

  @Query((returns) => [LoopSchema])
  async allLoops() {
    const loop = await this.loopsService.find(undefined);
    if (loop == undefined) {
      throw new Error('no projects');
    }
    return loop;
  }
}
