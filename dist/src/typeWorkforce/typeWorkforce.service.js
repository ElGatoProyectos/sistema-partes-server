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
exports.typeWorkforceService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_typeWorkfoce_repository_1 = require("./prisma-typeWorkfoce.repository");
class TypeWorkforceService {
    createMasive(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [];
                data.push({ nombre: "Externo", proyecto_id: project_id });
                data.push({ nombre: "Obrero", proyecto_id: project_id });
                data.push({ nombre: "Staff", proyecto_id: project_id });
                const typeWorkforce = yield prisma_typeWorkfoce_repository_1.prismaTypeWorkforceRepository.createTypeWorkforceMasive(data);
                if (typeWorkforce.count === 0) {
                    return http_response_1.httpResponse.SuccessResponse("Hubo problemas para crear los Tipos de la Mano de Obra");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva los Tipos de la Mano de Obra");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear forma masiva los Tipos de la Mano de Obra", error);
            }
        });
    }
}
exports.typeWorkforceService = new TypeWorkforceService();
