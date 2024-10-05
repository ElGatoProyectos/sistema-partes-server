import { httpResponse } from "@/common/http.response";
import express from "@/config/express.config";
import validator from "validator";

class DetailUserCompanyMiddleware {
  verifyHeadersFieldsIdCompanyHeader(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const project_id = request.get("company-id") as string;
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

export const detailUserCompanyMiddleware = new DetailUserCompanyMiddleware();
