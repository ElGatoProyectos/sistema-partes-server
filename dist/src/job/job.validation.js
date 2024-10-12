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
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_job_repository_1 = require("./prisma-job.repository");
const productionUnit_validation_1 = require("@/production-unit/productionUnit.validation");
const train_validation_1 = require("@/train/train.validation");
const job_service_1 = require("./job.service");
class JobValidation {
    updateJobForExcel(data, job_id, project_id, usuario_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const excelEpoch = new Date(1899, 11, 30);
                const inicioDate = new Date(excelEpoch.getTime() + data.INICIO * 86400000);
                const endDate = new Date(excelEpoch.getTime() + data.FINALIZA * 86400000);
                inicioDate.setUTCHours(0, 0, 0, 0);
                endDate.setUTCHours(0, 0, 0, 0);
                const formattedDuracion = parseFloat(data.DURA).toFixed(1);
                const upResponse = yield productionUnit_validation_1.productionUnitValidation.findByCodeValidation(data["UNIDAD DE PRODUCCION"].trim(), project_id);
                const up = upResponse.payload;
                const trainResponse = yield train_validation_1.trainValidation.findByCodeValidation(data.TREN.trim(), project_id);
                const train = trainResponse.payload;
                const duration = job_service_1.jobService.calcularDiasEntreFechas(inicioDate, endDate);
                const durationFix = duration === 0 ? 1 : duration;
                const jobFormat = {
                    codigo: data["ID-TRABAJO"].trim(),
                    nombre: data.TRABAJOS,
                    tren_id: train.id,
                    up_id: up.id,
                    fecha_inicio: inicioDate,
                    fecha_finalizacion: endDate,
                    costo_partida: 0,
                    costo_mano_obra: 0,
                    costo_material: 0,
                    costo_equipo: 0,
                    costo_varios: 0,
                    proyecto_id: project_id,
                    duracion: durationFix,
                    usuario_id: usuario_id,
                };
                const responseJob = yield prisma_job_repository_1.prismaJobRepository.updateJobFromExcel(jobFormat, job_id);
                return http_response_1.httpResponse.SuccessResponse("Trabajo modificado correctamente", responseJob);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Trabajo", error);
            }
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield prisma_job_repository_1.prismaJobRepository.findByCode(code, project_id);
                if (job) {
                    return http_response_1.httpResponse.NotFoundException("Codigo del Trabajo encontrado", job);
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", job);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar código del Trabajo", error);
            }
        });
    }
    findByCodeValidation(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield prisma_job_repository_1.prismaJobRepository.findByCode(code, project_id);
                if (!job) {
                    return http_response_1.httpResponse.NotFoundException("Codigo del Trabajo encontrado", job);
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", job);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar código del Trabajo", error);
            }
        });
    }
    findById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield prisma_job_repository_1.prismaJobRepository.findById(job_id);
                if (!job) {
                    return http_response_1.httpResponse.NotFoundException("Id del Trabajo no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", job);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_job_repository_1.prismaJobRepository.existsName(name, project_id);
                if (train) {
                    return http_response_1.httpResponse.NotFoundException("El nombre del Trabajo ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Trabajo", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_job_repository_1.prismaJobRepository.codeMoreHigh(project_id);
                if (!train) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", 0);
                }
                return http_response_1.httpResponse.SuccessResponse("Trabajo encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
}
exports.jobValidation = new JobValidation();
