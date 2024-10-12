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
exports.productionUnitValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_production_unit_repository_1 = require("./prisma-production-unit.repository");
const production_unit_mapper_1 = require("./mappers/production-unit.mapper");
class ProductionUnitValidation {
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findByCode(code, project_id);
                if (productionUnit) {
                    return http_response_1.httpResponse.NotFoundException("Codigo de la Unidad de Producción encontrado", productionUnit);
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad de Producción encontrado", productionUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar proyecto", error);
            }
        });
    }
    findByCodeValidation(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findByCode(code, project_id);
                if (!productionUnit) {
                    return http_response_1.httpResponse.NotFoundException("Codigo de la Unidad de Producción no encontrado", productionUnit);
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad de Producción encontrado", productionUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Unidad de Producción", error);
            }
        });
    }
    findById(idProductionUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.findById(idProductionUnit);
                if (!project) {
                    return http_response_1.httpResponse.NotFoundException("Id de la Unidad de Producción no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad de Producción encontrada", project);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Unidad de Producción", error);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.existsName(name);
                if (productionUnit) {
                    return http_response_1.httpResponse.NotFoundException("El Nombre de la Unidad de Producción ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("Nombre de la Unidad de Producción no encontrado", productionUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Unidad de Producción", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.codeMoreHigh(project_id);
                if (!productionUnit) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", []);
                }
                return http_response_1.httpResponse.SuccessResponse("Unidad de Producción encontrado", productionUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Unidad de Producción", error);
            }
        });
    }
    updateProductionUnit(data, idProductionUnit, idProjectID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnit = {
                    codigo: String(data.CODIGO),
                    nombre: data.NOMBRE,
                    nota: data.NOTA,
                    proyecto_id: Number(idProjectID),
                };
                const responseProductionUnit = yield prisma_production_unit_repository_1.prismaProductionUnitRepository.updateProductionUnit(productionUnit, idProductionUnit);
                const prouductionUnitMapper = new production_unit_mapper_1.ProductionUnitResponseMapper(responseProductionUnit);
                return http_response_1.httpResponse.SuccessResponse("Unidad de producción modificada correctamente", prouductionUnitMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Unidad de Producción", error);
            }
        });
    }
}
exports.productionUnitValidation = new ProductionUnitValidation();
