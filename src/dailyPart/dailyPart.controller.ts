import express from "../config/express.config";
import {
  I_DailyPartCreateBody,
  I_DailyPartUpdateBody,
} from "./models/dailyPart.interface";
import { dailyPartService } from "./dailyPart.service";
import { T_FindAllDailyPart } from "./models/dailyPart.types";

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
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartUpdateBody;
    const project_id = request.get("project-id") as string;
    const daily_part_id = Number(request.params.id);
    const result = await dailyPartService.updateDailyPart(
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
    const result = await dailyPartService.findById(id);
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("job-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllDailyPart = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await dailyPartService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartController = new DailyPartController();
