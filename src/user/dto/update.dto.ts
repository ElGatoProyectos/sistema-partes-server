import { z } from "zod";

export const userUpdateDto = z.object({
  email: z.string().optional(),
  dni: z.string().min(8).optional(),
  nombre_completo: z.string().optional(),
  telefono: z.string().optional(),
  contrasena: z.string().optional(),
  eliminado: z.enum(["y", "n"]),
  limite_proyecto: z.number().optional(),
  limite_usuarios: z.number().optional(),
});
