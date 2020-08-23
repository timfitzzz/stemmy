"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopyAiffFileReader = void 0;
var fs_1 = __importDefault(require("fs"));
var LoopyAiffFileReader = /** @class */ (function () {
    function LoopyAiffFileReader(aiffFolder) {
        this.aiffFolder = aiffFolder;
        this.aiffs = [];
        this.trackNameRegExp = /^Track (\d\d?).aiff$/;
    }
    LoopyAiffFileReader.prototype.read = function () {
        var _this = this;
        var fileList = fs_1.default.readdirSync(this.aiffFolder, { withFileTypes: true });
        fileList.forEach(function (entry) {
            var RE = _this.trackNameRegExp;
            if (entry.name) {
                var matchresult = void 0;
                if ((matchresult = RE.exec(entry.name)) !== null) {
                    var trackNumber = parseInt(matchresult[1]);
                    var trackData = fs_1.default.readFileSync(_this.aiffFolder + "/" + entry.name);
                    _this.aiffs.push([trackNumber, trackData]);
                }
            }
        });
    };
    return LoopyAiffFileReader;
}());
exports.LoopyAiffFileReader = LoopyAiffFileReader;
