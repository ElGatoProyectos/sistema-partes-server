import { z } from "zod";

export const proyectoStateDto = z.object({
  estado: z.enum(["ACTIVO", "INACTIVO", "PENDIENTE", "FINALIZADO"]),
});
