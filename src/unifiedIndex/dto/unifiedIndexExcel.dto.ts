import { z } from "zod";

export const unifiedIndexExcelDto = z.object({
  idCompany: z.string(),
});
