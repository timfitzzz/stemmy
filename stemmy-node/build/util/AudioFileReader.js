"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFileReader = void 0;
var fs_1 = __importDefault(require("fs"));
var node_wav_1 = __importDefault(require("node-wav"));
var getFileInfoFromHeader_1 = require("./getFileInfoFromHeader");
var AudioFileReader = /** @class */ (function () {
    function AudioFileReader(path) {
        this.path = path;
    }
    AudioFileReader.prototype.read = function () {
        var rawData = fs_1.default.readFileSync(this.path);
        this.data = node_wav_1.default.decode(rawData);
        this.stats = getFileInfoFromHeader_1.getFileInfoFromHeader(rawData);
    };
    return AudioFileReader;
}());
exports.AudioFileReader = AudioFileReader;
