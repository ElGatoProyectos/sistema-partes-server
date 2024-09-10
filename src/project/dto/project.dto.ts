import { z } from "zod";

export const proyectoDto = z.object({
  nombre_completo: z.string(),
  descripcion: z.string(),
  direccion: z.string(),
  nombre_consorcio: z.string(),
  nombre_corto: z.string().min(3),
  costo_proyecto: z.string(),
  color_proyecto: z.string(),
  estado: z.enum(["ACTIVO", "INACTIVO", "PENDIENTE", "FINALIZADO"]),
  fecha_creacion: z.string(),
  fecha_fin: z.string(),
  plazo_proyecto: z.string(),
  codigo_proyecto: z.string(),
  color_primario: z.string(),
  color_personalizado: z.string(),
  color_linea: z.string(),
  color_detalle: z.string(),
  color_menu: z.string(),
  color_submenu: z.string(),
  empresa_id: z.string(),
});
