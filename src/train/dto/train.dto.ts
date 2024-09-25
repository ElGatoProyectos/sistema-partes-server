import { z } from "zod";

export const trainDto = z.object({
  nombre: z.string(),
  nota: z.string(),
});
