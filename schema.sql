
 CREATE TABLE `usertable`(
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    avatar TEXT
    

 );

-- INSERT INTO usertable
--     (id, username,email,password)
--     VALUES
--     (101,"eve","eve@gmail.com","123"),
--     (102,"adam","adam@gmail.com","456"),
--     (103,"vick","vick@gmamail.com","890");


TRUNCATE TABLE usertable;