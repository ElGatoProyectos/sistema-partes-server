import { z } from "zod";

export const dailyPartMOUpdate = z.object({
  hora_parcial: z.number(),
  hora_normal: z.number(),
  hora_60: z.number(),
  hora_100: z.number(),
});
