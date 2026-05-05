import { z } from "zod";

export const usernameParamSchema = z.object({
    username: z.string()
        .min(5)
        .max(15)
})


export const createRepoSchema = z.object({
    name: z.string(),
    description: z.string(),
    visibility: z.enum(['public', 'private'])
        .default('public'),
})


export const repoByNameSchema = z.object({
    owner: z.string().min(5).max(15),
    repo: z.string().min(1)
})


export const updateRepoSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    visibility: z.enum(['public', 'private'])
        .default('public')
        .optional(),
})