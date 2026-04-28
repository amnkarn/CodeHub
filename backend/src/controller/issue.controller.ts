import type { Request, Response } from "express";


//user's issue's
export const createIssue = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const getAllIssuesByRepo = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const getIssueById = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const updateIssue = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const deleteIssue = async (req: Request, res: Response) => {
    console.log("res reached");
}


//own issues
export const getMyIssues = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const updateMyIssuesById = async (req: Request, res: Response) => {
    console.log("res reached");
}

export const deleteMyIssuesById = async (req: Request, res: Response) => {
    console.log("res reached");
}