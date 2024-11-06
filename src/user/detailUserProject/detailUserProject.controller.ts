import express from "../../config/express.config";
import {
  T_FindAllDetailUser,
  T_FindAllDetailUserProject,
} from "./models/detailUserProject.types";
import { detailUserProjectService } from "./detailUserProject.service";
import {
  I_CreateDetailAssignment,
  I_DeleteDetail,
} from "./models/detail.interface";
import { httpResponse } from "../../common/http.response";

class DetailUserProjectController {
  async createDetailAssignment(
    request: express.Request,
    response: express.Response
  ) {
    const data = request.body as I_CreateDetailAssignment;
    const project_id = request.get("project-id") as string;
    const result = await detailUserProjectService.createDetail(
      data,
      +project_id
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async allUsersByProject(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const name = request.query.name as string;
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization;
    if (!tokenWithBearer) {
      return httpResponse.BadRequestException(
        "No hay nada en el Authorization"
      );
    }
    let paginationOptions: T_FindAllDetailUserProject = {
      queryParams: {
        page: page,
        limit: limit,
        name,
      },
    };
    const result = await detailUserProjectService.findAll(
      paginationOptions,
      project_id,
      tokenWithBearer
    );

    response.status(result.statusCode).json(result);
  }
  async allUsersAvailableForAssignDetail(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const user_id = Number(request.params.id);
    const name = request.query.name as string;
    const project_id = request.get("project-id") as string;

    let paginationOptions: T_FindAllDetailUserProject = {
      queryParams: {
        page: page,
        limit: limit,
        name,
      },
    };
    const result = await detailUserProjectService.findAllAvailable(
      paginationOptions,
      project_id,
      user_id
    );
    if (result?.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(400).json(result);
    }
  }
  async allUsersResponsible(
    request: express.Request,
    response: express.Response
  ) {
    const project_id = request.get("project-id") as string;
    const result = await detailUserProjectService.findAllResponsible(
      project_id
    );
    if (result?.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(400).json(result);
    }
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

  async allDetailAccordingToTheRole(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const project_id = request.get("project-id") as string;
    const user_id = Number(request.params.id);
    let paginationOptions: T_FindAllDetailUserProject = {
      queryParams: {
        page: page,
        limit: limit,
        name: search,
      },
    };
    const result = await detailUserProjectService.getDetailForRole(
      paginationOptions,
      project_id,
      user_id
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
  async deleteDetail(request: express.Request, response: express.Response) {
    const body = request.body as I_DeleteDetail;
    const project_id = request.get("project-id") as string;
    const user_id = request.query.user_id as string;
    const assignment = request.query.assignment as string;
    const detailFormat: I_DeleteDetail = {
      user_id: user_id,
      assignment: assignment,
    };
    const result = await detailUserProjectService.deleteDetail(
      detailFormat,
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
