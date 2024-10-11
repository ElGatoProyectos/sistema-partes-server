import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import validator from "validator";
import { unifiedIndexDto } from "./dto/unifiedIndex.dto";
import { unifiedIndexUpdateDto } from "./dto/unifiedIndexUpdate.dto";

class UnifiedIndexMiddleware {
  verifyFieldsRegistry(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      unifiedIndexDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar campos"
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
      unifiedIndexUpdateDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar los campos para actualizar el Indice Unificado"
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
        "Error al validar los campos"
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
      const project_id = request.get("project-id") as string;
      if (!validator.isNumeric(project_id)) {
        throw new Error("El id del proyecto debe ser numérico");
      }
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar el header"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const unifiedIndexMiddleware = new UnifiedIndexMiddleware();
