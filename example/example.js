var { QueryManager } = require('./../index.js');
var readFile = require('read-file');

var sqlTemplates = [
    './file1.sql',
    './file2.sql'
].map(function (filePath) {
    return readFile.sync(filePath, { encoding: 'utf8' });
});

var qm = new QueryManager(sqlTemplates);

console.log(qm.get('users.getAll')); // SELECT * FROM users;
console.log(qm.get('users.getLastLogin')); // SELECT last_login FROM users WHERE user_id = 234;

var userProfileOptions = {
    user_id: 345
};
console.log(qm.get('users.getUserProfile', userProfileOptions)); // SELECT * FROM profiles WHERE id = 345;

var userFieldsOptions = {
    field1: 'username',
    field2: 'email',
    email_value: 'john.doe@mail.com'
};
console.log(qm.get('users.getFields', userFieldsOptions)); // SELECT username, email FROM users WHERE email='john.doe@mail.com';