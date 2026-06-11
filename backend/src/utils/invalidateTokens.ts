import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { jwtPayload } from "./generateToken.js";
import blackListToken from "./blacklistToken.js";

export default function invalidateTokens(
    accessToken: string,
    refreshToken: string,
    res: Response,
) {
    const decodeRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET!) as jwtPayload;
    const decodeAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET!) as jwtPayload;

    blackListToken(decodeRefreshToken.jti, 604800);
    blackListToken(decodeAccessToken.jti, 900);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
}
