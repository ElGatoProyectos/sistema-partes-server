import { z } from "zod";

export const prouductionUnitUpdateDto = z.object({
  codigo: z.string().optional(),
  titulo: z.string().optional(),
  nota: z.string().optional(),
});
