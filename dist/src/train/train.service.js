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
exports.trainService = void 0;
const project_validation_1 = require("@/project/project.validation");
const http_response_1 = require("@/common/http.response");
const train_validation_1 = require("./train.validation");
const prisma_train_repository_1 = require("./prisma-train.repository");
const train_mapper_1 = require("./mappers/train.mapper");
const xlsx = __importStar(require("xlsx"));
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const validator_1 = __importDefault(require("validator"));
class TrainService {
    createTrain(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultTrain = yield train_validation_1.trainValidation.findByName(data.nombre, project_id);
                if (!resultTrain.success) {
                    return resultTrain;
                }
                const resultIdProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear el Tren con el id del Proyecto proporcionado");
                }
                const lastTrain = yield train_validation_1.trainValidation.codeMoreHigh(project_id);
                const lastTrainResponse = lastTrain.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastTrainResponse === null || lastTrainResponse === void 0 ? void 0 : lastTrainResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(3, "0");
                const trainFormat = Object.assign(Object.assign({}, data), { codigo: formattedCodigo, operario: 1, oficial: 1, peon: 1, proyecto_id: project_id });
                const responseTrain = yield prisma_train_repository_1.prismaTrainRepository.createTrain(trainFormat);
                const trainMapper = new train_mapper_1.TrainResponseMapper(responseTrain);
                return http_response_1.httpResponse.CreatedResponse("Tren creado correctamente", trainMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear Tren", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateTrain(data, idTrain, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdTrain = yield train_validation_1.trainValidation.findById(idTrain);
                if (!resultIdTrain.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id del Tren que se quiere editar");
                }
                const resultTrainFind = resultIdTrain.payload;
                if (resultTrainFind.nombre != data.nombre) {
                    const resultTrain = yield train_validation_1.trainValidation.findByName(data.nombre, +project_id);
                    if (!resultTrain.success) {
                        return resultTrain;
                    }
                }
                const resultIdProject = yield project_validation_1.projectValidation.findById(+project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede crear el Tren con el id del proyecto proporcionado");
                }
                const trainResponse = resultIdTrain.payload;
                const trainFormat = Object.assign(Object.assign({}, data), { operario: data.operario, oficial: data.oficial, peon: data.peon, proyecto_id: +project_id });
                const responseTrain = yield prisma_train_repository_1.prismaTrainRepository.updateTrain(trainFormat, idTrain);
                const trainMapper = new train_mapper_1.TrainResponseMapper(responseTrain);
                return http_response_1.httpResponse.SuccessResponse("Tren modificado correctamente", trainMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Tren", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateCuadrillaTrain(data, train_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdTrain = yield train_validation_1.trainValidation.findById(train_id);
                if (!resultIdTrain.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id del Tren que se quiere editar");
                }
                const trainUpdate = yield prisma_train_repository_1.prismaTrainRepository.updateCuadrillaByIdTrain(train_id, data.official, data.pawns, data.workers);
                const trainMapper = new train_mapper_1.TrainResponseMapper(trainUpdate);
                return http_response_1.httpResponse.SuccessResponse("Cuadrilla del Tren modificada con éxito", trainMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al editar la cuadrilla del Tren", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainResponse = yield prisma_train_repository_1.prismaTrainRepository.findById(idTrain);
                if (!trainResponse) {
                    return http_response_1.httpResponse.NotFoundException("El id del Tren no fue no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Tren encontrado", trainResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Tren", error);
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
                const result = yield prisma_train_repository_1.prismaTrainRepository.searchNameTrain(name, skip, data.queryParams.limit, +project_id);
                const { trains, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: trains,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al buscar el Tren", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Trenes", error);
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
                const result = yield prisma_train_repository_1.prismaTrainRepository.findAll(skip, data, +project_id);
                const { trains, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: trains,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Trenes", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas los Trenes", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusTrain(idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainResponse = yield train_validation_1.trainValidation.findById(idTrain);
                if (!trainResponse.success) {
                    return trainResponse;
                }
                else {
                    const result = yield prisma_train_repository_1.prismaTrainRepository.updateStatusTrain(idTrain);
                    return http_response_1.httpResponse.SuccessResponse("Tren eliminado correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error en eliminar el Tren", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    registerTrainMasive(file, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                const project = yield project_validation_1.projectValidation.findById(project_id);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["ID-TREN"] == undefined || item.TREN == undefined) {
                        error++;
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                //[note] Aca verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    //verificamos si tenemos el codigo
                    const codigo = parseInt(item["ID-TREN"], 10); // Intenta convertir el string a número
                    if (!validator_1.default.isNumeric(item["ID-TREN"])) {
                        errorNumber++; // Aumenta si el código no es un número válido
                    }
                    else {
                        // Verifica si el código ya ha sido procesado
                        if (!seenCodes.has(item["ID-TREN"])) {
                            // errorNumber++; // Aumenta si hay duplicado
                            seenCodes.add(item["ID-TREN"]);
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
                let productionUnit;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield train_validation_1.trainValidation.findByCode(String(item["ID-TREN"]), project_id);
                    if (!code.success) {
                        productionUnit = code.payload;
                        yield train_validation_1.trainValidation.updateTrain(item, +productionUnit.id, responseProject.id);
                    }
                    else {
                        yield prisma_config_1.default.tren.create({
                            data: {
                                codigo: String(item["ID-TREN"]),
                                nombre: item.TREN,
                                nota: item.NOTA,
                                operario: 1,
                                oficial: 1,
                                peon: 1,
                                proyecto_id: responseProject.id,
                            },
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Trenes creados correctamente!");
            }
            catch (error) {
                console.log(error);
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer el Tren", error);
            }
        });
    }
}
exports.trainService = new TrainService();
