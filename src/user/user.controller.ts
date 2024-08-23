import { I_CreateUserBody } from "@/auth/models/auth.interface";
import express from "@/config/express.config";

class UserController {
  async create(request: express.Request, response: express.Response) {
    const data = request.body as I_CreateUserBody;
  }
}

export const userController = new UserController();
