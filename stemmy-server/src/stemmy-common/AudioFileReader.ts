import { promises, readFileSync, fstat } from 'fs';
import AV, { Asset } from 'av';
import { decode, WavData, AudioChannels } from 'node-wav';
import { getFileInfoFromHeader, ReadResult } from './getFileInfoFromHeader';
import { AIFFDecoder } from './audiofile';
import { InternalServerError } from '@tsed/exceptions';
import { AjvValidationError } from '@tsed/ajv';
import { stringify } from 'querystring';
import { Service } from '@tsed/di';

export interface AuroraAssetFormat {
  formatID: string;
  channelsPerFrame: number;
  sampleCount: number;
  bitsPerChannel: number;
  sampleRate: number;
  framesPerPacket: number;
  littleEndian: false;
  floatingPoint: false;
  bytesPerPacket: 4;
}

export interface AudioFileOutput {
  data?: Float32Array[];
  format?: AuroraAssetFormat;
  duration?: number;
  fileType?: string;
}

export class AudioFileReader {
  public output: AudioFileOutput = {
    data: undefined,
    format: undefined,
    duration: undefined,
    fileType: undefined,
  };

  constructor(public path: string) {}

  async getSingleArray(asset: any): Promise<Float32Array> {
    // console.log('getting single array');
    return new Promise((resolve, reject) => {
      try {
        asset.decodeToBuffer(function (buffer: Float32Array) {
          resolve(buffer);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  getEveryNValue(
    array: Float32Array,
    n: number,
    offset: number = 0
  ): Float32Array {
    return array.filter((value, index) => {
      if ((index + offset) % n) {
        return true;
      }
    });
  }

  async handleDecode(asset: any): Promise<AudioFileOutput> {
    return await new Promise(async (resolve, reject) => {
      try {
        let singleArray: Float32Array = await this.getSingleArray(asset);
        let format = await this.getFormat(asset);
        if (format) {
          let channelsPerFrame = format.channelsPerFrame;
          let channelData: Float32Array[] = [];
          for (let i = 0; i < channelsPerFrame; i++) {
            channelData[i] = this.getEveryNValue(
              singleArray,
              channelsPerFrame,
              i
            );
          }
          this.output.data = channelData;
          resolve(this.output);
        } else {
          reject(`Couldn't read audio format`);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async getDuration(asset: any): Promise<number> {
    return await new Promise((resolve, reject) => {
      try {
        asset.get('duration', (duration: number) => {
          this.output.duration = duration;
          resolve(duration);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async getFormat(asset: any): Promise<AuroraAssetFormat> {
    return await new Promise((resolve, reject) => {
      try {
        // console.log(asset.decoder.demuxer.fileType);
        asset.get('format', (formatInfo: AuroraAssetFormat) => {
          this.output.format = formatInfo;
          resolve(formatInfo);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async getFileType(asset: any): Promise<string> {
    return await new Promise((resolve, reject) => {
      try {
        const fileType: string = asset.decoder.demuxer.fileType;
        if (fileType) {
          this.output.fileType = fileType;
          resolve(fileType);
        } else {
          reject('FileType not available, is the asset loaded?');
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async read(): Promise<AudioFileOutput> {
    const rawData = await promises.readFile(this.path);
    const asset = Asset.fromBuffer(rawData);

    return await new Promise(async (resolve, reject) => {
      let output = await this.handleDecode(asset);
      let length = await this.getDuration(asset);
      let filetype = await this.getFileType(asset);
      resolve(this.output);
    });
  }
}

// export class AudioFileReader {
//   public data: WavData | undefined;
//   public stats: ReadResult | undefined;

//   constructor(public path: string) {}

//   async read(): Promise<

//   read(): void {
//     const rawData = readFileSync(this.path);
//     this.stats = getFileInfoFromHeader(rawData);
//     if (this.stats) {
//       if (this.stats.header && this.stats.header.wave_identifier === 'AIFF') {
//         // file is aiff
//         try {
//           const asset = AV.Asset.fromBuffer(rawData);
//           let decoded = false;
//           let decoding = false;
//           let recordingStats = false;
//           let statsRecorded = false;
//           let format: AuroraAssetFormat;

//           function handleDecode() {
//             if (!recordingStats) {
//               recordingStats = true;
//               asset.get('format', (formatInfo: any) => {
//                 if (formatInfo) {
//                   format = formatInfo
//                   this.data.sampleRate = formatInfo.sampleRate;
//                   statsRecorded = true;
//                 }
//               })
//             } else if (statsRecorded && !decoding && !decoded ) {
//               decoding = true;
//               asset.decodeToBuffer((buffer: Float32Array) => {
//                 if (format.channelsPerFrame === 1) {
//                   this.channelData = buffer;
//                   this.decoded = true;
//                 } else if (format.channelsPerFrame === 2) {
//                   this.channelData = [new Float32Array, new Float32Array]
//                   buffer.forEach((value, index) => {

//                     if (index === 0) {
//                       this.channelData[0][index] = value;
//                     } else if (index === 1) {
//                       this.channelData[1][0] = value;
//                     } else if (index % 2 === 0) {
//                       this.channelData[0][index / 2] = value;
//                     } else {
//                       this.channelData[1][(index -1) / 2] = value;
//                     }
//                   })
//                   this.decoded = true;
//                 }

//               })
//             }
//           }
//           asset.decodeToBuffer(function(buffer: Float32Array) {
//             if (buffer)
//           });

//             this.data = {
//               channelData: aiffData.channels,
//               sampleRate: aiffData.sampleRate as number,
//             };
//         }
//       } else if (this.stats.error) {
//         // error in reading file
//       } else {
//         // wav case
//         console.log(this.stats);
//         console.log(rawData);
//         this.data = decode(rawData);
//       }
//     } else {
//       // no stats error
//       throw new Error("Couldn't read stats for audiofile");
//     }
//   }
// }

// import { readFileSync } from 'fs';
// import { decode, WavData, AudioChannels } from 'node-wav';
// import { getFileInfoFromHeader, ReadResult } from './getFileInfoFromHeader';
// import { AIFFDecoder } from './audiofile';
// import { InternalServerError } from '@tsed/exceptions';

// export class AudioFileReader {
//   public data: WavData | undefined;
//   public stats: ReadResult | undefined;

//   constructor(public path: string) {}

//   read(): void {
//     const rawData = readFileSync(this.path);
//     this.stats = getFileInfoFromHeader(rawData);
//     if (this.stats) {
//       if (this.stats.header && this.stats.header.wave_identifier === 'AIFF') {
//         // file is aiff
//         const audioFile = new AIFFDecoder();
//         const aiffData = audioFile.decode(rawData.toString());
//         if (aiffData) {
//           this.data = {
//             channelData: aiffData.channels,
//             sampleRate: aiffData.sampleRate as number,
//           };
//         }
//       } else if (this.stats.error) {
//         // error in reading file
//       } else {
//         // wav case
//         console.log(this.stats);
//         console.log(rawData);
//         this.data = decode(rawData);
//       }
//     } else {
//       // no stats error
//       throw new Error("Couldn't read stats for audiofile");
//     }
//   }
// }
