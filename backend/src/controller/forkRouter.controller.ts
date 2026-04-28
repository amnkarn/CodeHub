import type { Request, Response } from "express";


export const forkRepository = async (req: Request, res: Response) => {
    console.log("req reached");
}

export const getForkedRepositories = async (req: Request, res: Response) => {
    console.log("req reached");
}