import { z } from "zod";

export const dailyPartDto = z.object({
  fecha_inicio: z.string(),
  job_id: z.number(),
});
