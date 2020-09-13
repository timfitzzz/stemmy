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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
var Model_1 = require("../Model");
var ApiSync_1 = require("../ApiSync");
var Attributes_1 = require("../Attributes");
var Eventing_1 = require("../Eventing");
var Project = /** @class */ (function (_super) {
    __extends(Project, _super);
    function Project() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Project.buildProject = function (props) {
        return new Project(new Attributes_1.Attributes(props), new ApiSync_1.ApiSync('projects'), new Eventing_1.Eventing());
    };
    Project.getPlaceholder = function () {
        return new Project(new Attributes_1.Attributes({}), new ApiSync_1.ApiSync(''), new Eventing_1.Eventing());
    };
    Project.prototype.addProjectTracks = function (tracks) {
        var _this = this;
        var trackIds = this.get('tracks') || [];
        tracks.map(function (track) {
            var trackId = track.get('id');
            if (trackId) {
                if (trackIds.indexOf(trackId) === -1) {
                    trackIds.push(trackId);
                }
                _this.set({
                    tracks: trackIds,
                });
            }
        });
    };
    return Project;
}(Model_1.Model));
exports.Project = Project;
