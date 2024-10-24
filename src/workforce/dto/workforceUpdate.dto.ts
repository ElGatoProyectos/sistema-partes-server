import { z } from "zod";

export const workforceUpdateDto = z.object({
  documento_identidad: z.string().optional(),
  nombre_completo: z.string().optional(),
  categoria_obrero_id: z.number().optional(),
  especialidad_obrero_id: z.number().optional(),
  unidad_id: z.number().optional(),
  fecha_inicio: z.string().optional(),
  fecha_cese: z.string().optional(),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
  fecha_nacimiento: z.string().optional(),
  telefono: z.string().optional(),
  email_personal: z.string().optional(),
  apellido_materno: z.string().optional(),
  apellido_paterno: z.string().optional(),
  genero: z.string().optional(),
  estado_civil: z.string().optional(),
  lugar_nacimiento: z.string().optional(),
  domicilio: z.string().optional(),
  usuario_id: z.number().optional(),
  tipo_obrero_id: z.number().optional(),
});
