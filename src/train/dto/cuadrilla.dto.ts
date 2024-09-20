import { z } from "zod";

export const cuadrillaDto = z.object({
  workers: z.number(),
  official: z.number(),
  pawns: z.number(),
});
