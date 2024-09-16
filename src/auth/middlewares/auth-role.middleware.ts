import { envConfig } from "@/config/env.config";
import express from "@/config/express.config";
import jwt from "@/config/jwt.config";
import { T_ResponseToken } from "../models/auth.type";
import { jwtService } from "../jwt.service";
import { httpResponse } from "@/common/http.response";

class AuthRoleMiddleware {
  authAdmin(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    const customError = httpResponse.UnauthorizedException(
      "Error en la autenticación"
    );
    try {
      const authorization = request.get("Authorization") as string;

      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      if (tokenDecrypted.role !== "ADMIN") {
        response.status(customError.statusCode).send(customError);
      } else {
        nextFunction();
      }
    } catch (error) {
      response.status(customError.statusCode).send(customError);
    }
  }
  authAdminAndProjectManager(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    const customError = httpResponse.UnauthorizedException(
      "Error en la autenticación"
    );
    try {
      const authorization = request.get("Authorization") as string;

      if (!authorization) {
        return response.status(customError.statusCode).send(customError);
      }

      const [bearer, token] = authorization.split(" ");

      const tokenDecrypted = jwtService.verify(token) as T_ResponseToken;

      // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
      if (
        tokenDecrypted.role === "ADMIN" ||
        tokenDecrypted.role === "GERENTE_PROYECTO"
      ) {
        nextFunction();
      } else {
        response.status(customError.statusCode).send(customError);
      }
    } catch (error) {
      response.status(customError.statusCode).send(customError);
    }
  }

  authUser() {}
}

export const authRoleMiddleware = new AuthRoleMiddleware();
