import { Router } from "express";
import { addComment, deleteComment, getComments } from "../controller/comment.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import optionalAuth from "../middlewares/optionalAuth.js";

//mergeParams passes parent params to child route
const commentRouter: Router = Router({ mergeParams: true });

commentRouter.post("/:repo/issues/:issueId", isAuthenticated, addComment);

commentRouter.get("/:repo/issues/:issueId", optionalAuth, getComments);

commentRouter.delete("/:repo/issues/:issueId/:commentId", isAuthenticated, deleteComment);

export default commentRouter;