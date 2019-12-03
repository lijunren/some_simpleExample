const cluster = require("cluster"); //创建进程使用
const os = require("os"); // 能获取操作系统的信息
const process = require("process"); // 获取进程信息
const http = require("http");

if (cluster.isMaster){ // 判断是否在主进程
    for(let i = 0; i < os.cpus().length; i++) {
        cluster.fork(); // 分叉 产生了两个进程,系统内核多少个就开多少个进程
    }
    console.log("主进程PID", process.pid);
} else {
    console.log("子进程PID", process.pid);
    http.createServer((req, res) => {
        console.log("子进程PID在工作", process.pid);
        res.write("aaaa");
        res.end();
    }).listen(8089);
};

