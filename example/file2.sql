# @users.getUserProfile@
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