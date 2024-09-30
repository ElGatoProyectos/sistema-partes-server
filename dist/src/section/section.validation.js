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
exports.sectionValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prismaSection_repository_1 = require("./prismaSection.repository");
class SectionValidation {
    findById(section_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const section = yield prismaSection_repository_1.prismaSectionRepository.findById(section_id);
                if (!section) {
                    return http_response_1.httpResponse.NotFoundException("Id de la Sección no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Sección encontrada", section);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Sección", error);
            }
        });
    }
}
exports.sectionValidation = new SectionValidation();
