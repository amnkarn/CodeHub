import type { Request, Response } from "express";

type AsyncController = (req: Request, res: Response) => Promise<void | Response>;

export default function asyncHandler(fn: AsyncController) {
    return (req: Request, res: Response) => {
        fn(req, res).catch((error) => {
            console.error(`Error in ${fn.name || "handler"}: `, error);
            res.status(500).json({ message: "Error in server" });
        });
    };
}
