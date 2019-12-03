/**
 * 处理缓存机制
 * 一.缓存策略：
 * cache-control：告诉浏览器需不需要缓存
 * expires：缓存的时效
 * 二.缓存实现过程：
 * 使用etag和if-none-watch实现缓存
 * 1.第一次发送数据，server --> client，设置响应头的etag字段
 * 2.第二次请求数据，client请求头发送if-none-match
 * 3.第三次服务端对比if-none-match和当前的，以此判断返回新的文件还是返回304
 * 
 */

const http = require("http");
const fs = require("fs");
const url = require("url");
const uuid = require("uuid/v4");
let etag = uuid().replace(/\-/g, "");
let initT = "";
const server = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url);
    fs.stat(`../job${pathname}`, (err, sta) => {
        if (err) {
            res.writeHeader(404);
            res.write("Not Found");
            res.end();
        } else {
            if (req.headers["if-none-match"]) {
                if (initT < sta.mtimeMs) {
                    initT = sta.mtimeMs;
                    etag = uuid().replace(/\-/g, "");
                }
                let etag_client = req.headers["if-none-match"];
                if (etag_client != etag) { // 服务器的文件时间大于客户端手里的版本
                    sendFileToClient();
                } else {
                    res.writeHeader(304);
                    res.write("Not Modified");
                    res.end();
                }
            } else {
                initT = sta.mtimeMs;
                sendFileToClient();
            }
        }
        function sendFileToClient() {
            let oDate = sta.mtime.toUTCString();
            let rs = fs.createReadStream(`../job${pathname}`);
            res.setHeader("cache-control", "no-cache");
            const expiresT = new Date();
            expiresT.setTime(expiresT.getTime() + 120000)
            res.setHeader("expires", expiresT.toUTCString());
            res.setHeader("last-Modified", oDate);
            res.setHeader("etag", etag);
            rs.pipe(res);
            rs.on("error", err => {
                console.log("出错啦", err);
            });
        }
    })
});
server.listen(8089);