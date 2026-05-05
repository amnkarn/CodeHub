import { Router } from "express";
import { 
    createRepository,
    deleteRepository,
    getMyRepositories,
    getMyStarredRepos,
    getRepositoryByFullName,
    getUserRepositories, 
    getUserStarredRepos, 
    searchRepositories, 
    starRepository, 
    toggleRepositoryVisibility, 
    unstarRepository, 
    updateRepository
} from "../controller/repo.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const repoRouter: Router = Router();


repoRouter.post("/", isAuthenticated, createRepository);

repoRouter.get("/search", searchRepositories); //search all public repo(user pagination)

repoRouter.get("/me", isAuthenticated, getMyRepositories);

repoRouter.get("/me/starred", isAuthenticated, getMyStarredRepos);

repoRouter.get("/:username", getUserRepositories); //all repos of user

repoRouter.get("/:username/starred", getUserStarredRepos); // starred repos of a user



// user's specific repositories operations
repoRouter.get("/:owner/:repo", getRepositoryByFullName);

repoRouter.put("/:owner/:repo", isAuthenticated, updateRepository);

repoRouter.delete("/:owner/:repo", isAuthenticated, deleteRepository);

repoRouter.patch("/:owner/:repo/visibility", isAuthenticated, toggleRepositoryVisibility);


// Social & Interaction (Stars)
repoRouter.post("/:owner/:repo/star", isAuthenticated, starRepository);

repoRouter.delete("/:owner/:repo/star", isAuthenticated, unstarRepository);


export default repoRouter;