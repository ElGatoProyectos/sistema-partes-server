import { z } from "zod";

export const unitUpdateDto = z.object({
  nombre: z.string(),
  simbolo: z.string(),
  descripcion: z.string().optional(),
  empresa_id: z.number(),
});
