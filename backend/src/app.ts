import express, { type Application } from "express";
import userRouter from "./router/user.route.js";
import { WebSocketServer, WebSocket } from "ws";
const app: Application = express();
app.use(express.json());

const wss = new WebSocketServer({ port: 8080 });

app.get("/", (req, res) => {
    res.send("hii");
})

app.use("/api/v1/users", userRouter);

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        socket.send("ping pong");

        const parsedData = message.toString();
        console.log(parsedData);
    })
})


export default app;