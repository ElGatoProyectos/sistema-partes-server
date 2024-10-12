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
exports.detailUserCompanyValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prismaUserDetailCompany_respository_1 = require("./prismaUserDetailCompany.respository");
class DetailUserCompanyValidation {
    findByIdCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detail = yield prismaUserDetailCompany_respository_1.prismaDetailUserCompanyRepository.findByIdCompany(company_id);
                if (!detail) {
                    return http_response_1.httpResponse.NotFoundException("Detalle Usuario-Empresa de la empresa proporcionada no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Detalle Usuario-Empresa encontrado de la empresa proporcionada", detail);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Detalle Usuario-Empresa ", error);
            }
        });
    }
    findByIdUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const detail = yield prismaUserDetailCompany_respository_1.prismaDetailUserCompanyRepository.findByIdUser(user_id);
                if (!detail) {
                    return http_response_1.httpResponse.NotFoundException("Detalle Usuario-Empresa de la empresa proporcionada no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Detalle Usuario-Empresa encontrado de la empresa proporcionada", detail);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Detalle Usuario-Empresa ", error);
            }
        });
    }
    totalUserByCompany(company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countUsersByCompany = yield prismaUserDetailCompany_respository_1.prismaDetailUserCompanyRepository.countUsersForCompany(company_id);
                if (!countUsersByCompany) {
                    return http_response_1.httpResponse.NotFoundException("La empresa proporcionada para buscar sus usuarios no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Se encontró la cantidad de usuarios de la empresa", countUsersByCompany);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la cantidad de usuarios de la empresa", error);
            }
        });
    }
}
exports.detailUserCompanyValidation = new DetailUserCompanyValidation();
