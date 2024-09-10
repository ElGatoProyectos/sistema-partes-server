import { z } from "zod";

export const rolDto = z.object({
  nombre_secundario: z.string(),
  descripcion: z.string(),
  rol: z.string(),
});
