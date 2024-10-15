import { z } from "zod";

export const resourseDto = z.object({
  nombre: z.string(),
  precio: z.number(),
  unidad_id: z.number(),
  id_unificado: z.number(),
});
