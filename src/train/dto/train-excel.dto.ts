import { z } from "zod";

export const trainExcelDto = z.object({
  idProject: z.string(),
});
