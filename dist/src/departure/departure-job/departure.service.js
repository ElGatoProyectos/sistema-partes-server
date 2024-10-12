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
exports.departureJobService = void 0;
const xlsx = __importStar(require("xlsx"));
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const departure_validation_1 = require("../departure.validation");
const project_validation_1 = require("@/project/project.validation");
const job_validation_1 = require("@/job/job.validation");
const unit_validation_1 = require("@/unit/unit.validation");
const departureJob_validation_1 = require("./departureJob.validation");
const prisma_departure_job_repository_1 = require("./prisma-departure-job.repository");
class DepartureJobService {
    updateDepartureJobMasive(file, project_id) {
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
                let errorMessages = [];
                const responseProject = yield project_validation_1.projectValidation.findById(project_id);
                if (!responseProject.success)
                    return responseProject;
                const project = responseProject.payload;
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
                    return http_response_1.httpResponse.BadRequestException("Error al leer el archivo. El archivo no puede tener arriba varias filas en blanco ");
                }
                const seenCodes = new Set();
                let previousCodigo = null;
                //[note] aca si hay espacio en blanco.
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    if (item["ID-TRABAJO"] == undefined ||
                        item.PARTIDA == undefined ||
                        item.UNIDAD == undefined ||
                        item.METRADO == undefined) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. Los campos ID-TRABAJO, PARTIDA, UNIDAD y METRADO son obligatorios. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el id del trabajo
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const jobResponse = yield job_validation_1.jobValidation.findByCodeValidation(item["ID-TRABAJO"].trim(), project.id);
                    if (!jobResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El Id del Trabajo no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] separar el id de la Partida y buscar si existe
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios
                    const codeDeparture = departureWithComa[0];
                    const departureResponse = yield departure_validation_1.departureValidation.findByCodeValidation(codeDeparture, project.id);
                    if (!departureResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El Id de la Partida no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[note] buscar si existe el id de la Unidad
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const jobResponse = yield unit_validation_1.unitValidation.findBySymbol(item.UNIDAD.trim(), project.id);
                    if (!jobResponse.success) {
                        error++;
                        errorRows.push(index + 1);
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El Id de la Unidad no fue encontrada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[success] Verifico si el metrado supera al de la partida
                yield Promise.all(sheetToJson.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    index++;
                    const departureWithComa = item.PARTIDA.split(" "); // Divide por espacios
                    const codeDeparture = departureWithComa[0];
                    const departureResponse = yield departure_validation_1.departureValidation.findByCodeValidation(codeDeparture, project.id);
                    const partida = departureResponse.payload;
                    if (partida.metrado_inicial) {
                        if (Number(item.METRADO) > partida.metrado_inicial) {
                            error++;
                            errorRows.push(index + 1);
                        }
                    }
                })));
                if (error > 0) {
                    return http_response_1.httpResponse.BadRequestException(`Error al leer el archivo. El metrado ingresado de la partida es mayor de la que está guardada. Fallo en las siguientes filas: ${errorRows.join(", ")}`);
                }
                //[SUCCESS] Guardo o actualizo la Unidad de Producciónn
                for (const item of sheetToJson) {
                    yield departureJob_validation_1.departureJobValidation.updateDepartureJob(item, project_id);
                    yield departureJob_validation_1.departureJobValidation.createDetailDepartureJob(item, project_id);
                }
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.SuccessResponse("Partidas y Trabajos actualizados correctamente!");
            }
            catch (error) {
                yield prisma_config_1.default.$disconnect();
                return http_response_1.httpResponse.InternalServerErrorException("Error al leer las Partidas con sus Trabajos", error);
            }
        });
    }
    findAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (data.queryParams.page - 1) * data.queryParams.limit;
                const result = yield prisma_departure_job_repository_1.prismaDepartureJobRepository.findAll(skip, data);
                const { detailsDepartureJob, total } = result;
                const pageCount = Math.ceil(total / data.queryParams.limit);
                const formData = {
                    total,
                    page: data.queryParams.page,
                    // x ejemplo 20
                    limit: data.queryParams.limit,
                    //cantidad de paginas que hay
                    pageCount,
                    data: detailsDepartureJob,
                };
                return http_response_1.httpResponse.SuccessResponse("Éxito al traer todos los Trabajos y sus Partidas", formData);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al traer todas los Trabajos y sus Partidas", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.departureJobService = new DepartureJobService();
