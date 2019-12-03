const http = require("http");
const net = require("net");
const crypto = require("crypto");

// const httpServer = http.createServer((req, res) => {
// });
// httpServer.listen(8089);

const server = net.createServer(sock => {
    console.log("链接");
    // 数据过来握手，所以只需要监听一次即可
    sock.once("data", data => {
        // 握手
        console.log("hanl shake start....")
        const str = data.toString();
        const lines = str.split("\r\n");
        // 舍弃第一行和最后两行
        lines.shift();
        lines.pop();
        lines.pop();
        // console.log(lines);

        // 切开
        const headers = {};
        lines.forEach((line) => {
            let [key, val] = line.split(": ");
            headers[key.toLowerCase()] = val;
        })
        // console.log(headers);
        if (headers["upgrade"] != "websocket") {
            console.log("其他协议", headers["upgrade"]);
            // 关闭链接
            sock.end();
        } else if (headers["sec-websocket-version"] != 13) {
            console.log("版本不正确", headers["sec-websocket-version"]);
            // 关闭链接
            sock.end();
        } else {
            // 秘钥
            const key = headers["sec-websocket-key"];
            const mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
            // sha1(key+mask) -> base64 -> client
            const hash = crypto.createHash("sha1");
            hash.update(key+mask);
            const key2 = hash.digest("base64");
            sock.write(`http/1.1 101 Switching Protocaols\r\nUpgrade: websocket\r\nConnection: upgrade\r\nSec-WebSocket-Accept: ${key2}\r\n\r\n`);
            console.log("hanl shake end");
        }

        // 真正的数据
        sock.on("data", data => {
            console.log("有数据……",data);
        });
    });
    sock.emit("msgs", "aaaa");
    // 断开
    sock.on("end", () => {
        console.log("客户端断开了");
    });
});

server.listen(8089);

