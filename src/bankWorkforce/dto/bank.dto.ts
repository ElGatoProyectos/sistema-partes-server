import { z } from "zod";

export const bankDto = z.object({
  nombre: z.string(),
});
