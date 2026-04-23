import { Router, type Request, type Response } from "express";
import { loginSchema } from "../validators/loginSchema.js";

const userRouter: Router = Router();

userRouter.get("/register", async (req: Request, res: Response) => {
    const parsedResult = loginSchema.safeParse(req.body);
    if(!parsedResult.success) {
        throw new Error("Something is missing");
    }

    try {
        const { username, email, password } = parsedResult.data;

        //const findUser = await 

    } catch (error) {
        console.log(error);
    }
})

userRouter.get("/login", async (req: Request, res: Response) => {
    
})

userRouter.get("/get-me", async (req: Request, res: Response) => {
    
})

userRouter.get("/logout", async (req: Request, res: Response) => {
    
})

export default userRouter;