import { z } from "zod";

export const proyectoStateDto = z.object({
  state: z.enum(["TODOS", "CREADO", "REPROGRAMADO", "EJECUCION", "TERMINADO"]),
});
