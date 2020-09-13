import {
  Loop,
  LoopProps,
  AudioEntity,
  AudioEntityProps,
  PngShapes,
} from './Models/AudioEntities';

import { Model } from './Models/Model';
import { Interface } from 'readline';
import fs, { Dirent } from 'fs';
import { LoopyMultiSessionReader } from './Controllers/LoopyImporter/LoopyMultiSessionReader';
import { LoopySession } from './Models/LoopyEntities';
import { LoopySessionImporter } from './Controllers/LoopyImporter/LoopySessionImporter';

const testDataDirPath = './testData';

// const testDataDir = fs.readdirSync(testDataDirPath, { withFileTypes: true });

// function processLoopyProjectFolder(dataDir: Dirent) {
//   const sessionDataFile = fs.readFileSync(
//     `${testDataDirPath}/${dataDir.name}/Session Data.xml`,
//     { encoding: 'utf-8' }
//   );
//   const projectConverter = new LoopyProjectImporter(
//     sessionDataFile,
//     'testproject'
//   );
// }

// testDataDir.forEach((dirEntry) => {
//   if (dirEntry.isDirectory && dirEntry.name.indexOf('.loopysession') != -1) {
//     processLoopyProjectFolder(dirEntry);
//   }
// });

let folderReader = new LoopyMultiSessionReader(testDataDirPath);
folderReader.read();
folderReader.sessions.forEach((session: LoopySession) => {
  const importer = new LoopySessionImporter(session, './fileStore');
  importer.import(() => {
    console.log(importer.project);
  });
});
