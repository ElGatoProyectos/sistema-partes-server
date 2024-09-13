import { z } from "zod";

export const unifiedIndexDto = z.object({
  nombre: z.string(),
  simbolo: z.string(),
  comentario: z.string(),
  empresa_id: z.number(),
});
