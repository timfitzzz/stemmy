"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PngShapes = exports.AudioEntitySources = exports.audioEntityTypes = void 0;
var audioEntityTypes;
(function (audioEntityTypes) {
    audioEntityTypes[audioEntityTypes["Loop"] = 0] = "Loop";
})(audioEntityTypes = exports.audioEntityTypes || (exports.audioEntityTypes = {}));
var AudioEntitySources;
(function (AudioEntitySources) {
    AudioEntitySources[AudioEntitySources["loopyhd"] = 0] = "loopyhd";
    AudioEntitySources[AudioEntitySources["web"] = 1] = "web";
    AudioEntitySources[AudioEntitySources["unset"] = 2] = "unset";
})(AudioEntitySources = exports.AudioEntitySources || (exports.AudioEntitySources = {}));
var PngShapes;
(function (PngShapes) {
    PngShapes[PngShapes["round"] = 0] = "round";
    PngShapes[PngShapes["flat"] = 1] = "flat";
})(PngShapes = exports.PngShapes || (exports.PngShapes = {}));
