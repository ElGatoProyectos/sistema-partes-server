import express from "src/config/express.config";
import { I_DailyPartCreateBody } from "./models/dailyPart.interface";
import { dailyPartService } from "./dailyPart.service";

class DailyPartController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartCreateBody;
    const project_id = request.get("project-id") as string;
    const result = await dailyPartService.createDailyPart(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
}

export const dailyPartController = new DailyPartController();
