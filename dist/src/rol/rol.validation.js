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
exports.rolValidation = void 0;
const http_response_1 = require("../common/http.response");
const prisma_rol_repository_1 = require("./prisma-rol.repository");
class RolValidation {
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
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol = yield prisma_rol_repository_1.prismaRolRepository.findByName(name);
                if (!rol)
                    return http_response_1.httpResponse.NotFoundException("No se encontró el rol con el nombre que desea buscar");
                return http_response_1.httpResponse.SuccessResponse("Rol encontrado con éxito", rol);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar rol", error);
            }
        });
    }
    createRol(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol = yield prisma_rol_repository_1.prismaRolRepository.createRol(data);
                if (!rol)
                    return http_response_1.httpResponse.NotFoundException("No se pudo crear el rol");
                return http_response_1.httpResponse.SuccessResponse("Se pudo crear el Rol con éxito", rol);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear rol", error);
            }
        });
    }
}
exports.rolValidation = new RolValidation();
