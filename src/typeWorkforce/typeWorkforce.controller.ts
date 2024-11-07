import express from "../config/express.config";
import {
  I_CreateTypeWorkforceBody,
  I_TypeBody,
} from "./models/typeWorkforce.interface";
import { typeWorkforceService } from "./typeWorkforce.service";
import { T_FindAllType } from "./models/typeWorkforce.types";

class TypeWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_TypeBody;
    const project_id = request.get("project-id") as string;
    const typeFormat: I_CreateTypeWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await typeWorkforceService.createTypeWorkforce(typeFormat);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_TypeBody;
    const type_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const typeFormat: I_CreateTypeWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await typeWorkforceService.updateTypeWorkforce(
      type_id,
      typeFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const type_id = Number(request.params.id);
    const result = await typeWorkforceService.updateStatusTypeWorkforce(
      type_id
    );
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllType = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await typeWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
  async findByIdType(request: express.Request, response: express.Response) {
    const type_id = Number(request.params.id);
    const result = await typeWorkforceService.findById(type_id);
    response.status(result.statusCode).json(result);
  }
}

export const typeWorkforceController = new TypeWorkforceController();
