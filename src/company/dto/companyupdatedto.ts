import { z } from "zod";

export const empresaDto = z.object({
  nombre_empresa: z.string().optional(),
  descripcion_empresa: z.string().optional(),
});
