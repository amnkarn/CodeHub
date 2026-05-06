import { type Request, type Response } from "express";
import { createRepoSchema, repoByNameSchema, searchSchema, toggleVisibilitySchema, updateRepoSchema, usernameParamSchema } from "../validators/repoSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";


//Public Operations
export const searchRepositories = async (req: Request, res: Response) => { //search repo's
    const parseParamsInput = searchSchema.safeParse(req.query);
    if(!parseParamsInput.success) {
        return res.status(400).json({
            message: "Query is invalid"
        })
    }

    try {
        const userInput = parseParamsInput.data.input;

        const result = await prismaClient.repository.findMany({
            where: {
                visibility: VISIBILITY.public, //should be public
                OR: [
                    { name: { contains: userInput, mode: 'insensitive' } },
                    { description: { contains: userInput, mode: 'insensitive' } },
                    //{
                    //    issues: {
                    //        some: {
                    //            OR: [
                    //                {
                    //                    title: {
                    //                        contains: userInput,
                    //                        mode: 'insensitive'
                    //                    },
                    //                },
                    //                {
                    //                    description: {
                    //                        contains: userInput,
                    //                        mode: 'insensitive'
                    //                    }
                    //                }
                    //            ]
                    //        },
                    //    }
                    //}
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
        
    } catch (error) {
        console.log("Error in searchRepositories: ", error);
        res.status(500).json({
            message: "Error in repositories searching"
        })
    }

}

export const getUserRepositories = async (req: Request, res: Response) => { //all repos of user
    const parsedResponse = usernameParamSchema.safeParse(req.params);
    if(!parsedResponse.success) {
        return res.status(400).json({
            message: "username is missing"
        })
    }

    try {
        const username = parsedResponse.data.username;

        const userAllRepos = await prismaClient.user.findUnique({
            where: { username: username },
            select: {
                repositories: {
                    where: { visibility: VISIBILITY.public }, //if visibility is public then show only
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
        
    } catch (error) {
        console.log("Error in getUserRepository: ", error);
        res.status(500).json({
            message: "Something wrong in server"
        })
    }
}

export const getUserStarredRepos = async (req: Request, res: Response) => { //show only publilc stared repo
    const parsedParams = usernameParamSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Something is missing",
        })
    }

    try {
        const username = parsedParams.data.username;
        const userStaredRepos = await prismaClient.user.findUnique({
            where: { username: username },
            select: {
                starRepos: {
                    where: { visibility: VISIBILITY.public },
                    select: {
                        name: true,
                        description: true,
                        _count: {
                            select: {
                                staredBy: true,
                                fork: true,
                                issues: true
                            }
                        },
                        updatedAt: true,
                    }
                }
            }
        })

        res.status(200).json({
            message: "Starred repos fetched successfully",
            userStaredRepos
        })

    } catch (error) {
        console.log("Error in getUserStarredRepos: ", error);
        res.status(500).json({
            message: "Something wrong in server"
        })
    }
}

//return's single repo using repo name 
export const getRepositoryByFullName = async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    try {
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
                        visibility: VISIBILITY.public //return only public repo's
                    },
                    select: {
                        name: true,
                        description: true,
                        _count: {
                            select: {
                                staredBy: true,
                                fork: true,
                                issues: true
                            }
                        },
                        createdAt: true,
                        updatedAt: true,
                    }
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

    } catch (error) {
        console.log("Error in getRepositoryByFullName: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


//Authenticated Operations
export const getMyRepositories = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const userReopos = await prismaClient.user.findUnique({
            where: { id: (userId as string) },
            select: {
                repositories: {
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
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })
        
        res.status(200).json({
            message: "User's all repositories fetched successfully",
            userReopos
        })
        
    } catch (error) {
        console.log("Error in getMyRepositories: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getMyStarredRepos = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const userStarredReopos = await prismaClient.user.findUnique({
            where: { id: (userId as string) },
            select: {
                starRepos: {
                    select: {
                        name: true,
                        description: true,
                        _count: {
                            select: {
                                staredBy: true,
                                fork: true,
                                issues: true
                            }
                        },
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })
        
        res.status(200).json({
            message: "User's all starred repositories fetched successfully",
            userStarredReopos
        })
        
    } catch (error) {
        console.log("Error in getMyStarredRepos: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const createRepository = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const parsedData = createRepoSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect input"
        })
    }

    try {
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
        
    } catch (error) {
        console.log("Error in createRepo: ", error);
        res.status(500).json({
            message: "Something wrong in server"
        })
    }
}

export const updateRepository =async (req: Request, res: Response) => {
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

    try {
        const owenrname = parseNames.data.owner;
        const repoName = parseNames.data.repo;

        // create the update object
        let { name, description } = parsedBodyData.data;
        let updateData: any = {};

        if(name) {
            updateData.name = name;
        }
        if(description) {
            updateData.description = description;
        }

        //find the owner id
        const owner = await prismaClient.user.findUnique({
            where: { username: owenrname }
        })

        if(!owner) {
            return res.status(404).json({
                message: "Owner not found"
            })
        }
        if (owner.id !== req.user?.id) {
            return res.status(403).json({ 
                message: "You are not the owner of this repo" 
            })
        }
        if(Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            })
        }

        const updateRepo = await prismaClient.repository.update({
            where: {
                //repo name in user's account is unique,
                //so find using it
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

    } catch (error) {
        console.log("Error in updateRepository: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const deleteRepository = async (req: Request, res: Response) => {
    const parseNames = repoByNameSchema.safeParse(req.params);
    if(!parseNames.success) {
        return res.status(400).json({
            message: "please provide the correct parameters"
        })
    }

    try {
        const owenrname = parseNames.data.owner;
        const repoName = parseNames.data.repo;

        //find the owner id
        const owner = await prismaClient.user.findUnique({
            where: { username: owenrname }
        })

        if(!owner) {
            return res.status(404).json({
                message: "Owner not found"
            })
        }
        if (owner.id !== req.user?.id) {
            return res.status(403).json({ 
                message: "You are not the owner of this repo" 
            })
        }

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
        console.log("Error in deleteRepository: ", error);
        if (error.code === 'P2025') { //Prisma's "record not found" error code
            return res.status(404).json({ message: "Repo not found" })
        }
        throw error
    }
}

export const toggleRepositoryVisibility = async (req: Request, res: Response) => {
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

    try {
        const owenrname = parseNames.data.owner;
        const repoName = parseNames.data.repo;

        //find the owner id
        const owner = await prismaClient.user.findUnique({
            where: { username: owenrname }
        })

        if(!owner) {
            return res.status(404).json({
                message: "Owner not found"
            })
        }
        if (owner.id !== req.user?.id) {
            return res.status(403).json({ 
                message: "You are not the owner of this repo" 
            })
        }

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
        
    } catch (error) {
        console.log("Error in toggleRepositoryVisibility: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


// start and unstart the repo
export const starRepository = async (req: Request, res: Response) => {
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

    //add this owner's repo in logged in user's starred array
    try {
        const owenrname = parseNames.data.owner;
        const repoName = parseNames.data.repo;

        const targetRepo = await prismaClient.repository.findFirst({
            where: {
                //match the repo and owner's name
                name: repoName,
                owner: {
                    username: owenrname,
                }
            },
            select: {
                id: true,
                ownerId: true,
                staredBy: {
                    where: { id: userId }, //starred by the logged in user
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

        await prismaClient.user.update({ //add
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

    } catch (error) {
        console.log("Error in startRepository: ", error);
        res.status(500).json({
            message: "Can't add this repo in starred list, Error in server"
        })
    }

}

export const unstarRepository = async (req: Request, res: Response) => {
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

    try {
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

    } catch (error) {
        console.log("Error in unstarRepository: ", error);
        res.status(500).json({
            message: "Can't unstar the repo, Error in server"
        })
    }

}