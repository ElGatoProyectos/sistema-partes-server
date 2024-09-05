import { z } from "zod";

export const prouductionUnitDto = z.object({
  codigo: z.string(),
  titulo: z.string(),
  nota: z.string().optional(),
});
