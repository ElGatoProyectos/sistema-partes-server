import { z } from "zod";

export const unifiedIndexUpdateDto = z.object({
  nombre: z.string(),
  simbolo: z.string(),
  comentario: z.string(),
});
