"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiSync = void 0;
var axios_1 = __importDefault(require("axios"));
var apiRootUrl = 'http://localhost:8083/rest/';
var ApiSync = /** @class */ (function () {
    function ApiSync(modelSlug, options) {
        this.modelSlug = modelSlug;
        this.options = options;
    }
    ApiSync.prototype.fetch = function (id) {
        return axios_1.default.get("" + apiRootUrl + this.modelSlug + "/" + id);
    };
    ApiSync.prototype.save = function (data) {
        var id = data.id;
        var filteredData = Object.assign({}, data);
        if (this.options && this.options.doNotSync) {
            this.options.doNotSync.forEach(function (unsyncedProp) {
                delete filteredData[unsyncedProp];
            });
        }
        if (id) {
            return axios_1.default.put("" + apiRootUrl + this.modelSlug + "/" + id, filteredData);
        }
        else {
            return axios_1.default.post("" + apiRootUrl + this.modelSlug, filteredData);
        }
    };
    return ApiSync;
}());
exports.ApiSync = ApiSync;
