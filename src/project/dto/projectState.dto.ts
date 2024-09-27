import { z } from "zod";

export const proyectoStateDto = z.object({
  estado: z.enum(["CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
});
