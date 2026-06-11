import type { Request, Response } from "express";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import blackListToken from "../utils/blacklistToken.js";
import type { jwtPayload } from "../utils/generateToken.js";
import { userUpdateSchema } from "../validators/userSchema.js";
import { getUserParamsSchema } from "../validators/userSchema.js";
import { getTargetQuerySchema } from "../validators/userSchema.js";

//User Profile Management (User Controller)
export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.id; //from cookies
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorised"
        })
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                createdAt: true,
                _count: { //return counts instead of full data
                    select: {
                        followedBy: true,
                        following: true,
                        starRepos: true,
                        issues: true,
                        forks: true
                    }
                }
            }
        })

        res.status(200).json({
            message: "user fetched succefully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server is failed"
        })
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const parsedData = userUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong"
        })
    }

    try {
        //can change username, email, password
        const updateData: any = {};
        const { username, email, name, password } = parsedData.data;

        if (username) {
            //check username availability
            const user = await prismaClient.user.findUnique({
                where: {
                    username: username
                }
            })
            if (user) {
                return res.status(404).json({
                    message: `Username ${username} is not available. Please choose another`
                })
            }

            updateData.username = username;
        }
        if(email) {
            //cheak avilability
            const user = await prismaClient.user.findUnique({
                where: {email: email}
            })
            if(user) {
                return res.status(404).json({
                    message: `Email ${email} is already in use. Please choose another`
                })
            }

            updateData.email = email;
        }
        if (password) {
            const pass = password;
            const salt = await bcrypt.genSalt(5);
            const hash = await bcrypt.hash(pass, salt);

            updateData.password = hash;
        }
        if(name) {
            updateData.name = name;
        }

        if(Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Nothing to update"
            })
        }

        const updateUser = await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        })

        res.status(200).json({
            message: "your profile is updated successfully",
            updateUser
        })

    } catch (err) {
        console.log("Can't update the profile: ", err)

        res.status(500).json({
            message: "Error in server",
        })
    }
}

export const deleteUserProfile = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    const userId = req.user?.id; //from cookies
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const user = await prismaClient.user.delete({
            where: {
                id: userId
            }
        })

        const decodeRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwtPayload;
        const decodeAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwtPayload;

        //blacklist both tokens
        await blackListToken(decodeRefreshToken.jti, 604800);
        await blackListToken(decodeAccessToken.jti, 900);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");


        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch (err) {
        console.log("Error in delete controller: ", err);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getMyFollowers = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        //following me
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                followedBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        name: true,
                        createdAt: true
                    }
                }
            }
        })

        res.status(200).json({
            user
        })

    } catch (error) {
        console.log("Error in getMyFollowers: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getMyFollowing = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                id: userId
            },
            select: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        name: true,
                        createdAt: true
                    }
                }
            }
        })

        res.status(200).json({
            user
        })

    } catch (error) {
        console.log("Error in getMyFollowing: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


//Public profile controller
export const getUserByUsername = async (req: Request, res: Response) => {
    const result = getUserParamsSchema.safeParse(req.params);
    if(!result.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    const { username } = result.data;

    try {
        const user = await prismaClient.user.findUnique({
            where: {
                username: username
            },
            select: {
                username: true,
                email: true,
                name: true,
                createdAt: true,
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                followedBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                starRepos: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                issues: {
                    select: {
                        id: true,
                        title: true,
                        status: true
                    }
                },
                repositories: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        visibility: true,
                    }
                },
                forks: true,
            }
        })
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "User found succeesfully",
            user
        })

    } catch (error) {
        console.log("Error in finding uesr: ", error);
        res.status(500).json({
            message: "Can't searrch the profile"
        })
    }
}

export const getUserFollowers = async (req: Request, res: Response) => {
    const parsedParams = getUserParamsSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    try {
        const username = parsedParams.data.username;

        const userFollowers = await prismaClient.user.findUnique({
            where: {
                username: username as string
            },
            select: {
                followedBy: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                }
            }
        })
        if(!userFollowers) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            userFollowers
        })

    } catch (error) {
        console.log("Error in getUserFollowers: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getUserFollowing = async (req: Request, res: Response) => {
    const params = getUserParamsSchema.safeParse(req.params);
    if(!params.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    const username = params.data.username;

    try {
        const userFollowing = await prismaClient.user.findUnique({
            where: {
                username: username as string
            },
            select: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        name: true,
                        createdAt: true
                    }
                }
            }
        })
        if(!userFollowing) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            userFollowing
        })

    } catch (error) {
        console.log("Error in getUserFollowing: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


//Follow and Unfollow user's
export const followUser = async (req: Request, res: Response) => {
    const query = getTargetQuerySchema.safeParse(req.query);
    if(!query.success) {
        return res.status(400).json({
            message: "Invalid query params"
        })
    }
    
    const targetUsername = query.data.target;
    const userId = req.user?.id;

    if (!targetUsername || !userId) {
        return res.status(400).json({
            message: "Missing required info"
        })
    }

    try {
        //search and verify targetUsername
        const targetUser = await prismaClient.user.findUnique({
            where: { username: targetUsername },
            select: { id: true }
        })
        if (!targetUser) {
            return res.status(404).json({
                message: "Invalid user"
            })
        }

        const targetUserId = targetUser.id;
        if(targetUserId === userId) {
            return res.status(400).json({
                message: "You can't follow yourself"
            })
        }

        const alreadyFollowing = await prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    where: { id: targetUserId },
                    select: { id: true }
                }
            }
        })

        if((alreadyFollowing?.following?.length ?? 0) > 0) {
            return res.status(400).json({
                message: "Already following this user"
            })
        }

        await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                following: {
                    connect: { //connect: Adds a user to the list.
                        id: targetUserId
                    }
                }
            }
        })

        return res.json({ message: "User followed successfully" });

    } catch (error) {
        console.log("Error in followUser: ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const unfollowUser = async (req: Request, res: Response) => {
    const query = getTargetQuerySchema.safeParse(req.query);
    if(!query.success) {
        return res.status(400).json({
            message: "Invalid query params"
        })
    }

    const targetUsername = query.data.target;
    const userId = req.user?.id

    if (!targetUsername || !userId) {
        return res.status(400).json({
            message: "Missing required info"
        })
    }

    try {
        const targetUser = await prismaClient.user.findUnique({
            where: { username: targetUsername },
            select: { id: true },
        })
        if (!targetUser) {
            return res.status(404).json({
                message: "Invalid user"
            })
        }

        const targetUserId = targetUser.id;

        const isFollowing = await prismaClient.user.findFirst({
            where: {
                id: userId,
                following: {
                    some: {
                        id: targetUserId
                    }
                }
            }
        })

        if(!isFollowing) {
            return res.status(400).json({
                message: "You are not following this user"
            })
        }


        await prismaClient.user.update({
            where: {
                id: userId,
            },
            data: {
                following: {
                    disconnect: {
                        id: targetUserId
                    }
                }
            }
        })

        return res.json({ message: "User unfollowed successfully" });

    } catch (error) {
        console.log("Error in unfollowUser: ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
}