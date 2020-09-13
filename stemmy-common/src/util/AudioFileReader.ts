import fs from 'fs';
import wav, { WavData } from 'node-wav';
import { getFileInfoFromHeader, ReadResult } from './getFileInfoFromHeader';

export class AudioFileReader {
  public data: WavData | undefined;
  public stats: ReadResult | undefined;

  constructor(public path: string) {}

  read(): void {
    const rawData = fs.readFileSync(this.path);
    this.data = wav.decode(rawData);
    this.stats = getFileInfoFromHeader(rawData);
  }
}
