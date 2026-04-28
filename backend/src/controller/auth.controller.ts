import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

//Authentication (Auth Controller)
export const registerUser = async (req: Request, res: Response) => {
    const parsedData = registerSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong in input"
        })
    }

    try {
        const { username, email, password } = parsedData.data;
        
        const findUser = await prismaClient.user.findUnique({
            where: {
                username
            }
        })
        
        if(findUser) {
            return res.status(400).json({
                messasge: "User already exists",
            })
        }

        const salt = await bcrypt.genSalt(5);
        const hash = await bcrypt.hash(password, salt);

        const user = await prismaClient.user.create({
            data: {
                username,
                email,
                password: hash
            }
        })

        generateToken(user.id, res); //token seted

        res.send(201).json({
            message: "User created successfully",
            data: {
                username: user.username,
                email: user.email,
                verified: false,
            }
        })

    } catch (error) {
        console.log("Error in user regiser: ", error);
        res.status(500).json({
            message: "Error in signing"
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const parsedData = loginSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong in input"
        })
    }

    try {
        const { username, password } = parsedData.data;

        const user = await prismaClient.user.findUnique({
            where: {
                username
            }
        })
        if(!user) {
            return res.status(404).json({
                message: "User doesn't exist"
            })
        }

        const isValid = bcrypt.compare(password, user.password);

        if(!isValid) {
            return res.status(401).json({
                message: "wrong password"
            })
        }

        generateToken(user.id, res);

        return res.status(200).json({
            message: "successfully loged in"
        })

    } catch (error) {
        console.log("Erorr in login endpoint: ", error);
        res.status(500).json({
            message: "Error in login"
        })
    }
}

export const refreshAccessToken = (req: Request, res: Response) => {
    console.log("req reached");;
}


export const logoutUser = (req: Request, res: Response) => {
    console.log("req reached");;
}