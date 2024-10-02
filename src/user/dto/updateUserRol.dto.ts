import { z } from "zod";

export const userUpdateRolDto = z.object({
  usuario_id: z.number(),
  rol_id: z.number(),
  action: z.enum(["CREACION"]),
});
