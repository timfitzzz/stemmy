"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioEntity = void 0;
var Model_1 = require("../Model");
var wavToPng_1 = require("../../util/wavToPng");
var fs_1 = __importDefault(require("fs"));
var Eventing_1 = require("../Eventing");
var Attributes_1 = require("../Attributes");
var ApiSync_1 = require("../ApiSync");
var _1 = require("./");
var AudioEntity = /** @class */ (function (_super) {
    __extends(AudioEntity, _super);
    function AudioEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // id: number;
    // parentId: number | undefined;
    // filePath: string;
    // pngPaths: pngPath[] = [];
    // source: AudioEntitySources;
    // audioData: AudioFileReader;
    AudioEntity.buildConstructorProps = function (attrs, apiSlug) {
        attrs.pngs = attrs.pngs || [];
        attrs.source = attrs.source || _1.AudioEntitySources.unset;
        // attrs.audioData = new AudioFileReader(attrs.filePath);
        //attrs.audioData.read();
        return [
            new Attributes_1.Attributes(attrs),
            new ApiSync_1.ApiSync("" + apiSlug, { doNotSync: ['audioData'] }),
            new Eventing_1.Eventing(),
        ];
    };
    // constructor(props: AudioEntityProps) {
    //   super(props);
    //   this.id = props.id || -1;
    //   this.filePath = props.filePath;
    //   this.pngPaths = props.pngPaths || [];
    //   this.source = props.source || AudioEntitySources['unset'];
    //   this.audioData = new AudioFileReader(this.filePath);
    //   this.audioData.read();
    // }
    AudioEntity.prototype.createPng = function (outFolderPath, diameter, shape) {
        if (diameter === void 0) { diameter = 600; }
        try {
            var audioData = this.get('audioData');
            var id = this.get('id') || 0;
            if (audioData && audioData.data && audioData.data.channelData) {
                var canvas = wavToPng_1.wavToPng({ diameter: diameter }, audioData.data);
                var buffer = canvas.toBuffer();
                var fullOutPath = outFolderPath + ("wav-" + id + "-" + diameter + "px-.png");
                fs_1.default.writeFileSync(fullOutPath, buffer);
                var pngs = this.get('pngs');
                if (pngs) {
                    pngs.push([_1.PngShapes['round'], diameter, fullOutPath]);
                }
                this.set({ pngs: pngs });
                this.trigger('newPng');
            }
            else {
                throw new Error('Channel data not found');
            }
        }
        catch (err) {
            return err.toString();
        }
    };
    return AudioEntity;
}(Model_1.Model));
exports.AudioEntity = AudioEntity;
