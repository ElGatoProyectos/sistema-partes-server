import { z } from "zod";

export const departureJobUpdateDto = z.object({
  departure_id: z.number(),
  metrado: z.number(),
});
