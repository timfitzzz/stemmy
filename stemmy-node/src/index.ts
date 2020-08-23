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

// const loop = new Loop({
//   filePath: './src/Track 2.wav',
//   originalProjectId: 1,
// });

// loop.on('save', () => {
//   console.log(loop.get('id'));
// });

// // loop.createPng('./src/', 400, PngShapes.round);
// // console.log(loop.get('pngPaths'));
// loop.save();

console.log('done');

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
console.log(folderReader.sessions);
folderReader.sessions.forEach((session: LoopySession) => {
  const importer = new LoopySessionImporter(session, './fileStore');
  importer.import(() => {
    console.log(importer.project);
  });
});

fs.writeFile('./testfile', 'test', 'utf-8', (err) => {
  console.log('wrote test file');
});
