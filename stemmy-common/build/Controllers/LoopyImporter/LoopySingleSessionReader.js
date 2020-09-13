"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopySingleSessionReader = void 0;
var LoopyAiffFileReader_1 = require("./LoopyAiffFileReader");
var LoopyPlistReader_1 = require("./LoopyPlistReader");
var LoopySingleSessionReader = /** @class */ (function () {
    function LoopySingleSessionReader(pListReader, aiffReader, folderPath) {
        this.pListReader = pListReader;
        this.aiffReader = aiffReader;
        this.folderPath = folderPath;
        this.sessionNameRegExp = /(?!.*\/).*(?=\.loopysession)/;
        this.data = {
            name: '',
            metadata: { clock: {}, tracks: [] },
            aiffs: [],
        };
        var nameArray;
        if ((nameArray = this.sessionNameRegExp.exec(folderPath)) !== null) {
            this.data.name = nameArray[0];
        }
    }
    LoopySingleSessionReader.fromFolder = function (folderPath) {
        return new LoopySingleSessionReader(new LoopyPlistReader_1.LoopyPlistReader(folderPath + "/Session Data.xml"), new LoopyAiffFileReader_1.LoopyAiffFileReader(folderPath + "/Media"), folderPath);
    };
    LoopySingleSessionReader.prototype.read = function () {
        this.pListReader.read();
        this.data.metadata = this.pListReader.metadata;
        this.aiffReader.read();
        this.data.aiffs = this.aiffReader.aiffs;
    };
    return LoopySingleSessionReader;
}());
exports.LoopySingleSessionReader = LoopySingleSessionReader;
