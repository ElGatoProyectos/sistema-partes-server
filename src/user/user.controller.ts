import { T_FindAll } from "./models/user.service.types";
import express from "@/config/express.config";
import { I_CreateUserBody, I_UpdateUserBody } from "./models/user.interface";
import { userService } from "./user.service";

class UserController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUserBody;
    const result = await userService.createUser(data);
    response.status(result.statusCode).json(result);
  }

  async update(request: express.Request, response: express.Response) {
    const data = request.body as I_UpdateUserBody;
    const idUser = Number(request.params.id);
    const result = await userService.updateUser(data, idUser);
    response.status(result.statusCode).json(result);
  }

  async allUsers(request: express.Request, response: express.Response) {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
    let paginationOptions: T_FindAll = {
      queryParams: {
        page: page,
        limit: limit,
      },
    };
    const result = await userService.findAll(paginationOptions);
    response.status(result.statusCode).json(result);
  }
}

export const userController = new UserController();
