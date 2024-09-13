import express from "@/config/express.config";
import {
  I_CreateResourseCategoryBody,
  I_UpdateResourseCategoryBody,
} from "./models/resourseCategory.interface";
import { resourseCategoryService } from "./resourseCategory.service";
import { T_FindAll } from "@/common/models/pagination.types";

class ResourceCategoryController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateResourseCategoryBody;
    const result = await resourseCategoryService.createResourseCategory(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateResourseCategoryBody;
    const idResourseCategory = Number(request.params.id);
    const result = await resourseCategoryService.updateResourseCategory(
      data,
      idResourseCategory
    );
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async updateStatus(request: express.Request, response: express.Response) {
    const idResourseCategory = Number(request.params.id);
    const result = await resourseCategoryService.updateStatusProject(
      idResourseCategory
    );
    response.status(result.statusCode).json(result);
  }

  async findByIdResourseCategory(
    request: express.Request,
    response: express.Response
  ) {
    const idResourseCategory = Number(request.params.id);
    const result = await resourseCategoryService.findById(idResourseCategory);
    response.status(result.statusCode).json(result);
  }

  async findByName(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const name = request.query.name as string;
    const result = await resourseCategoryService.findByName(
      name,
      paginationOptions
    );
    response.status(result.statusCode).json(result);
  }

  async allResoursesCategories(
    request: express.Request,
    response: express.Response
  ) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await resourseCategoryService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const resourseCategoryController = new ResourceCategoryController();
