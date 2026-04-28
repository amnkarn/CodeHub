import type { Request, Response } from "express";


export const addComment = async (req: Request, res: Response) => {
    console.log("req reached");
}

export const getComments = async (req: Request, res: Response) => {
    console.log("req reached");
}

export const deleteComment = async (req: Request, res: Response) => {
    console.log("req reached");
}