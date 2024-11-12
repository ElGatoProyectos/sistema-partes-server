import { z } from "zod";

export const dailyPartResourceUpdateMO = z.object({
  resource_id: z.number(),
  amount: z.number(),
});
