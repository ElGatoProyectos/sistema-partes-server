import { z } from "zod";

export const jwtDecodeDto = z.object({
  sub: z.string(),
  iat: z.number(),
  id: z.number(),
  role: z.string(),
});
