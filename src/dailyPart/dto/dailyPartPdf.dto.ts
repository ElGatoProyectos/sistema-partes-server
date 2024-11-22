import { z } from "zod";

export const dailyPartPdfDto = z.object({
  date: z.string(),
});
