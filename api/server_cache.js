/**
 * 处理缓存机制
 * 一.缓存策略：
 * cache-control：告诉浏览器需不需要缓存
 * expires：缓存的时效
 * 二.缓存实现过程：
 * 1.第一次发送数据，server --> client，设置响应头的last-modified 的时间，改时间为文件的最后修改时间mtime
 * 2.第二次请求数据，客户端会根据响应头的last-modified给服务端发送一个请求头if-modified-sence，注明之前请求文件最新修改的时间
 * 3.第三次服务端对比两个时间，以此判断返回新的文件还是返回304
 * 
 */

const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url);
    fs.stat(`../job${pathname}`, (err, sta) => {
        if (err) {
            res.writeHeader(404);
            res.write("Not Found");
            res.end();
        } else {
            if (req.headers["if-modified-since"]) {
                let time_client = Math.floor(new Date(req.headers["if-modified-since"]).getTime() / 1000);
                // console.log(time_client, sta.mtime.getTime());
                let time_server = Math.floor(sta.mtime.getTime() / 1000)
                if (time_client < time_server) { // 服务器的文件时间大于客户端手里的版本
                    sendFileToClient();
                } else {
                    res.writeHeader(304);
                    res.write("Not Modified");
                    res.end();
                }
            } else {
                sendFileToClient();
            }
        }
        function sendFileToClient() {
            let oDate = sta.mtime.toUTCString();
            let rs = fs.createReadStream(`../job${pathname}`);
            // res.setHeader("cache-control", "no-store"); // 告诉浏览器不需要缓存
            res.setHeader("last-Modified", oDate);
            res.setHeader("etag", "1111111");
            rs.pipe(res);
            rs.on("error", err => {
                console.log("出错啦", err);
            });
        }
    })
});
server.listen(8089);