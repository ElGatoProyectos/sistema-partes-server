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
exports.companyService = void 0;
const http_response_1 = require("../common/http.response");
const prisma_company_repository_1 = require("./prisma-company.repository");
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
const company_mapper_1 = require("./mapper/company.mapper");
const company_constant_1 = require("./models/company.constant");
const app_root_path_1 = __importDefault(require("app-root-path"));
const promises_1 = __importDefault(require("fs/promises"));
const number_1 = require("../common/utils/number");
const largeMinEleven_1 = require("../common/utils/largeMinEleven");
const user_validation_1 = require("../user/user.validation");
const company_validation_1 = require("./company.validation");
const email_1 = require("../common/utils/email");
const jwt_service_1 = require("../auth/jwt.service");
class CompanyService {
    createCompany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userResponse = yield user_validation_1.userValidation.findById(Number(data.usuario_id));
                if (!userResponse.success) {
                    return userResponse;
                }
                const responseName = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                if (!responseName.success)
                    return responseName;
                const responseNameShort = yield company_validation_1.companyValidation.findByNameShort(data.nombre_empresa);
                if (!responseNameShort.success)
                    return responseNameShort;
                const responseRuc = yield company_validation_1.companyValidation.findByRuc(data.nombre_empresa);
                if (!responseRuc.success)
                    return responseRuc;
                if (data.ruc) {
                    const resultRuc = (0, number_1.lettersInNumbers)(data.ruc);
                    if (resultRuc) {
                        return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener solo números");
                    }
                    const resultRucLength = (0, largeMinEleven_1.largeMinEleven)(data.ruc);
                    if (resultRucLength) {
                        return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener por lo menos 11 caracteres");
                    }
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                const resultEmail = (0, email_1.emailValid)(data.correo);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                const responseEmail = yield company_validation_1.companyValidation.findByEmail(data.correo);
                if (!responseEmail.success)
                    return responseEmail;
                const companyFormat = Object.assign(Object.assign({}, data), { usuario_id: Number(data.usuario_id) });
                const result = yield prisma_company_repository_1.prismaCompanyRepository.createCompany(companyFormat);
                const companyMapper = new company_mapper_1.CompanyResponseMapper(result);
                return http_response_1.httpResponse.CreatedResponse("Empresa creada correctamente", companyMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    createCompanyWithTokenUser(data, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse.success) {
                    return userTokenResponse;
                }
                const userResponse = userTokenResponse.payload;
                const responseName = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                if (!responseName.success)
                    return responseName;
                const responseNameShort = yield company_validation_1.companyValidation.findByNameShort(data.nombre_empresa);
                if (!responseNameShort.success)
                    return responseNameShort;
                const responseRuc = yield company_validation_1.companyValidation.findByRuc(data.nombre_empresa);
                if (!responseRuc.success)
                    return responseRuc;
                if (data.ruc) {
                    const resultRuc = (0, number_1.lettersInNumbers)(data.ruc);
                    if (resultRuc) {
                        return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener solo números");
                    }
                    const resultRucLength = (0, largeMinEleven_1.largeMinEleven)(data.ruc);
                    if (resultRucLength) {
                        return http_response_1.httpResponse.BadRequestException("El campo Ruc debe contener por lo menos 11 caracteres");
                    }
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                const resultEmail = (0, email_1.emailValid)(data.correo);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                const responseEmail = yield company_validation_1.companyValidation.findByEmail(data.correo);
                if (!responseEmail.success)
                    return responseEmail;
                const companyFormat = Object.assign(Object.assign({}, data), { usuario_id: userResponse.id });
                const result = yield prisma_company_repository_1.prismaCompanyRepository.createCompany(companyFormat);
                const companyMapper = new company_mapper_1.CompanyResponseMapper(result);
                return http_response_1.httpResponse.CreatedResponse("Empresa creada correctamente", companyMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_company_repository_1.prismaCompanyRepository.findAll(skip, data.queryParams.limit);
                const { companies, total } = result;
                //numero de pagina donde estas
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: companies,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas las empresas", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer las empresas", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findIdImage(idProject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productionUnitResponse = yield prisma_company_repository_1.prismaCompanyRepository.findById(idProject);
                if (!productionUnitResponse)
                    return http_response_1.httpResponse.NotFoundException("No se ha podido encontrar la imagen de la empresa");
                const imagePath = app_root_path_1.default +
                    "/static/" +
                    company_constant_1.CompanyMulterProperties.folder +
                    "/" +
                    company_constant_1.CompanyMulterProperties.folder +
                    "_" +
                    productionUnitResponse.id +
                    ".png";
                try {
                    // se verifica primero si el archivo existe en el path que colocaste y luego si es accesible
                    yield promises_1.default.access(imagePath, promises_1.default.constants.F_OK);
                }
                catch (error) {
                    return http_response_1.httpResponse.BadRequestException(" La Imagen no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("Imagen encontrada", imagePath);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la imagen", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect;
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
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findCompanyByUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const company = yield prisma_company_repository_1.prismaCompanyRepository.findCompanyByUser(idUser);
                if (!company)
                    return http_response_1.httpResponse.NotFoundException("No se encontró la empresa del usuario");
                return http_response_1.httpResponse.SuccessResponse("Empresa encontrada del usuario con éxito", company);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar empresa del usuario", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateCompany(data, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyResponseId = yield company_validation_1.companyValidation.findById(idCompany);
                if (!companyResponseId.success)
                    return companyResponseId;
                const userResponse = yield user_validation_1.userValidation.findById(Number(data.usuario_id));
                if (!userResponse.success)
                    return userResponse;
                const company = companyResponseId.payload;
                if (company.nombre_empresa != data.nombre_empresa) {
                    const responseName = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                    if (!responseName.success)
                        return responseName;
                }
                if (company.nombre_corto != data.nombre_corto) {
                    const responseNameShort = yield company_validation_1.companyValidation.findByNameShort(data.nombre_empresa);
                    if (!responseNameShort.success)
                        return responseNameShort;
                }
                if (company.ruc != data.ruc) {
                    const responseRuc = yield company_validation_1.companyValidation.findByRuc(data.nombre_empresa);
                    if (!responseRuc.success)
                        return responseRuc;
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                const resultEmail = (0, email_1.emailValid)(data.correo);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                if (company.correo != data.correo) {
                    const responseEmail = yield company_validation_1.companyValidation.findByEmail(data.correo);
                    if (!responseEmail.success)
                        return responseEmail;
                }
                const companyFormat = Object.assign(Object.assign({}, data), { usuario_id: Number(data.usuario_id) });
                const companyResponse = yield prisma_company_repository_1.prismaCompanyRepository.updateCompany(companyFormat, idCompany);
                const companyMapper = new company_mapper_1.CompanyResponseMapper(companyResponse);
                return http_response_1.httpResponse.CreatedResponse("Empresa modificada correctamente", companyMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al actualizar la empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateCompanyWithTokenUser(data, idCompany, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyResponseId = yield company_validation_1.companyValidation.findById(idCompany);
                if (!companyResponseId.success)
                    return companyResponseId;
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse.success) {
                    return userTokenResponse;
                }
                const userResponse = userTokenResponse.payload;
                const company = companyResponseId.payload;
                if (company.nombre_empresa != data.nombre_empresa) {
                    const responseName = yield company_validation_1.companyValidation.findByName(data.nombre_empresa);
                    if (!responseName.success)
                        return responseName;
                }
                if (company.nombre_corto != data.nombre_corto) {
                    const responseNameShort = yield company_validation_1.companyValidation.findByNameShort(data.nombre_empresa);
                    if (!responseNameShort.success)
                        return responseNameShort;
                }
                if (company.ruc != data.ruc) {
                    const responseRuc = yield company_validation_1.companyValidation.findByRuc(data.nombre_empresa);
                    if (!responseRuc.success)
                        return responseRuc;
                }
                const resultPhoneCompany = (0, number_1.lettersInNumbers)(data.telefono);
                if (resultPhoneCompany) {
                    return http_response_1.httpResponse.BadRequestException("El campo telefono de la empresa debe contener solo números");
                }
                const resultEmail = (0, email_1.emailValid)(data.correo);
                if (!resultEmail) {
                    return http_response_1.httpResponse.BadRequestException("El Correo de la empresa ingresado no es válido");
                }
                if (company.correo != data.correo) {
                    const responseEmail = yield company_validation_1.companyValidation.findByEmail(data.correo);
                    if (!responseEmail.success)
                        return responseEmail;
                }
                const companyFormat = Object.assign(Object.assign({}, data), { usuario_id: userResponse.id });
                const companyResponse = yield prisma_company_repository_1.prismaCompanyRepository.updateCompany(companyFormat, idCompany);
                const companyMapper = new company_mapper_1.CompanyResponseMapper(companyResponse);
                return http_response_1.httpResponse.CreatedResponse("Empresa modificada correctamente", companyMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al actualizar la empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusCompany(idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyResponse = yield company_validation_1.companyValidation.findById(idCompany);
                if (!companyResponse.success)
                    return companyResponse;
                const empresaResponse = yield prisma_company_repository_1.prismaCompanyRepository.updateStatusCompany(idCompany);
                return http_response_1.httpResponse.SuccessResponse("Empresa eliminada correctamente", empresaResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar la empresa", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    searchByName(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_company_repository_1.prismaCompanyRepository.searchNameCompany(name, skip, data.queryParams.limit);
                const { companies, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: companies,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar las empresas", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar empresas", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.companyService = new CompanyService();
