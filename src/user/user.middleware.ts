import express from "@/config/express.config";
import { userDto } from "./dto/user.dto";
import { httpResponse } from "@/common/http.response";

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
        "Error al validar autenticacion"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const userMiddleware = new UserMiddleware();
