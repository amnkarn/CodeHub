import { z } from "zod";


export const getUserParamsSchema = z.object({
    username: z.string()
        .min(3, "Username too short")
        .max(15, "Username too big")
});

export const getTargetQuerySchema = z.object({
    target: z.string().min(3).max(15)
})

export const userUpdateSchema = z.object({
    username: z.string().min(5).optional(),
    email: z.email().optional(),
    password: z.string().min(5).optional(),
})