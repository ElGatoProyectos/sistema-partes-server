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
exports.unitValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_unit_repository_1 = require("./prisma-unit.repository");
class UnitValidation {
    updateUnifiedIndex(data, unit_id, company_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndexFormat = {
                    codigo: String(data["ID-UNIT"]),
                    nombre: data.NOMBRE,
                    simbolo: data.SIMBOLO,
                    descripcion: data.DESCRIPCION,
                    empresa_id: company_id,
                    proyecto_id: project_id,
                };
                const responseUnifiedIndex = yield prisma_unit_repository_1.prismaUnitRepository.updateUnit(unifiedIndexFormat, unit_id);
                return http_response_1.httpResponse.SuccessResponse("Unidad modificada correctamente", responseUnifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Unidad", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.codeMoreHigh(project_id);
                if (!responseUnit) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", []);
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad encontrada", responseUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Unidad", error);
            }
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unit = yield prisma_unit_repository_1.prismaUnitRepository.findByCode(code, project_id);
                if (unit) {
                    return http_response_1.httpResponse.NotFoundException("Unidad fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("La Unidad fue encontrada", unit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad ", error);
            }
        });
    }
    findById(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unitResponse = yield prisma_unit_repository_1.prismaUnitRepository.findById(idResourseCategory);
                if (!unitResponse) {
                    return http_response_1.httpResponse.NotFoundException("Unidad no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("La Unidad fue encontrada", unitResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad ", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameExists = yield prisma_unit_repository_1.prismaUnitRepository.existsName(name, project_id);
                if (nameExists) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado de la Unidad ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar la Categoria del recurso en la base de datos", error);
            }
        });
    }
    findBySymbol(symbol, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const symbolExists = yield prisma_unit_repository_1.prismaUnitRepository.existsSymbol(symbol, project_id);
                if (symbolExists) {
                    return http_response_1.httpResponse.NotFoundException("El simbolo ingresado de la Unidad ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El simbolo no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar el simbolo de la Unidad en la base de datos", error);
            }
        });
    }
}
exports.unitValidation = new UnitValidation();
