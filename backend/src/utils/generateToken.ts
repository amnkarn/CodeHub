import { type Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const secret = process.env.secret!;

export default function generateToken(userId: string, res: Response) {
    const refreshToken = jwt.sign({
        id: userId,
        jti: uuidv4,
    }, secret, {
        expiresIn: 7 * 24 * 60 *60 * 1000,
    })
    
    const accessToken = jwt.sign({
        id: userId,
        jti: uuidv4
    }, secret, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict"
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "strict"
    })
}