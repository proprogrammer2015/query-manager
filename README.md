# SQL query manager
* lightweight node module
* shortcut for queries
* caching queries
* simple API
* well tested with Chai and Sinon

# Installation
```sh
npm install query-manager
```

# Run tests
Run tests typing in terminal:
```sh
mocha
```
or run code coverage typing:
```sh
npm run coverage
```

# !!! Warn
Be careful with comments. Comments need to apply SQL parser rules.

# Assume that:
* './path/to/sql/file1.sql' contains:
```sql
--<users>
/* Get all users */
--[getAll]
SELECT * FROM users;

/*
  Get all active users
*/
--[getAllActive]
SELECT * FROM users WHERE active = 1;

--[getAllBanned]
SELECT * FROM users WHERE banned = 1;


--<apps>
--[getAll]
SELECT *
FROM apps
;

```



# Example:
To get query just run:
```js
var queryManager = require('query-manager')();
var files = [
  './path/to/sql/file1.sql',
  './path/to/sql/file2.sql',
  './path/to/sql/file3.sql',
  './path/to/sql/file4.sql'
];

queryManager.load( files );

var query1 = queryManager.get('users.getAll'); // SELECT * FROM users;
var query2 = queryManager.get('users.getAllActive'); // SELECT * FROM users WHERE active = 1;
var query2 = queryManager.get('users.getAllBanned'); // SELECT * FROM users WHERE banned = 1;
var query3 = queryManager.get('apps.getAll'); // SELECT * FROM apps;
// and so on...
```

# ToDo:
- add simple config object during init
- add handling nasted comments of: (this makes an error)
```sql
/*

--[someMethod]

*/
```

# LICENCE
MIT
