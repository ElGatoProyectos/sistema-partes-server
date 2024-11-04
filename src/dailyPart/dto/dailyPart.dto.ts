import { z } from "zod";

export const assistsDto = z.object({
  fecha_inicio: z.string(),
});
