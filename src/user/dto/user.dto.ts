import { z } from "zod";

export const userDto = z.object({
  email: z.string(),
  dni: z.string().min(8),
  nombre_completo: z.string(),
  telefono: z.string(),
  contrasena: z.string().min(3),
  limite_proyecto: z.number(),
  limite_usuarios: z.number(),
  rol_id: z.number(),
});
