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
exports.workforceService = void 0;
const xlsx = __importStar(require("xlsx"));
const http_response_1 = require("@/common/http.response");
const project_validation_1 = require("@/project/project.validation");
const client_1 = require("@prisma/client");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const typeWorkforce_validation_1 = require("@/typeWorkforce/typeWorkforce.validation");
const originWorkforce_validation_1 = require("@/originWorkforce/originWorkforce.validation");
const specialtyWorkfoce_validation_1 = require("@/specialtyWorkforce/specialtyWorkfoce.validation");
const unit_validation_1 = require("@/unit/unit.validation");
const categoryWorkforce_validation_1 = require("@/categoryWorkforce/categoryWorkforce.validation");
const bankWorkforce_validation_1 = require("@/bankWorkforce/bankWorkforce.validation");
const workforce_validation_1 = require("./workforce.validation");
const jwt_service_1 = require("@/auth/jwt.service");
class WorkforceService {
    registerWorkforceMasive(file, project_id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                let error = 0;
                let errorNumber = 0;
                let errorRows = [];
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse.success) {
                    return userTokenResponse;
                }
                const userResponse = userTokenResponse.payload;
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
                const project = yield project_validation_1.projectValidation.findById(project_id);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.DNI === undefined ||
                        item["APELLIDO Y NOMBRE COMPLETO"] === undefined ||
                        item.TIPO === undefined ||
                        item.ORIGEN === undefined ||
                        item.CATEGORIA === undefined ||
                        item.ESPECIALIDAD === undefined ||
                        item.UNIDAD === undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.El DNI,NOMBRE Y APELLIDO, TIPO, ORIGEN, CATEGORIA, ESPECIALIDAD, UNIDAD son obligatorios.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] buscar si existe el nombre del tipo
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const typeResponse = yield typeWorkforce_validation_1.typeWorkforceValidation.findByName(item.TIPO.trim(), responseProject.id);
                    if (!typeResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre del Tipo de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre del Origen
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const originResponse = yield originWorkforce_validation_1.originWorkforceValidation.findByName(item.ORIGEN.trim(), responseProject.id);
                    if (!originResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre de la Categoria
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const categoryResponse = yield categoryWorkforce_validation_1.categoryWorkforceValidation.findByName(item.CATEGORIA.trim(), responseProject.id);
                    if (!categoryResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre de la Categoria de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre de la Especialidad
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const specialtyResponse = yield specialtyWorkfoce_validation_1.specialtyWorkforceValidation.findByName(item.ESPECIALIDAD.trim(), responseProject.id);
                    if (!specialtyResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. La Especialidad del Origen de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el simbolo de la Unidad
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(item.UNIDAD.trim(), responseProject.id);
                    if (!unitResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre de la Unidad de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el nombre del Banco
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.BANCO) {
                        const bankResponse = yield bankWorkforce_validation_1.bankWorkforceValidation.findByName(item.BANCO.trim(), responseProject.id);
                        if (!bankResponse.success) {
                            error++;
                            errorRows.push(index + 1);
                        }
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El nombre del Banco de Mano de Obra no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] Verifico si el estado es uno de los que existen
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item.ESTADO.toUpperCase() != client_1.E_Estado_MO_BD.ACTIVO &&
                        item.ESTADO.toUpperCase() != client_1.E_Estado_MO_BD.INACTIVO) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El Estado de la Mano de Obra sólo puede ser Activo o Inactivo. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                // //[SUCCESS] Guardo o actualizo la Mano de Obraa
                let workforceResponse;
                let workforce;
                for (const item of sheetToJson) {
                    workforceResponse = yield workforce_validation_1.workforceValidation.findByDni(item.DNI.toString(), project_id);
                    if (workforceResponse.success) {
                        workforce = workforceResponse.payload;
                        yield workforce_validation_1.workforceValidation.updateWorkforce(item, responseProject.id, workforce.id, userResponse.id);
                    }
                    else {
                        const typeResponse = yield typeWorkforce_validation_1.typeWorkforceValidation.findByName(item.TIPO, responseProject.id);
                        const type = typeResponse.payload;
                        const originResponse = yield originWorkforce_validation_1.originWorkforceValidation.findByName(item.ORIGEN, responseProject.id);
                        const origin = originResponse.payload;
                        const categoryResponse = yield categoryWorkforce_validation_1.categoryWorkforceValidation.findByName(item.CATEGORIA, responseProject.id);
                        const category = categoryResponse.payload;
                        const specialtyResponse = yield specialtyWorkfoce_validation_1.specialtyWorkforceValidation.findByName(item.ESPECIALIDAD, responseProject.id);
                        const specialty = specialtyResponse.payload;
                        const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(item.UNIDAD, responseProject.id);
                        const unit = unitResponse.payload;
                        let bank;
                        if (item.BANCO) {
                            const bankResponse = yield bankWorkforce_validation_1.bankWorkforceValidation.findByName(item.BANCO, responseProject.id);
                            bank = bankResponse.payload;
                        }
                        const lastWorkforce = yield workforce_validation_1.workforceValidation.codeMoreHigh(project_id);
                        const lastWorkforceResponse = lastWorkforce.payload;
                        // Incrementar el código en 1
                        const nextCodigo = (parseInt(lastWorkforceResponse === null || lastWorkforceResponse === void 0 ? void 0 : lastWorkforceResponse.codigo) || 0) + 1;
                        const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                        const excelEpoch = new Date(1899, 11, 30);
                        let inicioDate;
                        if (item.INGRESO) {
                            inicioDate = new Date(excelEpoch.getTime() + item.INGRESO * 86400000);
                            inicioDate.setUTCHours(0, 0, 0, 0);
                        }
                        let endDate;
                        if (item.CESE) {
                            endDate = new Date(excelEpoch.getTime() + item.CESE * 86400000);
                            endDate.setUTCHours(0, 0, 0, 0);
                        }
                        let dateOfBirth;
                        if (item["FECHA DE NACIMIENTO"]) {
                            dateOfBirth = new Date(excelEpoch.getTime() + item["FECHA DE NACIMIENTO"] * 86400000);
                            dateOfBirth.setUTCHours(0, 0, 0, 0);
                        }
                        yield prisma_config_1.default.manoObra.create({
                            data: {
                                codigo: formattedCodigo,
                                documento_identidad: item.DNI.toString(),
                                nombre_completo: item["APELLIDO Y NOMBRE COMPLETO"],
                                tipo_obrero_id: type.id,
                                origen_obrero_id: origin.id,
                                categoria_obrero_id: category.id,
                                especialidad_obrero_id: specialty.id,
                                unidad_id: unit.id,
                                banco_id: bank ? bank.id : null,
                                fecha_inicio: item.INGRESO ? inicioDate : null,
                                fecha_cese: item.CESE ? endDate : null,
                                fecha_nacimiento: item["FECHA DE NACIMIENTO"]
                                    ? dateOfBirth
                                    : null,
                                estado: item.ESTADO == client_1.E_Estado_MO_BD.ACTIVO
                                    ? client_1.E_Estado_MO_BD.ACTIVO
                                    : client_1.E_Estado_MO_BD.INACTIVO,
                                escolaridad: item.ESCOLARIDAD ? String(item.ESCOLARIDAD) : null,
                                cuenta: item.CUENTA,
                                telefono: String(item.CELULAR),
                                email_personal: item.CORREO,
                                observacion: item.OBSERVACION,
                                proyecto_id: responseProject.id,
                                usuario_id: userResponse.id,
                            },
                        });
                    }
                }
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Empleados creados correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer la Mano de Obra", error);
            }
        });
    }
}
exports.workforceService = new WorkforceService();
