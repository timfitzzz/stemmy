import { LoopyAiffFileReader } from './LoopyAiffFileReader';
import { LoopyPlistReader } from './LoopyPlistReader';
import {
  LoopySession,
  LoopySessionMetadata,
  LoopyAiffs,
} from '../../Models/LoopyEntities';

export interface LoopySessionSettingsLoader {
  read(): void;
  metadata: LoopySessionMetadata;
}

export interface LoopyAiffLoader {
  read(): void;
  aiffs: LoopyAiffs;
}

export interface LoopySessionReader {
  read(): void;
  data: LoopySession;
}

export class LoopySingleSessionReader {
  static fromFolder(folderPath: string) {
    return new LoopySingleSessionReader(
      new LoopyPlistReader(`${folderPath}/Session Data.xml`),
      new LoopyAiffFileReader(`${folderPath}/Media`),
      folderPath
    );
  }

  sessionNameRegExp: RegExp = /(?!.*\/).*(?=\.loopysession)/;
  data: LoopySession = {
    name: '',
    metadata: { clock: {}, tracks: [] },
    aiffs: [],
  };

  constructor(
    public pListReader: LoopySessionSettingsLoader,
    public aiffReader: LoopyAiffLoader,
    public folderPath: string
  ) {
    let nameArray;

    if ((nameArray = this.sessionNameRegExp.exec(folderPath)) !== null) {
      this.data.name = nameArray[0];
    }
  }

  read(): void {
    this.pListReader.read();
    this.data.metadata = this.pListReader.metadata;
    this.aiffReader.read();
    this.data.aiffs = this.aiffReader.aiffs;
  }
}
