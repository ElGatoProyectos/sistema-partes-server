import { z } from "zod";

export const userUpdateDto = z.object({
  email: z.string().optional(),
  dni: z.string().optional(),
  nombre_completo: z.string().optional(),
  telefono: z.string().optional(),
  contrasena: z.string().optional(),
  eliminado: z.enum(["y", "n"]).optional(),
  rol_id: z.string().optional(),
});
