import { Router } from "express";
import userRouter from "./user.route.js";
import repoRouter from "./repo.route.js";
import issueRouter from "./issue.route.js";
import authRouter from "./auth.route.js";
import commentRouter from "./comment.route.js";
import forkRouter from "./fork.route.js";

const indexRouter: Router = Router();

indexRouter.use("/auth", authRouter);

indexRouter.use("/user", userRouter);

indexRouter.use("/repo", repoRouter);

indexRouter.use("/issue", issueRouter);

indexRouter.use("/repo/:owner", commentRouter);

indexRouter.use("/fork", forkRouter);

export default indexRouter;