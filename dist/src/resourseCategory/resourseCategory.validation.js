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
exports.resourseCategoryValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_resourse_category_repository_1 = require("./prisma-resourse-category.repository");
class ResourseCategoryValidation {
    findById(idResourseCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourseCategory = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.findById(idResourseCategory);
                if (!resourseCategory) {
                    return http_response_1.httpResponse.NotFoundException("Id de la Categoria del Recurso no encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("La Categoria del Recurso encontrada", resourseCategory);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Categoria del Recurso ", error);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameExists = yield prisma_resourse_category_repository_1.prismaResourseCategoryRepository.existsName(name);
                if (nameExists) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado de la Categoria del recurso ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar la Categoria del recurso en la base de datos", error);
            }
        });
    }
}
exports.resourseCategoryValidation = new ResourseCategoryValidation();
