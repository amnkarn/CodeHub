import type { Request, Response } from "express";

//User Profile Management (User Controller)
export const getCurrentUser = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const updateUserProfile = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const deleteUserProfile = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const getMyFollowers = (req: Request, res: Response) => {
    console.log("req reached");;
}


export const getMyFollowing = (req: Request, res: Response) => {
    console.log("req reached");;
}


//Public profile controller
export const getUserByUsername = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const getUserFollowers = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const getUserFollowing = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const followUser = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const unfollowUser = (req: Request, res: Response) => {
    console.log("req reached");;
}