import type { Request, Response } from "express";

//repo conroller(create, and get)
export const getRepositories = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const createRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}


//search repo
export const searchRepositories = (req: Request, res: Response) => {
    console.log("req reached");;
}


//specific repo controllers
export const getRepositoryByFullName = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const updateRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const deleteRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const toggleRepositoryVisibility = (req: Request, res: Response) => {
    console.log("req reached");;
}


// start and unstart the repo
export const starRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}

export const unstarRepository = (req: Request, res: Response) => {
    console.log("req reached");;
}


//all repos of user
export const getUserRepositories = (req: Request, res: Response) => {
    console.log("req reached");;
}