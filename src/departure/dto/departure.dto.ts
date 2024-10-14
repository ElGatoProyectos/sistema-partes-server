import { z } from "zod";

export const departureDto = z.object({
  item: z.string(),
  nombre_partida: z.string(),
  unidad_id: z.number(),
  metrado: z.number(),
  precio: z.number(),
  mano_obra_unitaria: z.number(),
  material_unitario: z.number(),
  equipo_unitario: z.number(),
  subcontrata_varios: z.number(),
});
