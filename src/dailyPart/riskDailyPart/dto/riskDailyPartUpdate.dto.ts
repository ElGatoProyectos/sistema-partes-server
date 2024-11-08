import { z } from "zod";

export const riskDailyPartUpdate = z.object({
  descripcion: z.string().optional(),
  estado: z.enum(["PENDIENTE", "SOLUCIONADO"]),
  riesgo: z.enum(["BAJO", "MEDIO", "ALTO"]),
});
