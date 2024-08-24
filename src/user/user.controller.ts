import express from "@/config/express.config";
import { I_CreateUserBody } from "./models/user.interface";
import { userService } from "./user.service";

class UserController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUserBody;
    const result = await userService.createUser(data);
    response.status(result.statusCode).json(result);
  }
}

export const userController = new UserController();
