/**
 * 这个方法处理文件的方式不是最优解，读写文件操作影响磁盘和内存的利用率
 */

const bufferSplit = require("./bufferSplit");
const fs = require("fs");
const uuid = require("uuid/v4");
function parse(sp, str) {
    // console.log("formParse>>>>" , sp, str);
    const data = {};
    const files = {};
    const arrs = str.split(sp);
    arrs.shift();
    arrs.pop();
    const newArr = arrs.map(ele => ele.slice(2, ele.length - 2));
    newArr.forEach(ele => {
        // const disposition = ele.split("\r\n\r\n")[0].split("; ")[1].split("=")[1];
        // cosnt name = name.slice(1,name.length - 1);
        // const val = ele.split("\r\n\r\n")[1];
        // 因为文件中可能存在\r\n\r\n， 所以要去第一个，上面的操作会出现问题
        let disposition = ele.slice(0,ele.indexOf("\r\n\r\n")); 
        disposition = disposition.toString();
        let val = ele.slice(ele.indexOf("\r\n\r\n") + 4);
        if (disposition.indexOf("\r\n") == -1) {
            // 格式 Content-Disposition: form-data; name="user"
            val = val.toString();
            let name = disposition.split("; ")[1].split("=")[1];
            name = name.slice(1, name.length -1);
            data[name] = val;
        } else {
            // 格式 Content-Disposition: form-data; name="file"; filename="1.txt" Content-Type: text/plain
            let [line1, line2] = disposition.split("\r\n");
            let [,name, filename] = line1.split("; ");
            let type = line2.split(": ")[1];
            name = name.split("=")[1];
            name = name.substring(1, name.length - 1);
            filename = filename.split("=")[1];
            filename = filename.substring(1, filename.length - 1);
            // const uid = uuid().split("-").join("");
            const path = `upload/${uuid().replace(/\-/g, "")}`;
            fs.writeFile(path, val, err => {
                if (err) {
                    console.log("上传失败！", err);
                } else {
                    console.log("成功");
                    files[name] = {filename, path, type}
                    console.log(">>>forEach>>",files);
                }
            });
        }
    });
    // console.log("name<<<<<<<   val>>>>>", data);
    // console.log("formParse>>>>>", newArr.map(ele => ele.toString()));
}

module.exports = parse;