import { envConfig } from "@/config/env.config";
import express from "@/config/express.config";
import jwt from "@/config/jwt.config";
import { T_ResponseToken } from "../models/auth.type";
import { jwtService } from "../jwt.service";
import { httpResponse } from "@/common/http.response";

class AuthRoleMiddleware {
  private unauthorizedError = httpResponse.UnauthorizedException(
    "Error al autenticar usuario"
  );

  authAdmin(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const authorization = request.get("Authorization") as string;

      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      if (tokenDecrypted.role !== "ADMIN")
        response
          .status(this.unauthorizedError.statusCode)
          .send(this.unauthorizedError);

      nextFunction();
    } catch (error) {
      response
        .status(this.unauthorizedError.statusCode)
        .send(this.unauthorizedError);
    }
  }

  authUser() {}
}

export const authRoleMiddleware = new AuthRoleMiddleware();
