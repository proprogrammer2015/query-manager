var requireSQL = require('read-file');
var _ = require('lodash/lang');
var lodash = require('lodash/object');
var format = require("string-template")

/**
 * Stores all queries added from files.
 * @type{Object}
 */
var queries = {};

function add(files) {
    // Check if null or undefined
    if (!files)
        throw new Error('#add(String|Array): Expected an string or array but ' + files + ' given.');

    var isStr = _.isString(files);
    var isArr = _.isArray(files);

    // Check if not string and not array
    if (!isStr && !isArr)
        throw new Error('#add(String|Array): Expected an string or array but ' + (typeof files) + ' given.');

    files = isStr ? [files] : files;

    files.forEach(function (filePath, index) {
        isStr = _.isString(filePath);
        if (!isStr)
            throw new Error('#add(String|Array): Unexpected file path at index ' + index);
        isEmpty = !filePath.trim().length;
        if (isEmpty)
            throw new Error('#add(String|Array): Path cannot be an empty string at index ' + index);

        parseFile(filePath);
    });
}

function parseFile(filePath) {
    var config = {
        encoding: 'utf8'
    };
    var sqlText = requireSQL.sync(filePath, config);
    var regExp = /(?:@)[\s\n]*([a-zA-Z_]+\.?[a-zA-Z]+)[\s\n]*(?:@)(?:\n|\*\/|\s)*([^;]*)/g;
    var result = null;

    var deleteComments = /(?:#{1,}.*)|(?:-{2,}.*)|(?:(?:(\/\*)+?[\w\W]+?(\*\/)+))/g;
    while (result = regExp.exec(sqlText)) {
        var q = result[2].replace(deleteComments, '').replace(/\s*\n\s*/g, ' ');
        queries[result[1]] = q + ';';
    }
    //console.log("result:", queries);
}

function get(key, options) {
    var query = lodash.get(queries, key);
    if (!query)
        throw new Error('#get(String, Object): ' + key + ' key does not exist.');

    //console.log("query:", query, "opts:", options);
    if (options)
        return format(query, options);
    return query;
}

module.exports = {
    add: add,
    get: get
};
