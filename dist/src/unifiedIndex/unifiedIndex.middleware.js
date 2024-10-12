"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unifiedIndexMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
const unifiedIndex_dto_1 = require("./dto/unifiedIndex.dto");
const unifiedIndexUpdate_dto_1 = require("./dto/unifiedIndexUpdate.dto");
class UnifiedIndexMiddleware {
    verifyFieldsRegistry(request, response, nextFunction) {
        try {
            unifiedIndex_dto_1.unifiedIndexDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            unifiedIndexUpdate_dto_1.unifiedIndexUpdateDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos para actualizar el Indice Unificado");
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
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos");
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
exports.unifiedIndexMiddleware = new UnifiedIndexMiddleware();
