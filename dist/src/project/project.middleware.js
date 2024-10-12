"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
const projectState_dto_1 = require("./dto/projectState.dto");
const projectColors_dto_1 = require("./dto/projectColors.dto");
class ProjectMiddleware {
    verifyColors(request, response, nextFunction) {
        try {
            projectColors_dto_1.proyectoColorsDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos ");
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
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campo ");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFieldsIdProject(request, response, nextFunction) {
        try {
            const id = request.params.project_id;
            if (!validator_1.default.isNumeric(id)) {
                throw new Error("El id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campo");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdateState(request, response, nextFunction) {
        try {
            if (request.query.state) {
                projectState_dto_1.proyectoStateDto.parse({ state: request.query.state });
                nextFunction();
            }
            else {
                nextFunction();
            }
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("El estado ingresado no es válido");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.projectMiddleware = new ProjectMiddleware();
