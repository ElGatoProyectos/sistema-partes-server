import express from "../../config/express.config";
import { I_RiskDailyPartBody } from "./models/riskDailyPart.interface";
import { riskDailyPartService } from "./riskDailyPart.service";

class RiskDailyPartController {
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_RiskDailyPartBody;
    const daily_part_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await riskDailyPartService.updateRiskDailyPart(
      data,
      daily_part_id,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async findById(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const result = await riskDailyPartService.findById(id);
    response.status(result.statusCode).json(result);
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const result = await riskDailyPartService.updateStatusRisk(id);
    response.status(result.statusCode).json(result);
  }
}

export const riskDailyPartController = new RiskDailyPartController();
