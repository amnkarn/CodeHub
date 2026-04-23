import { email, z } from 'zod';

export const loginSchema = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string(),
})