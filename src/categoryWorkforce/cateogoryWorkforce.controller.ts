import express from "../config/express.config";
import {
  I_CategoryWorkforceBody,
  I_CreateCategoryWorkforceBody,
} from "./models/categoryWorkforce.interface";
import { categoryWorkforceService } from "./categoryWorkforce.service";
import { T_FindAllCategoryWorkforce } from "./models/categoryWorkforce.types";

class CategoryWorkforceController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CategoryWorkforceBody;
    const project_id = request.get("project-id") as string;
    const categoryFormat: I_CreateCategoryWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await categoryWorkforceService.createCategoryWorkforce(
      categoryFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_CategoryWorkforceBody;
    const category_workforce_id = Number(request.params.id);
    const project_id = request.get("project-id") as string;
    const categoryFormat: I_CreateCategoryWorkforceBody = {
      nombre: data.nombre,
      proyecto_id: +project_id,
    };
    const result = await categoryWorkforceService.updateCategoryWorkforce(
      category_workforce_id,
      categoryFormat
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const category_workforce_id = Number(request.params.id);
    const result = await categoryWorkforceService.updateStatusCategoryWorkforce(
      category_workforce_id
    );
    response.status(result.statusCode).json(result);
  }

  async all(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    const project_id = request.get("project-id") as string;
    const search = request.query.search as string;
    let paginationOptions: T_FindAllCategoryWorkforce = {
      queryParams: {
        page: page,
        limit: limit,
        search: search,
      },
    };
    const result = await categoryWorkforceService.findAll(
      paginationOptions,
      project_id
    );
    response.status(result.statusCode).json(result);
  }
  async findById(request: express.Request, response: express.Response) {
    const category_workforce_id = Number(request.params.id);
    const result = await categoryWorkforceService.findById(
      category_workforce_id
    );
    response.status(result.statusCode).json(result);
  }
}

export const categoryWorkforceController = new CategoryWorkforceController();
