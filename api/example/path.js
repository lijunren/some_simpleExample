const path = require("path");

let str = "/var/local/www/ion.png"
console.log(path.dirname(str));
console.log(path.extname(str));
console.log(path.basename(str));