import { z } from "zod";

export const photosDto = z.object({
  comentary_one: z.string().optional(),
  comentary_two: z.string().optional(),
  comentary_three: z.string().optional(),
  comentary_four: z.string().optional(),
});
