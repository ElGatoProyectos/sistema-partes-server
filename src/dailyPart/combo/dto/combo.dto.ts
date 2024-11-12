import { z } from "zod";

export const comboDto = z.object({
  nombre: z.string(),
  workforces_id: z.array(z.number()),
});
