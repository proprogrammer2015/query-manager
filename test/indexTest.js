var expect = require('chai').expect;
var sinon = require('sinon');
var queryManager = require('../index.js')();

describe('query-manager', function () {
  describe('#load(Array)', function () {

    it('should throw an error when null passed', function () {
      var test = function () {
        queryManager.load(null);
      };
      expect(test).to.throw(Error);
      expect(test).to.throw(/Expected an array but null given/);
    });

    it('should throw an error when invalid array elements were passed', function () {
      var sqlFiles = [
        './test/sqlFile1.sql',
        {}
      ];

      var test = function () {
        queryManager.load(sqlFiles);
      };
      expect(test).to.throw(Error);
      expect(test).to.throw(/Unexpected file path at index 1/);
    });

    it('should not throw an error', function () {
      var sqlFiles = [
        './test/sqlFile1.sql'
      ];

      var test = function () {
        queryManager.load(sqlFiles);
      };
      expect(test).to.not.throw(Error);
    });

  });

  describe('#get(String)', function () {
    it('should return proper query', function () {
      var sqlFiles = [
        './test/example/file1.sql'
      ];

      queryManager.load(sqlFiles);
      var qm = queryManager;
      var query1 = qm.get('users.getAllUsers');
      var query2 = qm.get('users.getAllActiveUsers');
      var query3 = qm.get('apps.getAllApps');

      expect(query1).to.be.equal('SELECT * FROM users;');
      expect(query2).to.be.equal('SELECT * FROM users WHERE active = 1;');
      expect(query3).to.be.equal('SELECT * FROM apps;');
    });

    it('should return undefined when key not found', function () {
      var sqlFiles = [
        './test/example/file1.sql'
      ];

      queryManager.load(sqlFiles);
      var qm = queryManager;
      var query = qm.get('users.getAllBlockedUsers');

      expect(query).to.be.undefined;
    });

    it('should return undefined if no queries loaded', function () {
      var sqlFiles = [];

      queryManager.load(sqlFiles);
      var qm = queryManager;
      var query = qm.get('users.getAllBlockedUsers');

      expect(query).to.be.undefined;
    });

  });

  it('should cache processed files', function () {
    var sqlFiles = [
      './test/example/file1.sql'
    ];

    queryManager.load(sqlFiles);
    var qm = queryManager;
    var query1 = qm.get('users.getAllUsers');
    var query2 = qm.get('users.getAllActiveUsers');
    var query3 = qm.get('apps.getAllApps');

    expect(query1).to.be.equal('SELECT * FROM users;');
    expect(query2).to.be.equal('SELECT * FROM users WHERE active = 1;');
    expect(query3).to.be.equal('SELECT * FROM apps;');
    qm = null;

    var queryManagerCached = require('../index.js')();
    qm = queryManagerCached;
    var query4 = qm.get('users.getAllUsers');
    var query5 = qm.get('users.getAllActiveUsers');
    var query6 = qm.get('apps.getAllApps');

    expect(query4).to.be.equal('SELECT * FROM users;');
    expect(query5).to.be.equal('SELECT * FROM users WHERE active = 1;');
    expect(query6).to.be.equal('SELECT * FROM apps;');

  });

});
