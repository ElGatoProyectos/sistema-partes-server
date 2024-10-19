import { z } from "zod";

export const typeDto = z.object({
  nombre: z.string(),
});
