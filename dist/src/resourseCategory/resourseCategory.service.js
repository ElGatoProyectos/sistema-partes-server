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
exports.resourseCategoryService = void 0;
const http_response_1 = require("@/common/http.response");
const resourseCategory_validation_1 = require("./resourseCategory.validation");
const prisma_resourse_category_repository_1 = require("./prisma-resourse-category.repository");
const resourseCategory_mapper_1 = require("./mapper/resourseCategory.mapper");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const project_validation_1 = require("@/project/project.validation");
class ResourseCategoryService {
    createResourseCategory(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear la Categoria del Recurso con el id del Proyecto proporcionado");
                }
                const lastCategory = yield resourseCategory_validation_1.resourseCategoryValidation.codeMoreHigh(project_id);
                const lastCategoryResponse = lastCategory.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastCategoryResponse === null || lastCategoryResponse === void 0 ? void 0 : lastCategoryResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                const resultIdResourseCategory = yield resourseCategory_validation_1.resourseCategoryValidation.findByName(data.nombre, project_id);
                if (!resultIdResourseCategory.success) {
                    return resultIdResourseCategory;
                }
                const resourceFormat = Object.assign(Object.assign({}, data), { codigo: formattedCodigo, proyecto_id: project_id });
                const responseResourseCategory = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.createResourseCategory(resourceFormat);
                const prouducResourseCategoryMapper = new resourseCategory_mapper_1.ResourseCategoryMapper(responseResourseCategory);
                return http_response_1.httpResponse.CreatedResponse("Categoria del recurso creado correctamente", prouducResourseCategoryMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear la Categoria del Recurso", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    createMasive(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [
                    {
                        codigo: "001",
                        nombre: "Mano de Obra",
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "002",
                        nombre: "Materiales",
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "003",
                        nombre: "Equipos",
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "004",
                        nombre: "Sub-contratas",
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "005",
                        nombre: "Varios",
                        proyecto_id: project_id,
                    },
                ];
                const units = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.createResourcesCategoryMasive(data);
                if (units.count === 0) {
                    return http_response_1.httpResponse.SuccessResponse("Hubo problemas para crear las Categorias de los Recursos");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva las Categorias de los Recursos");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear forma masiva las Categorias de los Recursos", error);
            }
        });
    }
    updateResourseCategory(data, idResourseCategory, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdResourseCategory = yield resourseCategory_validation_1.resourseCategoryValidation.findById(idResourseCategory);
                if (!resultIdResourseCategory.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id de la Categoria del Recurso que se quiere editar");
                }
                const resourceCategoryFind = resultIdResourseCategory.payload;
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede actualizar la Categoria del Recurso con el id del Proyecto proporcionado");
                }
                if (resourceCategoryFind.nombre != data.nombre) {
                    const resultIdResourseCategory = yield resourseCategory_validation_1.resourseCategoryValidation.findByName(data.nombre, project_id);
                    if (!resultIdResourseCategory.success) {
                        return resultIdResourseCategory;
                    }
                }
                const resourceFormat = Object.assign(Object.assign({}, data), { proyecto_id: project_id });
                const responseProductionUnit = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.updateResourseCategory(resourceFormat, idResourseCategory);
                const resourseCategoryMapper = new resourseCategory_mapper_1.ResourseCategoryMapper(responseProductionUnit);
                return http_response_1.httpResponse.SuccessResponse("La Categoria del recurso fue modificada correctamente", resourseCategoryMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Categoria del Recurso", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourseCategory = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.findById(idResourseCategory);
                if (!resourseCategory) {
                    return http_response_1.httpResponse.NotFoundException("El id de la Categoria del Recurso no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("La Categoria del Recurso fue encontrada", resourseCategory);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Categoria del Recurso", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.searchNameResourseCategory(name, skip, data.queryParams.limit);
                const { resoursesCategories, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: resoursesCategories,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar la Categoria del Recurso", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Categoria del Recurso", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAll(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdProject = yield project_validation_1.projectValidation.findById(+project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede traer todas las categorias del recurso con el id del proyecto proporcionado");
                }
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.findAll(skip, data.queryParams.limit, project_id);
                const { categoriesResources, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: categoriesResources,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas las Categorias de los Recursos", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas las Categorias de los Recursos", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusProject(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseCategoryResponse = yield resourseCategory_validation_1.resourseCategoryValidation.findById(idResourseCategory);
                if (!responseCategoryResponse.success) {
                    return responseCategoryResponse;
                }
                else {
                    const result = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.updateStatusResourseCategory(idResourseCategory);
                    return http_response_1.httpResponse.SuccessResponse("Categoria del Recurso eliminada correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar la Categoria del Recurso", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.resourseCategoryService = new ResourseCategoryService();
