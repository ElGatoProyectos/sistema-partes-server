import express from "@/config/express.config";
import { I_AssistsBody } from "./models/assists.interface";
import { assistsService } from "./assists.service";

class AssistsController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_AssistsBody;
    const project_id = request.get("project-id") as string;

    const result = await assistsService.create(data, project_id);
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
