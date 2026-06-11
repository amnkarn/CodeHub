import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import prismaClient from "../config/db.js";
import bcrypt from "bcrypt";
import generateToken, { type jwtPayload } from "../utils/generateToken.js";
import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import invalidateTokens from "../utils/invalidateTokens.js";

//Authentication (Auth Controller)
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = registerSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong in input"
        })
    }

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

    generateToken(user.id, res);

    res.status(201).json({
        message: "User created successfully",
        data: {
            username: user.username,
            email: user.email,
            name: user.name,
            verified: false,
        }
    })
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const parsedData = loginSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Something is wrong in input"
        })
    }

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
});


export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken || !refreshToken) {
        return res.status(401).json({
            message: "Token is missing"
        })
    }

    const decodeRefreshToken = await jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwtPayload;
    const decodeAccessToken = await jwt.verify(accessToken, process.env.JWT_SECRET!) as jwtPayload;

    const isRefreshTokenBlacklisted = await redisClient.get(decodeRefreshToken.jti);
    const isAccessTokenBlacklisted = await redisClient.get(decodeAccessToken.jti);

    if(isRefreshTokenBlacklisted || isAccessTokenBlacklisted) {
        return res.status(400).json({
            message: "Token is blacklisted, can't refresh the token"
        })
    }

    invalidateTokens(accessToken, refreshToken, res);
    generateToken(decodeRefreshToken.id, res);

    res.status(200).json({
        message: "Token refreshed successfully"
    })
});


export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if(!refreshToken || !accessToken) {
        return res.status(400).json({
            message: "token is missing"
        })
    }

    invalidateTokens(accessToken, refreshToken, res);

    res.status(200).json({
        message: "Successully loged out"
    })
});
