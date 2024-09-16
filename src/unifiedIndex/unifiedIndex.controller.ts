import { T_FindAll } from "@/common/models/pagination.types";
import express from "@/config/express.config";
import {
  I_CreateUnifiedIndexBody,
  I_UpdateUnifiedIndexBody,
} from "./models/unifiedIndex.interface";
import { unifiedIndexService } from "./unifiedIndex.service";

class UnifiedIndexController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUnifiedIndexBody;
    const result = await unifiedIndexService.createUnifiedIndex(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUnifiedIndexBody;
    const idResourseCategory = Number(request.params.id);
    const result = await unifiedIndexService.updateUnifiedIndex(
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
    const result = await unifiedIndexService.updateStatusUnifiedIndex(
      idResourseCategory
    );
    response.status(result.statusCode).json(result);
  }

  async findByIdUnifiedIndex(
    request: express.Request,
    response: express.Response
  ) {
    const idResourseCategory = Number(request.params.id);
    const result = await unifiedIndexService.findById(idResourseCategory);
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
    const result = await unifiedIndexService.findByName(
      name,
      paginationOptions
    );
    response.status(result.statusCode).json(result);
  }

  async allUnifiedIndex(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await unifiedIndexService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const unifiedIndexController = new UnifiedIndexController();
