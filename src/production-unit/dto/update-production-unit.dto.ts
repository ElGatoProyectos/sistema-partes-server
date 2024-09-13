import { z } from "zod";

export const prouductionUnitUpdateDto = z.object({
  titulo: z.string().optional(),
  nota: z.string().optional(),
});
