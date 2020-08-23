import { LoopySessionMetadata } from '../../Models/LoopyEntities';
import plist, { PlistObject } from 'plist';
import fs from 'fs';

export class LoopyPlistReader {
  metadata: LoopySessionMetadata = {
    clock: {},
    tracks: [],
  };

  constructor(public xmlFilePath: string) {
    this.read();
  }

  read(): void {
    this.metadata = plist.parse(
      fs.readFileSync(this.xmlFilePath, {
        encoding: 'utf-8',
      })
    ) as PlistObject & LoopySessionMetadata;
  }
}
