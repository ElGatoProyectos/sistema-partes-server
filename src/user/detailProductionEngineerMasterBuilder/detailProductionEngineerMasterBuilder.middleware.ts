import express from "../../config/express.config";
import { httpResponse } from "../../common/http.response";
import validator from "validator";

class DetailProductionEngineerMasterBuilderMiddleware {
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
        "Error al validar los campos"
      );
      response.status(result.statusCode).send(result);
    }
  }
  verifyHeadersFieldsIdProjectHeader(
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

export const detailProductionEngineerMasterBuilderMiddleware =
  new DetailProductionEngineerMasterBuilderMiddleware();
