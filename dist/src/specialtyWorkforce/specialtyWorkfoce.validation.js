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
exports.specialtyWorkforceValidation = void 0;
const http_response_1 = require("../common/http.response");
const prisma_specialtyWorkforce_1 = require("./prisma-specialtyWorkforce");
class SpecialtyWorkforceValidation {
    findById(bank_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialtyWorkforce = yield prisma_specialtyWorkforce_1.prismaSpecialtyWorkforceRepository.findById(bank_id);
                if (!specialtyWorkforce)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la Especialidad de la Mano de Obra solicitada");
                return http_response_1.httpResponse.SuccessResponse("Especialidad de la Mano de Obra encontrado con éxito", specialtyWorkforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Especialidad", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const specialtyWorkforce = yield prisma_specialtyWorkforce_1.prismaSpecialtyWorkforceRepository.findByName(name, project_id);
                if (!specialtyWorkforce)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la Especialidad de la Mano de Obra con el nombre que desea buscar");
                return http_response_1.httpResponse.SuccessResponse("Especialidad de la Mano de Obra encontrado con éxito", specialtyWorkforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Especialidad de la Mano de Obra", error);
            }
        });
    }
}
exports.specialtyWorkforceValidation = new SpecialtyWorkforceValidation();
