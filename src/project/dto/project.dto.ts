import { z } from "zod";

export const proyectoDto = z.object({
  nombre_completo: z.string(),
  descripcion: z.string().optional(),
  direccion: z.string(),
  nombre_consorcio: z.string(),
  nombre_corto: z.string().min(3),
  costo_proyecto: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  plazo_proyecto: z.string(),
  color_primario: z.string().optional(),
  color_personalizado: z.string().optional(),
  color_linea: z.string().optional(),
  color_detalle: z.string().optional(),
  color_menu: z.string().optional(),
  color_submenu: z.string().optional(),
});
