const fs = require("fs");
// 文件流操作
let rs = fs.createReadStream("../1.txt");
let ws = fs.createWriteStream("../upload/2.txt");

// 读取方流向写入方
rs.pipe(ws);
// 读取完成 监听的事end事件
rs.on("end", err => {
    console.log("读取结束");
});
// 流的错误处理
rs.on("error", err => {
    console.log("读取失败");
});

// 写入流用的事finish
ws.on("finish", err => {
    console.log("写入成功");
});
