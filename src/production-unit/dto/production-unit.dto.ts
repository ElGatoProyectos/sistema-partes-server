import { z } from "zod";

export const prouductionUnitDto = z.object({
  codigo: z.string(),
  nombre: z.string(),
  nota: z.string().optional(),
});
