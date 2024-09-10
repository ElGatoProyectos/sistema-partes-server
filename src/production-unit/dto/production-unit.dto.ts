import { z } from "zod";

export const prouductionUnitDto = z.object({
  nombre: z.string(),
  nota: z.string().optional(),
});
