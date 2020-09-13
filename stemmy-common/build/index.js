"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoopyMultiSessionReader_1 = require("./Controllers/LoopyImporter/LoopyMultiSessionReader");
var LoopySessionImporter_1 = require("./Controllers/LoopyImporter/LoopySessionImporter");
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
folderReader.sessions.forEach(function (session) {
    var importer = new LoopySessionImporter_1.LoopySessionImporter(session, './fileStore');
    importer.import(function () {
        console.log(importer.project);
    });
});
