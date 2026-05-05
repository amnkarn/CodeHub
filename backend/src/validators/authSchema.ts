import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(5),
    email: z.email(),
    name: z.string(),
    password: z.string().min(5)
})

export const loginSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(5),
})