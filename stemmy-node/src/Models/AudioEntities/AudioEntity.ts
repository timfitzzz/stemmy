import { AxiosResponse } from 'axios';
import { Model } from '../Model';
import { AudioFileReader } from '../../util/AudioFileReader';
import { wavToPng } from '../../util/wavToPng';
import fs from 'fs';
import { Eventing } from '../Eventing';
import { Attributes } from '../Attributes';
import { ApiSync } from '../ApiSync';

export enum AudioEntitySources {
  'loopyhd',
  'web',
  'unset',
}

export enum PngShapes {
  'round',
  'flat',
}

export interface AudioEntityProps {
  id?: number;
  filePath: string;
  pngPaths?: pngPath[];
  source?: AudioEntitySources;
  audioData?: AudioFileReader;
}

type pngPath = [PngShapes, number, string];

export class AudioEntity<K extends AudioEntityProps> extends Model<K> {
  // id: number;
  // parentId: number | undefined;
  // filePath: string;
  // pngPaths: pngPath[] = [];
  // source: AudioEntitySources;
  // audioData: AudioFileReader;

  static buildConstructorProps<T extends AudioEntityProps, K>(
    attrs: T,
    apiSlug: string
  ): [Attributes<T>, ApiSync<T>, Eventing] {
    attrs.pngPaths = attrs.pngPaths || [];
    attrs.source = attrs.source || AudioEntitySources.unset;
    attrs.audioData = new AudioFileReader(attrs.filePath);
    //attrs.audioData.read();

    return [
      new Attributes<T>(attrs),
      new ApiSync<T>(`${apiSlug}`, { doNotSync: ['audioData'] }),
      new Eventing(),
    ];
  }

  // constructor(props: AudioEntityProps) {
  //   super(props);
  //   this.id = props.id || -1;
  //   this.filePath = props.filePath;
  //   this.pngPaths = props.pngPaths || [];
  //   this.source = props.source || AudioEntitySources['unset'];
  //   this.audioData = new AudioFileReader(this.filePath);
  //   this.audioData.read();
  // }

  createPng(
    outFolderPath: string,
    diameter: number = 600,
    shape: PngShapes
  ): void {
    try {
      let audioData = this.get('audioData');
      let id = this.get('id') || 0;
      if (audioData && audioData.data && audioData.data.channelData) {
        let canvas = wavToPng({ diameter }, audioData.data);
        let buffer = canvas.toBuffer();
        let fullOutPath = outFolderPath + `wav-${id}-${diameter}px-.png`;
        fs.writeFileSync(fullOutPath, buffer);
        let pngPaths = this.get('pngPaths');
        if (pngPaths) {
          pngPaths.push([PngShapes['round'], diameter, fullOutPath]);
        }
        this.set({ pngPaths } as K);
        this.trigger('newPng');
      } else {
        throw new Error('Channel data not found');
      }
    } catch (err) {
      return err.toString();
    }
  }
}
