import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { jwtPayload } from "../utils/generateToken.js";

export default async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken;
    const secret = process.env.JWT_SECRET;
    if(!secret) return;

    if(!accessToken) {
        return next();
    }

    try {
        const decode = await jwt.verify(accessToken, secret) as jwtPayload;
        req.user = decode;
        next();

    } catch {
        next();
    }
}