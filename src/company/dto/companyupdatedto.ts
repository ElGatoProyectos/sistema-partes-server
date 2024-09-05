import { z } from "zod";

export const empresaDto = z.object({
  nombre_empresa: z.string(),
  descripcion_empresa: z.string().optional(),
  fecha_creacion: z.string(),
});
