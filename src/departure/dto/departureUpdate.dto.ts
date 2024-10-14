import { z } from "zod";

export const departureUpdateDto = z.object({
  item: z.string().optional(),
  nombre_partida: z.string().optional(),
  unidad_id: z.number().optional(),
  metrado: z.number().optional(),
  precio: z.number().optional(),
  mano_obra_unitaria: z.number().optional(),
  material_unitario: z.number().optional(),
  equipo_unitario: z.number().optional(),
  subcontrata_varios: z.number().optional(),
});
