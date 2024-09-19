import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import validator from "validator";
import { proyectoStateDto } from "./dto/projectState.dto";

class ProjectMiddleware {
  verifyHeadersFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const id = request.params.id;
      if (!validator.isNumeric(id)) {
        throw new Error("El id debe ser numérico");
      }
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar campo "
      );
      response.status(result.statusCode).send(result);
    }
  }
  verifyFieldsUpdateState(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      proyectoStateDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar campos para actualizar el estado del Proyecto"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const projectMiddleware = new ProjectMiddleware();
