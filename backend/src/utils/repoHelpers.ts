import type { Request, Response } from "express";
import prismaClient from "../config/db.js";
import { VISIBILITY } from "../generated/prisma/enums.js";

export async function findRepoWithAccess(
    ownerName: string,
    repoName: string,
    userId?: string,
) {
    return prismaClient.repository.findFirst({
        where: {
            name: repoName,
            owner: { username: ownerName },
            OR: [
                { visibility: VISIBILITY.public },
                ...(userId ? [{ ownerId: userId }] : []),
            ],
        },
    });
}

export async function verifyRepoOwner(
    ownerUsername: string,
    req: Request,
    res: Response,
): Promise<{ id: string } | null> {
    const owner = await prismaClient.user.findUnique({
        where: { username: ownerUsername },
    });

    if (!owner) {
        res.status(404).json({ message: "Owner not found" });
        return null;
    }
    if (owner.id !== req.user?.id) {
        res.status(403).json({ message: "You are not the owner of this repo" });
        return null;
    }

    return owner;
}
