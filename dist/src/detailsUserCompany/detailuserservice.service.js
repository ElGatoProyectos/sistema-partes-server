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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailUserCompanyService = void 0;
const company_validation_1 = require("@/company/company.validation");
const http_response_1 = require("../common/http.response");
const prismaUserDetailCompany_respository_1 = require("./prismaUserDetailCompany.respository");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
class DetailUserCompanyService {
    createDetail(idUser, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseDetails = yield prismaUserDetailCompany_respository_1.prismaDetailUserCompanyRepository.createCompany(idUser, idCompany);
                return http_response_1.httpResponse.CreatedResponse("Detalle usuario-empresa creado correctamente", responseDetails);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear detalle usuario-empresa", error);
            }
        });
    }
    findAllUnassigned(data, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const companyResponse = yield company_validation_1.companyValidation.findById(+company_id);
                if (!companyResponse.success) {
                    return companyResponse;
                }
                const result = yield prismaUserDetailCompany_respository_1.prismaDetailUserCompanyRepository.getAllUsersOfProjectUnassigned(skip, data, +company_id);
                const { userAll, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: userAll,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Usuarios de la Empresa con Rol Sin Asignar", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todos los Usuarios de la Empresa con Rol Sin Asignar", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.detailUserCompanyService = new DetailUserCompanyService();
