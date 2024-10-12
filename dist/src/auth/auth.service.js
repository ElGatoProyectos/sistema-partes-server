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
const detail_user_company_validation_1 = require("@/detailsUserCompany/detail-user-company.validation");
const http_response_1 = require("@/common/http.response");
const jwt_service_1 = require("./jwt.service");
const bcrypt_service_1 = require("@/auth/bcrypt.service");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const login_mapper_1 = __importDefault(require("./mappers/login.mapper"));
const rol_service_1 = require("@/rol/rol.service");
const client_1 = require("@prisma/client");
const auth_validation_1 = require("./auth.validation");
const company_validation_1 = require("@/company/company.validation");
const rol_validation_1 = require("@/rol/rol.validation");
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
    verifyRolProjectAdminUser(authorization) {
        try {
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
                return http_response_1.httpResponse.SuccessResponse("Éxito en la autenticación");
            }
        }
        catch (error) {
            // console.log(error);
            return http_response_1.httpResponse.UnauthorizedException("Error en la autenticación");
        }
    }
    verifyRolProject(authorization) {
        try {
            const [bearer, token] = authorization.split(" ");
            const tokenDecrypted = jwt_service_1.jwtService.verify(token);
            // Cambiamos la lógica para permitir "ADMIN" o "GERENTE_PROYECTO"
            if (tokenDecrypted.role === "ADMIN") {
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
                const rolResponseUser = yield rol_validation_1.rolValidation.findByName("USER");
                const rolResponseAdmin = yield rol_validation_1.rolValidation.findByName("ADMIN");
                if (!rolResponseUser.success) {
                    return rolResponseUser;
                }
                if (!rolResponseAdmin.success) {
                    return rolResponseAdmin;
                }
                let companyResponse = {};
                let formatUser = {};
                formatUser = {
                    usuario: userResponse,
                    permisos: permisos.payload,
                };
                const rolUser = rolResponseUser.payload;
                const rolAdmin = rolResponseAdmin.payload;
                if (userResponse.rol_id === rolUser.id ||
                    userResponse.rol_id === rolAdmin.id) {
                    companyResponse = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                    if (!companyResponse.success) {
                        return companyResponse;
                    }
                    formatUser.empresa = companyResponse.payload;
                }
                else {
                    companyResponse = yield detail_user_company_validation_1.detailUserCompanyValidation.findByIdUser(userResponse.id);
                    if (!companyResponse.success) {
                        return companyResponse;
                    }
                    const detail = companyResponse.payload;
                    const companyFind = yield company_validation_1.companyValidation.findById(detail.empresa_id);
                    formatUser.empresa = companyFind.payload;
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito en la autenticación", formatUser);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error en la autenticación del usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.authService = new AuthService();
