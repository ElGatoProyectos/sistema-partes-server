import express from "../../config/express.config";
import { T_FindAllTrainReport } from "./models/trainReport.types";
import { trainReportService } from "./trainReport.service";


class TrainReportController {

  async allTrainReports(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const week = request.query.week as string;
    let paginationOptions: T_FindAllTrainReport = {
      queryParams: {
        page: page,
        limit: limit,
        week: week,
      },
    };
    const result = await trainReportService.findAll(paginationOptions, project_id);
    response.status(result.statusCode).json(result);
  }

  async getInformation(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const result = await trainReportService.getInformation(+project_id);
    response.status(result.statusCode).json(result);
  }


}

export const trainReportController = new TrainReportController();
