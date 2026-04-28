import express, { type Application } from "express";
import userRouter from "./router/user.route.js";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors());


app.get("/", async (req, res) => {
    res.send("hii");
})

app.use("/api/v1/users", userRouter);


export default app;