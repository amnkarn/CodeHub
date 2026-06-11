import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

interface ValidateOptions {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export default function validate(schemas: ValidateOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json({ message: "Invalid parameters" });
            }
            Object.assign(req.params, result.data);
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                return res.status(400).json({ message: "Invalid query parameters" });
            }
            Object.assign(req.query, result.data);
        }

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ message: "Invalid input data" });
            }
            req.body = result.data;
        }

        next();
    };
}
