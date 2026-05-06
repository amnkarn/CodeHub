import type { Request, Response } from "express";
import { createIssueSchema, issueByIdSchema, issueParams } from "../validators/issueSchema.js";
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
    if(!userId) return;

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
    console.log("req reached to updateIssue")

}

export const deleteIssue = async (req: Request, res: Response) => {
    console.log("req reached to deleteIssue")

}


//own issues
export const getMyIssues = async (req: Request, res: Response) => {
    console.log("req reached to getMyIssues")

}

export const updateMyIssuesById = async (req: Request, res: Response) => {
    console.log("req reached to updateMyIssuesById")

}

export const deleteMyIssuesById = async (req: Request, res: Response) => {
    console.log("req reached to deleteMyIssuesById")

}