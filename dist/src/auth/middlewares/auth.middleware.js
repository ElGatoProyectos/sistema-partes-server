"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAuthmiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const validator_1 = __importDefault(require("validator"));
const jwt_service_1 = require("../jwt.service");
const auth_dto_1 = require("../dtos/auth.dto");
class AuthMiddleware {
    existToken(request, response, nextFunction) {
        try {
            const authorization = request.get("Authorization");
            if (!authorization)
                throw new Error("Error al validar autenticacion");
            const [bearer, token] = authorization.split(" ");
            if (bearer !== "Bearer" || token === "" || !validator_1.default.isJWT(token))
                throw new Error("Error al validar autenticacion");
            const decodeToken = jwt_service_1.jwtService.verify(token);
            auth_dto_1.jwtDecodeDto.parse(decodeToken);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error al validar autenticacion");
            response.status(result.statusCode).send(result);
        }
    }
}
exports.authAuthmiddleware = new AuthMiddleware();
