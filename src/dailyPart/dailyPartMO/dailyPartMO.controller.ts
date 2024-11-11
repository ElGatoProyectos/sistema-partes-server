import express from "../../config/express.config";
import { I_DailyPartMO } from "../models/dailyPart.interface";
import { dailyPartMOService } from "./dailyPartMO.service";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.dto";

class DailyPartMOController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartMO;
    const project_id = request.get("project-id") as string;
    const result = await dailyPartMOService.createDailyPartMO(
      data,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDailyPartMO = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await dailyPartMOService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartMOController = new DailyPartMOController();
