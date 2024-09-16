import { z } from "zod";

export const unitDto = z.object({
  nombre: z.string(),
  simbolo: z.string(),
  descripcion: z.string(),
  empresa_id: z.number(),
});
