import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "./router/index.route.js";
import cookiParser from "cookie-parser";

const app: Application = express();

app.use(cors({ 
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiParser());
app.use(morgan('dev'));


app.get("/", async (req, res) => {
    res.send("hii");
})

app.use("/api/v1", indexRouter);


export default app;