import { type Request, type Response } from "express";
import { createRepoSchema, repoByNameSchema, searchSchema, toggleVisibilitySchema, updateRepoSchema, usernameParamSchema } from "../validators/repoSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";
import asyncHandler from "../utils/asyncHandler.js";
import { repoListItemSelect, repoSummarySelect } from "../utils/prismaSelects.js";
import { verifyRepoOwner } from "../utils/repoHelpers.js";
import buildUpdateData from "../utils/buildUpdateData.js";


//Public Operations
export const searchRepositories = asyncHandler(async (req: Request, res: Response) => {
    const parseParamsInput = searchSchema.safeParse(req.query);
    if(!parseParamsInput.success) {
        return res.status(400).json({
            message: "Query is invalid"
        })
    }

    const userInput = parseParamsInput.data.input;

    const result = await prismaClient.repository.findMany({
        where: {
            visibility: VISIBILITY.public,
            OR: [
                { name: { contains: userInput, mode: 'insensitive' } },
                { description: { contains: userInput, mode: 'insensitive' } },
            ]
        },
        select: {
            name: true,
            description: true,
            visibility: true,
            owner: {
                select: {
                    username: true
                }
            },
            _count: {
                select: {
                    staredBy: true,
                    fork: true
                }
            },
            createdAt: true
        }
    })
    if(result.length === 0) {
        return res.status(200).json({
            message: `There is nothing with name ${userInput}`
        })
    }

    res.status(200).json({
        message: "Repo's find successfully",
        result
    })
});

export const getUserRepositories = asyncHandler(async (req: Request, res: Response) => {
    const parsedResponse = usernameParamSchema.safeParse(req.params);
    if(!parsedResponse.success) {
        return res.status(400).json({
            message: "username is missing"
        })
    }

    const username = parsedResponse.data.username;

    const userAllRepos = await prismaClient.user.findUnique({
        where: { username: username },
        select: {
            repositories: {
                where: { visibility: VISIBILITY.public },
                select: {
                    name: true,
                    description: true,
                    visibility: true,
                    _count: {
                        select: {
                            staredBy: true,
                            fork: true,
                            issues: true
                        }
                    },
                    updatedAt: true
                }
            }
        }
    })
    if(!userAllRepos) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "Repository fetched successfully",
        userAllRepos
    })
});

export const getUserStarredRepos = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = usernameParamSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }

    const username = parsedParams.data.username;
    const userStaredRepos = await prismaClient.user.findUnique({
        where: { username: username },
        select: {
            starRepos: {
                where: { visibility: VISIBILITY.public },
                select: repoSummarySelect
            }
        }
    })

    res.status(200).json({
        message: "Starred repos fetched successfully",
        userStaredRepos
    })
});

//return's single repo using repo name 
export const getRepositoryByFullName = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const userRepo = await prismaClient.user.findFirst({
        where: { 
            username: owenrname, 
        },
        select: {
            repositories: {
                where: {
                    name: repoName,
                    visibility: VISIBILITY.public
                },
                select: repoSummarySelect
            }
        }
    })

    if(userRepo?.repositories.length === 0) {
        return res.status(200).json({
            message: "User doesn't have any repo with this name"
        })
    }

    res.status(200).json({
        message: "Repository searched successfully",
        userRepo
    })
});


//Authenticated Operations
export const getMyRepositories = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const userReopos = await prismaClient.user.findUnique({
        where: { id: (userId as string) },
        select: {
            repositories: {
                select: repoListItemSelect
            }
        }
    })
    
    res.status(200).json({
        message: "User's all repositories fetched successfully",
        userReopos
    })
});

export const getMyStarredRepos = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const userStarredReopos = await prismaClient.user.findUnique({
        where: { id: (userId as string) },
        select: {
            starRepos: {
                select: repoSummarySelect
            }
        }
    })
    
    res.status(200).json({
        message: "User's all starred repositories fetched successfully",
        userStarredReopos
    })
});

export const createRepository = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const parsedData = createRepoSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect input"
        })
    }

    const { name, description, visibility } = parsedData.data;
    const repo = await prismaClient.repository.create({
        data: {
            name,
            description,
            visibility,
            ownerId: (userId as string)
        }
    })

    res.status(201).json({
        message: "Repository created successfully",
        repo
    })
});

export const updateRepository = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const parsedBodyData = updateRepoSchema.safeParse(req.body);
    if(!parsedBodyData.success) {
        return res.status(400).json({
            message: "please enter the correct value"
        })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const owner = await verifyRepoOwner(owenrname, req, res);
    if (!owner) return;

    const { name, description } = parsedBodyData.data;
    const updateData = buildUpdateData({ name, description }, res);
    if (!updateData) return;

    const updateRepo = await prismaClient.repository.update({
        where: {
            name_ownerId: {
                name: repoName,
                ownerId: owner.id
            }
        },
        data: updateData
    })

    res.status(200).json({
        message: "Repository updated successfully",
        updateRepo
    })
});

export const deleteRepository = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const owner = await verifyRepoOwner(owenrname, req, res);
    if (!owner) return;

    try {
        const deleteRepo = await prismaClient.repository.delete({
            where: {
                name_ownerId: {
                    name: repoName,
                    ownerId: owner.id
                }
            }
        })

        res.status(200).json({
            message: "Repository deleted successfully",
            deleteRepo
        })
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "Repo not found" })
        }
        throw error
    }
});

export const toggleRepositoryVisibility = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const visibility =  toggleVisibilitySchema.safeParse(req.body);
    console.log(visibility)
    if(!visibility.success) {
        return res.status(400).json({
            message: "Invalid body data"
        })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const owner = await verifyRepoOwner(owenrname, req, res);
    if (!owner) return;

    const visibilityData = visibility.data.visibility;

    await prismaClient.repository.update({
        where: {
            name_ownerId: {
                name: repoName,
                ownerId: owner.id
            }
        },
        data: {
            visibility: visibilityData
        } 
    })

    res.status(200).json({
        message: `Repository is now ${visibilityData}`
    })
});


// star and unstar the repo
export const starRepository = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const userId = req.user?.id;
    if(!userId) {
        return res.status(400).json({ message: "Can't find user's id" })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const targetRepo = await prismaClient.repository.findFirst({
        where: {
            name: repoName,
            owner: {
                username: owenrname,
            }
        },
        select: {
            id: true,
            ownerId: true,
            staredBy: {
                where: { id: userId },
                select: { id: true }
            }
        }
    })

    if(!targetRepo) {
        return res.status(404).json({
            message: "Repo not found"
        })
    }

    if(targetRepo.staredBy.length > 0) {
        return res.status(400).json({
            message: "Already starred this repo"
        })
    }

    await prismaClient.user.update({
        where: { id: userId },
        data: {
            starRepos: {
                connect: {
                    id: targetRepo.id
                }
            }
        }
    })

    res.status(200).json({
        message: "Successfully added to starred"
    })
});

export const unstarRepository = asyncHandler(async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    const userId = req.user?.id;
    if(!userId) {
        return res.status(400).json({ message: "Can't find user's id" })
    }

    const owenrname = parseNames.data.owner;
    const repoName = parseNames.data.repo;

    const targetRepo = await prismaClient.repository.findFirst({
        where: {
            name: repoName,
            owner: {
                username: owenrname
            }
        },
        select: {
            id: true,
            ownerId: true,
            staredBy: {
                where: { id: userId },
                select: { id: true }
            }
        }
    })

    if(!targetRepo) {
        return res.status(400).json({
            message: "Repo not found"
        })
    }
    if(targetRepo.staredBy.length === 0) {
        res.status(400).json({
            message: "You haven't starred this repo"
        })
    }

    await prismaClient.user.update({
        where: {
            id: userId
        },
        data: {
            starRepos: {
                disconnect: {
                    id: targetRepo.id
                }
            }
        }
    })


    res.status(200).json({
        message: "successfully removed from starred list"
    })
});
