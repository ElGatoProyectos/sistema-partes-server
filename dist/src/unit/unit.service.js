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
exports.unitService = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const http_response_1 = require("@/common/http.response");
const unit_validation_1 = require("./unit.validation");
const prisma_unit_repository_1 = require("./prisma-unit.repository");
const unit_mapper_dto_1 = require("./mapper/unit.mapper.dto");
const company_validation_1 = require("@/company/company.validation");
const jwt_service_1 = require("@/auth/jwt.service");
const project_validation_1 = require("@/project/project.validation");
class UnitService {
    createUnit(data, tokenWithBearer, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear el Tren con el id del Proyecto proporcionado");
                }
                const resultName = yield unit_validation_1.unitValidation.findByName(data.nombre, project_id);
                if (!resultName.success) {
                    return resultName;
                }
                if (data.simbolo) {
                    const resultSymbol = yield unit_validation_1.unitValidation.findBySymbol(data.simbolo, project_id);
                    if (!resultSymbol.success) {
                        return resultSymbol;
                    }
                }
                const resultIdCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                if (!resultIdCompany.success) {
                    return resultIdCompany;
                }
                const company = resultIdCompany.payload;
                const lastUnit = yield unit_validation_1.unitValidation.codeMoreHigh(project_id);
                const lastUnitResponse = lastUnit.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastUnitResponse === null || lastUnitResponse === void 0 ? void 0 : lastUnitResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                const unitFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, codigo: formattedCodigo, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "", project_id: project_id });
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.createUnit(unitFormat);
                const unitMapper = new unit_mapper_dto_1.ResponseUnitMapper(responseUnit);
                return http_response_1.httpResponse.CreatedResponse("Unidad creada correctamente", unitMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateUnit(data, idUnit, tokenWithBearer, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultIdUnit = yield unit_validation_1.unitValidation.findById(idUnit);
                if (!resultIdUnit.success) {
                    return resultIdUnit;
                }
                const resultUnitFind = resultIdUnit.payload;
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear el Tren con el id del Proyecto proporcionado");
                }
                if (resultUnitFind.nombre != data.nombre) {
                    const resultName = yield unit_validation_1.unitValidation.findByName(data.nombre, project_id);
                    if (!resultName.success) {
                        return resultName;
                    }
                }
                if (data.simbolo && resultUnitFind.simbolo != data.simbolo) {
                    const resultSymbol = yield unit_validation_1.unitValidation.findBySymbol(data.simbolo, project_id);
                    if (!resultSymbol.success) {
                        return resultSymbol;
                    }
                }
                const resultIdCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                if (!resultIdCompany.success)
                    resultIdCompany;
                const company = resultIdCompany.payload;
                const unitFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "", project_id: project_id });
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.updateUnit(unitFormat, idUnit);
                const unitMapper = new unit_mapper_dto_1.ResponseUnitMapper(responseUnit);
                return http_response_1.httpResponse.SuccessResponse("La Unidad fue modificada correctamente", unitMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(idUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.findById(idUnit);
                if (!responseUnit) {
                    return http_response_1.httpResponse.NotFoundException("El id de la Unidad no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("La Unidad fue encontrada", responseUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(name, data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_unit_repository_1.prismaUnitRepository.searchNameUnit(name, skip, data.queryParams.limit, project_id);
                if (!result) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", []);
                }
                const { units, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: units,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar la Unidad", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAll(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_unit_repository_1.prismaUnitRepository.findAll(skip, data.queryParams.limit, project_id);
                const { units, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: units,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas las Unidades", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas las Unidades", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusUnit(idUnit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unitResponse = yield unit_validation_1.unitValidation.findById(idUnit);
                if (!unitResponse.success) {
                    return unitResponse;
                }
                else {
                    const result = yield prisma_unit_repository_1.prismaUnitRepository.updateStatusUnit(idUnit);
                    return http_response_1.httpResponse.SuccessResponse("Unidad eliminada correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.unitService = new UnitService();
