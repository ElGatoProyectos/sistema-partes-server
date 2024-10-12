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
exports.categoryWorkforceValidation = void 0;
const http_response_1 = require("../common/http.response");
const prisma_categoryWorkfoce_repository_1 = require("./prisma-categoryWorkfoce.repository");
class CategoryWorkforceValidation {
    findById(bank_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryWorkforce = yield prisma_categoryWorkfoce_repository_1.prismaCategoryWorkforceRepository.findById(bank_id);
                if (!categoryWorkforce)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la Categoria de la Mano de Obra solicitado");
                return http_response_1.httpResponse.SuccessResponse("Categoria de la Mano de Obra encontrado con éxito", categoryWorkforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Categoria de la Mano de Obra", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryWorkforce = yield prisma_categoryWorkfoce_repository_1.prismaCategoryWorkforceRepository.findByName(name, project_id);
                if (!categoryWorkforce)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la Categoria de la Mano de Obra con el nombre que desea buscar");
                return http_response_1.httpResponse.SuccessResponse("Categoria de la Mano de Obra encontrado con éxito", categoryWorkforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Categoria de la Mano de Obra", error);
            }
        });
    }
    createBank(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryWorkforce = yield prisma_categoryWorkfoce_repository_1.prismaCategoryWorkforceRepository.createCategoryWorkforce(data);
                if (!categoryWorkforce)
                    return http_response_1.httpResponse.NotFoundException("No se pudo crear la Categoria de la Mano de Obra");
                return http_response_1.httpResponse.SuccessResponse("Se pudo crear la Categoria de la Mano de Obra", categoryWorkforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear la Categoria de la Mano de Obra", error);
            }
        });
    }
}
exports.categoryWorkforceValidation = new CategoryWorkforceValidation();
