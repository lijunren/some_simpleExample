const zlib = require("zlib");
const fs = require("fs");

let rs = fs.createReadStream("../img.jpg");
let ws = fs.createWriteStream("../upload/img.jpg.gz");

let gz = zlib.createGzip();

rs.pipe(gz).pipe(ws);

ws.on("finish", data => {
    console.log("success!!");
});