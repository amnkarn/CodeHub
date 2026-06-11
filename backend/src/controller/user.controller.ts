import type { Request, Response } from "express";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import { userUpdateSchema } from "../validators/userSchema.js";
import { getUserParamsSchema } from "../validators/userSchema.js";
import { getTargetQuerySchema } from "../validators/userSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userSummarySelect } from "../utils/prismaSelects.js";
import invalidateTokens from "../utils/invalidateTokens.js";


//User Profile Management (User Controller)
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            message: "Unauthorised"
        })
    }

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
            _count: {
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
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return;

    const parsedData = userUpdateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong"
        })
    }

    const updateData: Record<string, unknown> = {};
    const { username, email, name, password } = parsedData.data;

    if (username) {
        const user = await prismaClient.user.findUnique({
            where: { username: username }
        })
        if (user) {
            return res.status(404).json({
                message: `Username ${username} is not available. Please choose another`
            })
        }
        updateData.username = username;
    }
    if(email) {
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
        const salt = await bcrypt.genSalt(5);
        updateData.password = await bcrypt.hash(password, salt);
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
});

export const deleteUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    const userId = req.user?.id;
    if (!userId) return;

    await prismaClient.user.delete({
        where: {
            id: userId
        }
    })

    invalidateTokens(accessToken, refreshToken, res);

    res.status(200).json({
        message: "User deleted successfully"
    })
});

export const getMyFollowers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return;

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            followedBy: {
                select: userSummarySelect
            }
        }
    })

    res.status(200).json({
        user
    })
});

export const getMyFollowing = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) return;

    const user = await prismaClient.user.findUnique({
        where: {
            id: userId
        },
        select: {
            following: {
                select: userSummarySelect
            }
        }
    })

    res.status(200).json({
        user
    })
});


//Public profile controller
export const getUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const result = getUserParamsSchema.safeParse(req.params);
    if(!result.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    const { username } = result.data;

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
});

export const getUserFollowers = asyncHandler(async (req: Request, res: Response) => {
    const parsedParams = getUserParamsSchema.safeParse(req.params);
    if(!parsedParams.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    const username = parsedParams.data.username;

    const userFollowers = await prismaClient.user.findUnique({
        where: {
            username: username as string
        },
        select: {
            followedBy: {
                select: userSummarySelect
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
});

export const getUserFollowing = asyncHandler(async (req: Request, res: Response) => {
    const params = getUserParamsSchema.safeParse(req.params);
    if(!params.success) {
        return res.status(400).json({
            message: "Invalid ID formate"
        })
    }

    const username = params.data.username;

    const userFollowing = await prismaClient.user.findUnique({
        where: {
            username: username as string
        },
        select: {
            following: {
                select: userSummarySelect
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
});


//Follow and Unfollow user's
export const followUser = asyncHandler(async (req: Request, res: Response) => {
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
                connect: {
                    id: targetUserId
                }
            }
        }
    })

    return res.json({ message: "User followed successfully" });
});

export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
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
});
