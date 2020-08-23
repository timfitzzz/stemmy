import { LoopyAiffs } from '../../Models/LoopyEntities';
import fs, { Dirent } from 'fs';

export class LoopyAiffFileReader {
  aiffs: LoopyAiffs = [];

  trackNameRegExp: RegExp = /^Track (\d\d?).aiff$/;

  constructor(public aiffFolder: string) {}

  read(): void {
    const fileList = fs.readdirSync(this.aiffFolder, { withFileTypes: true });
    fileList.forEach((entry: Dirent) => {
      const RE = this.trackNameRegExp;
      if (entry.name) {
        let matchresult;
        if ((matchresult = RE.exec(entry.name)) !== null) {
          const trackNumber: number = parseInt(matchresult[1]);
          const trackData: Buffer = fs.readFileSync(
            `${this.aiffFolder}/${entry.name}`
          );
          this.aiffs.push([trackNumber, trackData]);
        }
      }
    });
  }
}
