import type { Request, Response } from "express";


//Public Operations
export const searchRepositories = (req: Request, res: Response) => { //search repo's
    console.log("req reached");;
}

export const getUserRepositories = (req: Request, res: Response) => { //all repos of user
    
}

export const getUserStarredRepos = (req: Request, res: Response) => {

}

export const getRepositoryByFullName = (req: Request, res: Response) => {
    console.log("req reached");;
}



//Authenticated Operations
export const getMyRepositories = (req: Request, res: Response) => {

}

export const getMyStarredRepos = (req: Request, res: Response) => {

}

export const createRepository = (req: Request, res: Response) => {
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


