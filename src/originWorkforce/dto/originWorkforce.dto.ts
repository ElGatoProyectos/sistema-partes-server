import { z } from "zod";

export const originDto = z.object({
  nombre: z.string(),
});
