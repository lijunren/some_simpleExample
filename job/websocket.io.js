(function($){
    $.ws = new ws();
    function ws() {
        this.prototype = WebSocket.prototype;
    }
    ws.prototype.connect = function(path) {
        this.prototype = new WebSocket(path);
        return this;
    };
    ws.prototype.emit = function(name, ...data) {
        // console.log(this);
        this.prototype.send(JSON.stringify({name, data: [...data]}));
    };
    ws.prototype.on = function(name, callback) {
        if (name === "error") {
            this.prototype.onerror = function(err) {
                callback(JSON.stringify(err));
            }
            return;
        } else if (name === "open") {
            this.prototype.onopen = function(err) {
                callback(JSON.stringify(err));
            }
            return;
        } else if (name === "disconnect") {
            this.prototype.onclose = function(err) {
                callback(JSON.stringify(err));
            }
            return;
        }
        this.prototype.onmessage = function(res) {
            const data = JSON.parse(res.data);
            // console.log("onmessage", data);
            if (data.name === name) {
                callback(data.data);
            }
        }
    }
})(window)

