import { z } from "zod";

export const unitUpdateDto = z.object({
  nombre: z.string().optional(),
  simbolo: z.string().optional(),
});
