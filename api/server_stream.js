const http = require("http");
const fs = require("fs");
const zlib = require("zlib");

const server = http.createServer((req, res) => {
    console.log(req.url);
    const rs = fs.createReadStream(`../job${req.url}`);
    const gz = zlib.createGzip();
    // rs.pipe(res); // 未经压缩输出，会影响浏览器的浏览速度，浪费带宽
    rs.pipe(gz).pipe(res); // 压缩后的事二进制的数据，浏览器给下载操作了
    // 所以在给浏览器返回的时候需要给响应头添加属性，用以告诉浏览器服务器发送的格式
    res.setHeader("content-encoding", "gzip"); 
    rs.on("error", err => {
        res.writeHeader(404);
        res.write("Not Found");
        res.end();
    });
});

server.listen(8089);