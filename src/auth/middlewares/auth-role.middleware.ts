import express from "@/config/express.config";
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
  authAdminUser(
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
        tokenDecrypted.role === "GERENTE_PROYECTO" ||
        tokenDecrypted.role === "USER" ||
        tokenDecrypted.role === "CONTROL_COSTOS" ||
        tokenDecrypted.role === "ASISTENTE_CONTROL_COSTOS" ||
        tokenDecrypted.role === "INGENIERO_PRODUCCION" ||
        tokenDecrypted.role === "ASISTENTE_PRODUCCION" ||
        tokenDecrypted.role === "MAESTRO_OBRA" ||
        tokenDecrypted.role === "CAPATAZ" ||
        tokenDecrypted.role === "ADMINISTRACION_OBRA" ||
        tokenDecrypted.role === "INGENIERO_SSOMMA" ||
        tokenDecrypted.role === "ASISTENTE_SSOMMA" ||
        tokenDecrypted.role === "LOGISTICA" ||
        tokenDecrypted.role === "ASISTENTE_ALMACEN"
      ) {
        nextFunction();
      } else {
        response.status(customError.statusCode).send(customError);
      }
    } catch (error) {
      response.status(customError.statusCode).send(customError);
    }
  }
}

export const authRoleMiddleware = new AuthRoleMiddleware();
