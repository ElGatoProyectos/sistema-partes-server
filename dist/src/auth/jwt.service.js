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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const env_config_1 = require("../config/env.config");
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
const user_service_1 = require("../user/user.service");
const http_response_1 = require("../common/http.response");
class JWTService {
    sign(payload) {
        return jwt_config_1.default.sign(payload, env_config_1.envConfig.jwt_token, { expiresIn: "30d" });
    }
    verify(token) {
        return jwt_config_1.default.verify(token, env_config_1.envConfig.jwt_token);
    }
    getUserFromToken(authorizationHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            const [bearer, token] = authorizationHeader.split(" ");
            const tokenDecrypted = exports.jwtService.verify(token);
            const userResponse = yield user_service_1.userService.findById(tokenDecrypted.id);
            if (!userResponse.success)
                return userResponse;
            return http_response_1.httpResponse.SuccessResponse("Usuario encontrado", userResponse.payload);
        });
    }
    getRolFromToken(authorizationHeader) {
        return __awaiter(this, void 0, void 0, function* () {
            const [bearer, token] = authorizationHeader.split(" ");
            const tokenDecrypted = exports.jwtService.verify(token);
            return http_response_1.httpResponse.SuccessResponse("Usuario encontrado", tokenDecrypted.role);
        });
    }
}
exports.jwtService = new JWTService();
