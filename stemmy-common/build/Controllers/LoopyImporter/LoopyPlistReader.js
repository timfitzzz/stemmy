"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopyPlistReader = void 0;
var plist_1 = __importDefault(require("plist"));
var fs_1 = __importDefault(require("fs"));
var LoopyPlistReader = /** @class */ (function () {
    function LoopyPlistReader(xmlFilePath) {
        this.xmlFilePath = xmlFilePath;
        this.metadata = {
            clock: {},
            tracks: [],
        };
        this.read();
    }
    LoopyPlistReader.prototype.read = function () {
        this.metadata = plist_1.default.parse(fs_1.default.readFileSync(this.xmlFilePath, {
            encoding: 'utf-8',
        }));
    };
    return LoopyPlistReader;
}());
exports.LoopyPlistReader = LoopyPlistReader;
