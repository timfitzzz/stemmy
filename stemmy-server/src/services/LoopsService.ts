import { Inject, Service, Constant } from '@tsed/common';
import { MongooseModel, Ref } from '@tsed/mongoose';
import { BadRequest } from '@tsed/exceptions';
import { $log } from '@tsed/logger';
import { LoopSchema, png } from '../models/LoopSchema';
import { LoopProps } from '../stemmy-common';
import { stringify } from 'querystring';
import { MongooseDocument, Mongoose } from 'mongoose';
import { deepExtends } from '@tsed/core';
import { promises } from 'fs';
import { AudioFileProcessor } from './AudioFileProcessor';
import { convertLoopSchemaToLoopProps } from '../controllers/LoopsController';

@Service()
export class LoopsService {
  @Constant('multer.dest')
  private multerPath: string;

  @Inject(LoopSchema)
  private Loop: MongooseModel<LoopSchema>;

  async find(
    id: string | undefined
  ): Promise<LoopSchema | LoopSchema[] | null> {
    if (id) {
      return await this.Loop.findById(id).exec();
    } else {
      return await this.Loop.find().exec();
    }
  }

  async findById(id: string): Promise<LoopSchema | null> {
    return (await this.Loop.findById(id).exec()) || null;
  }

  async getPage(page: number, perPage: number): Promise<LoopSchema[]> {
    return await this.Loop.find(
      {},
      {},
      { skip: (page - 1) * perPage, limit: perPage }
    );
  }

  async save(props: LoopProps): Promise<LoopSchema | null> {
    // @ts-ignore
    const newLoop: LoopSchema = {
      ...props,
      originalProjectId: (props.originalProjectId as unknown) as string,
      _id: (props.id as unknown) as string,
    };
    return await this.Loop.create(newLoop);
  }

  async attachFiles(
    id: string,
    fileName: string,
    pngs: png[]
  ): Promise<LoopSchema | null> {
    return await this.Loop.findOneAndUpdate(
      { _id: id },
      {
        fileName,
        pngs,
      },
      { new: true }
    );
  }

  async processNewLoop(
    props: LoopProps,
    path: string
  ): Promise<LoopSchema | null> {
    const audioFileProcessor = new AudioFileProcessor(path);
    let { pngs } = await audioFileProcessor.readAndProcessFile();

    return await this.save(props).then(async (data: LoopSchema) => {
      if (data && data._id) {
        return await this.attachFiles(data._id, path, pngs);
      } else {
        return null;
      }
    });
  }

  getAudioPath(fileName: string): string {
    const multerPath = this.multerPath;
    return `${multerPath}/${fileName}`;
    // return await promises.readFile(`${multerPath}/${fileName}`);
  }
}
