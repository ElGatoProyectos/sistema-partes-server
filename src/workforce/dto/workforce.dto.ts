import { z } from "zod";

export const workforceDto = z.object({
  nombre: z.string(),
  nota: z.string(),
});
