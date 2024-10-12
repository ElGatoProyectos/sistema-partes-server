"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
const job_dto_1 = require("./dto/job.dto");
const jobUpdate_dto_1 = require("./dto/jobUpdate.dto");
class JobMiddleware {
    verifyFields(request, response, nextFunction) {
        try {
            job_dto_1.jobDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos para crear el Trabajo");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            jobUpdate_dto_1.jobUpdateDto.parse(request.body);
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos para actualizar el Trabajo");
            response.status(result.statusCode).send(result);
        }
    }
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
exports.jobMiddleware = new JobMiddleware();
