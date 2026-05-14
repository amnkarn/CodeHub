import type { Request, Response } from "express";
import { forkParamsSchema } from "../validators/forkSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";
import copyRepoFilesInS3 from "../utils/copyRepoFiles.js";


export const forkRepository = async (req: Request, res: Response) => {
    const parsedParams = forkParamsSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid parameters"
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

        //**create new repository
        
        //if name conflicts,then add '-fork' in the last of the new forked repo name
        const nameConflict = await prismaClient.repository.findUnique({
            where: {
                name_ownerId: {
                    name: targetRepo.name,
                    ownerId: userId
                }
            }
        })

        const forkedRepoName = nameConflict ? `${targetRepo.name}-fork` : targetRepo.name;

        const newRepo = await prismaClient.repository.create({
            data: {
                name: forkedRepoName,
                description: targetRepo.description,
                visibility: VISIBILITY.public,
                ownerId: userId
            }
        })

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

        //copy s3 files * * *
        const forkRepoId =  await copyRepoFilesInS3(targetRepo.id, (userId as string));

        res.status(201).json({
            message: "Repository forked successfully",
            fork,
            forkRepoId,
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

        const repo = await prismaClient.repository.findFirst({
            where: {
                name: repoName,
                owner: {
                    username: ownerName,
                },
                visibility: VISIBILITY.public
            },
            select: {
                id: true
            }
        })
        
        if(!repo) {
            return res.status(400).json({
                message: "Repository not found"
            })
        }

        const forks = await prismaClient.fork.findMany({
            where: {
                sourceCodeRepoId: repo.id
            },
            select: {
                id: true,
                forkedBy: {
                    select: {
                        username: true,
                        name: true
                    }
                },
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            message: "Forks fetched successfully",
            totalLength: forks.length,
            forks
        })
        
    } catch (error) {
        console.log("Error in getForkedRepositories: ", error);
        res.status(500).json({
            message: "Something went wrong in Server"
        })
    }
}