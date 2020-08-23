"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopyMultiSessionReader = void 0;
var path_1 = require("path");
var LoopySingleSessionReader_1 = require("./LoopySingleSessionReader");
var fs_1 = __importDefault(require("fs"));
var LoopyMultiSessionReader = /** @class */ (function () {
    function LoopyMultiSessionReader(folderPath) {
        this.folderPath = folderPath;
        // static fromFolder(folderPath: string): LoopySessionsLoader {
        //   return new LoopySessionsLoader(
        //     new LoopyFolderReader(folderPath);
        //   )
        // }
        this.sessions = [];
        this.folderPath = path_1.resolve(folderPath);
    }
    LoopyMultiSessionReader.prototype.read = function () {
        var _this = this;
        var folders = this.getLoopyFolders();
        folders.forEach(function (sessionFolderPath) {
            var folderReader = LoopySingleSessionReader_1.LoopySingleSessionReader.fromFolder("" + sessionFolderPath);
            folderReader.read();
            _this.sessions.push(folderReader.data);
        });
    };
    LoopyMultiSessionReader.prototype.getLoopyFolders = function () {
        var _this = this;
        var loopyDirPaths = [];
        var dirEntries = fs_1.default.readdirSync(this.folderPath, {
            withFileTypes: true,
        });
        dirEntries.forEach(function (dirEntry) {
            if (dirEntry.isDirectory && dirEntry.name.indexOf('loopysession') > -1) {
                loopyDirPaths.push(_this.folderPath + "/" + dirEntry.name);
            }
        });
        return loopyDirPaths;
    };
    return LoopyMultiSessionReader;
}());
exports.LoopyMultiSessionReader = LoopyMultiSessionReader;
