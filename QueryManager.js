"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var format = require("string-template");
var QueryManager = /** @class */ (function () {
    function QueryManager(templates) {
        this.extractIdAndQueryTemplate = /(?:@)[\s\n]*([a-zA-Z_\.]+[a-zA-Z]+)[\s\n]*(?:@)(?:\n|\*\/|\s)*([^;]*)/g;
        this.deleteComments = /(?:#{1,}.*)|(?:-{2,}.*)|(?:(?:(\/\*)+?[\w\W]+?(\*\/)+))/g;
        this.queries = this.parse(templates);
    }
    QueryManager.prototype.get = function (key, options) {
        var query = _.get(this.queries, key);
        if (!query)
            throw new Error("InvalidArgument: '" + key + "' key does not exist.");
        if (options)
            return format(query, options);
        return query;
    };
    QueryManager.prototype.add = function (templates) {
        var newQueries = this.parse(templates);
        this.queries = _.merge({}, this.queries, newQueries);
    };
    QueryManager.prototype.parse = function (templates) {
        var _this = this;
        this.throwInvalidArguments(templates);
        if (_.isString(templates)) {
            templates = [templates];
        }
        return templates.reduce(function (queries, template) {
            var result = null;
            while (result = _this.extractIdAndQueryTemplate.exec(template)) {
                var key = result[1];
                var sqlRawTemplate = result[2];
                var sqlTemplate = sqlRawTemplate
                    .replace(_this.deleteComments, '')
                    .replace(/\s*\n\s*/g, ' ');
                queries[key] = sqlTemplate.trim() + ';';
            }
            return queries;
        }, {});
    };
    QueryManager.prototype.throwInvalidArguments = function (templates) {
        if (_.isNil(templates)) {
            throw new Error('InvalidArgument: templates cannot be null!');
        }
    };
    return QueryManager;
}());
exports.QueryManager = QueryManager;
