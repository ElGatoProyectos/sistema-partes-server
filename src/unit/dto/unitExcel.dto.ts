import { z } from "zod";

export const unitDto = z.object({
  idCompany: z.string(),
});
