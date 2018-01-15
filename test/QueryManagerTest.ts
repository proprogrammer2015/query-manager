import { QueryManager } from '../QueryManager';
import * as chai from 'chai';

const expect = chai.expect;
const create = (stringContent: string | Array<string>) => new QueryManager(stringContent);

describe('query-manager', () => {
    describe('get(key:string, options:object)', () => {
        it('should throw if key not found', () => {
            const key = 'users.getAllBanned';
            const sqlTemplate = `
                --@users.getAll@
                SELECT * FROM users;
            `;
            const qm = create(sqlTemplate);

            expect(() => qm.get(key)).to.throw(/InvalidArgument: 'users.getAllBanned' key does not exist.*/);
        });

        it('should return sql template if parameters not passed', () => {
            const key = 'users.getAll';
            const sqlTemplate = `
                --@users.getAll@
                SELECT * FROM users;
            `;
            const expected = 'SELECT * FROM users;';
            const qm = create(sqlTemplate);
            let result = qm.get(key);

            expect(result).to.equal(expected);
        });

        it('should return sql template without parameters', () => {
            const key = 'users.getAll';
            const sqlTemplate = `
                --@users.getAll@
                SELECT * FROM users;
            `;
            const options = {};

            const expected = 'SELECT * FROM users;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template for multiline template', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@users.getBanned@ 
                SELECT * 
                FROM users
                WHERE banned = 1;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);

        });

        it('should return sql template for query id markup without extra space around', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@users.getBanned@ 
                SELECT * 
                FROM users
                WHERE banned = 1
                ;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template for query id markup with extra space on left', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@          users.getBanned@ 
                SELECT * 
                FROM users
                WHERE banned = 1
                ;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template for query id markup with extra space on right', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@users.getBanned      @ 
                SELECT * 
                FROM users
                WHERE banned = 1
                ;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);

        });

        it('should return sql template for query id markup with extra space around', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@   users.getBanned        @ 
                SELECT * 
                FROM users
                WHERE banned = 1
                ;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);

        });

        it('should return sql template for query id markup and additional comments between query id and sql template', () => {
            const key = 'users.getBanned';
            const sqlTemplate = `
                #@   users.getBanned        @ 
                -- Lists all banned users.
                # TODO: Improve this query.
                SELECT * 
                FROM users
                WHERE banned = 1
                ;
            `;
            const options = {};

            const expected = 'SELECT * FROM users WHERE banned = 1;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return last sql template for duplicated query id', () => {
            const key = 'users.getUsers';
            const sqlTemplate = `
                #@   users.getUsers        @ 
                -- Lists all banned users.
                SELECT * 
                FROM users
                WHERE banned = 1
                ;

                --@users.getUsers@ 
                SELECT * FROM users;
            `;
            const options = {};

            const expected = 'SELECT * FROM users;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);

        });

        it('should return sql template with parameters as SELECT fields', () => {
            const key = 'users.getUsers';
            const sqlTemplate = `
                #@   users.getUsers        @ 
                SELECT {field1}, {field2} 
                FROM users
                ;
            `;
            const options = {
                field1: 'first_name',
                field2: 'last_name'
            };

            const expected = 'SELECT first_name, last_name FROM users;';
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template with parameters as WHERE condition values', () => {
            const key = 'users.getUsersBy';
            const sqlTemplate = `
                #@   users.getUsersBy       @ 
                SELECT *
                FROM users
                WHERE
                    first_name='{first_name}'
                AND
                    last_name like '{last_name_contains}'
                ;
            `;
            const options = {
                first_name: 'John',
                last_name_contains: 'Do%'
            };

            const expected = `SELECT * FROM users WHERE first_name='John' AND last_name like 'Do%';`;
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template with text inside query comment', () => {
            const key = 'users.getUserProfile';
            const sqlTemplate = `
                /*
                This query returns user profile.
                @users.getUserProfile@
                
                */
                SELECT *
                FROM profiles
                WHERE id=1245
                ;
            `;

            const expected = `SELECT * FROM profiles WHERE id=1245;`;
            const qm = create(sqlTemplate);
            let result = qm.get(key);

            expect(result).to.equal(expected);
        });

        it('should return sql template with multiline query id', () => {
            const key = 'users.getUsersBy';
            const sqlTemplate = `
                /*
                @  
                    users.getUsersBy  
                @
                */
                SELECT *
                FROM users
                WHERE
                    first_name='{first_name}'
                AND
                    last_name like '{last_name_contains}'
                ;
            `;
            const options = {
                first_name: 'John',
                last_name_contains: 'Do%'
            };

            const expected = `SELECT * FROM users WHERE first_name='John' AND last_name like 'Do%';`;
            const qm = create(sqlTemplate);
            let result = qm.get(key, options);

            expect(result).to.equal(expected);
        });

        it('should return sql template when multiple input templates passed', () => {
            const template1 = `
                --@users.getAll@
                SELECT * FROM users;`;
            const template2 = `
                /*@users.getAllBanned@*/
                SELECT * FROM users
                WHERE banned=1;
            `;
            const template3 = `
                --@users.emailLikeGmail@
                SELECT * FROM users
                WHERE email like '%gmail';
            `;
            const template4 = `
                --@users.getEmailBy@
                SELECT * FROM users
                WHERE email='{email}';
            `;
            const sqlTemplates = [
                template1,
                template2,
                template3,
                template4
            ];

            const qm = create(sqlTemplates);
            let expected1 = `SELECT * FROM users WHERE email like '%gmail';`;
            let expected2 = `SELECT * FROM users;`;
            let expected3 = `SELECT * FROM users WHERE email='some.creazy@email.com';`;
            let options = {
                email: 'some.creazy@email.com'
            };

            expect(qm.get('users.emailLikeGmail')).to.equal(expected1);
            expect(qm.get('users.getAll')).to.equal(expected2);
            expect(qm.get('users.getEmailBy', options)).to.equal(expected3);
        });
    });

    describe('add(templates: string|Array<string>', () => {
        it('should return sql template when multiple input templates passed', () => {
            const template1 = `
                --@users.getAll@
                SELECT * FROM users;`;
            const template2 = `
                /*@users.getAllBanned@*/
                SELECT * FROM users
                WHERE banned=1;
            `;
            const template3 = `
            --@users.emailLikeGmail@
            SELECT * FROM users
            WHERE email like '%gmail';
            `;

            const sqlTemplates = [
                template1,
                template2,
                template3
            ];

            const qm = create(sqlTemplates);
            let expected1 = `SELECT * FROM users WHERE email like '%gmail';`;
            let expected2 = `SELECT * FROM users;`;


            expect(qm.get('users.emailLikeGmail')).to.equal(expected1);
            expect(qm.get('users.getAll')).to.equal(expected2);

            const template4 = `
            --@users.getEmailBy@
            SELECT * FROM users
            WHERE email='{email}';
            `;
            const template5 = `
            --@users.getActiveUsers@
            SELECT *
            FROM users
            WHERE active = 1;
            `;
            let additionalSqlTemplates = [
                template4,
                template5
            ];
            qm.add(additionalSqlTemplates);

            let expected4 = `SELECT * FROM users WHERE email='some.creazy@email.com';`;
            let options = {
                email: 'some.creazy@email.com'
            };
            let expected5 = `SELECT * FROM users WHERE active = 1;`;
            expect(qm.get('users.getEmailBy', options)).to.equal(expected4);
            expect(qm.get('users.getActiveUsers', options)).to.equal(expected5);
        });

        it('should throw when null passed', () => {
            let qm = create([]);
            
            expect(() => qm.add(null)).to.throw(/InvalidArgument: templates cannot be null/);
            expect(() => qm.add(void 0)).to.throw(/InvalidArgument: templates cannot be null!/);
        })
    })

    it('should throw when null passed', () => {
        expect(() => create(null)).to.throw(/InvalidArgument: templates cannot be null/);
        expect(() => create(void 0)).to.throw(/InvalidArgument: templates cannot be null!/);
    })
});
