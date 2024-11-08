import { z } from "zod";

export const dailyPartDto = z.object({
  fecha: z.string(),
  job_id: z.number(),
});
