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

