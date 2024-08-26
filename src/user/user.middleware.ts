import express from "@/config/express.config";
import { userDto } from "./dto/user.dto";
import { httpResponse } from "@/common/http.response";
import { userUpdateDto } from "./dto/update.dto";

class UserMiddleware {
  verifyFieldsRegistry(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      userDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "[m] Error al validar autenticacion"
      );
      response.status(result.statusCode).send(result);
    }
  }

  verifyFieldsUpdate(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      userUpdateDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "[m] Error al validar campos para actualizar el usuario"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const userMiddleware = new UserMiddleware();
