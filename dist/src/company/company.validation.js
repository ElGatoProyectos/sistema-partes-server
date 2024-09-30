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
exports.companyValidation = void 0;
const user_validation_1 = require("@/user/user.validation");
const http_response_1 = require("../common/http.response");
const prisma_company_repository_1 = require("./prisma-company.repository");
const company_mapper_1 = require("./mapper/company.mapper");
class CompanyValidation {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailExists = yield prisma_company_repository_1.prismaCompanyRepository.existsEmail(email);
                if (emailExists) {
                    return http_response_1.httpResponse.NotFoundException("El correo ingresado de la empresa ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proseguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el nombre en la base de datos", error);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameExists = yield prisma_company_repository_1.prismaCompanyRepository.existsName(name);
                if (nameExists) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado de la empresa ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el nombre en la base de datos", error);
            }
        });
    }
    findByNameShort(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameShort = yield prisma_company_repository_1.prismaCompanyRepository.existsNameShort(name);
                if (nameShort) {
                    return http_response_1.httpResponse.NotFoundException("El nombre corto ingresado de la empresa ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre corto no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el nombre corto en la base de datos", error);
            }
        });
    }
    findByRuc(ruc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rucExists = yield prisma_company_repository_1.prismaCompanyRepository.existsRuc(ruc);
                if (rucExists) {
                    return http_response_1.httpResponse.NotFoundException("El Ruc ingresado de la empresa ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El Ruc no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el ruc en la base de datos", error);
            }
        });
    }
    findByIdUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_company_repository_1.prismaCompanyRepository.findByIdUser(id);
                if (!company)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la empresa del Usuario");
                return http_response_1.httpResponse.SuccessResponse("Empresa del Usuario encontrada con éxito", company);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar empresa", error);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_company_repository_1.prismaCompanyRepository.findById(id);
                if (!company)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la empresa solicitada");
                return http_response_1.httpResponse.SuccessResponse("Empresa encontrada con éxito", company);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar empresa", error);
            }
        });
    }
    createCompanyOfTheAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findByEmailAdmin("ale@gmail.com");
                if (!userResponse.success) {
                    return userResponse;
                }
                const user = userResponse.payload;
                const companyFormat = Object.assign(Object.assign({}, data), { usuario_id: user.id });
                const result = yield prisma_company_repository_1.prismaCompanyRepository.createCompany(companyFormat);
                const companyMapper = new company_mapper_1.CompanyResponseMapper(result);
                return http_response_1.httpResponse.CreatedResponse("Empresa creada correctamente", companyMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear empresa", error);
            }
        });
    }
}
exports.companyValidation = new CompanyValidation();
