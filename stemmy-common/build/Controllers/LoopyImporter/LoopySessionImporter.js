"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopySessionImporter = void 0;
var Project_1 = require("../../Models/Project");
var AudioEntities_1 = require("../../Models/AudioEntities");
var fs_1 = __importDefault(require("fs"));
var path_1 = require("path");
var wait = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var LoopySessionImporter = /** @class */ (function () {
    function LoopySessionImporter(loopySession, aiffOutPath) {
        this.loopySession = loopySession;
        this.aiffOutPath = aiffOutPath;
        this.project = Project_1.Project.getPlaceholder();
        this.done = false;
        this.loops = new Array(this.loopySession.metadata.tracks.length);
        this.tracks = new Array(this.loopySession.metadata.tracks.length);
        this.aiffOutPath = path_1.resolve(aiffOutPath);
    }
    LoopySessionImporter.prototype.isProjectInitiallySaved = function () {
        return !!this.project.get('id');
    };
    LoopySessionImporter.prototype.areLoopsSaved = function () {
        var unsavedLoops = this.loops.filter(function (loop) {
            return !!loop.get('id');
        });
        var response = unsavedLoops.length > 0 &&
            this.loops.length === this.loopySession.metadata.tracks.length;
        return response;
    };
    LoopySessionImporter.prototype.areProjectTracksSaved = function () {
        var unsavedProjectTracks = [];
        return ((unsavedProjectTracks = this.tracks.filter(function (track) {
            return !!track.get('id');
        })).length > 0 &&
            this.tracks.length === this.loopySession.metadata.tracks.length);
    };
    LoopySessionImporter.prototype.import = function (callback) {
        var _this = this;
        // create and save project
        this.createAndSaveProject(function (projectId) {
            // once project is created and saved, generate and save loops
            _this.createAndSaveLoops(function () {
                // once loops are generated and saved, generate and save project tracks
                _this.createAndSaveProjectTracks(function () {
                    console.log.apply(console, __spreadArrays(['saved project tracks: '], _this.tracks.map(function (track) { return track.get('id'); })));
                    // once project tracks are generated and saved, attach to project.
                    _this.project.addProjectTracks(_this.tracks);
                    console.log.apply(console, __spreadArrays(['attached tracks to project: '], (_this.project.get('tracks') || [])));
                    // once project tracks are attached to project, save project.
                    var saveHandler = _this.project.on('save', function () {
                        // once project is saved, mark as done and optionally run callback
                        _this.done = true;
                        console.log('saved project: ', _this.project);
                        _this.project.remove('save', saveHandler);
                        if (callback) {
                            callback();
                        }
                    });
                });
            });
        });
    };
    LoopySessionImporter.prototype.createAndSaveProject = function (callback) {
        var _this = this;
        var projectProps = {
            name: this.loopySession.name,
            clock: this.loopySession.metadata.clock,
            tracks: [],
        };
        this.project = Project_1.Project.buildProject(projectProps);
        var saveHandler = this.project.on('save', function () {
            _this.project.remove('save', saveHandler);
            var objectId = _this.project.get('id');
            if (objectId) {
                callback(objectId);
            }
            else {
                throw new Error('Project did not properly save.');
            }
        });
        this.project.save();
    };
    LoopySessionImporter.prototype.createAndSaveLoops = function (callback) {
        var _this = this;
        var loopyTrackMetadata = this.loopySession.metadata
            .tracks;
        var loopyAiffs = this.loopySession.aiffs;
        var savedLoops = [];
        loopyTrackMetadata.forEach(function (loopyTrack, index) {
            var loopyAiff = _this.loopySession.aiffs.filter(function (v) {
                if (v[0] === index) {
                    return true;
                }
            })[0];
            _this.saveAiff(loopyAiff[1], "p" + _this.project.get('id') + "-" + index + ".aiff", function (outPath) {
                var stemmyLoopProps = {
                    originalProjectId: _this.project.get('id'),
                    decay: loopyTrack.decay,
                    loopStartTime: loopyTrack.loopStartTime,
                    originalLoopStartTime: loopyTrack.originalLoopStartTime,
                    originalScale: loopyTrack.originalScale,
                    fileName: outPath,
                    source: AudioEntities_1.AudioEntitySources['loopyhd'],
                };
                _this.loops[index] = new AudioEntities_1.Loop(stemmyLoopProps);
                var saveHandler = _this.loops[index].on('save', function () {
                    _this.loops[index].remove('save', saveHandler);
                    savedLoops.push(index);
                });
                _this.loops[index].save();
            });
        });
        var waitToCallback = function () {
            wait(500).then(function () {
                if (_this.areLoopsSaved()) {
                    callback();
                }
                else {
                    waitToCallback();
                }
            });
        };
        waitToCallback();
    };
    LoopySessionImporter.prototype.createAndSaveProjectTracks = function (callback) {
        var _this = this;
        var loopyTrackMetadata = this.loopySession.metadata.tracks;
        loopyTrackMetadata.forEach(function (track, index) {
            var pan = track.pan, playing = track.playing, reverse = track.reverse, scale = track.scale, synchronize = track.synchronize, volume = track.volume;
            var stemmyProjectTrack = Project_1.ProjectTrack.buildProjectTrack({
                entityType: AudioEntities_1.audioEntityTypes.Loop,
                entityId: _this.loops[index].get('id'),
                pan: pan,
                playing: playing,
                reverse: reverse,
                scale: scale,
                synchronize: synchronize,
                volume: volume,
            });
            var saveHandler = stemmyProjectTrack.on('save', function () {
                _this.tracks[index] = stemmyProjectTrack;
                stemmyProjectTrack.remove('save', saveHandler);
            });
            stemmyProjectTrack.save();
        });
        var waitToCallback = function () {
            wait(500).then(function () {
                if (_this.areProjectTracksSaved()) {
                    callback();
                }
                else {
                    waitToCallback();
                }
            });
        };
        waitToCallback();
    };
    // TODO: Genericize
    LoopySessionImporter.prototype.saveAiff = function (aiff, aiffName, callback, saved) {
        if (saved === void 0) { saved = false; }
        var waitcount = 0;
        var outPath = this.aiffOutPath + '/' + aiffName;
        fs_1.default.writeFile(outPath, aiff, 'utf-8', function (err) {
            saved = true;
            if (err) {
                console.log(err);
            }
            callback(outPath);
        });
    };
    return LoopySessionImporter;
}());
exports.LoopySessionImporter = LoopySessionImporter;
