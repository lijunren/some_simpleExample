/**
 * 在Buffer原型对象上添加split方法
 */
Buffer.prototype.split = Buffer.prototype.split || function(str) {
    const arr = [];
    // let initStr = this;
    let n = 0;
    while(this.indexOf(str, n) !== -1) {
        const end = this.indexOf(str, n);
        // console.log("srtring>>>>>>", this.slice(n, end).toString());
        arr.push(this.slice(n, end));
        n = end + str.length;
    }
    arr.push(this.slice(n));
    // console.log("initStr>>>>>", arr.map(ele => ele.toString()));
    return arr;
}