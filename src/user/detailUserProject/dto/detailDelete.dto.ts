import { z } from "zod";

export const deleteDetailAssignmentDto = z.object({
  user_id: z.number(),
  assignment: z.string(),
});
