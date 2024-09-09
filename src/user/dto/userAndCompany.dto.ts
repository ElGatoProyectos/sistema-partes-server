import { z } from "zod";

export const userAndCompanyDto = z.object({
  email: z.string(),
  dni: z.string(),
  nombre_completo: z.string(),
  telefono: z.string(),
  contrasena: z.string().min(3),
  nombre_empresa: z.string(),
  descripcion_empresa: z.string(),
  // rol_id: z.string().optional(),
});
