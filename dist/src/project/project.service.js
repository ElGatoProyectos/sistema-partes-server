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
exports.projectService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const prisma_project_repository_1 = require("./prisma-project.repository");
const app_root_path_1 = __importDefault(require("app-root-path"));
const project_constant_1 = require("./models/project.constant");
const promises_1 = __importDefault(require("fs/promises"));
const validator_1 = __importDefault(require("validator"));
const project_mapper_1 = require("./mapper/project.mapper");
const company_validation_1 = require("@/company/company.validation");
const project_validation_1 = require("./project.validation");
const jwt_service_1 = require("@/auth/jwt.service");
const client_1 = require("@prisma/client");
const week_service_1 = require("@/week/week.service");
class ProjectService {
    isNumeric(word) {
        if (!validator_1.default.isNumeric(word)) {
            return true;
        }
        else {
            return false;
        }
    }
    createProject(data, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const date = new Date();
                // const weekResponse = await weekService.findByYear(date.getFullYear());
                // if (!weekResponse.success) {
                //   console.log("ENTRO AL IF :0 xq no hay nada");
                //   await weekService.createWeek(date.getFullYear());
                // }
                const week = yield week_service_1.weekService.createWeek(2026);
                // const resultCompany = await companyValidation.findByIdUser(
                //   userResponse.id
                // );
                // if (!resultCompany.success) {
                //   return httpResponse.BadRequestException(
                //     "No se puede crear el proyecto con el id de la empresa proporcionado"
                //   );
                // }
                // const company = resultCompany.payload as Empresa;
                // const totalProjects = await projectValidation.totalProjectsByCompany(
                //   company.id
                // );
                // if (!totalProjects.success) {
                //   return totalProjects;
                // }
                // const total = totalProjects.payload as Number;
                // const rolResponse = await rolValidation.findByName("ADMIN");
                // const rol = rolResponse.payload as Rol;
                // if (
                //   userResponse.rol_id != rol.id &&
                //   total === userResponse.limite_proyecto
                // ) {
                //   return httpResponse.BadRequestException(
                //     "Alcanzó el límite de proyectos la empresa"
                //   );
                // }
                // const lastProject = await projectValidation.codeMoreHigh(company.id);
                // const lastProjectResponse = lastProject.payload as Proyecto;
                // // Incrementar el código en 1
                // const nextCodigo =
                //   (parseInt(lastProjectResponse?.codigo_proyecto) || 0) + 1;
                // const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                // const fecha_creacion = converToDate(data.fecha_inicio);
                // const fecha_fin = converToDate(data.fecha_fin);
                // let proyectFormat: any = {};
                // proyectFormat = {
                //   ...data,
                //   codigo_proyecto: formattedCodigo,
                //   estado: E_Proyecto_Estado.CREADO,
                //   costo_proyecto: Number(data.costo_proyecto),
                //   fecha_inicio: fecha_creacion,
                //   fecha_fin,
                //   empresa_id: company.id,
                // };
                // const project = await prismaProyectoRepository.createProject(
                //   proyectFormat
                // );
                // //[SUCCESS] Si estuvo todo ok se crea lo siguiente
                // //[NOTE]:  TIPO DE MANO DE OBRA
                // const typeWorkforce = await typeWorkforceService.createMasive(project.id);
                // if (!typeWorkforce.success) {
                //   return typeWorkforce;
                // }
                // //[NOTE]:  ORIGEN DE MANO DE OBRA
                // const responseOriginWorkforce = await originWorkforceService.createMasive(
                //   project.id
                // );
                // if (!responseOriginWorkforce.success) {
                //   return responseOriginWorkforce;
                // }
                // //[NOTE]:  CATEGORIA DE MANO DE OBRA
                // const responseCategoryWorkforce =
                //   await categoryWorkforceService.createMasive(project.id);
                // if (!responseCategoryWorkforce.success) {
                //   return responseCategoryWorkforce;
                // }
                // //[NOTE]:  ESPECIALIDAD DE MANO DE OBRA
                // const specialtyWorkforce = await specialtyWorkforceService.createMasive(
                //   project.id
                // );
                // if (!specialtyWorkforce.success) {
                //   return specialtyWorkforce;
                // }
                // //[NOTE]:  UNIDAD QUE LUEGO PUEDE SER USADO POR RECURSOS O MANO DE OBRA
                // const unitReponse = await unitService.createMasive(
                //   company.id,
                //   project.id
                // );
                // if (!unitReponse.success) {
                //   return unitReponse;
                // }
                // //[NOTE]:  TIPOS DE BANCO PARA MANO DE OBRA
                // const responseBankWorkforce = await bankWorkforceService.createMasive(
                //   project.id
                // );
                // if (!responseBankWorkforce.success) {
                //   return responseBankWorkforce;
                // }
                // //[NOTE]:  INDICE UNIFICADO DE RECURSOS
                // const responseUnifiedIndex = await unifiedIndexService.createMasive(
                //   company.id,
                //   project.id
                // );
                // if (!responseUnifiedIndex.success) {
                //   return responseUnifiedIndex;
                // }
                // //[NOTE]:  CATEGORIA DE LOS RECURSOS
                // const resourcesCategory = await resourseCategoryService.createMasive(
                //   project.id
                // );
                // if (!resourcesCategory.success) {
                //   return resourcesCategory;
                // }
                // const projectMapper = new ProjectResponseMapper(project);
                return http_response_1.httpResponse.CreatedResponse("Proyecto creado correctamente", "ja");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateProject(data, idProject, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                if (!resultCompany.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear el proyecto con el id de la empresa proporcionado");
                }
                const company = resultCompany.payload;
                const projectResponse = yield project_validation_1.projectValidation.findById(idProject);
                if (!projectResponse.success)
                    return projectResponse;
                let fecha_creacion = new Date(data.fecha_inicio);
                let fecha_fin = new Date(data.fecha_fin);
                const proyectFormat = Object.assign(Object.assign({}, data), { fecha_inicio: fecha_creacion, fecha_fin: fecha_fin, empresa_id: company.id });
                const project = yield prisma_project_repository_1.prismaProyectoRepository.updateProject(proyectFormat, idProject);
                const projectMapper = new project_mapper_1.ProjectResponseMapper(project);
                return http_response_1.httpResponse.SuccessResponse("Proyecto modificado correctamente", projectMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findIdImage(idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield prisma_project_repository_1.prismaProyectoRepository.findById(idProject);
                if (!projectResponse)
                    return http_response_1.httpResponse.NotFoundException("No se ha podido encontrar la imagen");
                const imagePath = app_root_path_1.default +
                    "/static/" +
                    project_constant_1.ProjectMulterProperties.folder +
                    "/" +
                    project_constant_1.ProjectMulterProperties.folder +
                    "_" +
                    projectResponse.id +
                    ".png";
                try {
                    // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
                    yield promises_1.default.access(imagePath, promises_1.default.constants.F_OK);
                }
                catch (error) {
                    return http_response_1.httpResponse.BadRequestException(" La Imagen no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("Imagen encontrada", imagePath);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la imagen", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect;
            }
        });
    }
    findById(idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield prisma_project_repository_1.prismaProyectoRepository.findById(idProject);
                if (!project) {
                    return http_response_1.httpResponse.NotFoundException("Id del proyecto no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Proyecto encontrado", project);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_project_repository_1.prismaProyectoRepository.searchNameProject(data, skip);
                const { projects, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: projects,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar proyectos", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAllProjectsXCompany(token, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const companyResponse = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                const company = companyResponse.payload;
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_project_repository_1.prismaProyectoRepository.allProjectsuser(company.id, data, skip);
                const { projects, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: projects,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los proyectos", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todos los proyectos", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusProject(idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield project_validation_1.projectValidation.findById(idProject);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                else {
                    const result = yield prisma_project_repository_1.prismaProyectoRepository.updateStatusProject(idProject);
                    return http_response_1.httpResponse.SuccessResponse("Proyecto eliminado correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar el proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateColorsProject(project_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield project_validation_1.projectValidation.findById(project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                else {
                    const projectFormat = {
                        color_primario: data.color_primario,
                        color_personalizado: data.color_personalizado,
                        color_linea: data.color_linea,
                        color_detalle: data.color_detalle,
                        color_menu: data.color_menu,
                        color_submenu: data.color_submenu,
                    };
                    const result = yield prisma_project_repository_1.prismaProyectoRepository.updateColorsProject(project_id, projectFormat);
                    return http_response_1.httpResponse.SuccessResponse("Los colores del Proyecto fueron cambiados correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al cambiar los colore del Proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStateProject(idProject, project_state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projectResponse = yield project_validation_1.projectValidation.findById(idProject);
                const estadoEnum = this.stringToProyectoEstado(project_state);
                if (estadoEnum === undefined) {
                    return http_response_1.httpResponse.NotFoundException("El estado ingresado del proyecto no coincide con las opciones");
                }
                if (!projectResponse.success) {
                    return projectResponse;
                }
                else {
                    const result = yield prisma_project_repository_1.prismaProyectoRepository.updateStateProject(idProject, estadoEnum);
                    return http_response_1.httpResponse.SuccessResponse("Estado del Proyecto cambiado correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al cambiar el estado del Proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    stringToProyectoEstado(estado) {
        if (Object.values(client_1.E_Proyecto_Estado).includes(estado)) {
            return estado;
        }
        return undefined;
    }
}
exports.projectService = new ProjectService();
