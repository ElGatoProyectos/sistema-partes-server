import { z } from "zod";

export const empresaDto = z.object({
  nombre_empresa: z.string(),
  descripcion_empresa: z.string().optional(),
  ruc: z.string().min(11).optional(),
  nombre_corto: z.string().optional(),
  telefono: z.string(),
  direccion: z.string(),
  usuario_id: z.string(),
});
