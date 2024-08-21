import { z } from "zod";

export const LoginDto = z.object({
  username: z.string(),
  password: z.string().min(6),
});
