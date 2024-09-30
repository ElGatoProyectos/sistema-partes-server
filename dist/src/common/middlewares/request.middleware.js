"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestMiddleware = void 0;
const validator_1 = __importDefault(require("validator"));
const http_response_1 = require("../http.response");
class RequestMiddleware {
    validatePagination(request, response, nextFunction) {
        try {
            const page = request.query.page;
            const limit = request.query.limit;
            if (page || limit) {
                if (!validator_1.default.isNumeric(page)) {
                    throw new Error("Error al validar peticion");
                }
                else if (!validator_1.default.isNumeric(limit)) {
                    throw new Error("Error al validar peticion");
                }
                else {
                    nextFunction();
                }
            }
            else {
                // console.log("llegando aa next");
                nextFunction();
            }
            //nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("[mG] Error al validar la consulta del header");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.requestMiddleware = new RequestMiddleware();
