import express from "@/config/express.config";
import {
  I_CreateSpecialtyWorkforceBody,
  I_SpecialtyBody,
} from "./models/specialtyWorkforce.interface";
import { specialtyWorkforceService } from "./specialtyWorkforce.service";
import { T_FindAllSpecialty } from "./models/specialtyWorkforce.types";

class SpecialtyWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_SpecialtyBody;
    const project_id = request.get("project-id") as string;
    const specialtyFormat: I_CreateSpecialtyWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await specialtyWorkforceService.createOriginWorkforce(
      specialtyFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_SpecialtyBody;
    const specialty_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const originFormat: I_CreateSpecialtyWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await specialtyWorkforceService.updateOriginWorkforce(
      specialty_id,
      originFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const specialty_id = Number(request.params.id);
    const result = await specialtyWorkforceService.updateStatusOriginWorkforce(
      specialty_id
    );
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllSpecialty = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await specialtyWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }

  async findByIdSpecialty(
    request: express.Request,
    response: express.Response
  ) {
    const specialty_id = Number(request.params.id);
    const result = await specialtyWorkforceService.findById(specialty_id);
    response.status(result.statusCode).json(result);
  }
}

export const specialtyWorkforceController = new SpecialtyWorkforceController();
