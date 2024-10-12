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
exports.departureService = void 0;
const jwt_service_1 = require("@/auth/jwt.service");
const company_validation_1 = require("@/company/company.validation");
const project_validation_1 = require("@/project/project.validation");
const xlsx = __importStar(require("xlsx"));
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const prisma_departure_repository_1 = require("./prisma-departure.repository");
const validator_1 = __importDefault(require("validator"));
const unit_validation_1 = require("@/unit/unit.validation");
const departure_validation_1 = require("./departure.validation");
class DepartureService {
    findById(departure_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseDeparture = yield prisma_departure_repository_1.prismaDepartureRepository.findById(departure_id);
                if (!responseDeparture) {
                    return http_response_1.httpResponse.NotFoundException("El id de la Partida no fue encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("La Partida fue encontrada", responseDeparture);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Partida", error);
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
                const projectResponse = yield project_validation_1.projectValidation.findById(+project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                const result = yield prisma_departure_repository_1.prismaDepartureRepository.findAll(skip, data, +project_id);
                const { departures, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: departures,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todas las Partidas", formData);
            }
            catch (error) {
                console.log(error);
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas los Partidas", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    registerDepartureMasive(file, project_id, token) {
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
                let errorMessages = [];
                let errorRows = [];
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
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. El archivo no puede tener más de 2 filas en blanco ");
                }
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["ID-PARTIDA"] === undefined ||
                        item.ITEM === undefined ||
                        item.PARTIDA === undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Los campos ID-PARTIDA, ITEM Y PARTIDA son obligatorios.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] Verifico si tiene 4 digitos.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const codigoSinEspacios = item["ID-PARTIDA"].trim();
                    if (codigoSinEspacios.length < 4) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Los códigos sólo pueden tener 4 digitos .Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    //[NOTE] hago esto xq sino me rompe todo ya q si uno tiene espacio no puede con
                    const codigoSinEspacios = item["ID-PARTIDA"].trim();
                    // indicas que la cadena debe ser interpretada como un número decimal (base 10)
                    const codigo = parseInt(codigoSinEspacios, 10);
                    if (!validator_1.default.isNumeric(codigoSinEspacios)) {
                        errorNumber++;
                        errorMessages.push("El ID-PARTIDA no puede contener letras.");
                    }
                    else {
                        if (!seenCodes.has(item["ID-PARTIDA"])) {
                            seenCodes.add(item["ID-PARTIDA"]);
                        }
                        if (previousCodigo !== null && codigo <= previousCodigo) {
                            errorNumber++;
                            // errorMessages.push(index + 1);
                            errorRows.push(index);
                        }
                        previousCodigo = codigo;
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Hay letras en códigos o el mismo puede que sea mayor o igual al siguiente.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                // //[NOTE] Acá verifico si el primer elemento es 001
                const sortedCodesArray = Array.from(seenCodes)
                    .map((item) => item.padStart(3, "0"))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                if (sortedCodesArray[0] != "0001") {
                    errorNumber++;
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException("El primer código del archivo debe ser 001");
                }
                // //[NOTE] ACÁ DE QUE LA DIFERENCIA SEA SÓLO 1
                for (let i = 1; i < sortedCodesArray.length; i++) {
                    const currentCode = parseInt(sortedCodesArray[i]);
                    const previousCode = parseInt(sortedCodesArray[i - 1]);
                    if (currentCode !== previousCode + 1) {
                        errorNumber++; // Aumenta si el código actual no es 1 número mayor que el anterior
                        errorRows.push(i);
                    }
                }
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Existen uno o varios códigos donde la diferencia es mayor a 1`);
                }
                //[SUCCESS] VERIFICAR SI LAS UNIDADES QUE VIENEN EXISTEN EN LA BASE DE DATOS
                let unit;
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.UNI) {
                        unit = yield unit_validation_1.unitValidation.findBySymbol(String(item.UNI).trim(), project_id);
                        if (!unit.success) {
                            errorNumber++;
                            errorRows.push(index + 1);
                        }
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Ha ingresado Unidades que no existen en la base de datos.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[SUCCESS] Guardo o actualizo la Unidad de Producciónn
                let code;
                let departure;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield departure_validation_1.departureValidation.findByCodeValidation(String(item["ID-PARTIDA"].trim()), project_id);
                    if (code.success) {
                        departure = code.payload;
                        yield departure_validation_1.departureValidation.updateDeparture(departure.id, item, userResponse.id, responseProject.id);
                    }
                    else {
                        const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(String(item.UNI), project_id);
                        const unit = unitResponse.payload;
                        const data = {
                            id_interno: String(item["ID-PARTIDA"].trim()),
                            item: item.ITEM,
                            partida: item.PARTIDA,
                            metrado_inicial: item.METRADO ? +item.METRADO : 0,
                            metrado_total: item.METRADO ? +item.METRADO : 0,
                            precio: +item.PRECIO ? +item.PRECIO : 0,
                            parcial: item.PARCIAL ? +item.PARCIAL : 0,
                            mano_de_obra_unitaria: item["MANO DE OBRA UNITARIO"]
                                ? +item["MANO DE OBRA UNITARIO"]
                                : 0,
                            material_unitario: item["MATERIAL UNITARIO"]
                                ? +item["MATERIAL UNITARIO"]
                                : 0,
                            equipo_unitario: item["EQUIPO UNITARIO"]
                                ? +item["EQUIPO UNITARIO"]
                                : 0,
                            subcontrata_varios: item["SUBCONTRATA - VARIOS UNITARIO"]
                                ? +item["SUBCONTRATA - VARIOS UNITARIO"]
                                : 0,
                            usuario_id: userResponse.id,
                            unidad_id: item.UNI ? unit.id : null,
                            proyecto_id: project_id,
                        };
                        yield prisma_config_1.default.partida.create({
                            data: data,
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Partidas creadas correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer las Partidas", error);
            }
        });
    }
}
exports.departureService = new DepartureService();
