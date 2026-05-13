import { Router } from "express";
import { forkRepository, getForkedRepositories } from "../controller/forkRouter.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";


const forkRouter: Router = Router();

forkRouter.post("/:owner/:repo/forks", isAuthenticated, forkRepository);

forkRouter.get("/:owner/:repo/forks", getForkedRepositories);

export default forkRouter;