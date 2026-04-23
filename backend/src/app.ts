import express, { type Application } from "express";
import userRouter from "./router/user.route.js";

const app: Application = express();
app.use(express.json());


app.get("/", (req, res) => {
    res.send("hii");
})

app.use("/api/v1/users", userRouter);


export default app;