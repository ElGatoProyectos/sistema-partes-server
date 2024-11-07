import { httpResponse } from "../../common/http.response";
import express from "../../config/express.config";
import validator from "validator";
import { jwtService } from "../jwt.service";
import { jwtDecodeDto } from "../dtos/auth.dto";

class AuthMiddleware {
  existToken(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const authorization = request.get("Authorization");
      if (!authorization) throw new Error("Error al validar autenticacion");

      const [bearer, token] = authorization.split(" ");

      if (bearer !== "Bearer" || token === "" || !validator.isJWT(token))
        throw new Error("Error al validar autenticacion");

      const decodeToken = jwtService.verify(token);

      jwtDecodeDto.parse(decodeToken);

      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar autenticacion"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const authAuthmiddleware = new AuthMiddleware();
