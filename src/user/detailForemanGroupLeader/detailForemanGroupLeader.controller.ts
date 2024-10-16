import express from "@/config/express.config";
import { detailForemanGroupLeaderService } from "./detailForemanGroupLeader.service";
import { T_FindAllDetailForemanGroupLeader } from "./models/detailForemanGroupLeader.types";

class DetailForemanGroupLeaderController {
  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    // const project_id = Number(request.params.project_id);
    const search = request.query.search as string;
    let paginationOptions: T_FindAllDetailForemanGroupLeader = {
      queryParams: {
        page: page,
        limit: limit,
        name: search,
      },
    };
    const result = await detailForemanGroupLeaderService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const detailForemanGroupLeaderController =
  new DetailForemanGroupLeaderController();
