import { z } from "zod";

export const userAndCompanyUpdateDto = z.object({
  email: z.string(),
  dni: z.string().min(8),
  nombre_completo: z.string(),
  telefono: z.string(),
  contrasena: z.string().optional(),
  limite_proyecto: z.string(),
  limite_usuarios: z.string(),
  nombre_empresa: z.string(),
  descripcion_empresa: z.string(),
  ruc: z.string(),
  telefono_empresa: z.string(),
  nombre_corto_empresa: z.string(),
  direccion_empresa_fiscal: z.string(),
  direccion_empresa_oficina: z.string(),
  email_empresa: z.string(),
  contacto_responsable: z.string(),
  estado: z.enum(["Y", "N"]),
});
