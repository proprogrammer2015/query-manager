
/*
@
    users.getAllMyApps
@
*/
SELECT * 
FROM user_apps
WHERE user_id = 234
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

/* -- @some_table.getSomething@ */
SELECT *
FROM some_table
WHERE id = 23
;
