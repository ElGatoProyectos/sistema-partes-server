import validator from "validator";
import { httpResponse } from "../../common/http.response";
import express from "../../config/express.config";
import { dailyPartDepartureDto } from "./dto/dailyPartDeparture.dto";

class DailyPartDepartureMiddleware {
  verifyFieldsUpdate(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      dailyPartDepartureDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar campos para actualizar el Parte Diario Partida"
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
  verifyHeadersFieldsIdDeparture(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const id = request.params.idDeparture;
      if (!validator.isNumeric(id)) {
        throw new Error("El id debe ser numérico de la Partida");
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

export const dailyPartDepartureMiddleware = new DailyPartDepartureMiddleware();
