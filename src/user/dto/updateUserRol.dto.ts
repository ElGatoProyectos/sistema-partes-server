import { z } from "zod";

export const userUpdateRolDto = z.object({
  idUser: z.number(),
  idRol: z.number(),
});
