"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolMiddleware = void 0;
const validator_1 = __importDefault(require("validator"));
const rol_dto_1 = require("./dto/rol.dto");
const http_response_1 = require("@/common/http.response");
class RolMiddleware {
    verifyFields(request, response, nextFunction) {
        try {
            rol_dto_1.rolDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException(" Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFields(request, response, nextFunction) {
        try {
            const id = request.params.id;
            if (!validator_1.default.isNumeric) {
                throw new Error("El id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException(" Error al validar los campos para traer los usuarios");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.rolMiddleware = new RolMiddleware();
