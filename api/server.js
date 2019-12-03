const http = require("http");
const url = require("url"); // 解析整个url的信息
const queryString = require("querystring"); // 用于解析body数据
const fs = require("fs");
const formParse = require("./tool/formParse.js");

let users = {
    bluename: "123456"
}
const server = http.createServer((req, res) => {
        const {pathname, query} = url.parse(req.url, true);
        let str = [];
        // post的传输的数据量比较大，需要分次到达
        // data表示有一个数据到达
        req.on("data", data => {
            str.push(data);
        });
        // end表示结束
        req.on("end", () => {
            let post1 = Buffer.concat(str);
            // console.log("buffer>>>>>>", post1.toString());
            if (req.headers["content-type"]) {
                const content = req.headers["content-type"].split("; ")[1];
                const boundary = "--" + content.split("=")[1];
                formParse(boundary,post1);
            }
            let post = queryString.parse(Buffer.concat(str).toString());
            let {user, pass} = query;
            console.log(pathname, query, post);
            switch(pathname) {
                case "/api/reg":
                    if (!user) {
                        res.write(`{"err": 1, "msg": "user id required"}`);
                    } else if (!pass) {
                        res.write(`{"err": 1, "msg": "pass id required"}`);
                    } else if (!(/^\w{8,32}$/).test(user)) {
                        res.write(`{"err": 1, "msg": "invaild username"}`);
                    } else if (/^\['|"]$/.test(pass)) {
                        res.write(`{"err": 1, "msg": "invaild password"}`);
                    } else if (users[user]) {
                        res.write(`{"err": 1, "msg": "user has already exsits"}`);
                    } else {
                        users[user] = pass;
                        res.write(`{"err": 0, "msg": "regist success"}`);
                    }
                    res.end();
                    break;
                case "/login":
                        if (!user) {
                            res.write(`{"err": 1, "msg": "user id required"}`);
                        } else if (!pass) {
                            res.write(`{"err": 1, "msg": "pass id required"}`);
                        } else if (!/^\w{8,32}$/.test(user)) {
                            res.write(`{"err": 1, "msg": "invaild username"}`);
                        } else if (/^\['|"]$/.test(pass)) {
                            res.write(`{"err": 1, "msg": "invaild password"}`);
                        } else if (!users[user]) {
                            res.write(`{"err": 1, "msg": "no this username"}`);
                        } else if (users[user] != pass){
                            res.write(`{"err": 1, "msg": "username or password is incorrect"}`);
                        } else {
                            res.write(`{"err": 0, "msg": "login success"}`);
                        }
                        res.end();
                    break;
                case "/upload":
                    // console.log("upload");
                    const str = new Buffer("send to message");
                    res.write(str);
                    res.end();
                    break;
                default:
                    fs.readFile(`../job${pathname}`, (err, data) => {
                        if(err) {
                            res.writeHead(404); // 返回装填码
                            res.write("Not Found");
                        } else {
                            res.write(data);
                        }
                        res.end();
                    })
                    break;
            }         
        })
});
server.listen(8089);