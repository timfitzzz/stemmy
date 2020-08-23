"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eventing = void 0;
var Eventing = /** @class */ (function () {
    function Eventing() {
        var _this = this;
        this.events = {};
        this.on = function (eventName, callback) {
            var handlers = _this.events[eventName] || [];
            handlers.push(callback);
            _this.events[eventName] = handlers;
            return callback;
        };
        this.remove = function (eventName, callback) {
            var indexToRemove = _this.events[eventName].indexOf(callback);
            if (indexToRemove > -1) {
                _this.events[eventName].splice(indexToRemove, 1);
            }
        };
        this.trigger = function (eventName) {
            var handlers = _this.events[eventName] || [];
            handlers.forEach(function (callback) {
                callback();
            });
        };
    }
    return Eventing;
}());
exports.Eventing = Eventing;
