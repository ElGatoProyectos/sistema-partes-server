import { z } from "zod";

export const workforceDto = z.object({
  documento_identidad: z.string(),
  nombre_completo: z.string(),
  categoria_obrero_id: z.number(),
  especialidad_obrero_id: z.number(),
  unidad_id: z.number(),
  fecha_inicio: z.string(),
  fecha_cese: z.string(),
  estado: z.string(),
  fecha_nacimiento: z.string(),
  telefono: z.string(),
  email_personal: z.string(),
  apellido_materno: z.string(),
  apellido_paterno: z.string(),
  genero: z.string(),
  estado_civil: z.string(),
  lugar_nacimiento: z.string(),
  domicilio: z.string(),
  usuario_id: z.number(),
});
