"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const http_response_1 = require("@/common/http.response");
class AuthController {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const result = yield auth_service_1.authService.login(body);
            response.status(result.statusCode).json(result);
        });
    }
    me(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenWithBearer = request.headers.authorization;
            if (tokenWithBearer) {
                const result = yield auth_service_1.authService.findMe(tokenWithBearer);
                if (!result.success) {
                    response.status(result.statusCode).json(result);
                }
                else {
                    response.status(result.statusCode).json(result);
                }
            }
            else {
                const result = http_response_1.httpResponse.UnauthorizedException("Error en la autenticacion");
                response.status(result.statusCode).json(result);
            }
        });
    }
}
exports.authController = new AuthController();
