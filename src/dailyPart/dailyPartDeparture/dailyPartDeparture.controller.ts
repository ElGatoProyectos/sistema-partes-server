import express from "../../config/express.config";
import { dailyPartDepartureService } from "./dailyPartDeparture.service";
import { I_DailyPartDepartureBody } from "./models/dailyPartDeparture.interface";
import { T_FindAllDailyPartDeparture } from "./models/dailyPartDeparture.types";

class DailyPartDepartureController {
  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_DailyPartDepartureBody;
    const daily_part_id = Number(request.params.id);
    const daily_part_departure_id = Number(request.params.idDeparture);
    const result = await dailyPartDepartureService.updateDailyPartDeparture(
      data,
      daily_part_id,
      daily_part_departure_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async findById(request: express.Request, response: express.Response) {
    const daily_part_departure_id = Number(request.params.id);
    const result = await dailyPartDepartureService.findById(
      daily_part_departure_id
    );
    response.status(result.statusCode).json(result);
  }

  async allForJob(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const daily_part_id = Number(request.params.id);
    let paginationOptions: T_FindAllDailyPartDeparture = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await dailyPartDepartureService.findAllForJob(
      paginationOptions,
      daily_part_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const dailyPartDepartureController = new DailyPartDepartureController();