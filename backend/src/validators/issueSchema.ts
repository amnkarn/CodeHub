import { z } from 'zod';


export const issueParams = z.object({
    owner: z.string().max(30),
    repo: z.string().max(30),
})

export const createIssueSchema = z.object({
    title: z.string(),
    description: z.string()
})

export const issueByIdSchema = z.object({
    owner: z.string().max(30),
    repo: z.string().max(30),
    issueId: z.string().uuid("Invalid issue id")
})