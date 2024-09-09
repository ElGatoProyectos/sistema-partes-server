import { z } from "zod";

export const userUpdateDto = z.object({
  email: z.string().optional(),
  dni: z.string().optional(),
  nombre_completo: z.string().optional(),
  telefono: z.string().optional(),
  contrasena: z.string().optional(),
  rol_id: z.string().optional(),
  limite_proyecto: z.string().optional(),
  limite_usuarios: z.string().optional(),
});
