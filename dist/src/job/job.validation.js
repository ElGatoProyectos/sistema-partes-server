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
class JobValidation {
    // async updateTrain(
    //   data: I_TrainExcel,
    //   idProductionUnit: number,
    //   idProjectID: number
    // ): Promise<T_HttpResponse> {
    //   try {
    //     const train = {
    //       codigo: String(data["ID-TREN"]),
    //       nombre: data.TREN,
    //       nota: data.NOTA,
    //       cuadrilla: data.TREN + "-" + data["ID-TREN"],
    //       proyecto_id: Number(idProjectID),
    //     };
    //     const responseTrain = await prismaTrainRepository.updateTrain(
    //       train,
    //       idProductionUnit
    //     );
    //     return httpResponse.SuccessResponse(
    //       "Tren modificado correctamente",
    //       responseTrain
    //     );
    //   } catch (error) {
    //     return httpResponse.InternalServerErrorException(
    //       "Error al modificar el Tren",
    //       error
    //     );
    //   }
    // }
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
