import { z } from "zod";

export const userDto = z.object({
  email: z.string(),
  dni: z.string(),
  nombre_completo: z.string(),
  telefono: z.string(),
  contrasena: z.string().min(3),
});
