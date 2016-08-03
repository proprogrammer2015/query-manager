# SQL query manager
* new simple API
* fast, lightweight node module
* shortcut for queries
* caching queries
* customizable queries
* well tested with Chai and Sinon

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

#   @users.getBanned @ 

# Some other comment here
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
@  
apps.getAllApps  
@
*/
SELECT *
FROM apps
;
# @user.getUserProfile@
SELECT *
FROM profiles
WHERE id = {user_id}
;
/*
-- @ users.getFields @
*/
SELECT {field1}, {field2}
FROM users
;


/*
# @someUniqueId @
*/
SELECT * 
FROM some_table
;

/* --@anotherUniqueId@ */
-- this is sample comment
SELECT *
FROM some_table
WHERE id = 3;
```


# Example:
To get query just run:
```js
var qm = require('query-manager');
var files = [
  'file1.sql'
];

qm.add( files );

var query1 = qm.get('users.getAll'); // SELECT * FROM users;
var query2 = qm.get('users.getAllActive'); // SELECT * FROM users WHERE active = 1 ;
var query3 = qm.get('apps.getAllApps'); // SELECT * FROM apps ;

// with placeholders inside query
var options1 = { user_id: 123 };
var query1 = qm.get('user.getUserProfile', options1); // SELECT * FROM profiles WHERE id = 123 ;

var options2 = {field1: 'first_name', field2: 'last_name'}; 
var query2 = qm.get('users.getFields', options2); // SELECT first_name, last_name FROM users ;

// and so on...
```

# LICENCE
MIT
