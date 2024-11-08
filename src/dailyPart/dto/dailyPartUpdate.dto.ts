import { z } from "zod";

export const dailyPartUpdateDto = z.object({
  fecha: z.string(),
  etapa: z.string(),
  jornada: z.string(),
  hora_inicio: z.string(),
  hora_fin: z.string(),
  descripcion_actividad: z.string().optional(),
  nota: z.string().optional(),
  distanciamiento: z.enum(["Y", "N"]),
  protocolo_ingreso: z.enum(["Y", "N"]),
  protocolo_salida: z.enum(["Y", "N"]),
});
