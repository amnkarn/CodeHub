import { z } from "zod";


export const forkParamsSchema = z.object({
    owner: z.string(),
    repo: z.string()
})