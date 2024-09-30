"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoleMiddleware = void 0;
const jwt_service_1 = require("../jwt.service");
const http_response_1 = require("@/common/http.response");
class AuthRoleMiddleware {
    authAdmin(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            if (tokenDecrypted.role !== "ADMIN") {
                response.status(customError.statusCode).send(customError);
            }
            else {
                nextFunction();
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authAdminAndProjectManager(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            if (!authorization) {
                return response.status(customError.statusCode).send(customError);
            }
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "GERENTE_PROYECTO") {
                nextFunction();
            }
            else {
                response.status(customError.statusCode).send(customError);
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authAdminAndCostControl(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            if (!authorization) {
                return response.status(customError.statusCode).send(customError);
            }
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "CONTROL_COSTOS") {
                nextFunction();
            }
            else {
                response.status(customError.statusCode).send(customError);
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authAdminAndGeneralProjectAndCostControlAndUser(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            if (!authorization) {
                return response.status(customError.statusCode).send(customError);
            }
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "CONTROL_COSTOS" ||
                tokenDecrypted.role === "USER") {
                nextFunction();
            }
            else {
                response.status(customError.statusCode).send(customError);
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authAdminAndProjectManagerAndUser(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            if (!authorization) {
                return response.status(customError.statusCode).send(customError);
            }
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "GERENTE_PROYECTO" ||
                tokenDecrypted.role === "USER" ||
                tokenDecrypted.role === "CONTROL_COSTOS" ||
                tokenDecrypted.role === "ASISTENTE_CONTROL_COSTOS" ||
                tokenDecrypted.role === "INGENIERO_PRODUCCION" ||
                tokenDecrypted.role === "ASISTENTE_PRODUCCION" ||
                tokenDecrypted.role === "MAESTRO_OBRA" ||
                tokenDecrypted.role === "CAPATAZ" ||
                tokenDecrypted.role === "ADMINISTRACION_OBRA" ||
                tokenDecrypted.role === "INGENIERO_SSOMMA" ||
                tokenDecrypted.role === "ASISTENTE_SSOMMA" ||
                tokenDecrypted.role === "LOGISTICA" ||
                tokenDecrypted.role === "ASISTENTE_ALMACEN") {
                nextFunction();
            }
            else {
                response.status(customError.statusCode).send(customError);
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authViewAll(request, response, nextFunction) {
        const customError = http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        try {
            const authorization = request.get("Authorization");
            if (!authorization) {
                return response.status(customError.statusCode).send(customError);
            }
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "GERENTE_PROYECTO" ||
                tokenDecrypted.role === "USER") {
                nextFunction();
            }
            else {
                response.status(customError.statusCode).send(customError);
            }
        }
        catch (error) {
            response.status(customError.statusCode).send(customError);
        }
    }
    authUser() { }
}
exports.authRoleMiddleware = new AuthRoleMiddleware();
