import { z } from "zod";

export const empresaDto = z.object({
  nombre_empresa: z.string(),
  descripcion_empresa: z.string().optional(),
  ruc: z.string().min(11),
  razon_social: z.string(),
  direccion_fiscal: z.string(),
  direccion_oficina: z.string(),
  nombre_corto: z.string(),
  telefono: z.string(),
  correo: z.string(),
  contacto_responsable: z.string(),
  usuario_id: z.string(),
});
