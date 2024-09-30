import { z } from "zod";

export const prouductionUnitUpdateDto = z.object({
  nombre: z.string().optional(),
  nota: z.string().optional(),
});
