"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainMiddleware = void 0;
const train_dto_1 = require("./dto/train.dto");
const http_response_1 = require("@/common/http.response");
const update_dto_1 = require("./dto/update.dto");
const validator_1 = __importDefault(require("validator"));
class TrainMiddleware {
    verifyFields(request, response, nextFunction) {
        try {
            train_dto_1.trainDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos ");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            update_dto_1.trainUpdateDto.parse(request.body);
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos para actualizar el Tren");
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
exports.trainMiddleware = new TrainMiddleware();
