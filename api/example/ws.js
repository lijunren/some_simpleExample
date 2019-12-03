const websocket = require("ws");

const websocketServer = websocket.Server;

const wss = new websocketServer({
    port: 8089
});
const wssArr = [];
wss.on("connection", ws => {
    wssArr.push(ws);
    console.log(wssArr.length);
    ws.on("message", data => {
        console.log(`[SERVER] Received: ${data}`);
        ws.send(JSON.stringify({name: "msg2", data: "success"}), err => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    });
    const sendmessage = setInterval(() => {
        ws.send(JSON.stringify({name: "msg", data: "timer success"}), err => {
            if (err) {
                console.log(`[timer SERVER] error: ${err}`);
                // clearInterval(sendmessage);
            }
        });
    }, 1000);
    ws.on("close", () => {
        clearInterval(sendmessage);
    });
});