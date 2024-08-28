import { z } from "zod";

export const headerDto = z.object({
  page: z.string(),
  limit: z.string(),
});
