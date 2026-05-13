import type { Request, Response } from "express";
import { forkParamsSchema } from "../validators/forkSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";
import { s3, S3_BUCKET } from "../config/aws.config.js";
import { CopyObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import copyRepoFiles from "../utils/copyRepoFiles.js";



export const forkRepository = async (req: Request, res: Response) => {
    const parsedParams = forkParamsSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    const userId = req.user?.id;
    if(userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const ownerName = parsedParams.data.owner;
        const repoName = parsedParams.data.repo;

        const targetRepo = await prismaClient.repository.findFirst({
            where: {
                name: repoName,
                owner: {
                    username: ownerName
                },
                OR: [
                    { visibility: VISIBILITY.public },
                    { ownerId: (userId as string) }
                ]
            }
        })

        if(!targetRepo) {
            return res.status(400).json({
                message: "Repository not found"
            })
        }
        
        //can't fork own repo
        if(targetRepo.ownerId == userId) {
            return res.status(400).json({
                message: "Can't fork your own repo"
            })
        }

        //already forked
        const alreadyForked = await prismaClient.fork.findUnique({
            where: {
                sourceCodeRepoId_forkedById: {
                    sourceCodeRepoId: targetRepo.id,
                    forkedById: (userId as string)
                }
            }
        })

        if(alreadyForked) {
            return res.status(400).json({
                message: "You already forked this repo"
            })
        }

        const fork = await prismaClient.fork.create({
            data: {
                sourceCodeRepoId: targetRepo.id,
                forkedById: userId!
            },
            select: {
                id: true,
                sourceCode: {
                    select: {
                        name: true,
                        owner: {
                            select: { username: true }
                        }
                    }
                },
                forkedBy: {
                    select: {
                        username: true
                    }
                },
                createdAt: true
            }
        })

        //copy s3 files
        await copyRepoFiles(targetRepo.id, (userId as string));

        res.status(201).json({
            message: "Repository forked successfully"
        })
        
    } catch (error: any) {
        if(error.code == 'P2002') {
            return res.status(400).json({
                message: "Already forked"
            })
        }

        console.log("Error in forkRepository: ", error);
        res.status(500).json({
            message: "Something went wrong in server"
        })
    }
}

export const getForkedRepositories = async (req: Request, res: Response) => {
    const parsedParams = forkParamsSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
        })
    }

    try {
        const ownerName = parsedParams.data.owner;
        const repoName = parsedParams.data.repo;

        
        
    } catch (error) {
        console.log("Error in getForkedRepositories: ", error);
        res.status(500).json({
            message: "Something went wrong in Server"
        })
    }
}