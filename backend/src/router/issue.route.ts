import { Router } from "express";
import { 
    createIssue, 
    deleteIssue, 
    deleteMyIssuesById, 
    getAllIssuesByRepo, 
    getIssueById, 
    getMyIssues, 
    updateIssue, 
    updateMyIssuesById 
} from "../controller/issue.controller.js";


const issueRouter: Router = Router();

//user's issues
issueRouter.post("/:owner/:repo/issues", createIssue);

issueRouter.get("/:owner/:repo/issues", getAllIssuesByRepo);

issueRouter.get("/:owner/:repo/issues/:issueId", getIssueById);

issueRouter.patch("/:owner/:repo/issues/:issueId", updateIssue);

issueRouter.delete("/:owner/:repo/issues/:issueId", deleteIssue);


//my issues
issueRouter.get("/me", getMyIssues);

issueRouter.patch("/me/issues/:issueId", updateMyIssuesById);

issueRouter.delete("/me/issues/:issueId", deleteMyIssuesById);

export default issueRouter;