import { z } from "zod";

export const jobUpdateDto = z.object({
  up_id: z.number(),
  train_id: z.number(),
  nombre: z.string().optional(),
  nota: z.string().optional(),
  user_id: z.number(),
  fecha_inicio: z.string().optional(),
  fecha_finalizacion: z.string().optional(),
  plazo_proyecto: z.string().optional(),
  duracion: z.string().optional(),
});
