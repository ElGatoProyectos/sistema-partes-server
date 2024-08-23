import { httpResponse, T_HttpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import { LoginDto } from "../dtos/login.dto";

class LoginMiddleware {
  validateBody(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      LoginDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error en la validacion de campos",
        error
      );
      response.status(result.statusCode).json(result);
    }
  }
}

export const loginMiddleware = new LoginMiddleware();
