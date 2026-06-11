import type { Request, Response } from "express";
import { addCommentParams, addCommentSchema, deleteCommentParams } from "../validators/commentSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";
import asyncHandler from "../utils/asyncHandler.js";
import { commentDetailSelect } from "../utils/prismaSelects.js";


export const addComment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) {
        return res.status(400).json({
            message: "can't find the user account"
        })
    }

    const parsedParams = addCommentParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "wrong id, please enter the correct id"
        })
    }

    const parseData = addCommentSchema.safeParse(req.body);
    if(!parseData.success) {
        return res.status(400).json({
            message: "give the input in correct formate"
        })
    }

    const { repo, owner, issueId } = parsedParams.data;

    const targetRepo = await prismaClient.repository.findFirst({
        where: {
            name: repo,
            owner: {
                username: owner
            }
        },
        select: {
            id: true
        }
    })
    
    if(!targetRepo) {
        return res.status(400).json({
            message: "Can't find the repo"
        })
    }

    const newComment = await prismaClient.comments.create({
        data: {
            comment: parseData.data.comment,
            authorId: userId,
            issueId: issueId,
            repoId: targetRepo.id
        },
        select: commentDetailSelect
    })

    return res.status(201).json({
        message: "Comment added successfully",
        addComment: newComment
    })
});

export const getComments = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = addCommentParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "wrong id, please enter the correct id"
        })
    }
    
    const userId = req.user?.id;
    const { repo, owner, issueId } = parsedParams.data;

    const allComments = await prismaClient.comments.findMany({
        where: {
            issueId: issueId,
            repo: {
                name: repo,
                owner: {
                    username: owner
                },
                OR: [
                    { visibility: VISIBILITY.public },
                    { ownerId: (userId as string) }
                ]
            }
        },
        select: commentDetailSelect
    })

    if(allComments.length === 0) {
        return res.status(200).json({
            message: "No comments on this issue yet"
        })
    }

    return res.status(200).json({
        message: "Comment fetched successfully",
        allComments
    })
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = deleteCommentParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({
            message: "User must be logged in"
        })
    }

    const { owner, repo, issueId, commentId } = parsedParams.data;

    try {
        await prismaClient.comments.delete({
            where: {
                id: commentId,
                repo: {
                    name: repo,
                    owner: {
                        username: owner
                    }
                },
                issueId: issueId,
                OR: [
                    { authorId: userId },
                    {
                        repo: {
                            owner: { username: owner }
                        }
                    }   
                ]
            }
        })

        res.status(200).json({
            message: "Comment removed successfully"
        })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Comment not found or unauthorized" })
        }
        throw error;
    }
});
