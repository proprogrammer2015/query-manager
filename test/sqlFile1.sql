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
@  users.getAllApps  @
*/
SELECT *
FROM apps
;

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

/* @anotherUniqueId@ */
-- this is sample comment
SELECT *
FROM some_table
WHERE id = 3;

