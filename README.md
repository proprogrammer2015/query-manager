# SQL query manager
* new simple API
* fast, lightweight node module
* shortcut for queries
* caching queries
* customizable queries
* well tested with Chai
* Typescript support

# Installation
```sh
npm install query-manager
```

# Run tests
Run tests typing in terminal:
```sh
npm run test
```
or run code coverage typing:
```sh
npm run coverage
```

# Markups
Put query identifier between @ signs.
* Example 'file1.sql'
```sql
--@users.getAll@
SELECT * FROM users;

--    @   users.getAllActive   @
SELECT * 
FROM users
WHERE active = 1
;

--   @users.getBanned @ 
-- Some other comment here
-- another comment 
SELECT * 
FROM users
WHERE banned = 1
;
/* This is very important comment here! */

/*  @ users.getLastLogin   @ */
SELECT last_login 
FROM users
WHERE user_id = 234
;

/*
This query returns user profile.
 @users.getUserProfile@

 */
SELECT *
FROM profiles
WHERE id = {user_id}
;
/*
-- @ users.getFields @
*/
SELECT {field1}, {field2}
FROM users
WHERE email='{email_value}'
;
```

# Live example
1. Go to /example directory. There is example.js script that shows usage of query-manager module.
2. Install dependencies with
```sh
npm install
```
3. Then run script with node
```sh
node example.js
```

# Example snippet
```js
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
```

# LICENCE
MIT
