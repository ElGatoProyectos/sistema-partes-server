import { z } from "zod";

export const proyectoDtoUpdate = z.object({
  nombre_completo: z.string().optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  nombre_consorcio: z.string().optional(),
  nombre_corto: z.string().min(3).optional(),
  costo_proyecto: z.string().optional(),
  estado: z.enum(["CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  plazo_proyecto: z.string().optional(),
  color_primario: z.string(),
  color_personalizado: z.string(),
  color_linea: z.string(),
  color_detalle: z.string(),
  color_menu: z.string(),
  color_submenu: z.string(),
});
