import express from "../config/express.config";
import { assistsService } from "./assists.service";
import { T_FindAllAssists, T_FindAllWeekAssists } from "./models/assists.types";
import { httpResponse } from "../common/http.response";
import { I_AssistsBody } from "./models/assists.interface";

class AssistsController {
  async create(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization as string;
    if (!tokenWithBearer) {
      const result = httpResponse.UnauthorizedException(
        "No hay en Authorization para poder avanzar"
      );
      response.status(result.statusCode).json(result);
    }
    const result = await assistsService.create(project_id, tokenWithBearer);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async update(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const mano_obra_id = request.query.mano_obra_id as string;
    const tokenWithBearer = request.headers.authorization as string;
    if (!tokenWithBearer) {
      const result = httpResponse.UnauthorizedException(
        "No hay nada en Authorization para poder avanzar"
      );
      response.status(result.statusCode).json(result);
    }
    const numberMO = parseInt(mano_obra_id);
    const result = await assistsService.update(
      +numberMO,
      project_id,
      tokenWithBearer
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async updateStatus(request: express.Request, response: express.Response) {
    const assists_id = Number(request.params.id);
    const tokenWithBearer = request.headers.authorization as string;
    if (!tokenWithBearer) {
      const result = httpResponse.UnauthorizedException(
        "No hay nada en Authorization para poder avanzar"
      );
      response.status(result.statusCode).json(result);
    }
    const result = await assistsService.updateStatusAssists(
      assists_id,
      tokenWithBearer
    );
    response.status(result.statusCode).json(result);
  }
  async getAll(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const state = request.query.state as string;
    const week = request.query.week as string;
    const date = request.query.date as string;
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization as string;
    if (!tokenWithBearer) {
      const result = httpResponse.UnauthorizedException(
        "No hay en Authorization para poder avanzar"
      );
      response.status(result.statusCode).json(result);
    }

    let data: T_FindAllAssists = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        state: state,
        week: week,
        date: date,
      },
    };

    const result = await assistsService.findAll(
      data,
      project_id,
      tokenWithBearer
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async getAllForWeek(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const search = request.query.search as string;
    const week = request.query.week as string;
    const project_id = request.get("project-id") as string;
    const tokenWithBearer = request.headers.authorization as string;

    let data: T_FindAllWeekAssists = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
        week: week,
      },
    };

    const result = await assistsService.findAllForWeek(
      data,
      project_id,
      tokenWithBearer
    );

    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }
  async synchronization(request: express.Request, response: express.Response) {
    const project_id = request.get("project-id") as string;
    const result = await assistsService.synchronization(project_id);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async findById(request: express.Request, response: express.Response) {
    const assists_id = Number(request.params.id);
    const result = await assistsService.findById(assists_id);
    response.status(result.statusCode).json(result);
  }

  // async all(request: express.Request, response: express.Response) {
  //   const page = parseInt(request.query.page as string) || 1;
  //   const limit = parseInt(request.query.limit as string) || 20;
  //   const project_id = request.get("project-id") as string;
  //   const search = request.query.search as string;
  //   let paginationOptions: T_FindAllBank = {
  //     queryParams: {
  //       page: page,
  //       limit: limit,
  //       search: search,
  //     },
  //   };
  //   const result = await bankWorkforceService.findAll(
  //     paginationOptions,
  //     project_id
  //   );
  //   response.status(result.statusCode).json(result);
  // }
}

export const assistsController = new AssistsController();
