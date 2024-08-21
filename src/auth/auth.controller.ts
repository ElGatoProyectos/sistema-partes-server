import express from "@/config/express.config";
import { authService } from "./auth.service";

class AuthController {
  async login(request: express.Request, response: express.Response) {
    const body = request.body;
    const result = await authService.login(body);
    response.status(result.statusCode).json(result);
  }
}

export const authController = new AuthController();
