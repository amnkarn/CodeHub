import { Router } from "express";
import { 
    createRepository,
    deleteRepository,
    getRepositories,
    getRepositoryByFullName,
    getUserRepositories, 
    searchRepositories, 
    starRepository, 
    toggleRepositoryVisibility, 
    unstarRepository, 
    updateRepository
} from "../controller/repo.controller.js";

const repoRouter: Router = Router();


//repo operation
repoRouter.get("/", getRepositories);

repoRouter.post("/", createRepository);


// search repo
repoRouter.get("/search", searchRepositories);


//Operations for specific repo by owner and name
repoRouter.get("/:owner/:repo", getRepositoryByFullName);

repoRouter.put("/:owner/:repo", updateRepository);

repoRouter.delete("/:owner/:repo", deleteRepository);

repoRouter.patch("/:owner/:repo/visibility", toggleRepositoryVisibility);


// Social & Interaction (Stars)
repoRouter.post("/:owner/:repo/star", starRepository);

repoRouter.delete("/:owner/:repo/star", unstarRepository);


//Fetch all repos belonging to a username
repoRouter.get("/user/:username", getUserRepositories);


export default repoRouter;