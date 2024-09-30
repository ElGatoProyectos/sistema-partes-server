import { z } from "zod";

export const proyectoColorsDto = z.object({
  color_primario: z.string().optional(),
  color_personalizado: z.string().optional(),
  color_linea: z.string().optional(),
  color_detalle: z.string().optional(),
  color_menu: z.string().optional(),
  color_submenu: z.string().optional(),
});
