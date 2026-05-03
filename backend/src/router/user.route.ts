import { Router, type Request, type Response } from "express";
import { loginSchema } from "../validators/authSchema.js";
import {
    deleteUserProfile,
    followUser, 
    getCurrentUser, 
    getMyFollowers, 
    getMyFollowing, 
    getUserByUsername, 
    getUserFollowers, 
    getUserFollowing,
    unfollowUser,
    updateUserProfile
} from "../controller/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const userRouter: Router = Router();


//User Profile (Self & Others)
userRouter.get("/me", isAuthenticated, getCurrentUser)

userRouter.patch("/me", isAuthenticated, updateUserProfile)

userRouter.delete("/me", isAuthenticated, deleteUserProfile)

userRouter.get("/me/followers", isAuthenticated, getMyFollowers);

userRouter.get("/me/following", isAuthenticated, getMyFollowing);


//Public profiles for other users
userRouter.get("/:username", getUserByUsername)

userRouter.get("/:username/followers", getUserFollowers)

userRouter.get("/:username/following", getUserFollowing)


//Follow and Unfollow user's
userRouter.post("/follow", isAuthenticated, followUser) //?target=amnkarn

userRouter.post("/unfollow", isAuthenticated, unfollowUser) //?target=amnkarn


export default userRouter;