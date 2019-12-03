const http = require("http");
const mysql = require("mysql");
const fs = require("fs");
const url = require("url");
const zlib = require("zlib");
const uuid = require("uuid/v4");
const crypto = require("crypto"); // 加密
const queryString = require("querystring"); // 用于解析body数据

const _key = "o830sdjadsfkjsdfy37podsanjkasdjf";
function md5(str) {
    const obj = crypto.createHash("md5");
    obj.update(str);
    return obj.digest("hex");
}
function md5_2(str){
    return md5(md5(str)+_key);
}
let code = uuid().replace(/\-/g,"");
let initT = "";
const db = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "user_table",
});
const server = http.createServer((req, res) => {
    // 判读是接口还是静态文件
    let {pathname, query} = url.parse(req.url, true);
    let {user, pass} = query;
    switch(pathname) {
        case "/api/reg":
            if (!user) {
                res.write('{"err": 10001, "msg": "username is required"}');
                res.end();
            } else if (!pass) {
                res.write('{"err": 10002, "msg": "password is required"}');
                res.end();
            } else if (!/^\w{4,16}$/.test(user)) {
                res.write('{"err": 10003, "msg": "username is invaild"}');
                res.end();
            } else if (/['||"]/.test(pass)) {
                res.write('{"err": 10004, "msg": "password is invaild"}');
                res.end();
            } else {
                db.query(`SELECT * FROM user_table WHERE username="${user}";`, (err, data) => {
                    if (err) {
                        res.write('{"err": 10009, "msg": "database select error' + err + '"}');
                        res.end();
                    } else {
                        if (data.length > 0) {
                            res.write('{"err": 10005, "msg": "user has exist"}');
                            res.end();
                        } else {
                            db.query(`INSERT INTO user_table (ID, username, password) VALUES(0, "${user}", "${md5_2(pass)}");`, (err, data) => {
                                if (err) {
                                    res.write('{"err": 10009, "msg": "database insert error' + err + '"}');
                                    res.end();
                                } else {
                                    res.write('{"err": 0, "msg": "add success"}');
                                    res.end();
                                }
                            });
                        }
                    }
                });
                
            }
            break;
        case "/login":
            if (!user) {
                res.write('{"err": 10001, "msg": "username is required"}');
                res.end();
            } else if (!pass) {
                res.write('{"err": 10002, "msg": "password is required"}');
                res.end();
            } else if (!/^\w{4,16}$/.test(user)) {
                res.write('{"err": 10003, "msg": "username is invaild"}');
                res.end();
            } else if (/['||"]/.test(pass)) {
                res.write('{"err": 10004, "msg": "password is invaild"}');
                res.end();
            } else {
                db.query(`SELECT * FROM user_table WHERE username="${user}"`, (err, data) => {
                    if (err) {
                        res.write('{"err": 10009, "msg": "database error"}');
                        res.end();
                    } else {
                        if (data.length > 0) { // data返回的是一个数组
                            // console.log(typeof data, pass);
                            if (data[0].password != md5_2(pass)) {
                                res.write('{"err": 10010, "msg": "username or password is incorrect"}');
                                res.end();
                            } else {
                                res.write('{"err": 0, "msg": "login success"}');
                                res.end();
                            }
                        } else {
                            res.write('{"err": 10005, "msg": "username do not exist"}');
                            res.end();
                        }
                    }
                });
            }
            break;
        default:
            // 处理缓存
            fs.stat(`../job${pathname}`, (err, data) => {
                if (err) {
                    res.writeHeader(404);
                    res.write('Not Found');
                    res.end();
                } else {
                    // 最新修改文件时间
                    const modifyfileT = data.mtimeMs;
                    if (!req.headers["if-none-match"]) {
                        initT = data.mtimeMs;
                        sendFile(modifyfileT);
                    } else {
                        if (initT < modifyfileT) {
                            initT = modifyfileT;
                            code = uuid().replace(/\-/g, "");
                        }
                        if (req.headers["if-none-match"] == code) {
                            res.writeHeader(304);
                            res.write("Not Modified");
                            res.end();
                        } else {
                            sendFile(modifyfileT);
                        }
                    }
                    
                }
            });
            // 静态文件
            
            break;
    }
    
    function sendFile(time) {
        const rs = fs.createReadStream(`../job${pathname}`);
        const gz = zlib.createGzip();
        res.setHeader("etag", code);
        res.setHeader("cache-control", "no-cache");
        res.setHeader("last-modified", (new Date(time)).toUTCString());
        res.setHeader("content-encoding", "gzip");
        rs.pipe(gz).pipe(res);
        rs.on("error", err => {
            res.writeHeader(404);
            res.write('Not Found');
            res.end();
        });
    }
});
server.listen(8089);