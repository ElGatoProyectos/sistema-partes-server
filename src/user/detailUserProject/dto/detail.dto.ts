import { z } from "zod";

export const detailAssignmentDto = z.object({
  user_id: z.number(),
  user2_id: z.number(),
  assignment: z.string(),
});
