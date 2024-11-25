import { T_FindAll } from "../common/models/pagination.types";
import express from "../config/express.config";
import { I_CreateRolBody } from "./models/rol.interfaces";
import { T_FindAllRol } from "./models/rol.types";
import { rolService } from "./rol.service";

class RolController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateRolBody;
    const result = await rolService.createRol(data);
    if (!result.success) {
      response.status(result.statusCode).json(result);
    } else {
      response.status(result.statusCode).json(result);
    }
  }

  async findByIdRol(request: express.Request, response: express.Response) {
    const idRol = Number(request.params.id);
    const result = await rolService.findById(idRol);
    response.status(result.statusCode).json(result);
  }

  async allRoles(request: express.Request, response: express.Response) {
    const isOrder = request.query.isOrder as string;
    let paginationOptions: T_FindAllRol = {
      queryParams: {
        isOrder: isOrder,
      },
    };
    const result = await rolService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const rolController = new RolController();
