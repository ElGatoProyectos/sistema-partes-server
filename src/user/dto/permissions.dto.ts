import { z } from "zod";

const actionSchema = z.object({
  id: z.string(),
});

export const permissionsDto = z.object({
  sections: z.number(),
  actions: z.array(actionSchema),
});
