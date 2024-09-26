import { z } from "zod";

export const jobDto = z.object({
  up_id: z.number(),
  train_id: z.number(),
  nombre: z.string(),
  nota: z.string().optional(),
  user_id: z.number(),
  fecha_inicio: z.string(),
  fecha_finalizacion: z.string(),
  plazo_proyecto: z.string(),
  duracion: z.string(),
});
