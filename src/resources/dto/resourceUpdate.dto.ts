import { z } from "zod";

export const resourceUpdateDto = z.object({
  nombre: z.string().optional(),
  precio: z.number(),
  unidad_id: z.number(),
  id_unificado: z.number()
});
