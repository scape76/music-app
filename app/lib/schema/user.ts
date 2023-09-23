import * as z from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(24),
});
