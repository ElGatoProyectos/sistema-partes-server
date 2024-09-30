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
exports.authService = void 0;
const http_response_1 = require("@/common/http.response");
const jwt_service_1 = require("./jwt.service");
const bcrypt_service_1 = require("@/auth/bcrypt.service");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const login_mapper_1 = __importDefault(require("./mappers/login.mapper"));
const rol_service_1 = require("@/rol/rol.service");
const client_1 = require("@prisma/client");
const auth_validation_1 = require("./auth.validation");
class AuthService {
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield prisma_config_1.default.usuario.findFirst({
                    where: {
                        OR: [{ email: body.username }, { dni: body.username }],
                        eliminado: client_1.E_Estado_BD.n,
                        //contrasena: data.contrasena,
                    },
                });
                if (!user) {
                    return http_response_1.httpResponse.UnauthorizedException("Credenciales incorrectas", null);
                }
                // validar password
                if (!bcrypt_service_1.bcryptService.comparePassword(body.password, user.contrasena)) {
                    return http_response_1.httpResponse.UnauthorizedException("Credenciales incorrectas", null);
                }
                const role = yield rol_service_1.rolService.findById(user.rol_id);
                const responseRole = role.payload;
                const userResponse = new login_mapper_1.default(user, responseRole.rol);
                const rolePayload = role.payload;
                //const { estatus, contrasena, ...userWithoutSensitiveData } = user;
                // retornarjwt
                const token = jwt_service_1.jwtService.sign({
                    id: user.id,
                    username: user.email,
                    role: rolePayload.rol,
                });
                return http_response_1.httpResponse.SuccessResponse("Usuario logueado con éxito", {
                    user: userResponse,
                    token,
                });
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error", error);
            }
            finally {
            }
        });
    }
    verifyRolProject(authorization) {
        try {
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "GERENTE_PROYECTO") {
                return http_response_1.httpResponse.SuccessResponse("Éxito en la autenticación");
            }
        }
        catch (error) {
            // console.log(error);
            return http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        }
    }
    verifyRolProjectAdminAndCostControlAndProjectManagerAndUser(authorization) {
        try {
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN" ||
                tokenDecrypted.role === "GERENTE_PROYECTO" ||
                tokenDecrypted.role === "CONTROL_COSTOS" ||
                tokenDecrypted.role === "USER") {
                return http_response_1.httpResponse.SuccessResponse("Éxito en la autenticación");
            }
        }
        catch (error) {
            // console.log(error);
            return http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        }
    }
    findMe(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const permisos = yield auth_validation_1.authValidation.findRolPermisssion(userResponse.rol_id);
                let formatUser = {
                    usuario: userResponse,
                    permisos: permisos.payload,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito en la autenticación", formatUser);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear el usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.authService = new AuthService();
