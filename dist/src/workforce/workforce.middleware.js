"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workforceMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
class WorkforceMiddleware {
    // verifyFields(
    //   request: express.Request,
    //   response: express.Response,
    //   nextFunction: express.NextFunction
    // ) {
    //   try {
    //     trainDto.parse(request.body);
    //     nextFunction();
    //   } catch (error) {
    //     const result = httpResponse.BadRequestException(
    //       "Error al validar campos "
    //     );
    //     response.status(result.statusCode).send(result);
    //   }
    // }
    // verifyFieldsUpdate(
    //   request: express.Request,
    //   response: express.Response,
    //   nextFunction: express.NextFunction
    // ) {
    //   try {
    //     trainUpdateDto.parse(request.body);
    //     nextFunction();
    //   } catch {
    //     const result = httpResponse.BadRequestException(
    //       "Error al validar campos para actualizar el Tren"
    //     );
    //     response.status(result.statusCode).send(result);
    //   }
    // }
    verifyHeadersFieldsId(request, response, nextFunction) {
        try {
            const id = request.params.id;
            if (!validator_1.default.isNumeric(id)) {
                throw new Error("El id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar el header");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFieldsIdProject(request, response, nextFunction) {
        try {
            const project_id = request.get("project-id");
            if (!validator_1.default.isNumeric(project_id)) {
                throw new Error("El id del proyecto debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar el header");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.workforceMiddleware = new WorkforceMiddleware();
