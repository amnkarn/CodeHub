import type { Request, Response } from "express";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";


//User Profile Management (User Controller)
export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.id
    if (!userId) return;

    try {
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            },
            include: {
                followedBy: true,
                following: true,
                starRepos: true,
                issues: true,
                forks: true,
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
    if(!userId) return;

    try {
        //can change username, password
        const updateData: any = {};

        if (req.body.username) {
            const username = req.body.username;

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

        if (req.body.password) {
            const pass = req.body.password;
            const salt = await bcrypt.genSalt(5);
            const hash = await bcrypt.hash(pass, salt);

            updateData.password = hash;
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
    const userId = req.user?.id;
    if(!userId) return;

    try {
        const user = await prismaClient.user.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: "User deleted successfully"
        })

    } catch(err) {
        console.log("Error in delete controller: ", err);
        res.status(500).json({
            message: "Error in server"
        })
    }
}

export const getMyFollowers = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) return;

    try {
        //following me
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            },
            include: {
                followedBy: true,
                following: true
            }
        })
        
        res.status(200).json({
            user: user?.followedBy
        })
        
    } catch (error) {
        console.log("Error in myyFollowwers controller: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


export const getMyFollowing = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if(!userId) return;

    try {
        //following me
        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            },
            include: {
                followedBy: true,
                following: true
            }
        })
        
        res.status(200).json({
            user: user?.following
        })
        
    } catch (error) {
        console.log("Error in myyFollowwers controller: ", error);
        res.status(500).json({
            message: "Error in server"
        })
    }
}


//Public profile controller
export const getUserByUsername = async (req: Request, res: Response) => {
    const username = req.body.username;

    try {
        const user = prismaClient.user.findUnique({
            where: {
                username
            }
        })

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

export const getUserFollowers = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const getUserFollowing = (req: Request, res: Response) => {
    console.log("req reached");;
}


//Follow and Unfollow user's
export const followUser = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const unfollowUser = (req: Request, res: Response) => {
    console.log("req reached");;
}