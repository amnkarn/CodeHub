import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import type { jwtPayload } from "../utils/generateToken.js";


declare global {
    namespace Express {
        interface Request {
            user?: jwtPayload
        }
    }
}

export default async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;

    if(!accessToken) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    const secret = process.env.JWT_SECRET;
    if(!secret) return;

    try {
        const decodeAccessToken = jwt.verify(accessToken, secret) as jwtPayload;

        req.user = decodeAccessToken;

        next();

    } catch(err) {
        console.log("Error is isAuthenticated middleware: ", err);
        res.status(500).json({
            message: "Error in server",
        })
    }
}