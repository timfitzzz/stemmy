import { LoopySession } from '../../Models/LoopyEntities';
import { resolve } from 'path';
import { LoopySingleSessionReader } from './LoopySingleSessionReader';
import fs, { Dirent } from 'fs';

export class LoopyMultiSessionReader {
  // static fromFolder(folderPath: string): LoopySessionsLoader {
  //   return new LoopySessionsLoader(
  //     new LoopyFolderReader(folderPath);
  //   )
  // }

  sessions: LoopySession[] = [];

  constructor(public folderPath: string) {
    this.folderPath = resolve(folderPath);
  }

  read() {
    let folders: string[] = this.getLoopyFolders();
    folders.forEach((sessionFolderPath: string) => {
      const folderReader = LoopySingleSessionReader.fromFolder(
        `${sessionFolderPath}`
      );
      folderReader.read();
      this.sessions.push(folderReader.data);
    });
  }

  getLoopyFolders(): string[] {
    let loopyDirPaths: string[] = [];
    let dirEntries: Dirent[] = fs.readdirSync(this.folderPath, {
      withFileTypes: true,
    });
    dirEntries.forEach((dirEntry: Dirent) => {
      if (dirEntry.isDirectory && dirEntry.name.indexOf('loopysession') > -1) {
        loopyDirPaths.push(`${this.folderPath}/${dirEntry.name}`);
      }
    });
    return loopyDirPaths;
  }
}
