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
exports.projectValidation = void 0;
const http_response_1 = require("../common/http.response");
const prisma_project_repository_1 = require("./prisma-project.repository");
class ProjectValidation {
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
        });
    }
    codeMoreHigh(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const project = yield prisma_project_repository_1.prismaProyectoRepository.codeMoreHigh(company_id);
                if (!project) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", 0);
                }
                return http_response_1.httpResponse.SuccessResponse("Proyecto encontrado", project);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Proyecto", error);
            }
        });
    }
}
exports.projectValidation = new ProjectValidation();
