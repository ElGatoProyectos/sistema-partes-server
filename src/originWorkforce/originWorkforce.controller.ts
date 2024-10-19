import express from "@/config/express.config";
import {
  I_CreateOriginWorkforceBody,
  I_OriginBody,
} from "./models/originWorkforce.interface";
import { originWorkforceService } from "./originWorkforce.service";
import { T_FindAllOrigin } from "./models/originWorkforce.types";

class OriginWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_OriginBody;
    const project_id = request.get("project-id") as string;
    const originFormat: I_CreateOriginWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await originWorkforceService.createOriginWorkforce(
      originFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_OriginBody;
    const origin_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const originFormat: I_CreateOriginWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await originWorkforceService.updateOriginWorkforce(
      origin_id,
      originFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const origiin_id = Number(request.params.id);
    const result = await originWorkforceService.updateStatusOriginWorkforce(
      origiin_id
    );
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllOrigin = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await originWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const originWorkforceController = new OriginWorkforceController();
