import { z } from "zod";

export const proyectoStateDto = z.object({
  state: z.enum(["CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
});
