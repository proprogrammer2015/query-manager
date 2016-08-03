var expect = require('chai').expect;
var sinon = require('sinon');
var qm = require('../index.js');

describe('query-manager', function () {
    describe('#add(String|Array)', function () {

        it('should throw an error when null passed', function () {
            var test = function () {
                qm.add(null);
            };
            expect(test).to.throw(Error);
            expect(test).to.throw(/Expected an string or array but null given/);
        });

        it('should throw an error when undefined passed', function () {
            var test = function () {
                qm.add(undefined);
            };
            expect(test).to.throw(Error);
            expect(test).to.throw(/Expected an string or array but undefined given/);
        });

        it('should throw an error when number passed', function () {
            var test = function () {
                qm.add(9);
            };
            expect(test).to.throw(Error);
            expect(test).to.throw(/Expected an string or array but number given/);
        });

        it('should throw an error when invalid array elements were passed', function () {
            var sqlFiles = [
                './test/sqlFile1.sql',
                {}
            ];

            var test = function () {
                qm.add(sqlFiles);
            };
            expect(test).to.throw(Error);
            expect(test).to.throw(/Unexpected file path at index 1/);
        });

        it('should not throw an error while array passed', function () {
            var sqlFiles = [
                './test/sqlFile1.sql'
            ];

            var test = function () {
                qm.add(sqlFiles);
            };
            expect(test).to.not.throw(Error);
        });

        it('should not throw an error while string passed', function () {
            var sqlFile = './test/sqlFile1.sql';

            var test = function () {
                qm.add(sqlFile);
            };
            expect(test).to.not.throw(Error);
        });
    });

    describe('#get(String, Object)', function () {
        it('should return proper query', function () {
            var sqlFiles = [
                './test/example/file1.sql'
            ];

            qm.add(sqlFiles);
            var query1 = qm.get('users.getAll');
            var query2 = qm.get('users.getAllActive');
            var query3 = qm.get('apps.getAllApps');

            var anotherFile = [
                './test/example/file2.sql'
            ];

            qm.add(anotherFile);
            var query4 = qm.get('users.getAllMyApps');
            var query5 = qm.get('someUniqueId');
            var query6 = qm.get('anotherUniqueId');

            expect(query1).to.be.equal('SELECT * FROM users;');
            expect(query2).to.be.equal('SELECT * FROM users WHERE active = 1 ;');
            expect(query3).to.be.equal('SELECT * FROM apps ;');
            expect(query4).to.be.equal('SELECT * FROM user_apps WHERE user_id = 234 ;');
            expect(query5).to.be.equal('SELECT * FROM some_table ;');
            expect(query6).to.be.equal(' SELECT * FROM some_table WHERE id = 3;');
        });

        it('should throw error when key not found', function () {
            var sqlFiles = [
                './test/example/file1.sql'
            ];

            qm.add(sqlFiles);
            function test() { var query = qm.get('users.getAllBlockedUsers'); }

            expect(test).to.throw(Error);
            expect(test).to.throw(/key does not exist/);
        });


        it('should return proper query when option object passed', function () {
            qm.add('./test/example/file3.sql');

            var options1 = { user_id: 123 };
            var query1 = qm.get('user.getUserProfile', options1);

            var options2 = {field1: 'first_name', field2: 'last_name'};
            var query2 = qm.get('users.getFields', options2);

            expect(query1).to.equal('SELECT * FROM profiles WHERE id = 123 ;');
            expect(query2).to.equal('SELECT first_name, last_name FROM users ;');
        });

    });

    it('should cache processed files', function () {
        var sqlFiles = [
            './test/example/file1.sql'
        ];

        qm.add(sqlFiles);
        var query1 = qm.get('users.getAll');
        var query2 = qm.get('users.getAllActive');
        var query3 = qm.get('apps.getAllApps');

        expect(query1).to.be.equal('SELECT * FROM users;');
        expect(query2).to.be.equal('SELECT * FROM users WHERE active = 1 ;');
        expect(query3).to.be.equal('SELECT * FROM apps ;');
        qm = null;

        var queryManagerCached = require('../index.js');
        qm = queryManagerCached;
        var query4 = qm.get('users.getAll');
        var query5 = qm.get('users.getAllActive');
        var query6 = qm.get('apps.getAllApps');

        expect(query4).to.be.equal('SELECT * FROM users;');
        expect(query5).to.be.equal('SELECT * FROM users WHERE active = 1 ;');
        expect(query6).to.be.equal('SELECT * FROM apps ;');

    });

});
