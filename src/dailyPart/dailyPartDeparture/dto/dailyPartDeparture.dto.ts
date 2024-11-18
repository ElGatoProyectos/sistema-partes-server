import { z } from "zod";

export const dailyPartDepartureDto = z.object({
  cuantity_used: z.number(),
});
