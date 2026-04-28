import { Router, type Request, type Response } from "express";
import { loginSchema } from "../validators/loginSchema.js";
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

const userRouter: Router = Router();


//User Profile (Self & Others)
userRouter.get("/me", getCurrentUser)

userRouter.patch("/me", updateUserProfile)

userRouter.delete("/me", deleteUserProfile)

userRouter.get("/me/followers", getMyFollowers);

userRouter.get("/me/following", getMyFollowing);

//Public profiles
userRouter.get("/:username", getUserByUsername)

userRouter.get("/:username/followers", getUserFollowers)

userRouter.get("/:username/following", getUserFollowing)

userRouter.post("/:username/follow", followUser)

userRouter.delete("/:username/follow", unfollowUser)


export default userRouter;