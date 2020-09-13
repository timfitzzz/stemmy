"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var Model = /** @class */ (function () {
    function Model(attributes, sync, events) {
        var _this = this;
        this.attributes = attributes;
        this.sync = sync;
        this.events = events;
        this.on = this.events.on;
        this.remove = this.events.remove;
        this.trigger = this.events.trigger;
        this.get = this.attributes.get;
        this.fetch = function () {
            var id = _this.attributes.get('id');
            if (typeof id !== 'number') {
                throw new Error('Cannot fetch without an id');
            }
            _this.sync.fetch(id).then(function (response) {
                _this.set(response.data);
            });
        };
    }
    Model.prototype.set = function (update) {
        this.attributes.set(update);
        this.events.trigger('change');
    };
    Model.prototype.save = function () {
        var _this = this;
        var that = this;
        var currentAttributes = this.attributes.getAll();
        this.sync
            .save(currentAttributes)
            .then(function (response) {
            var data = response.data;
            // const { id: number } = data;
            // const test: T = data;
            // @ts-ignore : TODO: why doesn't this work
            that.attributes.set({ id: data.id });
            _this.trigger('save');
        })
            .catch(function (err) {
            console.log(err);
            _this.trigger("error: " + err);
        });
    };
    return Model;
}());
exports.Model = Model;
