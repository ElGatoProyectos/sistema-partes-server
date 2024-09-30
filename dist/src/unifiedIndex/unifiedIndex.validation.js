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
exports.unifiedIndexValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_unified_index_1 = require("./prisma-unified-index");
class UnifiedIndexValidation {
    updateUnifiedIndex(data, idUnit, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndexFormat = {
                    codigo: String(data.ID),
                    nombre: data.Nombre,
                    simbolo: data.Simbolo,
                    comentario: data.Comentario,
                    empresa_id: idCompany,
                };
                const responseUnifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.updateUnifiedIndex(unifiedIndexFormat, idUnit);
                return http_response_1.httpResponse.SuccessResponse("Indice Unificado modificado correctamente", responseUnifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Indice Unificado", error);
            }
        });
    }
    codeMoreHigh() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.codeMoreHigh();
                if (!unifiedIndex) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", []);
                }
                return http_response_1.httpResponse.SuccessResponse("Indice Unificado encontrado", unifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Indice Unificado", error);
            }
        });
    }
    findByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.findByCode(code);
                if (unifiedIndex) {
                    return http_response_1.httpResponse.NotFoundException("El códgo del Indice Unificado encontrado", unifiedIndex);
                }
                return http_response_1.httpResponse.SuccessResponse("El códgo del Indice Unificado fue encontrado", unifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el códgo del Indice Unificado", error);
            }
        });
    }
    findById(idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.findById(idUnifiedIndex);
                if (!unifiedIndex) {
                    return http_response_1.httpResponse.NotFoundException("Id del Indice Unificado no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("El Indice Unificado fue encontrado", unifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Indice Unificado", error);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameExists = yield prisma_unified_index_1.prismaUnifiedIndexRepository.existsName(name);
                if (nameExists) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado del Indice Unificado ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Indice Unificado en la base de datos", error);
            }
        });
    }
    findBySymbol(symbol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const symbolExists = yield prisma_unified_index_1.prismaUnifiedIndexRepository.existSymbol(symbol);
                if (symbolExists) {
                    return http_response_1.httpResponse.NotFoundException("El Simbolo ingresado del Indice Unificado ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El Simbolo no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Simbolo del Indice Unificado en la base de datos", error);
            }
        });
    }
}
exports.unifiedIndexValidation = new UnifiedIndexValidation();
