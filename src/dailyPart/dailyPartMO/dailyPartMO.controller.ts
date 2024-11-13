import express from "../../config/express.config";
import { dailyPartMOService } from "./dailyPartMO.service";
import {
  I_DailyPartMO,
  I_UpdateDailyPartBody,
} from "./models/dailyPartMO.interface";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.types";

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
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateDailyPartBody;
    const project_id = request.get("project-id") as string;
    const daily_part_id = request.params.id;
    const daily_part_mo_id = request.params.idMO;
    const result = await dailyPartMOService.updateDailyPartMO(
      data,
      +daily_part_id,
      +project_id,
      +daily_part_mo_id
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
    const category = request.query.category as string;
    const daily_part_id = request.params.id;
    let paginationOptions: T_FindAllDailyPartMO = {
      queryParams: {
        page: page,
        limit: limit,
        category: category,
      },
    };
    const result = await dailyPartMOService.findAll(
      paginationOptions,
      project_id,
      +daily_part_id
    );
    response.status(result.statusCode).json(result);
  }

  async findById(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const result = await dailyPartMOService.findById(id);
    response.status(result.statusCode).json(result);
  }

  async delete(request: express.Request, response: express.Response) {
    const id = Number(request.params.id);
    const result = await dailyPartMOService.delete(id);
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartMOController = new DailyPartMOController();
