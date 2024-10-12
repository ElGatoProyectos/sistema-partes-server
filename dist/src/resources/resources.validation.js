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
exports.resourceValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_resources_repository_1 = require("./prisma-resources.repository");
const resourseCategory_validation_1 = require("@/resourseCategory/resourseCategory.validation");
const unit_validation_1 = require("@/unit/unit.validation");
const unifiedIndex_validation_1 = require("@/unifiedIndex/unifiedIndex.validation");
class ResourceValidation {
    updateResource(data, resource_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceCategoryResponse = yield resourseCategory_validation_1.resourseCategoryValidation.existsName(data["NOMBRE DEL RECURSO"].trim(), project_id);
                const resourceCategory = resourceCategoryResponse.payload;
                const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(data.UNIDAD, project_id);
                const unit = unitResponse.payload;
                const unifiedIndexResponse = yield unifiedIndex_validation_1.unifiedIndexValidation.findByName(data["NOMBRE INDICE UNIFICADO"].trim(), project_id);
                const unifiedIndex = unifiedIndexResponse.payload;
                const lastResource = yield exports.resourceValidation.codeMoreHigh(project_id);
                const lastResourceFind = lastResource.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastResourceFind === null || lastResourceFind === void 0 ? void 0 : lastResourceFind.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(4, "0");
                const resourceFormat = {
                    codigo: formattedCodigo,
                    nombre: data["NOMBRE DEL RECURSO"],
                    precio: data.PRECIO ? parseInt(data.PRECIO) : null,
                    unidad_id: unit.id,
                    proyecto_id: project_id,
                    id_unificado: unifiedIndex.id,
                    categoria_recurso_id: resourceCategory.id,
                };
                const resourceUpdate = yield prisma_resources_repository_1.prismaResourcesRepository.updateResource(resourceFormat, resource_id);
                return http_response_1.httpResponse.SuccessResponse("Recurso modificado correctamente", resourceUpdate);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Recurso", error);
            }
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.findByCode(code, project_id);
                if (resource) {
                    return http_response_1.httpResponse.NotFoundException("Recurso encontrado", resource);
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso no encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Recurso", error);
            }
        });
    }
    findByCodeValidation(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.findByCode(code, project_id);
                if (!resource) {
                    return http_response_1.httpResponse.NotFoundException("Recurso no encontrado", resource);
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Recurso", error);
            }
        });
    }
    findById(resource_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.findById(resource_id);
                if (!resource) {
                    return http_response_1.httpResponse.NotFoundException("Id del Recurso no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Recurso", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.findByName(name, project_id);
                if (resource) {
                    return http_response_1.httpResponse.NotFoundException("El nombre del Recurso ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Recurso", error);
            }
        });
    }
    findByNameValidation(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.findByName(name, project_id);
                if (!resource) {
                    return http_response_1.httpResponse.NotFoundException("No se encontró el nombre del Recurso en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Recurso", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield prisma_resources_repository_1.prismaResourcesRepository.codeMoreHigh(project_id);
                if (!resource) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", 0);
                }
                return http_response_1.httpResponse.SuccessResponse("Recurso encontrado", resource);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Recurso", error);
            }
        });
    }
}
exports.resourceValidation = new ResourceValidation();
