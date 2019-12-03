const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // 接收文件post数据

const app = new express();

// 中间件 app.use
app.use(bodyParser.urlencoded({extended: false}));
const multerObj = multer({dest: "../upload/"});
app.use(multerObj.any());
app.use(express.static("../../job/"));
// app.post 
// app.use 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
app.get("/fetch", (req, res) => {
    console.log(111);
    res.send("ceshi");
});
app.post("/upload", (req, res) => {
    res.send("OK");
});
app.listen(8089, () => {
    console.log("启动……");
})
