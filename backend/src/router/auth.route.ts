import { Router } from "express"
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser 
} from "../controller/auth.controller.js";

const authRouter: Router = Router();

//Authentication (Public Endpoints)
authRouter.post("/register", registerUser)

authRouter.post("/login", loginUser)

authRouter.post("/logout", logoutUser)

authRouter.get("/refresh-token", refreshAccessToken)


export default authRouter;