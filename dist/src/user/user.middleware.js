"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const user_dto_1 = require("./dto/user.dto");
const http_response_1 = require("@/common/http.response");
const update_dto_1 = require("./dto/update.dto");
const validator_1 = __importDefault(require("validator"));
const updateUserRol_dto_1 = require("./dto/updateUserRol.dto");
class UserMiddleware {
    verifyFieldsRegistry(request, response, nextFunction) {
        try {
            user_dto_1.userDto.parse(request.body);
            if (!validator_1.default.isEmail(request.body.email)) {
                throw new Error("El formato del email ingresado no es válido");
            }
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdate(request, response, nextFunction) {
        try {
            update_dto_1.userUpdateDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos para actualizar el usuario");
            response.status(result.statusCode).send(result);
        }
    }
    verifyFieldsUpdateRol(request, response, nextFunction) {
        try {
            updateUserRol_dto_1.userUpdateRolDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos para actualizar el rol del usuario");
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
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos ");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFieldsRolId(request, response, nextFunction) {
        try {
            const id = request.params.rol_id;
            if (!validator_1.default.isNumeric(id)) {
                throw new Error("El rol_id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFieldsProjectId(request, response, nextFunction) {
        try {
            const id = request.params.project_id;
            if (!validator_1.default.isNumeric(id)) {
                throw new Error("El project_id debe ser numérico");
            }
            nextFunction();
        }
        catch (_a) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar los campos");
            response.status(result.statusCode).send(result);
        }
    }
    verifyHeadersFieldsIdProjectHeader(request, response, nextFunction) {
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
exports.userMiddleware = new UserMiddleware();
