import express from "../../config/express.config";
import { T_FindAlReportlWorkforce } from "./models/reportWorkforce.types";
import { trainReportService } from "./reportController.service";


class TrainReportController {

  async allTrainReports(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const category = request.query.category as string;
    const week = request.headers.week as string;
    // const project_id = Number(request.params.project_id);
    const search = request.query.search as string;
    let paginationOptions: T_FindAlReportlWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        category: category,
        week: week,
      },
    };
    const result = await trainReportService.findAll(paginationOptions, project_id);
    response.status(result.statusCode).json(result);
  }

 
}

export const trainReportController = new TrainReportController();
