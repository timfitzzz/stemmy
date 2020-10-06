import {
  Configuration,
  Controller,
  Description,
  Get,
  Next,
  PathParams,
  Res,
  Status,
} from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Summary } from '@tsed/swagger';
import { getPackedSettings } from 'http2';
import { resolve } from 'path';
import { audioEntityTypes, PngShapes } from '../stemmy-common';
import { LoopsService } from '../services/LoopsService';
import { png } from '../models/LoopSchema';

@Controller('/pngs')
export class PngsController {
  constructor(
    @Configuration()
    private configuration: Configuration,
    private loopsService: LoopsService
  ) {}

  @Get('/:entityType/:entityId/:imageId')
  @Summary('get a png render for the audio file')
  @Status(200, { description: 'Success' })
  async getPng(
    @Description('Which entity type is the png for')
    @PathParams('entityType')
    entityType: audioEntityTypes,
    @Description('The id of the entity')
    @PathParams('entityId')
    entityId: string,
    @Description("the id of the image (in the entity's pngs array)")
    @PathParams('imageId')
    imageId: number,
    @Res()
    res: Res,
    @Next()
    next: Next
  ): Promise<void> {
    if (entityType === audioEntityTypes.Loop) {
      await this.loopsService.findById(entityId).then(async (loop) => {
        if (loop && loop.pngs) {
          let pngPath = loop.pngs[imageId].path;
          res.type('png');
          res.sendFile(resolve(pngPath), {}, (err) => {
            if (err) {
              res.sendStatus(500);
              next();
            }
            next();
          });
        } else {
          throw new NotFound(
            `${audioEntityTypes[entityType]} with id ${entityId} not found or not correctly formed`
          );
        }
      });
    }
  }
}
