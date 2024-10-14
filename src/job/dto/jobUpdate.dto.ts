import { z } from "zod";

export const jobUpdateDto = z.object({
  up_id: z.number(),
  tren_id: z.number(),
  nombre: z.string().optional(),
  nota: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_finalizacion: z.string().optional(),
  usuario_id: z.number(),
});
