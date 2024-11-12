import express from "../../config/express.config";
import { dailyPartResourceService } from "./dailyPartResources.service";
import { T_FindAllDailyPartResource } from "./models/dailyPartResource.types";
import {
  I_CreateDailyPartResourceBody,
  I_UpdateDailyPartResourceBody,
} from "./models/dailyPartResources.interface";

class DailyPartResourceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateDailyPartResourceBody;
    const project_id = request.get("project-id") as string;
    const daily_part_id = Number(request.params.id);
    const result = await dailyPartResourceService.createDailyPart(
      data,
      +project_id,
      daily_part_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateDailyPartResourceBody;
    const daily_part_resource_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const result = await dailyPartResourceService.updateDailyPartResource(
      data,
      +project_id,
      daily_part_resource_id
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
    const daily_part_id = request.params.id;
    let paginationOptions: T_FindAllDailyPartResource = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await dailyPartResourceService.findAll(
      paginationOptions,
      project_id,
      +daily_part_id
    );
    response.status(result.statusCode).json(result);
  }

  async findById(request: express.Request, response: express.Response) {
    const daily_part_resource_id = Number(request.params.id);
    const result = await dailyPartResourceService.findById(
      daily_part_resource_id
    );
    response.status(result.statusCode).json(result);
  }
  async delete(request: express.Request, response: express.Response) {
    const daily_part_resource_id = Number(request.params.id);
    const result = await dailyPartResourceService.deleteDailyPartResource(
      daily_part_resource_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartResourceController = new DailyPartResourceController();
