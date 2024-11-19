import { z } from "zod";

export const dailyPartDepartureDto = z.object({
  quantity_used: z.number(),
});
