"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.unifiedIndexService = void 0;
const http_response_1 = require("@/common/http.response");
const unifiedIndex_validation_1 = require("./unifiedIndex.validation");
const prisma_unified_index_1 = require("./prisma-unified-index");
const unifiedIndex_mapper_1 = require("./mapper/unifiedIndex.mapper");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const company_validation_1 = require("@/company/company.validation");
const xlsx = __importStar(require("xlsx"));
const validator_1 = __importDefault(require("validator"));
const jwt_service_1 = require("@/auth/jwt.service");
class UnifiedIndexService {
    createUnifiedIndex(data, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultIdProject = yield unifiedIndex_validation_1.unifiedIndexValidation.findByName(data.nombre);
                if (!resultIdProject.success) {
                    return resultIdProject;
                }
                if (data.simbolo) {
                    const resultIdUnifiedIndex = yield unifiedIndex_validation_1.unifiedIndexValidation.findBySymbol(data.simbolo);
                    if (!resultIdUnifiedIndex.success) {
                        return resultIdUnifiedIndex;
                    }
                }
                const resultIdCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                if (!resultIdCompany.success) {
                    return resultIdCompany;
                }
                const company = resultIdCompany.payload;
                const lastUnifiedIndex = yield unifiedIndex_validation_1.unifiedIndexValidation.codeMoreHigh();
                const lastUnifiedIndexResponse = lastUnifiedIndex.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastUnifiedIndexResponse === null || lastUnifiedIndexResponse === void 0 ? void 0 : lastUnifiedIndexResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                const unifiedIndexFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, codigo: formattedCodigo, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "" });
                const responseUnifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.createUnifiedIndex(unifiedIndexFormat);
                const prouducResourseCategoryMapper = new unifiedIndex_mapper_1.UnifiedIndexResponseMapper(responseUnifiedIndex);
                return http_response_1.httpResponse.CreatedResponse("Indice Unificado creado correctamente", prouducResourseCategoryMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear el Indice Unificado", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateUnifiedIndex(data, idUnifiedIndex, tokenWithBearer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultIdResourseCategory = yield unifiedIndex_validation_1.unifiedIndexValidation.findById(idUnifiedIndex);
                const unifiedIndexFind = resultIdResourseCategory.payload;
                if (!resultIdResourseCategory.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id del Indice Unificado que se quiere editar");
                }
                if (unifiedIndexFind.nombre != data.nombre) {
                    const resultIdUnifiedIndex = yield unifiedIndex_validation_1.unifiedIndexValidation.findByName(data.nombre);
                    if (!resultIdUnifiedIndex.success) {
                        return resultIdUnifiedIndex;
                    }
                }
                if (data.simbolo && unifiedIndexFind.simbolo != data.simbolo) {
                    const resultIdUnifiedIndex = yield unifiedIndex_validation_1.unifiedIndexValidation.findBySymbol(data.simbolo);
                    if (!resultIdUnifiedIndex.success) {
                        return resultIdUnifiedIndex;
                    }
                }
                const resultIdCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                const company = resultIdCompany.payload;
                const unifiedIndexFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "" });
                const responseUnifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.updateUnifiedIndex(unifiedIndexFormat, idUnifiedIndex);
                const resourseCategoryMapper = new unifiedIndex_mapper_1.UnifiedIndexResponseMapper(responseUnifiedIndex);
                return http_response_1.httpResponse.SuccessResponse("El Indice Unificado fue modificado correctamente", resourseCategoryMapper);
            }
            catch (error) {
                console.log(error);
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Indice Unificado", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndex = yield prisma_unified_index_1.prismaUnifiedIndexRepository.findById(idUnifiedIndex);
                if (!unifiedIndex) {
                    return http_response_1.httpResponse.NotFoundException("El id del Indice Unificado no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("El Indice Unificado fue encontrado", unifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Indice Unificado", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findByName(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_unified_index_1.prismaUnifiedIndexRepository.searchNameUnifiedIndex(name, skip, data.queryParams.limit);
                const { unifiedIndex, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: unifiedIndex,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar Indices Unificados", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Indices Unificados", error);
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
                const result = yield prisma_unified_index_1.prismaUnifiedIndexRepository.findAll(skip, data.queryParams.limit);
                const { unifiedIndex, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: unifiedIndex,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas los Indices Unificados", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas los Indices Unificados", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusUnifiedIndex(idUnifiedIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unifiedIndex = yield unifiedIndex_validation_1.unifiedIndexValidation.findById(idUnifiedIndex);
                if (!unifiedIndex.success) {
                    return unifiedIndex;
                }
                else {
                    const result = yield prisma_unified_index_1.prismaUnifiedIndexRepository.updateStatusUnifiedIndex(idUnifiedIndex);
                    return http_response_1.httpResponse.SuccessResponse("Indice Unificado eliminado correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar el Indice Unificado", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    registerUnifiedIndexMasive(file, idCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                let error = 0;
                //[NOTE] PARA QUE NO TE DE ERROR EL ARCHIVO:
                //[NOTE] SI HAY 2 FILAS AL PRINCIPIO VACIAS
                //[NOTE] EL CODIGO DEBE ESTAR COMO STRING
                //[NOTE] -NO DEBE EL CODIGO TENER LETRAS
                //[NOTE] -QUE EL CÓDIGO EMPIECE CON EL 001
                //[NOTE] -QUE LOS CÓDIGOS VAYAN AUMENTANDO
                //[NOTE] -NO PUEDE SER EL CÓDGO MAYOR A 1 LA DIFERENCIA ENTRE CADA UNO
                //[NOTE] ACÁ VERIFICA SI HAY 2 FILAS VACIAS
                //Usamos rango 0 para verificar q estamos leyendo las primeras filas
                const firstTwoRows = xlsx.utils
                    .sheet_to_json(sheet, { header: 1, range: 0, raw: true })
                    .slice(0, 2); //nos limitamos a las primeras 2
                //verificamos si están vacias las primeras filas
                const isEmptyRow = (row) => row.every((cell) => cell === null || cell === undefined || cell === "");
                //verificamos si tiene menos de 2 filas o si en las primeras 2 esta vacia lanzamos el error
                if (firstTwoRows.length < 2 ||
                    (isEmptyRow(firstTwoRows[0]) && isEmptyRow(firstTwoRows[1]))) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                const company = yield company_validation_1.companyValidation.findById(idCompany);
                if (!company.success)
                    return company;
                const responseCompany = company.payload;
                let errorNumber = 0;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.ID == undefined || item.Nombre == undefined) {
                        error++;
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    //verificamos si tenemos el codigo
                    const codigo = parseInt(item.ID, 10); // Intenta convertir el string a número
                    if (!validator_1.default.isNumeric(item.ID)) {
                        errorNumber++; // Aumenta si el código no es un número válido
                    }
                    else {
                        // Verifica si el código ya ha sido procesado
                        if (!seenCodes.has(item.ID)) {
                            // errorNumber++; // Aumenta si hay duplicado
                            seenCodes.add(item.ID);
                        }
                        // Verifica si el código actual no es mayor que el anterior
                        if (previousCodigo !== null && codigo <= previousCodigo) {
                            errorNumber++;
                        }
                        previousCodigo = codigo;
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[NOTE] Acá verifico si el primer elemento es 001, si empieza con por ejemplo 000 te da error
                const sortedCodesArray = Array.from(seenCodes)
                    .map((item) => item.padStart(3, "0"))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                if (sortedCodesArray[0] != "001") {
                    errorNumber++;
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
                for (let i = 1; i < sortedCodesArray.length; i++) {
                    const currentCode = parseInt(sortedCodesArray[i]);
                    const previousCode = parseInt(sortedCodesArray[i - 1]);
                    if (currentCode !== previousCode + 1) {
                        errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
                        break; // Puedes detener el ciclo en el primer error
                    }
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[SUCCESS] Guardo o actualizo la Unidad de Producción
                let code;
                let unifiedIndexIdResponse;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield unifiedIndex_validation_1.unifiedIndexValidation.findByCode(String(item.ID));
                    if (!code.success) {
                        unifiedIndexIdResponse = code.payload;
                        yield unifiedIndex_validation_1.unifiedIndexValidation.updateUnifiedIndex(item, unifiedIndexIdResponse.id, responseCompany.id);
                    }
                    else {
                        yield prisma_config_1.default.indiceUnificado.create({
                            data: {
                                codigo: String(item.ID),
                                nombre: item.Nombre,
                                simbolo: item.Simbolo,
                                comentario: item.Comentario,
                                empresa_id: idCompany,
                            },
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Indices Unificados creados correctamente!");
            }
            catch (error) {
                console.log(error);
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer el Indice Unificado", error);
            }
        });
    }
}
exports.unifiedIndexService = new UnifiedIndexService();
