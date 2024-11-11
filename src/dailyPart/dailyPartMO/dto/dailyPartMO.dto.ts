import { z } from "zod";

export const dailyPartMO = z.object({
  daily_part_id: z.number(),
  workforces_id: z.array(z.number()),
});
