import express from "../config/express.config";
import { httpResponse } from "../common/http.response";
import validator from "validator";
import { categoryDto } from "./dto/category.dto";

class CategoryWorkforceMiddleware {
  verifyFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      categoryDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar campos "
      );
      response.status(result.statusCode).send(result);
    }
  }

  verifyHeadersFieldsId(
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
        "Error al validar el header"
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

export const categoryWorkforceMiddleware = new CategoryWorkforceMiddleware();
