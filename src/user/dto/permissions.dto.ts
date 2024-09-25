import { z } from "zod";

const sectionSchema = z.object({
  id: z.number(),
});

const actionSchema = z.object({
  id: z.number(),
});

export const permissionsDto = z.object({
  sections: z.array(sectionSchema), // Array de objetos `section` que tienen un `id`
  actions: z.array(actionSchema), // Array de objetos `action` que tienen un `id`
});
