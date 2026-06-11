import type { Request, Response } from "express";
import { createIssueSchema, issueByIdSchema, issueParams, issueUpdateSchema, OnlyIssueParams } from "../validators/issueSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";
import asyncHandler from "../utils/asyncHandler.js";
import { findRepoWithAccess } from "../utils/repoHelpers.js";
import { issueDetailSelect } from "../utils/prismaSelects.js";
import buildUpdateData from "../utils/buildUpdateData.js";


//user's issue's
export const createIssue = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = issueParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const parsedData = createIssueSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }

    const userId = req.user?.id;
    if(!userId) return;

    const ownerName = parsedParams.data.owner;
    const repo = parsedParams.data.repo;
    const { title, description } = parsedData.data;

    const targetRepo = await findRepoWithAccess(ownerName, repo, userId);
    if(!targetRepo) {
        return res.status(404).json({
            message: "Repository not found"
        })
    }

    const newIssue = await prismaClient.issue.create({
        data: {
            title,
            description,
            repoId: targetRepo.id,
            authorId: userId
        },
        select: issueDetailSelect
    })

    res.status(201).json({
        message: "Issue created successfully",
        newIssue
    })
});

export const getAllIssuesByRepo = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = issueParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;
    const owner = parsedParams.data.owner;
    const repo = parsedParams.data.repo;
    
    const allIssues = await prismaClient.issue.findMany({
        where: {
            repository: {
                name: repo,
                owner: {
                    username: owner
                },
                OR: [
                    { visibility: VISIBILITY.public },
                    { ownerId:  (userId as string) },
                ]
            },
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            author: { select: { username: true } },
            comments: {
                select: {
                    comment: true,
                    author: {
                        select: { username: true }
                    }
                }
            },
            createdAt: true
        }
    })

    if(allIssues.length === 0) {
        return res.status(200).json({
            message: "No issues or Repository is private"
        })
    }

    res.status(200).json({
        message: "Issues fetched successfully",
        allIssues
    })
});

export const getIssueById = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = issueByIdSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;
    const { owner, repo, issueId } = parsedParams.data;
    
    const issue = await prismaClient.issue.findFirst({
        where: {
            id: issueId,
            repository: {
                name: repo,
                owner: {
                    username: owner
                },
                OR: [
                    { visibility: VISIBILITY.public },
                    { ownerId:  (userId as string) },
                ]
            }
        },
        select: issueDetailSelect
    })

    if(!issue) {
        return res.status(404).json({
            message: "Can't find the repo"
        })
    }

    res.status(200).json({
        message: "Issue fetched successfully",
        issue
    })
});

export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) return;

    const parsedParams = issueByIdSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const parsedData = issueUpdateSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input data"
        })
    }

    const { issueId, owner, repo } = parsedParams.data;
    const { title, description, status } = parsedData.data;

    const updateData = buildUpdateData({ title, description, status }, res);
    if (!updateData) return;

    try {
        const updatedIssue = await prismaClient.issue.update({
            where: {
                id: issueId,
                repository: {
                    name: repo,
                    owner: {
                        username: owner
                    }
                },
                OR: [
                    { authorId: userId },
                    { repository: { owner: { username: owner } } }
                ]
            },
            data: updateData,
            select: issueDetailSelect
        })

        res.status(200).json({
            message: "Issue updated successfully",
            updateIssue: updatedIssue
        })
    } catch (error: any) {
        if(error.code === 'P2025') {
            return res.status(404).json({ message: "Issue not found or unauthorized" })
        }
        throw error;
    }
});

export const deleteIssue = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) return;

    const parsedParams = issueByIdSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const { issueId, owner, repo } = parsedParams.data;

    try {
        const deletedIssue = await prismaClient.issue.delete({
            where: {
                id: issueId,
                repository: {
                    name: repo,
                    owner: {
                        username: owner,
                        id: userId
                    }
                }
            }
        })
        if(!deletedIssue) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        res.status(200).json({
            message: "Issue deleted successfully",
            deleteIssue: deletedIssue
        })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Issue not found or unauthorized" })
        }
        throw error;
    }
});


//own issues
export const getMyIssues = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) return;

    const issuesAcrossAllRepos = await prismaClient.issue.findMany({
        where: {
            authorId: (userId as string)
        },
        select: {
            id: true,
            title: true,
            status: true,
            repository: {
                select: {
                    name: true,
                    owner: {
                        select: { username: true }
                    }
                }
            },
            createdAt: true
        }
    })
    
    if(!issuesAcrossAllRepos) {
        return res.status(404).json({
            message: "You haven't created any issue"
        })
    }

    res.status(200).json({
        message: "Issues find successfully",
        issuesAcrossAllRepos
    })
});

export const updateMyIssuesById = asyncHandler(async (req: Request, res: Response) => {
    const parseIssueParams = OnlyIssueParams.safeParse(req.params);
    if(!parseIssueParams.success) {
        return res.status(400).json({
            message: "Invalid issue id"
        })
    }

    const userId = req.user?.id;
    if(!userId) return;

    const parsedData = issueUpdateSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input data"
        })
    }

    const { title, description, status } = parsedData.data;

    const updateData = buildUpdateData({ title, description, status }, res);
    if (!updateData) return;

    try {
        const updatedIssue = await prismaClient.issue.update({
            where: {
                id: parseIssueParams.data.issueId,
                authorId: userId
            },
            data: updateData,
            select: issueDetailSelect
        })

        res.status(200).json({
            message: "Issue updated successfully",
            updateIssue: updatedIssue
        })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Issue not found" })
        }
        throw error;
    }
});
