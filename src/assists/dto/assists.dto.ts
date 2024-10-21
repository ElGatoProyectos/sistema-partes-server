import { z } from "zod";

export const assistsDto = z.object({
  fecha: z.string(),
  horas_60: z.number(),
  horas_100: z.number(),
  asistencia: z.enum(["A", "F"]),
  horas_extras_estado: z.enum(["y", "n"]),
  mano_obra_id: z.number(),
});
