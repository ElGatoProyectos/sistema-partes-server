import validator from "validator";
import { httpResponse } from "../../common/http.response";
import express from "../../config/express.config";
import { dailyPartResourceMO } from "./dto/dailyPartResources.dto";
import { dailyPartResourceUpdateMO } from "./dto/dailyPartResourcesUpdate.dto";

class DailyPartResourceMiddleware {
  verifyFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      dailyPartResourceMO.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar campos "
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
      dailyPartResourceUpdateMO.parse(request.body);
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

export const dailyPartResourceMiddleware = new DailyPartResourceMiddleware();
