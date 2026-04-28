import { WebSocketServer, WebSocket } from "ws";


const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        socket.send("ping pong");

        const parsedData = message.toString();
        console.log(parsedData);
    })
})