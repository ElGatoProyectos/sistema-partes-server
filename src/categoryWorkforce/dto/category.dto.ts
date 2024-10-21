import { z } from "zod";

export const categoryDto = z.object({
  nombre: z.string(),
});
