var requireSQL = require('read-file');
var _ = require('lodash/lang');
var lodash = require('lodash/object');

var queries = null;

var cfg = {
  regexTableBegin: /-{2,}</,
  regexTableEnd: />\r?\n/,
  regexPropBegin: /-{2,}\[/,
  regexPropEnd: /\]/,
};

/**
 * Initialize a module.
 * @param {Object} config Initial config for module.
 * @returns {Object} Returns public api.
 */
function init(config) {
  // add config handle here
  return {
    load: load,
    get: get
  };
};

/**
 * Load all sql files to parse.
 * @param {Array} sqlFilePaths Array of file paths. Each file path is a string.
 */
function load(sqlFilePaths) {
  if (!sqlFilePaths)
    throw new Error('query-manager#load(): Expected an array but null given.');

  sqlFilePaths.forEach(function (sqlFilePath, index) {
    if (!_.isString(sqlFilePath))
      throw new Error('query-manager#load(): Unexpected file path at index ' + index);

    var config = {
      encoding: 'utf8'
    };
    var sqlText = requireSQL.sync(sqlFilePath, config);
    queries = parseSQL(sqlText);
  });
};

/**
 * Gets data between markup tags.
 * @param {String|Regex} regexStart Regex for beginning of the markup.
 * @param {String|Regex} regexEnd Regex for ending of the markup.
 * @param {String} text Text string with included markup.
 * @returns {Object} Returns object in format <markup> : 'rest of the text'.
 */
function getMarkup(regexStart, regexEnd, text) {
  var result = {};
  var tables = text.split(regexStart);
  tables.forEach(function (table) {
    if (table.trim()) {
      table = table.split(regexEnd);
      result[table[0]] = table[1];
    }
  });
  return result;
}

/**
 * Parse sql file content.
 * @param {String} text Sql file content.
 * @returns {Object} Returns well formatted shortcut for sql queries. Format: <table_alias>.<alias>: 'SQL QUERY'.
 */
function parseSQL(text) {
  var queryList = {};
  var regexDeleteComments = /\/\*([^*]|[\r\n]|(\*+([^\*\/]|[\r\n])))*\*+\//g;
  var regexDeleteNewLines = /\r?\n/g;
  var separator = '.';

  var sqlText = text.replace(regexDeleteComments, '');
  var tables = getMarkup(cfg.regexTableBegin, cfg.regexTableEnd, sqlText);
  lodash.forIn(tables, function (value, tableName) {
    value = value.replace(regexDeleteNewLines, '');
    var item = getMarkup(cfg.regexPropBegin, cfg.regexPropEnd, value);
    lodash.forIn(item, function (value, method) {
      var newKey = tableName + separator + method;
      queryList[newKey] = value.trim();
    });
  });
  return queryList;
}

/**
 * Returns a query depends on provided key.
 * @param {String} key Key is a string in following format <table>.<alias>
 * @returns {String} Returns query from file.
 */
function get(key) {
  return lodash.get(queries, key);
}

var cached = module.exports = init;
