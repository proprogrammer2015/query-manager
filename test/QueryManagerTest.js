"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryManager_1 = require("../QueryManager");
var chai = require("chai");
var expect = chai.expect;
var create = function (stringContent) { return new QueryManager_1.QueryManager(stringContent); };
describe('query-manager', function () {
    describe('get(key:string, options:object)', function () {
        it('should throw if key not found', function () {
            var key = 'users.getAllBanned';
            var sqlTemplate = "\n                --@users.getAll@\n                SELECT * FROM users;\n            ";
            var qm = create(sqlTemplate);
            expect(function () { return qm.get(key); }).to.throw(/InvalidArgument: 'users.getAllBanned' key does not exist.*/);
        });
        it('should return sql template if parameters not passed', function () {
            var key = 'users.getAll';
            var sqlTemplate = "\n                --@users.getAll@\n                SELECT * FROM users;\n            ";
            var expected = 'SELECT * FROM users;';
            var qm = create(sqlTemplate);
            var result = qm.get(key);
            expect(result).to.equal(expected);
        });
        it('should return sql template without parameters', function () {
            var key = 'users.getAll';
            var sqlTemplate = "\n                --@users.getAll@\n                SELECT * FROM users;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for multiline template', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@users.getBanned@ \n                SELECT * \n                FROM users\n                WHERE banned = 1;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for query id markup without extra space around', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@users.getBanned@ \n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for query id markup with extra space on left', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@          users.getBanned@ \n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for query id markup with extra space on right', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@users.getBanned      @ \n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for query id markup with extra space around', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@   users.getBanned        @ \n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template for query id markup and additional comments between query id and sql template', function () {
            var key = 'users.getBanned';
            var sqlTemplate = "\n                #@   users.getBanned        @ \n                -- Lists all banned users.\n                # TODO: Improve this query.\n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users WHERE banned = 1;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return last sql template for duplicated query id', function () {
            var key = 'users.getUsers';
            var sqlTemplate = "\n                #@   users.getUsers        @ \n                -- Lists all banned users.\n                SELECT * \n                FROM users\n                WHERE banned = 1\n                ;\n\n                --@users.getUsers@ \n                SELECT * FROM users;\n            ";
            var options = {};
            var expected = 'SELECT * FROM users;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template with parameters as SELECT fields', function () {
            var key = 'users.getUsers';
            var sqlTemplate = "\n                #@   users.getUsers        @ \n                SELECT {field1}, {field2} \n                FROM users\n                ;\n            ";
            var options = {
                field1: 'first_name',
                field2: 'last_name'
            };
            var expected = 'SELECT first_name, last_name FROM users;';
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template with parameters as WHERE condition values', function () {
            var key = 'users.getUsersBy';
            var sqlTemplate = "\n                #@   users.getUsersBy       @ \n                SELECT *\n                FROM users\n                WHERE\n                    first_name='{first_name}'\n                AND\n                    last_name like '{last_name_contains}'\n                ;\n            ";
            var options = {
                first_name: 'John',
                last_name_contains: 'Do%'
            };
            var expected = "SELECT * FROM users WHERE first_name='John' AND last_name like 'Do%';";
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template with text inside query comment', function () {
            var key = 'users.getUserProfile';
            var sqlTemplate = "\n                /*\n                This query returns user profile.\n                @users.getUserProfile@\n                \n                */\n                SELECT *\n                FROM profiles\n                WHERE id=1245\n                ;\n            ";
            var expected = "SELECT * FROM profiles WHERE id=1245;";
            var qm = create(sqlTemplate);
            var result = qm.get(key);
            expect(result).to.equal(expected);
        });
        it('should return sql template with multiline query id', function () {
            var key = 'users.getUsersBy';
            var sqlTemplate = "\n                /*\n                @  \n                    users.getUsersBy  \n                @\n                */\n                SELECT *\n                FROM users\n                WHERE\n                    first_name='{first_name}'\n                AND\n                    last_name like '{last_name_contains}'\n                ;\n            ";
            var options = {
                first_name: 'John',
                last_name_contains: 'Do%'
            };
            var expected = "SELECT * FROM users WHERE first_name='John' AND last_name like 'Do%';";
            var qm = create(sqlTemplate);
            var result = qm.get(key, options);
            expect(result).to.equal(expected);
        });
        it('should return sql template when multiple input templates passed', function () {
            var template1 = "\n                --@users.getAll@\n                SELECT * FROM users;";
            var template2 = "\n                /*@users.getAllBanned@*/\n                SELECT * FROM users\n                WHERE banned=1;\n            ";
            var template3 = "\n                --@users.emailLikeGmail@\n                SELECT * FROM users\n                WHERE email like '%gmail';\n            ";
            var template4 = "\n                --@users.getEmailBy@\n                SELECT * FROM users\n                WHERE email='{email}';\n            ";
            var sqlTemplates = [
                template1,
                template2,
                template3,
                template4
            ];
            var qm = create(sqlTemplates);
            var expected1 = "SELECT * FROM users WHERE email like '%gmail';";
            var expected2 = "SELECT * FROM users;";
            var expected3 = "SELECT * FROM users WHERE email='some.creazy@email.com';";
            var options = {
                email: 'some.creazy@email.com'
            };
            expect(qm.get('users.emailLikeGmail')).to.equal(expected1);
            expect(qm.get('users.getAll')).to.equal(expected2);
            expect(qm.get('users.getEmailBy', options)).to.equal(expected3);
        });
    });
    describe('add(templates: string|Array<string>', function () {
        it('should return sql template when multiple input templates passed', function () {
            var template1 = "\n                --@users.getAll@\n                SELECT * FROM users;";
            var template2 = "\n                /*@users.getAllBanned@*/\n                SELECT * FROM users\n                WHERE banned=1;\n            ";
            var template3 = "\n            --@users.emailLikeGmail@\n            SELECT * FROM users\n            WHERE email like '%gmail';\n            ";
            var sqlTemplates = [
                template1,
                template2,
                template3
            ];
            var qm = create(sqlTemplates);
            var expected1 = "SELECT * FROM users WHERE email like '%gmail';";
            var expected2 = "SELECT * FROM users;";
            expect(qm.get('users.emailLikeGmail')).to.equal(expected1);
            expect(qm.get('users.getAll')).to.equal(expected2);
            var template4 = "\n            --@users.getEmailBy@\n            SELECT * FROM users\n            WHERE email='{email}';\n            ";
            var template5 = "\n            --@users.getActiveUsers@\n            SELECT *\n            FROM users\n            WHERE active = 1;\n            ";
            var additionalSqlTemplates = [
                template4,
                template5
            ];
            qm.add(additionalSqlTemplates);
            var expected4 = "SELECT * FROM users WHERE email='some.creazy@email.com';";
            var options = {
                email: 'some.creazy@email.com'
            };
            var expected5 = "SELECT * FROM users WHERE active = 1;";
            expect(qm.get('users.getEmailBy', options)).to.equal(expected4);
            expect(qm.get('users.getActiveUsers', options)).to.equal(expected5);
        });
        it('should throw when null passed', function () {
            var qm = create([]);
            expect(function () { return qm.add(null); }).to.throw(/InvalidArgument: templates cannot be null/);
            expect(function () { return qm.add(void 0); }).to.throw(/InvalidArgument: templates cannot be null!/);
        });
    });
    it('should throw when null passed', function () {
        expect(function () { return create(null); }).to.throw(/InvalidArgument: templates cannot be null/);
        expect(function () { return create(void 0); }).to.throw(/InvalidArgument: templates cannot be null!/);
    });
});
