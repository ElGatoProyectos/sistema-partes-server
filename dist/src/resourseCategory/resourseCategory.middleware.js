"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourseCategoryMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
const resourseCategory_dto_1 = require("./dto/resourseCategory.dto");
class ResourseCategoryMiddleware {
    verifyFieldsRegistry(request, response, nextFunction) {
        try {
            resourseCategory_dto_1.resourseCategoryDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            resourseCategory_dto_1.resourseCategoryDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos para actualizar la Categoria del Recurso");
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
exports.resourseCategoryMiddleware = new ResourseCategoryMiddleware();
