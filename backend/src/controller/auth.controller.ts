import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken, { type jwtPayload } from "../utils/generateToken.js";
import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";
import blackListToken from "../utils/blacklistToken.js";

//Authentication (Auth Controller)
export const registerUser = async (req: Request, res: Response) => {
    const parsedData = registerSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong in input"
        })
    }

    try {
        const { username, email, name, password } = parsedData.data;
        
        const findUser = await prismaClient.user.findFirst({
            where: {
                OR: [ { username }, { email } ]
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
                name,
                password: hash
            }
        })

        generateToken(user.id, res); //token seted

        res.status(201).json({
            message: "User created successfully",
            data: {
                username: user.username,
                email: user.email,
                name: user.name,
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

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid) {
            return res.status(401).json({
                message: "wrong password"
            })
        }

        generateToken(user.id, res);

        return res.status(200).json({
            message: "successfully loged in",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            }
        })

    } catch (error) {
        console.log("Erorr in login endpoint: ", error);
        res.status(500).json({
            message: "Error in login"
        })
    }
}


export const refreshAccessToken = async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken || !refreshToken) {
        return res.status(401).json({
            message: "Token is missing"
        })
    }

    try {
        const decodeRefreshToken = await jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwtPayload;
        const decodeAccessToken = await jwt.verify(accessToken, process.env.JWT_SECRET!) as jwtPayload;

        const isRefreshTokenBlacklisted = await redisClient.get(decodeRefreshToken.jti); //jti is unique
        const isAccessTokenBlacklisted = await redisClient.get(decodeAccessToken.jti);

        if(isRefreshTokenBlacklisted || isAccessTokenBlacklisted) {
            return res.status(400).json({
                message: "Token is blacklisted, can't refresh the token"
            })
        }

        await blackListToken(decodeRefreshToken.jti, 604800);
        await blackListToken(decodeAccessToken.jti, 900);

        generateToken(decodeRefreshToken.id, res);

        res.status(200).json({
            message: "Token refreshed successfully"
        })

    } catch (error) {
        console.log("Error in token refreshing: ", error);
        res.status(500).json({
            message: "Error in token refreshing"
        })
    }

}


export const logoutUser = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if(!refreshToken || !accessToken) {
        return res.status(400).json({
            message: "token is missing"
        })
    }

    try {
        const decodeRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwtPayload;
        const decodeAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwtPayload;
        
        //blacklist both tokens
        await blackListToken(decodeRefreshToken.jti, 604800);
        await blackListToken(decodeAccessToken.jti, 900);

        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        res.status(200).json({
            message: "Successully loged out"
        })
        
    } catch (error) {
        console.log("Error in logout funtion: ", error);

        res.status(500).json({
            message: "Error in server",
        })
    }
}