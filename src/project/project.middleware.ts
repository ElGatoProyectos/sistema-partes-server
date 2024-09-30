import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import validator from "validator";
import { proyectoStateDto } from "./dto/projectState.dto";
import { proyectoColorsDto } from "./dto/projectColors.dto";

class ProjectMiddleware {
  verifyColors(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      proyectoColorsDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar campos "
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
  verifyHeadersFieldsIdProject(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const id = request.params.project_id;
      if (!validator.isNumeric(id)) {
        throw new Error("El id debe ser numérico");
      }
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException("Error al validar campo");
      response.status(result.statusCode).send(result);
    }
  }
  verifyFieldsUpdateState(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      if (request.query.state) {
        proyectoStateDto.parse({ state: request.query.state });
        nextFunction();
      } else {
        nextFunction();
      }
    } catch {
      const result = httpResponse.BadRequestException(
        "El estado ingresado no es válido"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const projectMiddleware = new ProjectMiddleware();
