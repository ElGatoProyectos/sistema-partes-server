import { z } from "zod";

export const specialtyDto = z.object({
  nombre: z.string(),
});
