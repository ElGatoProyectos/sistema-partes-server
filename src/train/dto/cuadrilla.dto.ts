import { z } from "zod";

export const cuadrillaDto = z.object({
  idTrain: z.number(),
  workers: z.number(),
  official: z.number(),
  pawns: z.number(),
});
