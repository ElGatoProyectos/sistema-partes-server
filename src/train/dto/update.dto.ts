import { z } from "zod";

export const trainUpdateDto = z.object({
  nombre: z.string(),
  cuadrilla: z.string(),
  nota: z.string(),
  operario: z.number().optional(),
  oficial: z.number().optional(),
  peon: z.number().optional(),
});
