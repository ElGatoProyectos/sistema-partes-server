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
exports.detailProjectValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prismaUserProject_repository_1 = require("./prismaUserProject.repository");
class DetailProjectValidation {
    createDetailUserProject(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseDetailUserProject = yield prismaUserProject_repository_1.prismaDetailUserProjectRepository.createUserProject(data);
                return http_response_1.httpResponse.CreatedResponse("Detalle Usuario-Proyecto creado correctamente", responseDetailUserProject);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear Detalle Usuario-Proyecto", error);
            }
        });
    }
    findByIdUser(user_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detail = yield prismaUserProject_repository_1.prismaDetailUserProjectRepository.findByUser(user_id, project_id);
                if (!detail) {
                    return http_response_1.httpResponse.NotFoundException("Id del Usuario con el id del Proyecto no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Id Usuario del proyecto fue encontrado", detail);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
}
exports.detailProjectValidation = new DetailProjectValidation();
