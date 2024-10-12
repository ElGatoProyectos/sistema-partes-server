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
exports.bankWorkforceValidation = void 0;
const http_response_1 = require("../common/http.response");
const prisma_bankWorkforce_repository_1 = require("./prisma-bankWorkforce.repository");
class BankWorkforceValidation {
    findById(bank_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bank = yield prisma_bankWorkforce_repository_1.prismaBankWorkforceRepository.findById(bank_id);
                if (!bank)
                    return http_response_1.httpResponse.NotFoundException("No se encontró el banco solicitado");
                return http_response_1.httpResponse.SuccessResponse("Banco encontrado con éxito", bank);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Banco", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bank = yield prisma_bankWorkforce_repository_1.prismaBankWorkforceRepository.findByName(name, project_id);
                if (!bank)
                    return http_response_1.httpResponse.NotFoundException("No se encontró el Banco con el nombre que desea buscar");
                return http_response_1.httpResponse.SuccessResponse("Banco encontrado con éxito", bank);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Banco", error);
            }
        });
    }
    createBank(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bank = yield prisma_bankWorkforce_repository_1.prismaBankWorkforceRepository.createBankWorkforce(data);
                if (!bank)
                    return http_response_1.httpResponse.NotFoundException("No se pudo crear el Banco");
                return http_response_1.httpResponse.SuccessResponse("Se pudo crear el Banco con éxito", bank);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear el Banco", error);
            }
        });
    }
}
exports.bankWorkforceValidation = new BankWorkforceValidation();
