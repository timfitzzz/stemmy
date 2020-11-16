import {
  Controller,
  Get,
  Description,
  PathParams,
  Status,
  Put,
  BodyParams,
  Post,
  Configuration,
  Returns,
  Title,
  IParamOptions,
  ContentType,
  AcceptMime,
  AcceptMimesMiddleware,
  Required,
  Schema,
  ParamRegistry,
  Res,
  Next,
} from '@tsed/common';
import { Model, MongooseModel, ObjectID } from '@tsed/mongoose';
import { LoopSchema, png } from '../models/LoopSchema';
import { LoopsService } from '../services/LoopsService';
import { LoopProps } from '../stemmy-common';
import { Example, Consumes } from '@tsed/swagger';
import { Summary } from '@tsed/swagger';
import { NotFound, InternalServerError } from '@tsed/exceptions';
import { MultipartFile } from '@tsed/multipartfiles';
import { AudioFileProcessor } from '../services/AudioFileProcessor';
import { Type } from '@tsed/core';
import { response } from 'express';
import { resolve } from 'path';
import { nextTick } from 'process';

function mapSchemaToProps<P>(
  newValues: [string, string][]
): (source: any) => P {
  return function (source) {
    return Object.assign(
      {},
      source.toObject(),
      ...newValues.map((newValue) => {
        return { [newValue[0]]: source.get(newValue[1]) };
      })
    );
  };
}

export const convertLoopSchemaToLoopProps: (
  source: LoopSchema
) => LoopProps = mapSchemaToProps<LoopProps>([
  ['originalProjectId', 'originalProjectId'],
  ['id', '_id'],
]);

@Controller('/loops')
export class LoopsController {
  constructor(
    @Configuration()
    private configuration: Configuration,
    private loopsService: LoopsService
  ) {}

  @Post('/')
  @Summary('get a page from the loop collection')
  @Status(200, { description: 'Success' })
  async getPage(
    @Description('How many loops to return')
    @BodyParams('page')
    page: number = 1,
    @Description('Which page of results to return')
    @BodyParams('perPage')
    perPage: number = 20
  ): Promise<LoopSchema[]> {
    return this.loopsService.getPage(page, perPage).catch((err) => {
      throw new NotFound(
        `Loops ${page * perPage} through ${page * perPage + 1 - 1} not found`
      );
    });
  }

  @Get('/:id')
  @Summary('get a loop from its id')
  @Status(200, { description: 'Success' })
  async get(
    @Description('The loop id')
    @PathParams('id')
    id?: string
  ): Promise<LoopSchema | LoopSchema[] | null> {
    return this.loopsService.find(id).catch((err) => {
      throw new NotFound('Loop not found');
    });
  }

  @Get('/audio/:id')
  @Summary(`get a loop's audio from its id`)
  @Status(200, { description: 'Success' })
  async getAudio(
    @Description('the loop id')
    @PathParams('id')
    id: string,
    @Res()
    res: Res,
    @Next()
    next: Next
  ): Promise<void> {
    await this.loopsService.findById(id).then(async (loop) => {
      if (loop && loop.fileName) {
        //let filePath = this.loopsService.getAudioPath(loop.fileName);
        // let filePathPath = resolve(filePath);
        let filePathPath = loop.fileName;
        console.log(loop);
        res.type('wav');
        res.sendFile(filePathPath, {}, (err) => {
          console.log('error sending file: ', filePathPath, err);
          if (err) {
            res.status(500).send(err);
            next();
          }
          next();
        });
      } else {
        throw new NotFound('Loop not found');
      }
    });
  }

  @Post('/create')
  @Summary('create a new loop')
  @Status(200, { description: 'Success' })
  @Consumes('application/json')
  @Returns(LoopSchema)
  async save(
    // @Description('Body parameters')
    // @Required()
    // @Title('loop')
    @BodyParams({ useType: LoopSchema, required: true })
    params: LoopProps
  ): Promise<LoopSchema | null> {
    return this.loopsService.save(params).catch((err) => {
      throw new InternalServerError(err);
    });
  }

  @Post('/upload')
  @Summary(
    'Upload one or more loops and audio files and retrieve loop documents'
  )
  @Status(200, { description: 'Success' })
  //@Returns(LoopSchema[])
  async upload(
    @Description('the array of loop documents being uploaded')
    @BodyParams('loopData')
    loopData: string,

    @Description(
      'the array of loop files that go with the documents being uploaded'
    )
    @MultipartFile('files')
    files: Express.Multer.File[]
  ): Promise<LoopProps[] | LoopProps | null> {
    console.log(loopData);
    const loops: LoopProps[] = JSON.parse(loopData);
    if (loops) {
      const output: Promise<LoopProps[]> = Promise.all<LoopProps>(
        loops.map((data, index) => {
          return new Promise(async (res, rej) => {
            const newLoop: LoopSchema | null = await this.loopsService.processNewLoop(
              data,
              files[index].path
            );
            if (newLoop) {
              res(convertLoopSchemaToLoopProps(newLoop));
            } else {
              rej('no loop');
            }
          });
        })
      ).catch((err) => {
        console.log(err);
        throw new InternalServerError(err);
      });
      return output;
    } else {
      return null;
    }
  }

  @Post('/replace')
  @Summary('Upload an audio file to assign to the loop with the given id')
  @Status(200, { description: 'Success' })
  //@Consumes('multipart/form-data', 'audio/x-aiff', 'audio/wav')
  @Returns(LoopSchema)
  async replaceFile(
    @Description('The id of an existing loop entity')
    @BodyParams('id')
    id: string,
    @Description('The audio file to attach')
    @MultipartFile('file')
    file: Express.Multer.File
  ): Promise<LoopProps | null> {
    const audioFileProcessor = new AudioFileProcessor(file.path);
    let { output, pngs } = await audioFileProcessor.readAndProcessFile();

    return this.loopsService
      .attachFiles(id, file.filename, pngs)
      .then(async () => {
        return this.loopsService
          .find(id)
          .then((data: LoopSchema) => {
            return convertLoopSchemaToLoopProps(data);
          })
          .catch((err) => {
            throw new InternalServerError(err);
          });
      });
  }

  @Post('/:id')
  @Summary('update a loop')
  @Status(200, { description: 'Success' })
  async update(
    @Description('The loop id')
    @PathParams('id')
    id: string,
    @Description('Body parameters')
    @BodyParams('loopData')
    loopData: LoopProps,
    @MultipartFile('file')
    file?: Express.Multer.File
  ): Promise<LoopSchema | null> {
    if (file) {
      loopData.fileName = file.filename;
      const audioFileProcessor = new AudioFileProcessor(file.path);
      loopData.pngs = await audioFileProcessor.createPngs();
    }

    return this.loopsService.find(id).then((result: LoopSchema) =>
      this.loopsService
        .save({
          ...loopData,
          ...result,
          originalProjectId: result.originalProjectId.toString(),
        })
        .catch((err) => {
          throw new InternalServerError(err);
        })
    );
  }
}
