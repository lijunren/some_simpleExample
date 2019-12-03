const mysql = require("mysql");


// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     port: 3306,
//     database: "user_table"
// });
// connection.connect(err => {
//     if (err) {
//         console.error("error connection", err.stack);
//         return;
//     }
//     console.log("connection as id", connection.threadId);
// });


// 连接池nysql.createPool  替换上面的链接方式
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "user_table"
});

/**
 * 四大查询语言
 * 1、增 insert
 * INSERT INTO 表（字段） VALUES(值）
 * 例：INSERT INTO user_table (name,gender,chinese,math,english) values("李四","女",81,70,43);
 * 2、删 delete
 * DELETE FROM 表 WHERE ID=3
 * 3、改 update
 * UPDATE 表 SET 字段=值，字段=值 where 条件
 * 4、查 select
 * SELECT {所需要的字段列表，全部用*代替} FROM 表 WHRER 条件
 */

const insert = 'INSERT INTO student_table (name,gender,chinese,math,english) values("李四","女",81,70,43);';
const deletes = 'DELETE FROM student_table WHERE ID=3';
const update = 'UPDATE student_table SET english=99 WHERE name="张三"';
const select = 'SELECT name,gender FROM student_table WHERE name="张三"'
connection.query(select, (err, data) => {
    if (err) {
        console.error("error query", err.stack);
        return;
    }
    console.log("success", data);
})