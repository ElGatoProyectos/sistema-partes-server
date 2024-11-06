import express from "../../config/express.config";
import { priceHourWorkforceService } from "./priceHourWorkforce.service";
import { I_PriceHourWorkforce } from "./models/priceHourWorkforce.interface";
import { T_FindAllPriceHourWorkforce } from "./models/priceHourWorkforce.types";

class PriceHourWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_PriceHourWorkforce;
    const project_id = request.get("project-id") as string;
    const result = await priceHourWorkforceService.create(data, +project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_PriceHourWorkforce;
    const project_id = request.get("project-id") as string;
    const price_hour_id = Number(request.params.id);
    const result = await priceHourWorkforceService.update(
      price_hour_id,
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
    const search = request.query.search as string;
    let paginationOptions: T_FindAllPriceHourWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await priceHourWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async findById(request: express.Request, response: express.Response) {
    const price_hour_id = Number(request.params.id);
    const result = await priceHourWorkforceService.findById(price_hour_id);
    response.status(result.statusCode).json(result);
  }
}

export const priceHourWorkforceController = new PriceHourWorkforceController();
