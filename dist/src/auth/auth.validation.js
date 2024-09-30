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
exports.authValidation = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const http_response_1 = require("../common/http.response");
class AuthValidation {
    findRolPermisssion(rol_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissions = yield prisma_config_1.default.permisos.findMany({
                    where: {
                        rol_id: rol_id,
                    },
                    include: {
                        Accion: true,
                        Seccion: true,
                    },
                });
                if (!permissions) {
                    return http_response_1.httpResponse.NotFoundException("Permisos no encontrados");
                }
                return http_response_1.httpResponse.SuccessResponse("Permisos encontrado", permissions);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar proyecto", error);
            }
        });
    }
}
exports.authValidation = new AuthValidation();
