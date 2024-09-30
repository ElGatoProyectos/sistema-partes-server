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
exports.jobService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_config_1 = __importDefault(require("@/config/prisma.config"));
const train_validation_1 = require("@/train/train.validation");
const productionUnit_validation_1 = require("@/production-unit/productionUnit.validation");
const date_1 = require("@/common/utils/date");
const job_validation_1 = require("./job.validation");
const prisma_job_repository_1 = require("./prisma-job.repository");
class JobService {
    createJob(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainResponse = yield train_validation_1.trainValidation.findById(+data.tren_id);
                if (!trainResponse) {
                    return trainResponse;
                }
                const upResponse = yield productionUnit_validation_1.productionUnitValidation.findById(+data.up_id);
                if (!upResponse) {
                    return upResponse;
                }
                const lastJob = yield job_validation_1.jobValidation.codeMoreHigh(data.proyecto_id);
                const lastJobResponse = lastJob.payload;
                // Incrementar el código en 1
                const nextCodigo = (parseInt(lastJobResponse === null || lastJobResponse === void 0 ? void 0 : lastJobResponse.codigo) || 0) + 1;
                const formattedCodigo = nextCodigo.toString().padStart(4, "0");
                const fecha_inicio = (0, date_1.converToDate)(data.fecha_inicio);
                const fecha_finalizacion = (0, date_1.converToDate)(data.fecha_finalizacion);
                const jobFormat = Object.assign(Object.assign({}, data), { codigo: formattedCodigo, costo_partida: data.costo_partida != undefined ? data.costo_partida : 0, costo_mano_obra: data.costo_mano_obra != undefined ? data.costo_mano_obra : 0, costo_material: data.costo_material != undefined ? data.costo_material : 0, costo_equipo: data.costo_equipo != undefined ? data.costo_equipo : 0, costo_varios: data.costo_varios != undefined ? data.costo_varios : 0, fecha_inicio: fecha_inicio, fecha_finalizacion: fecha_finalizacion });
                const jobResponse = yield prisma_job_repository_1.prismaJobRepository.createJob(jobFormat);
                return http_response_1.httpResponse.CreatedResponse("Trabajo creado correctamente", jobResponse);
            }
            catch (error) {
                console.log(error);
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear Trabajo", error);
            }
            finally {
                yield prisma_config_1.default.$disconnect();
            }
        });
    }
}
exports.jobService = new JobService();
