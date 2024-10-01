import express from "@/config/express.config";
import { authService } from "./auth.service";
import { httpResponse } from "@/common/http.response";

class AuthController {
  async login(request: express.Request, response: express.Response) {
    const body = request.body;
    const result = await authService.login(body);
    response.status(result.statusCode).json(result);
  }
  async me(request: express.Request, response: express.Response) {
    const tokenWithBearer = request.headers.authorization;
    if (tokenWithBearer) {
      const result = await authService.findMe(tokenWithBearer);
      if (!result.success) {
        response.status(result.statusCode).json(result);
      } else {
        response.status(result.statusCode).json(result);
      }
    } else {
      const result = httpResponse.UnauthorizedException(
        "Error en la autenticacion"
      );
      response.status(result.statusCode).json(result);
    }
  }
}

export const authController = new AuthController();
