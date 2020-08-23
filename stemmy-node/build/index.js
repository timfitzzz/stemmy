"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var LoopyMultiSessionReader_1 = require("./Controllers/LoopyImporter/LoopyMultiSessionReader");
var LoopySessionImporter_1 = require("./Controllers/LoopyImporter/LoopySessionImporter");
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
var testDataDirPath = './testData';
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
var folderReader = new LoopyMultiSessionReader_1.LoopyMultiSessionReader(testDataDirPath);
folderReader.read();
console.log(folderReader.sessions);
folderReader.sessions.forEach(function (session) {
    var importer = new LoopySessionImporter_1.LoopySessionImporter(session, './fileStore');
    importer.import(function () {
        console.log(importer.project);
    });
});
fs_1.default.writeFile('./testfile', 'test', 'utf-8', function (err) {
    console.log('wrote test file');
});
