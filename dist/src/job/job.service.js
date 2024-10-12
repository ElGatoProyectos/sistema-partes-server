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
exports.jobService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const train_validation_1 = require("@/train/train.validation");
const productionUnit_validation_1 = require("@/production-unit/productionUnit.validation");
const date_1 = require("@/common/utils/date");
const job_validation_1 = require("./job.validation");
const client_1 = require("@prisma/client");
const prisma_job_repository_1 = require("./prisma-job.repository");
const project_validation_1 = require("@/project/project.validation");
const job_mapper_1 = require("./mappers/job.mapper");
const user_validation_1 = require("@/user/user.validation");
const xlsx = __importStar(require("xlsx"));
const validator_1 = __importDefault(require("validator"));
const jwt_service_1 = require("@/auth/jwt.service");
class JobService {
    createJob(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainResponse = yield train_validation_1.trainValidation.findById(+data.tren_id);
                if (!trainResponse.success) {
                    return trainResponse;
                }
                // const train = trainResponse.payload as Tren;
                const upResponse = yield productionUnit_validation_1.productionUnitValidation.findById(+data.up_id);
                if (!upResponse) {
                    return upResponse;
                }
                const projectResponse = yield project_validation_1.projectValidation.findById(+project_id);
                if (!projectResponse.success) {
                    return projectResponse;
                }
                // const up = upResponse.payload as UnidadProduccion;
                const lastJob = yield job_validation_1.jobValidation.codeMoreHigh(+project_id);
                const lastJobResponse = lastJob.payload;
                const userResponse = yield user_validation_1.userValidation.findById(data.usuario_id);
                if (!userResponse.success)
                    return userResponse;
                const user = userResponse.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastJobResponse === null || lastJobResponse === void 0 ? void 0 : lastJobResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(4, "0");
                const fecha_inicio = (0, date_1.converToDate)(data.fecha_inicio);
                const fecha_finalizacion = (0, date_1.converToDate)(data.fecha_finalizacion);
                const jobFormat = {
                    nombre: data.nombre,
                    nota: data.nota ? data.nota : "",
                    duracion: data.duracion,
                    codigo: formattedCodigo,
                    costo_partida: data.costo_partida != undefined ? data.costo_partida : 0,
                    costo_mano_obra: data.costo_mano_obra != undefined ? data.costo_mano_obra : 0,
                    costo_material: data.costo_material != undefined ? data.costo_material : 0,
                    costo_equipo: data.costo_equipo != undefined ? data.costo_equipo : 0,
                    costo_varios: data.costo_varios != undefined ? data.costo_varios : 0,
                    fecha_inicio: fecha_inicio,
                    fecha_finalizacion: fecha_finalizacion,
                    up_id: data.up_id,
                    tren_id: data.tren_id,
                    proyecto_id: +project_id,
                    usuario_id: user.id,
                };
                const jobResponse = yield prisma_job_repository_1.prismaJobRepository.createJob(jobFormat);
                return http_response_1.httpResponse.CreatedResponse("Trabajo creado correctamente", jobResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear Trabajo", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateStatusJob(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobResponse = yield job_validation_1.jobValidation.findById(job_id);
                if (!jobResponse.success) {
                    return jobResponse;
                }
                else {
                    const result = yield prisma_job_repository_1.prismaJobRepository.updateStatusJob(job_id);
                    return http_response_1.httpResponse.SuccessResponse("Trabajo eliminado correctamente", result);
                }
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al eliminar el Trabajo", error);
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
                const result = yield prisma_job_repository_1.prismaJobRepository.findAll(skip, data, +project_id);
                const { jobs, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: jobs,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Trabajos", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas los Trabajos", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    findById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobResponse = yield prisma_job_repository_1.prismaJobRepository.findById(job_id);
                if (!jobResponse) {
                    return http_response_1.httpResponse.NotFoundException("El id del Trabajo no fue no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", jobResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el Trabajo", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    updateJob(data, job_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resultIdJob = yield job_validation_1.jobValidation.findById(job_id);
                if (!resultIdJob.success) {
                    return http_response_1.httpResponse.BadRequestException("No se pudo encontrar el id del Trabajo que se quiere editar");
                }
                const resultIdProject = yield project_validation_1.projectValidation.findById(+project_id);
                if (!resultIdProject.success) {
                    return http_response_1.httpResponse.BadRequestException("No se puede actualizar el Trabajo con el id del proyecto proporcionado");
                }
                const resultJobFind = resultIdJob.payload;
                const userResponse = yield user_validation_1.userValidation.findById(data.usuario_id);
                if (!userResponse.success)
                    return userResponse;
                const user = userResponse.payload;
                if (resultJobFind.nombre != data.nombre) {
                    const resultTrain = yield train_validation_1.trainValidation.findByName(data.nombre, +project_id);
                    if (!resultTrain.success) {
                        return resultTrain;
                    }
                }
                const trainResponse = yield train_validation_1.trainValidation.findById(data.tren_id);
                if (!trainResponse.success)
                    return trainResponse;
                const upResponse = yield productionUnit_validation_1.productionUnitValidation.findById(data.up_id);
                if (!upResponse.success)
                    return upResponse;
                const fecha_inicio = (0, date_1.converToDate)(data.fecha_inicio);
                const fecha_finalizacion = (0, date_1.converToDate)(data.fecha_finalizacion);
                const trainFormat = Object.assign(Object.assign({}, data), { fecha_inicio: fecha_inicio, fecha_finalizacion: fecha_finalizacion, proyecto_id: +project_id, usuario_id: user.id });
                const responseJob = yield prisma_job_repository_1.prismaJobRepository.updateJob(trainFormat, project_id);
                const jobMapper = new job_mapper_1.JobResponseMapper(responseJob);
                return http_response_1.httpResponse.SuccessResponse("Trabajo modificado correctamente", jobMapper);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Trabajo", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
    calcularDiasEntreFechas(fechaInicio, fechaFin) {
        // Convertir las fechas a milisegundos
        const milisegundosPorDia = 1000 * 60 * 60 * 24;
        // Restar las fechas y dividir por los milisegundos en un día
        const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
        const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / milisegundosPorDia);
        return diferenciaEnDias;
    }
    registerJobMasive(file, projectId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = file.buffer;
                const workbook = xlsx.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetToJson = xlsx.utils.sheet_to_json(sheet);
                const userTokenResponse = yield jwt_service_1.jwtService.getUserFromToken(token);
                if (!userTokenResponse)
                    return userTokenResponse;
                const userResponse = userTokenResponse.payload;
                let error = 0;
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
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. Verificar los campos");
                }
                const project = yield project_validation_1.projectValidation.findById(projectId);
                if (!project.success)
                    return project;
                const responseProject = project.payload;
                let errorNumber = 0;
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["ID-TRABAJO"] == undefined ||
                        item.TRABAJOS == undefined ||
                        item.TREN == undefined ||
                        item["UNIDAD DE PRODUCCION"] == undefined ||
                        item.INICIO == undefined ||
                        item.FINALIZA == undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Los campos ID-TRABAJO, TRABAJOS, TREN, UNIDAD DE PRODUCCION, INICIO, FINALIZA son obligatorios.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[note] Acá verificamos que el codigo no tenga letras ni que sea menor que el anterior
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const codigoSinEspacios = item["ID-TRABAJO"].trim();
                    //verificamos si tenemos el codigo
                    const codigo = parseInt(item["ID-TRABAJO"], 10); // Intenta convertir el string a número
                    if (!validator_1.default.isNumeric(codigoSinEspacios)) {
                        errorNumber++; // Aumenta si el código no es un número válido
                    }
                    else {
                        // Verifica si el código ya ha sido procesado
                        if (!seenCodes.has(item["ID-TRABAJO"])) {
                            // errorNumber++; // Aumenta si hay duplicado
                            seenCodes.add(item["ID-TRABAJO"]);
                        }
                        // Verifica si el código actual no es mayor que el anterior
                        if (previousCodigo !== null && codigo <= previousCodigo) {
                            errorNumber++;
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
                    .map((item) => item.padStart(4, "0"))
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
                //[NOTE] ACÁ VERIFICAMOS SI LOS TRENES EXISTEN
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const trainResponse = yield train_validation_1.trainValidation.findByCodeValidation(item.TREN.trim(), projectId);
                    if (!trainResponse.success) {
                        errorNumber++;
                        errorRows.push(index + 1);
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Ha ingresado Trenes que no existen en la base de datos.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[NOTE] ACÁ VERIFICAMOS SI LAS UNIDADES DE PRODUCCIÓN EXISTEN
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const upResponse = yield productionUnit_validation_1.productionUnitValidation.findByCodeValidation(item["UNIDAD DE PRODUCCION"], projectId);
                    if (!upResponse.success) {
                        errorNumber++;
                        errorRows.push(index + 1);
                    }
                })));
                if (errorNumber > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo.Ha ingresado Unidad de Producción que no existen en la base de datos.Verificar las filas: ${errorRows.join(", ")}.`);
                }
                //[SUCCESS] Guardo o actualizo el Trabajo
                let code;
                let job;
                yield Promise.all(sheetToJson.map((item) => __awaiter(this, void 0, void 0, function* () {
                    code = yield job_validation_1.jobValidation.findByCode(String(item["ID-TRABAJO"].trim()), responseProject.id);
                    if (!code.success) {
                        job = code.payload;
                        yield job_validation_1.jobValidation.updateJobForExcel(item, job.id, responseProject.id, userResponse.id);
                    }
                    else {
                        const excelEpoch = new Date(1899, 11, 30);
                        const inicioDate = new Date(excelEpoch.getTime() + item.INICIO * 86400000);
                        const endDate = new Date(excelEpoch.getTime() + item.FINALIZA * 86400000);
                        inicioDate.setUTCHours(0, 0, 0, 0);
                        endDate.setUTCHours(0, 0, 0, 0);
                        const formattedDuracion = parseFloat(item.DURA).toFixed(1);
                        const upResponse = yield productionUnit_validation_1.productionUnitValidation.findByCodeValidation(item["UNIDAD DE PRODUCCION"].trim(), projectId);
                        const up = upResponse.payload;
                        const trainResponse = yield train_validation_1.trainValidation.findByCodeValidation(item.TREN.trim(), projectId);
                        const train = trainResponse.payload;
                        const duration = this.calcularDiasEntreFechas(inicioDate, endDate);
                        const durationFix = duration === 0 ? 1 : duration;
                        yield prisma_config_1.default.trabajo.create({
                            data: {
                                codigo: String(item["ID-TRABAJO"].trim()),
                                nombre: item.TRABAJOS,
                                duracion: +durationFix,
                                fecha_inicio: inicioDate,
                                fecha_finalizacion: endDate,
                                nota: "",
                                costo_partida: 0,
                                costo_mano_obra: 0,
                                costo_material: 0,
                                costo_equipo: 0,
                                costo_varios: 0,
                                tren_id: train.id,
                                estado_trabajo: client_1.E_Trabajo_Estado.PROGRAMADO,
                                up_id: up.id,
                                proyecto_id: responseProject.id,
                                usuario_id: userResponse.id,
                            },
                        });
                    }
                })));
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Trabajos creados correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer los Trabajos", error);
            }
        });
    }
}
exports.jobService = new JobService();
