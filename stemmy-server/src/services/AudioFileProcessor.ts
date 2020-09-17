import { AudioFileReader, AudioFileOutput } from '../stemmy-common';
import { encode } from 'wav-encoder';
import { PngShapes } from '../stemmy-common';
import { png } from '../models/LoopSchema';
import { wavToPng } from '../stemmy-common';
import { promises } from 'fs';
import { ReadResult } from '../stemmy-common';
import { conf } from '../stemmyConf';
import { ServerSettingsService } from '@tsed/common';
import { resolve } from 'path';

export class AudioFileProcessor {
  private pngConfig: { storagePath: string; roundSizes: number[] } = conf.pngs;

  private fileReader: AudioFileReader;

  constructor(public filePath: string) {
    this.fileReader = new AudioFileReader(filePath);
  }

  // public getWaveStats(): ReadResult | void {
  //   if (this.fileReader.format) {
  //     return this.fileReader.stats;
  //   } else {
  //     this.fileReader.read();
  //     return this.fileReader.stats;
  //   }
  // }

  async readAndProcessFile(): Promise<{
    output: AudioFileOutput;
    pngs: png[];
  }> {
    return new Promise(async (resolve, reject) => {
      const output = await this.readFile();

      // handle conversion
      if (this.fileReader.output.fileType === 'AIFF') {
        let path = await this.saveAiffAsWav();
      }

      let pngs = await this.createPngs();
      if (output && pngs) {
        resolve({ output, pngs });
      } else {
        reject('something went wrong');
      }
    });
  }

  async readFile(): Promise<AudioFileOutput> {
    return await this.fileReader.read();
  }

  async saveAiffAsWav(): Promise<string> {
    return await new Promise((resolve, reject) => {
      if (!this.fileReader.output.data) {
        reject('No audio data loaded');
      } else if (!this.fileReader.output.format) {
        reject('No audio data format information found');
      } else {
        encode({
          sampleRate: this.fileReader.output.format.sampleRate,
          channelData: this.fileReader.output.data,
        }).then(async (fileBuffer) => {
          await promises.writeFile(this.filePath, new Buffer(fileBuffer));
          resolve(this.filePath);
        });
      }
    });
  }

  async createPngs(): Promise<png[]> {
    const roundSizes = this.pngConfig.roundSizes;
    return Promise.all(
      roundSizes.map((size: number) => {
        return this.createPng(size, PngShapes['round']);
      })
    );
  }

  async createPng(
    diameter: number = 600,
    shape: PngShapes = PngShapes['round']
  ): Promise<png> {
    //console.log('creating pngs');
    // if (!this.fileReader.output.data) {
    //   await this.readFile();
    // }
    const doneWriting: Boolean = false;
    const pngRoot = this.pngConfig.storagePath;
    const fileName = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 10);
    try {
      let audioData = this.fileReader.output.data;
      let sampleRate = this.fileReader.output.format?.sampleRate;
      if (audioData && sampleRate) {
        let canvas = wavToPng({ diameter }, audioData, sampleRate);
        return new Promise(async (res, rej) => {
          let buffer = canvas.toBuffer();
          let fullOutPath = pngRoot + `wav-${fileName}-${diameter}px.png`;
          await promises
            .writeFile(fullOutPath, buffer)
            .catch((err) => rej(err));
          const pngSet: png = {
            shape: shape,
            size: diameter,
            path: fullOutPath,
          };
          res(pngSet);
        });
      } else {
        throw new Error('Channel data not found');
      }
    } catch (err) {
      throw new Error(err.toString());
    }
  }
}
