"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyMiddleware = void 0;
const validator_1 = __importDefault(require("validator"));
const companydto_1 = require("./dto/companydto");
const http_response_1 = require("@/common/http.response");
class CompanyMiddleware {
    verifyFields(request, response, nextFunction) {
        try {
            companydto_1.empresaDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException(" Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsFromUser(request, response, nextFunction) {
        try {
            companydto_1.empresaDto.parse(request.body.company);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException(" Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            companydto_1.empresaDto.parse(request.body);
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos para actualizar el proyecto");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFields(request, response, nextFunction) {
        try {
            const id = request.params.id;
            if (!validator_1.default.isNumeric(id)) {
                throw new Error("El id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException(" Error al validar el header");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.companyMiddleware = new CompanyMiddleware();
