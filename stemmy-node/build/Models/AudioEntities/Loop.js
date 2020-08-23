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
exports.Loop = void 0;
var AudioEntity_1 = require("./AudioEntity");
var Loop = /** @class */ (function (_super) {
    __extends(Loop, _super);
    function Loop(props) {
        return _super.apply(this, Loop.buildConstructorProps(props, 'loops')) || this;
        // var _this = this;
    }
    return Loop;
}(AudioEntity_1.AudioEntity));
exports.Loop = Loop;
