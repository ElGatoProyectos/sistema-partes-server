import express from "@/config/express.config";
import validator from "validator";
import { prouductionUnitDto } from "./dto/production-unit.dto";
import { httpResponse } from "@/common/http.response";

class ProductionUnitMiddleware {
  verifyFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      prouductionUnitDto.parse(request.body);
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
      prouductionUnitDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar campos para actualizar la Unidad de Produccion"
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
        "Error al validar el parámetro"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const productionUnitMiddleware = new ProductionUnitMiddleware();
