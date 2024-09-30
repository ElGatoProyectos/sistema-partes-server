"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginMiddleware = void 0;
const http_response_1 = require("@/common/http.response");
const login_dto_1 = require("../dtos/login.dto");
class LoginMiddleware {
    validateBody(request, response, nextFunction) {
        try {
            login_dto_1.LoginDto.parse(request.body);
            nextFunction();
        }
        catch (error) {
            const result = http_response_1.httpResponse.BadRequestException("Error en la validacion de campos", error);
            response.status(result.statusCode).json(result);
        }
    }
}
exports.loginMiddleware = new LoginMiddleware();
