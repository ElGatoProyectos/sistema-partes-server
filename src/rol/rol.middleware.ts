import express from "@/config/express.config";

import validator from "validator";
import { rolDto } from "./dto/rol.dto";
import { httpResponse } from "@/common/http.response";

class RolMiddleware {
  verifyFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      rolDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        " Error al validar campos"
      );
      response.status(result.statusCode).send(result);
    }
  }

  verifyHeadersFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const id = request.params.id;
      if (!validator.isNumeric) {
        throw new Error("El id debe ser numérico");
      }
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        " Error al validar los campos para traer los usuarios"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const rolMiddleware = new RolMiddleware();
