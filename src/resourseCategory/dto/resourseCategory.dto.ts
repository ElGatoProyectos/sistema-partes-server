import { z } from "zod";

export const resourseCategoryDto = z.object({
  nombre: z.string(),
});
