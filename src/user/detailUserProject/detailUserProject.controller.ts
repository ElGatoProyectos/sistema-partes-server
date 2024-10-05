import express from "@/config/express.config";
import { T_FindAllDetailUserProject } from "./models/detailUserProject.types";
import { detailUserProjectService } from "./detailUserProject.service";

class DetailUserProjectController {
  async allUsersByProject(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const name = request.query.name as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDetailUserProject = {
      queryParams: {
        page: page,
        limit: limit,
        name,
      },
    };
    const result = await detailUserProjectService.findAll(
      paginationOptions,
      project_id
    );

    response.status(result.statusCode).json(result);
  }
  async allUsersByProjectUnassigned(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const name = request.query.name as string;
    const project_id = request.get("project-id") as string;
    let paginationOptions: T_FindAllDetailUserProject = {
      queryParams: {
        page: page,
        limit: limit,
        name,
      },
    };
    const result = await detailUserProjectService.findAllUnassigned(
      paginationOptions,
      project_id
    );

    response.status(result.statusCode).json(result);
  }

  async deleteUserFromProject(
    request: express.Request,
    response: express.Response
  ) {
    const project_id = request.get("project-id") as string;
    const user_id = Number(request.params.id);
    const result = await detailUserProjectService.deleteUserFromProject(
      user_id,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
}

export const detailUserProjectController = new DetailUserProjectController();
