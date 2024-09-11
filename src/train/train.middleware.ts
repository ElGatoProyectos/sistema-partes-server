import express from "@/config/express.config";
import { trainDto } from "./dto/train.dto";
import { httpResponse } from "@/common/http.response";
import { trainUpdateDto } from "./dto/update.dto";
import validator from "validator";
import { cuadrillaDto } from "./dto/cuadrilla.dto";

class TrainMiddleware {
  verifyFields(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      trainDto.parse(request.body);
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
      trainUpdateDto.parse(request.body);
      nextFunction();
    } catch {
      const result = httpResponse.BadRequestException(
        "Error al validar campos para actualizar el Tren"
      );
      response.status(result.statusCode).send(result);
    }
  }

  verifyFieldsUpdateCuadrilla(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      cuadrillaDto.parse(request.body);
      nextFunction();
    } catch {
      console.log("llegoooo");
      const result = httpResponse.BadRequestException(
        "Error al validar campos para actualizar el Tren"
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
        " Error al validar el parámetro"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const trainMiddleware = new TrainMiddleware();
