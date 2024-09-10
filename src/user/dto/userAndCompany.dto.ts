import { z } from "zod";

export const userAndCompanyDto = z.object({
  email: z.string(),
  dni: z.string().min(8),
  nombre_completo: z.string(),
  telefono: z.string(),
  contrasena: z.string().min(3),
  limite_proyecto: z.string(),
  limite_usuarios: z.string(),
  nombre_empresa: z.string(),
  descripcion_empresa: z.string(),
  ruc: z.string(),
  telefono_empresa: z.string(),
  nombre_corto_empresa: z.string(),
  direccion_empresa: z.string(),
  rol_id: z.string(),
});
