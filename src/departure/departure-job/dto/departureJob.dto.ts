import { z } from "zod";

export const departureJobDto = z.object({
  job_id: z.number(),
  departure_id: z.number(),
  metrado: z.number(),
});
