import { z } from "zod";

export const proyectoDtoUpdate = z.object({
  nombre_completo: z.string().optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  nombre_consorcio: z.string().optional(),
  nombre_corto: z.string().min(3).optional(),
  costo_proyecto: z.string().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO", "PENDIENTE", "FINALIZADO"]).optional(),
  fecha_creacion: z.string().optional(),
  fecha_fin: z.string().optional(),
  plazo_proyecto: z.string().optional(),
  codigo_proyecto: z.string().optional(),
});
