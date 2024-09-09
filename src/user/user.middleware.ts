import express from "@/config/express.config";
import { userDto } from "./dto/user.dto";
import { httpResponse } from "@/common/http.response";
import { userUpdateDto } from "./dto/update.dto";
import { headerDto } from "./dto/header.params.dto";
import validator from "validator";
import { userAndCompanyDto } from "./dto/userAndCompany.dto";

class UserMiddleware {
  verifyFieldsRegistry(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      userDto.parse(request.body.user);
      if (!validator.isEmail(request.body.user.email)) {
        throw new Error("El formato del email ingresado no es válido");
      }
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        " Error al validar campos"
      );
      response.status(result.statusCode).send(result);
    }
  }

  verifyFieldsRegistryUserWithCompany(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      userAndCompanyDto.parse(request.body);
      // if (!validator.isEmail(request.body.email)) {
      //   throw new Error("El formato del email ingresado no es válido");
      // }
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        " Error al validar campos"
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
      userUpdateDto.parse(request.body);
      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        " Error al validar los campos para actualizar el usuario"
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
        " Error al validar los campos para traer los usuarios"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const userMiddleware = new UserMiddleware();
