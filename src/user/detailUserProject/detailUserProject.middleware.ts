import express from "@/config/express.config";
import { httpResponse } from "@/common/http.response";
import { detailAssignmentDto } from "./dto/detail.dto";

class DetailUserProjectMiddleware {
  verifyFieldsAssignment(
    request: express.Request,
    response: express.Response,
    nextFunction: express.NextFunction
  ) {
    try {
      detailAssignmentDto.parse(request.body);

      nextFunction();
    } catch (error) {
      const result = httpResponse.BadRequestException(
        "Error al validar campos"
      );
      response.status(result.statusCode).send(result);
    }
  }
}

export const detailUserProjectMiddleware = new DetailUserProjectMiddleware();
