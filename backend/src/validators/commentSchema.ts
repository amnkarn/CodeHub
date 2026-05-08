import { z } from 'zod';


export const addCommentParams = z.object({
    owner: z.string(),
    repo: z.string(),
    issueId: z.string().uuid("Invalid issue id")
})

export const addCommentSchema = z.object({
    comment: z.string()
})

export const deleteCommentParams = z.object({
    owner: z.string(),
    repo: z.string(),
    issueId: z.string().uuid("Invalid issue id"),
    commentId: z.string().uuid()
})