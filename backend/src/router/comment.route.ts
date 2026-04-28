import { Router } from "express";
import { addComment, deleteComment, getComments } from "../controller/comment.controller.js";

const commentRouter: Router = Router();

commentRouter.post("/:owner/:repo/issues/:issueId/comments", addComment);

commentRouter.get("/:owner/:repo/issues/:issueId/comments", getComments);

commentRouter.delete("/:owner/:repo/issues/:issueId/comments/:commentId", deleteComment);

export default commentRouter;