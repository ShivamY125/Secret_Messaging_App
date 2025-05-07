import {z} from 'zod';

export const messageSchema = z.object({
      content: z.string().min(2, {message: "content must be of 2 char"}).max(200,  {message: "content must be less than 200 char"})
})