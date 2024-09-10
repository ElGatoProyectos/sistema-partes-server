import { z } from "zod";

export const empresaUpdateDto = z.object({
  nombre_empresa: z.string().optional(),
  descripcion_empresa: z.string().optional(),
  ruc: z.string().min(11).optional(),
  nombre_corto: z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});
