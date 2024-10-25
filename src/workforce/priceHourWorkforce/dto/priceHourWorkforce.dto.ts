import { z } from "zod";

const priceHourWorkforceBodySchema = z.object({
  hora_normal: z.number(),
  hora_extra_60: z.number(),
  hora_extra_100: z.number(),
  categoria_obrero_id: z.number(),
  precio_hora_mo_id: z.number(),
});

export const priceHourWorkforceSchema = z.object({
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  nombre: z.string(),
  data: z.array(priceHourWorkforceBodySchema),
});
