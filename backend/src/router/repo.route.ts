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
import isAuthenticated from "../middlewares/isAuthenticated.js";

const repoRouter: Router = Router();


//Public Operation
repoRouter.get("/", getRepositories);

repoRouter.get("/search", searchRepositories); //search repo

repoRouter.get("/user/:username", getUserRepositories); //all repos belonging to a username

repoRouter.get("/:owner/:repo", getRepositoryByFullName);

//get star repo's

//Operations for specific repo by owner and name
repoRouter.post("/", isAuthenticated, createRepository);

repoRouter.put("/:owner/:repo", isAuthenticated, updateRepository);

repoRouter.delete("/:owner/:repo", isAuthenticated, deleteRepository);

repoRouter.patch("/:owner/:repo/visibility", isAuthenticated, toggleRepositoryVisibility);

// Social & Interaction (Stars)
repoRouter.post("/:owner/:repo/star", isAuthenticated, starRepository);

repoRouter.delete("/:owner/:repo/star", isAuthenticated, unstarRepository);


export default repoRouter;