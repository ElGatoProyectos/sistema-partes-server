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
exports.unitService = void 0;
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const http_response_1 = require("@/common/http.response");
const unit_validation_1 = require("./unit.validation");
const prisma_unit_repository_1 = require("./prisma-unit.repository");
const unit_mapper_dto_1 = require("./mapper/unit.mapper.dto");
const company_validation_1 = require("@/company/company.validation");
const jwt_service_1 = require("@/auth/jwt.service");
const xlsx = __importStar(require("xlsx"));
const project_validation_1 = require("@/project/project.validation");
const validator_1 = __importDefault(require("validator"));
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
                    return http_response_1.httpResponse.BadRequestException("No se puede crear la Unidad con el id del Proyecto proporcionado");
                }
                const resultName = yield unit_validation_1.unitValidation.findByName(data.nombre, project_id);
                if (!resultName.success) {
                    return resultName;
                }
                if (data.simbolo) {
                    const resultSymbol = yield unit_validation_1.unitValidation.findBySymbolForCreate(data.simbolo, project_id);
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
                const unitFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, codigo: formattedCodigo, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "", proyecto_id: project_id });
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
    updateUnit(data, unit_id, tokenWithBearer, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(tokenWithBearer);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const resultIdUnit = yield unit_validation_1.unitValidation.findById(unit_id);
                if (!resultIdUnit.success) {
                    return resultIdUnit;
                }
                const resultUnitFind = resultIdUnit.payload;
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return resultIdProject;
                }
                if (resultUnitFind.nombre != data.nombre) {
                    const resultName = yield unit_validation_1.unitValidation.findByName(data.nombre, project_id);
                    if (!resultName.success) {
                        return resultName;
                    }
                }
                if (data.simbolo && resultUnitFind.simbolo != data.simbolo) {
                    const resultSymbol = yield unit_validation_1.unitValidation.findBySymbolForCreate(data.simbolo, project_id);
                    if (!resultSymbol.success) {
                        return resultSymbol;
                    }
                }
                const resultIdCompany = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                if (!resultIdCompany.success)
                    resultIdCompany;
                const company = resultIdCompany.payload;
                const unitFormat = Object.assign(Object.assign({}, data), { empresa_id: company.id, simbolo: data.simbolo ? data.simbolo.toUpperCase() : "", proyecto_id: project_id });
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.updateUnit(unitFormat, unit_id);
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
    findBySymbol(symbol, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseUnit = yield prisma_unit_repository_1.prismaUnitRepository.existsSymbol(symbol, +project_id);
                if (!responseUnit) {
                    return http_response_1.httpResponse.NotFoundException("El simbolo de la Unidad no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("El simbolo de la Unidad fue encontrada", responseUnit);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el simbolo de la Unidad", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findAll(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return resultIdProject;
                }
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_unit_repository_1.prismaUnitRepository.findAll(skip, data, project_id);
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
    registerUnitMasive(file, project_id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                const companyResponse = yield company_validation_1.companyValidation.findByIdUser(userResponse.id);
                const company = companyResponse.payload;
                const project = yield project_validation_1.projectValidation.findById(project_id);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                let error = 0;
                let errorNumber = 0;
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
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["ID-UNIDAD"] == undefined ||
                        item.DESCRIPCION == undefined ||
                        item.SIMBOLO == undefined) {
                        error++;
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const codigoSinEspacios = item["ID-UNIDAD"].trim();
                    //verificamos si tenemos el codigo
                    const codigo = parseInt(item["ID-UNIDAD"], 10); // Intenta convertir el string a número
                    if (!validator_1.default.isNumeric(codigoSinEspacios)) {
                        errorNumber++; // Aumenta si el código no es un número válido
                    }
                    else {
                        // Verifica si el código ya ha sido procesado
                        if (!seenCodes.has(item["ID-UNIDAD"])) {
                            // errorNumber++; // Aumenta si hay duplicado
                            seenCodes.add(item["ID-UNIDAD"]);
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
                //[NOTE] Acá verifico si el primer elemento es 001
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
                let unit;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield unit_validation_1.unitValidation.findByCodeValidation(String(item["ID-UNIDAD"].trim()), project_id);
                    if (code.success) {
                        unit = code.payload;
                        yield unit_validation_1.unitValidation.updateUnit(item, +unit.id, company.id, responseProject.id);
                    }
                    else {
                        yield prisma_config_1.default.unidad.create({
                            data: {
                                codigo: String(item["ID-UNIDAD"].trim()),
                                nombre: item.DESCRIPCION,
                                simbolo: item.SIMBOLO,
                                empresa_id: company.id,
                                proyecto_id: responseProject.id,
                            },
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Unidades creadas correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer las Unidades", error);
            }
        });
    }
    createMasive(company_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [
                    {
                        codigo: "001",
                        nombre: "PORCENTAJE",
                        simbolo: "%",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "002",
                        nombre: "PROCENTAJE DEL CD",
                        simbolo: "%cd",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "003",
                        nombre: "COMODIN EQUIPOS",
                        simbolo: "%eq",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "004",
                        nombre: "PORCENTAJE DE UN INSUMO",
                        simbolo: "%in",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "005",
                        nombre: "PORCENTAJE DE MANO DE OBRA",
                        simbolo: "%mo",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "006",
                        nombre: "COMODIN MATERIALES",
                        simbolo: "%mt",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "007",
                        nombre: "PORCENTAJE DE UN PRECIO UNITARIO",
                        simbolo: "%pu",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "008",
                        nombre: "PORCENTAJE DE SUBPARTIDAS",
                        simbolo: "%sp",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "009",
                        nombre: "1/4 DE GALON",
                        simbolo: "1/4",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "010",
                        nombre: "BALDE",
                        simbolo: "bal",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "011",
                        nombre: "BARRA",
                        simbolo: "bar",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "012",
                        nombre: "BIDON",
                        simbolo: "bid",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "013",
                        nombre: "BOLSAS",
                        simbolo: "bol",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "014",
                        nombre: "CHISGUETE",
                        simbolo: "chi",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "015",
                        nombre: "CILINDRO",
                        simbolo: "cil",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "016",
                        nombre: "CAJA",
                        simbolo: "cja",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "017",
                        nombre: "COJIN",
                        simbolo: "cjn",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "018",
                        nombre: "CIENTO",
                        simbolo: "cto",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "019",
                        nombre: "DIA",
                        simbolo: "dia",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "020",
                        nombre: "DECIMETRO",
                        simbolo: "dm",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "021",
                        nombre: "DECIMETRO CUBICO",
                        simbolo: "dm3",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "022",
                        nombre: "DOCENA",
                        simbolo: "doc",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "023",
                        nombre: "ENVIO",
                        simbolo: "env",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "024",
                        nombre: "EQUIPO",
                        simbolo: "eq",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "025",
                        nombre: "ESTIMADA",
                        simbolo: "est",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "026",
                        nombre: "FRASCO",
                        simbolo: "fco",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "027",
                        nombre: "GLOBAL",
                        simbolo: "glb",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "028",
                        nombre: "GALON",
                        simbolo: "gal",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "029",
                        nombre: "HORA",
                        simbolo: "h",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "030",
                        nombre: "HORA HOMBRE",
                        simbolo: "hh",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "031",
                        nombre: "HOJA",
                        simbolo: "hja",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "032",
                        nombre: "HORA MAQUINA",
                        simbolo: "hm",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "033",
                        nombre: "JGO",
                        simbolo: "jgo",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "034",
                        nombre: "KIT",
                        simbolo: "kit",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "035",
                        nombre: "KILOGRAMO",
                        simbolo: "kg",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "036",
                        nombre: "KILOMETRO",
                        simbolo: "km",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "037",
                        nombre: "KILOMETRO/M3",
                        simbolo: "km3",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "038",
                        nombre: "LATAS",
                        simbolo: "lat",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "039",
                        nombre: "LIBRAS",
                        simbolo: "lbs",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "040",
                        nombre: "LITRO",
                        simbolo: "l",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "041",
                        nombre: "METRO CUADRADO",
                        simbolo: "m2",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "042",
                        nombre: "METRO CUBICO",
                        simbolo: "m3",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "043",
                        nombre: "MADEJA",
                        simbolo: "mad",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "044",
                        nombre: "MES",
                        simbolo: "mes",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "045",
                        nombre: "METRO LINEAL",
                        simbolo: "m",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "046",
                        nombre: "MILLAR",
                        simbolo: "mll",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "047",
                        nombre: "NUMERICO",
                        simbolo: "num",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "048",
                        nombre: "ONZA",
                        simbolo: "onz",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "049",
                        nombre: "OVILLO",
                        simbolo: "ovl",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "050",
                        nombre: "PIE",
                        simbolo: "p",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "051",
                        nombre: "PIE CUADRADO",
                        simbolo: "p2",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "052",
                        nombre: "PAR",
                        simbolo: "par",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "053",
                        nombre: "PASAJE",
                        simbolo: "pje",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "054",
                        nombre: "PLANCHA",
                        simbolo: "pln",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "055",
                        nombre: "PLIEGO",
                        simbolo: "plg",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "056",
                        nombre: "PAQUETE",
                        simbolo: "pqt",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "057",
                        nombre: "PUNTO",
                        simbolo: "pto",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "058",
                        nombre: "PIEZA",
                        simbolo: "pza",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "059",
                        nombre: "ROLLO",
                        simbolo: "rll",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "060",
                        nombre: "SACO",
                        simbolo: "sac",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "061",
                        nombre: "SOBRE",
                        simbolo: "sbr",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "062",
                        nombre: "SEMANA",
                        simbolo: "sem",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "063",
                        nombre: "SERVICIO",
                        simbolo: "ser",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "064",
                        nombre: "TONELADA POR METRO LINEAL",
                        simbolo: "t/m",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "065",
                        nombre: "TONELADA",
                        simbolo: "ton",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "066",
                        nombre: "TOTAL",
                        simbolo: "tot",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "067",
                        nombre: "TUBO",
                        simbolo: "tub",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "068",
                        nombre: "UNIDAD",
                        simbolo: "und",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "069",
                        nombre: "USO",
                        simbolo: "uso",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "070",
                        nombre: "VARILLA",
                        simbolo: "var",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "071",
                        nombre: "VIAJE",
                        simbolo: "vje",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "072",
                        nombre: "CONO",
                        simbolo: "Cno",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "073",
                        nombre: "HECTAREA",
                        simbolo: "ha",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "074",
                        nombre: "METRO CUBICO KILOMETRO",
                        simbolo: "m3k",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "075",
                        nombre: "HORA EQUIPO",
                        simbolo: "he",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "076",
                        nombre: "CAJETILLA",
                        simbolo: "Cjt",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "077",
                        nombre: "LOTE",
                        simbolo: "lot",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "078",
                        nombre: "ESTUCHE",
                        simbolo: "estc",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "079",
                        nombre: "COMODIN PRECIO UNITARIO",
                        simbolo: "%PU",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                    {
                        codigo: "080",
                        nombre: "COMODIN PRECIO SUBPARTIDA",
                        simbolo: "%SP",
                        empresa_id: company_id,
                        proyecto_id: project_id,
                    },
                ];
                const units = yield prisma_unit_repository_1.prismaUnitRepository.createUnitMasive(data);
                if (units.count === 0) {
                    return http_response_1.httpResponse.NotFoundException("Hubo problemas para crear las Unidades de la Mano de Obra");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva las Unidades de la Mano de Obra");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear de forma masiva las Unidades de la Mano de Obra", error);
            }
        });
    }
}
exports.unitService = new UnitService();
