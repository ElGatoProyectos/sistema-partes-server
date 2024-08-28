import express from "@/config/express.config";
import validator from "validator";
import { httpResponse } from "../http.response";

class RequestMiddleware {
  validatePagination(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      const page = request.get("page");
      const limit = request.get("limit");
      console.log("page " + page);
      console.log("limit " + limit);
      if (page) {
        if (!validator.isNumeric(page)) {
          throw new Error("Error al validar peticion");
        }
      } else if (limit) {
        if (!validator.isNumeric(limit)) {
          throw new Error("Error al validar peticion");
        }
      } else {
        console.log("llegando aa next");
        nextFunction();
      }

      //nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "[mG] Error al validar la consulta del header"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const requestMiddleware = new RequestMiddleware();
