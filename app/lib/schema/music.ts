import * as z from "zod";

export const musicSchema = z.object({
  name: z.string().min(3).max(31),
});
