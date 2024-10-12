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
exports.detailUserProjectService = void 0;
const project_validation_1 = require("@/project/project.validation");
const prismaUserProject_repository_1 = require("./prismaUserProject.repository");
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const user_validation_1 = require("../user.validation");
const rol_validation_1 = require("@/rol/rol.validation");
const detailUserProject_validation_1 = require("./detailUserProject.validation");
class DetailUserProjectService {
    findAll(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const projectResponse = yield project_validation_1.projectValidation.findById(+project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const result = yield prismaUserProject_repository_1.prismaDetailUserProjectRepository.getAllUsersOfProject(skip, data, +project_id);
                const { userAll, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: userAll,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Usuarios del Proyecto", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todos los Usuarios del Proyecto", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAllUnassigned(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const projectResponse = yield project_validation_1.projectValidation.findById(+project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const result = yield prismaUserProject_repository_1.prismaDetailUserProjectRepository.getAllUsersOfProjectUnassigned(skip, data, +project_id);
                const { userAll, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: userAll,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Usuarios del Proyecto sin asignar", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todos los Usuarios del Proyecto sin asignar", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    deleteUserFromProject(user_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findById(user_id);
                if (!userResponse.success) {
                    return userResponse;
                }
                const user = userResponse.payload;
                const projectResponse = yield project_validation_1.projectValidation.findById(project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const project = projectResponse.payload;
                const rolResponse = yield rol_validation_1.rolValidation.findByName("NO_ASIGNADO");
                const rol = rolResponse.payload;
                const changeRolResponse = yield user_validation_1.userValidation.updateRolUser(user.id, rol.id, project.id);
                if (!changeRolResponse.success) {
                    return changeRolResponse;
                }
                const detailUserProjectResponse = yield detailUserProject_validation_1.detailProjectValidation.findByIdUser(user.id, project.id);
                const detailUserProject = detailUserProjectResponse.payload;
                if (!userResponse.success)
                    return userResponse;
                const result = yield prismaUserProject_repository_1.prismaDetailUserProjectRepository.deleteUserByDetail(detailUserProject.id);
                if (!result) {
                    return http_response_1.httpResponse.BadRequestException("Ocurrió un problema para borrar el Usuario del Proyecto");
                }
                return http_response_1.httpResponse.SuccessResponse("Usuario eliminado correctamente");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar el usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.detailUserProjectService = new DetailUserProjectService();
