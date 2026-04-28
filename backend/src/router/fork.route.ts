import { Router } from "express";
import { forkRepository, getForkedRepositories } from "../controller/forkRouter.controller.js";


const forkRouter: Router = Router();

forkRouter.post("/:owner/:repo/forks", forkRepository);

forkRouter.get("/:owner/:repo/forks", getForkedRepositories);

export default forkRouter;