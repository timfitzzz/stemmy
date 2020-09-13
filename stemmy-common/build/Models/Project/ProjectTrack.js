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
exports.ProjectTrack = void 0;
var AudioEntities_1 = require("../AudioEntities");
var Model_1 = require("../Model");
var Attributes_1 = require("../Attributes");
var ApiSync_1 = require("../ApiSync");
var Eventing_1 = require("../Eventing");
var ProjectTrack = /** @class */ (function (_super) {
    __extends(ProjectTrack, _super);
    function ProjectTrack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProjectTrack.buildProjectTrack = function (props) {
        return new ProjectTrack(new Attributes_1.Attributes(props), new ApiSync_1.ApiSync('tracks'), new Eventing_1.Eventing());
    };
    ProjectTrack.prototype.attachEntity = function (entityType, entityId) {
        if (entityType === AudioEntities_1.audioEntityTypes.Loop)
            this.set({ entityType: entityType, entityId: entityId });
    };
    return ProjectTrack;
}(Model_1.Model));
exports.ProjectTrack = ProjectTrack;
