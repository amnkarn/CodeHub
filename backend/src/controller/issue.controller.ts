import type { Request, Response } from "express";
import { createIssueSchema, issueByIdSchema, issueParams, issueUpdateSchema, OnlyIssueParams } from "../validators/issueSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";


//user's issue's
export const createIssue = async (req: Request, res: Response) => {
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
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const ownerName = parsedParams.data.owner;
        const repo = parsedParams.data.repo;
        const { title, description } = parsedData.data;

        //find the repo
        const targetRepo = await prismaClient.repository.findFirst({
            where: {
                name: repo,
                owner: {
                    username: ownerName
                },
                OR: [
                    { visibility: VISIBILITY.public },
                    { ownerId: userId } //owner can create issue on private repo's
                ]
            }
        })
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
                //statue is default 'open'
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                repository: { select: { name: true } },
                author: { select: { username: true } },
                createdAt: true
            }
        })

        res.status(201).json({
            message: "Issue created successfully",
            newIssue
        })

    } catch (error) {
        console.log("Error in createIssue: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getAllIssuesByRepo = async (req: Request, res: Response) => {
    const parsedParams = issueParams.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;

    try {
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
                        //if user is loged in and repo is private then also show issues
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

    } catch (error) {
        console.log("Error in getAllIssuesByRepo: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getIssueById = async (req: Request, res: Response) => {
    const parsedParams = issueByIdSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;

    try {
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
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                repository: { select: { name: true } },
                author: { select: { username: true } },
                createdAt: true
            }
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

    } catch (error) {
        console.log("Error in getIssueById: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const updateIssue = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

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

    try {
        const { issueId, owner, repo } = parsedParams.data;
        let updateData: any = {};

        const { title, description, status } = parsedData.data;
        if(title) {
            updateData.title = title;
        }
        if(description) {
            updateData.description = description;
        }
        if(status) {
            updateData.status = status;
        }

        if(Object.keys(updateData).length === 0) { //empty body handling
            return res.status(400).json({
                message: "Nothing to update"
            })
        }

        const updateIssue = await prismaClient.issue.update({
            where: {
                id: issueId,
                repository: {
                    name: repo,
                    owner: {
                        username: owner
                    }
                },
                OR: [ //author and repo owner both can update the issue
                    { authorId: userId },
                    { repository: { owner: { username: owner } } }
                ]
            },
            data: updateData,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                repository: { select: { name: true } },
                author: { select: { username: true } },
                createdAt: true
            }
        })

        res.status(200).json({
            message: "Issue updated successfully",
            updateIssue
        })

    } catch (error: any) {
        if(error.code === 'P2025') {
            return res.status(404).json({ message: "Issue not found or unauthorized" })
        }
        res.status(500).json({ message: "Error in server" })
    }
}

export const deleteIssue = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const parsedParams = issueByIdSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    try {
        const { issueId, owner, repo } = parsedParams.data;

        //only repo owner can delete the issue
        const deleteIssue = await prismaClient.issue.delete({
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
        if(!deleteIssue) {
            return res.status(400).json({
                message: "Something went wrong"
            })
        }

        res.status(200).json({
            message: "Issue deleted successfully",
            deleteIssue
        })

    } catch (error: any) {
        console.log("Error in deleteIssue: ", error);
        res.status(500).json({ message: "Error in server" })
    }
}


//own issues
export const getMyIssues = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
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
        
    } catch (error) {
        console.log("Error in getMyIssues: ", error);
        res.status(400).json({
            message: "Error in server"
        })
    }
}

export const updateMyIssuesById = async (req: Request, res: Response) => {
    const parseIssueParams = OnlyIssueParams.safeParse(req.params);
    if(!parseIssueParams.success) {
        return res.status(400).json({
            message: "Invalid issue id"
        })
    }

    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const parsedData = issueUpdateSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid input data"
        })
    }

    try {
        let updateData: any = {};

        const { title, description, status } = parsedData.data;
        if(title) {
            updateData.title = title;
        }
        if(description) {
            updateData.description = description;
        }
        if(status) {
            updateData.status = status;
        }

        if(Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            })
        }


        const updateIssue = await prismaClient.issue.update({
            where: {
                id: parseIssueParams.data.issueId,
                authorId: userId
            },
            data: updateData,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                repository: { select: { name: true } },
                author: { select: { username: true } },
                createdAt: true
            }
        })

        res.status(200).json({
            message: "Issue updated successfully",
            updateIssue
        })

    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Issue not found" })
        }
        console.log("Error in updateMyIssuesById: ", error);
        res.status(500).json({ message: "Error in server" })
    }
}