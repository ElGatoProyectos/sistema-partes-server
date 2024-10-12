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
exports.bankWorkforceService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_bankWorkforce_repository_1 = require("./prisma-bankWorkforce.repository");
class BankWorkforceService {
    createMasive(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [];
                data.push({ nombre: "BAN BINF", proyecto_id: project_id });
                data.push({ nombre: "BANCO NACION", proyecto_id: project_id });
                data.push({ nombre: "ASISTENTE", proyecto_id: project_id });
                data.push({ nombre: "BBVA", proyecto_id: project_id });
                data.push({ nombre: "BCP", proyecto_id: project_id });
                data.push({ nombre: "EFECTIVO", proyecto_id: project_id });
                data.push({ nombre: "INTERBANK", proyecto_id: project_id });
                data.push({ nombre: "OTROS", proyecto_id: project_id });
                data.push({ nombre: "SCOTIABANK", proyecto_id: project_id });
                const bankWorkforce = yield prisma_bankWorkforce_repository_1.prismaBankWorkforceRepository.createBankWorkforceMasive(data);
                if (bankWorkforce.count === 0) {
                    return http_response_1.httpResponse.SuccessResponse("Hubo problemas para crear los Bancos de la Mano de Obra");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva de los Bancos de la Mano de Obra");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear forma masiva de los Bancos de la Mano de Obra", error);
            }
        });
    }
}
exports.bankWorkforceService = new BankWorkforceService();
