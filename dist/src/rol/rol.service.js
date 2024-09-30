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
exports.rolService = void 0;
const http_response_1 = require("../common/http.response");
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const prisma_rol_repository_1 = require("./prisma-rol.repository");
class RolService {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield prisma_rol_repository_1.prismaRolRepository.findAll();
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los roles", result);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al traer los roles", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    createRol(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existsNameRol = yield this.existsName(data.rol);
                if (!existsNameRol.success) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado ya existe en la base de datos");
                }
                const result = yield prisma_rol_repository_1.prismaRolRepository.createRol(data);
                return http_response_1.httpResponse.CreatedResponse("Rol creado correctamente", result);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al crear el rol", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol = yield prisma_rol_repository_1.prismaRolRepository.findById(id);
                if (!rol)
                    return http_response_1.httpResponse.NotFoundException("No se encontró el rol solicitado");
                return http_response_1.httpResponse.SuccessResponse("Rol encontrado con éxito", rol);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar rol", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    existsName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameResponse = yield prisma_rol_repository_1.prismaRolRepository.existsName(name);
                if (nameResponse) {
                    return http_response_1.httpResponse.NotFoundException("El nombre del rol ingresado ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre del rol no fue encontrado puede proseguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar nombre del rol", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.rolService = new RolService();
