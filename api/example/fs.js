const fs = require("fs");
// 获取文件信息
fs.stat("1.txt", (err, data) => {
    if (err) {
        console.log("出错了", err);
    } else {
        console.log(data);
    }
})
fs.readFile("1.txt", (err, data) => {
    if (err) {
        console.log("出错了", err);
    } else {
        console.log(data.toString());
    }
});
fs.writeFile("1.txt", "坎坎坷坷扩", (err) => {
    if (err) {
        console.log("出错了", err);
    } else {
        console.log("成功了");
    }
});