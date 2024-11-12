import { z } from "zod";

export const dailyPartResourceMO = z.object({
  resources_id: z.array(z.number()),
});
