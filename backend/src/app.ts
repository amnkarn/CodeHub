import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "./router/index.route.js";


const app: Application = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: "*" }));


app.get("/", async (req, res) => {
    res.send("hii");
})

app.use("/api/v1", indexRouter);


export default app;