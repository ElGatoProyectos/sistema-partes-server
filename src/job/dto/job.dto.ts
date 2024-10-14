import { z } from "zod";

export const jobDto = z.object({
  up_id: z.number(),
  tren_id: z.number(),
  nombre: z.string(),
  nota: z.string().optional(),
  fecha_inicio: z.string(),
  fecha_finalizacion: z.string(),
  usuario_id: z.number(),
});
