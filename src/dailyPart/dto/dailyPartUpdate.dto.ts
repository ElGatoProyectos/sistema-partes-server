import { z } from "zod";

export const dailyPartUpdateDto = z.object({
  etapa: z.enum(["TODOS,PROCESO", "REVISADO", "TERMINADO", "INGRESADO"]),
  jornada: z.string(),
  hora_inicio: z.string(),
  hora_fin: z.string(),
  descripcion_actividad: z.string().optional(),
  nota: z.string().optional(),
  distanciamiento: z.boolean(),
  protocolo_ingreso: z.boolean(),
  protocolo_salida: z.boolean(),
});
