import { z } from "zod";

export const trainDto = z.object({
  nombre: z.string(),
  cuadrilla: z.string(),
  nota: z.string(),
  proyecto_id: z.string(),
});
