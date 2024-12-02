import { z } from "zod";

export const proyectoDtoUpdate = z.object({
  nombre_completo: z.string().optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  nombre_consorcio: z.string().optional(),
  nombre_corto: z.string().min(3).optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  plazo_proyecto: z.string().optional(),
});
