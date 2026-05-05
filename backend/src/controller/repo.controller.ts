import { response, type Request, type Response } from "express";
import { createRepoSchema, repoByNameSchema, updateRepoSchema, usernameParamSchema } from "../validators/repoSchema.js";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";


//Public Operations
export const searchRepositories = (req: Request, res: Response) => { //search repo's
    console.log("req reached");;
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
        res.send(500).json({
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
        let { name, description, visibility } = parsedBodyData.data;
        let updateData: any = {};

        if(name) {
            updateData.name = name;
        }
        if(description) {
            updateData.description = description;
        }
        if(visibility) {
            updateData.visibility = visibility;
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

export const deleteRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const toggleRepositoryVisibility = (req: Request, res: Response) => {
    console.log("req reached");;
}


// start and unstart the repo
export const starRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const unstarRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}


