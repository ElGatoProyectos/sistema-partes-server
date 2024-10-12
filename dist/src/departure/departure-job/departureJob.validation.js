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
exports.departureJobValidation = void 0;
const http_response_1 = require("@/common/http.response");
const job_validation_1 = require("@/job/job.validation");
const departure_validation_1 = require("../departure.validation");
const prisma_job_repository_1 = require("@/job/prisma-job.repository");
const prisma_departure_job_repository_1 = require("./prisma-departure-job.repository");
class DepartureJobValidation {
    updateDepartureJob(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobResponse = yield job_validation_1.jobValidation.findByCodeValidation(data["ID-TRABAJO"], project_id);
                const job = jobResponse.payload;
                const departureWithComa = data.PARTIDA.split(" "); // Divide por espacios
                const codeDeparture = departureWithComa[0];
                const departureResponse = yield departure_validation_1.departureValidation.findByCodeValidation(String(codeDeparture), project_id);
                const departure = departureResponse.payload;
                if (departure.precio) {
                    let suma = 0;
                    const resultado = data.METRADO * departure.precio;
                    // console.log(
                    //   "la partida " +
                    //     data.PARTIDA +
                    //     " viene con valor de la base de datos el trabajo " +
                    //     job.costo_partida +
                    //     " esto da del codigo de la partida " +
                    //     departure.id +
                    //     " de multiplicar el metrado " +
                    //     data.METRADO +
                    //     " por el precio de la partida " +
                    //     departure.precio +
                    //     " el siguiente resultado " +
                    //     resultado +
                    //     " para el id del trabajo " +
                    //     job.id
                    // );
                    suma = resultado + job.costo_partida;
                    // console.log("el resultado de la suma da  " + suma);
                    yield prisma_job_repository_1.prismaJobRepository.updateJobCost(suma, job.id);
                }
                if (departure.mano_de_obra_unitaria) {
                    let suma = 0;
                    const resultado = data.METRADO * departure.mano_de_obra_unitaria;
                    // console.log(
                    //   "la partida " +
                    //     data.PARTIDA +
                    //     " viene con valor de la base de datos el trabajo " +
                    //     job.costo_mano_obra +
                    //     " esto da del codigo de la partida " +
                    //     departure.id +
                    //     " de multiplicar el metrado " +
                    //     data.METRADO +
                    //     " por la mano de obra de bbdd " +
                    //     departure.mano_de_obra_unitaria +
                    //     " el siguiente resultado " +
                    //     resultado +
                    //     " para el id del trabajo " +
                    //     job.id
                    // );
                    suma = resultado + job.costo_partida;
                    yield prisma_job_repository_1.prismaJobRepository.updateJobCostOfLabor(suma, job.id);
                }
                if (departure.material_unitario) {
                    let suma = 0;
                    const resultado = data.METRADO * departure.material_unitario;
                    // console.log(
                    //   "la partida " +
                    //     data.PARTIDA +
                    //     " viene con valor de la base de datos el trabajo " +
                    //     job.costo_material +
                    //     " esto da del codigo de la partida " +
                    //     departure.id +
                    //     " de multiplicar el metrado " +
                    //     data.METRADO +
                    //     " por la material de bbdd " +
                    //     departure.material_unitario +
                    //     " el siguiente resultado " +
                    //     resultado +
                    //     " para el id del trabajo " +
                    //     job.id
                    // );
                    suma = resultado + job.costo_partida;
                    yield prisma_job_repository_1.prismaJobRepository.updateJobMaterialCost(suma, job.id);
                }
                if (departure.equipo_unitario) {
                    let suma = 0;
                    const resultado = data.METRADO * departure.equipo_unitario;
                    // console.log(
                    //   "la partida " +
                    //     data.PARTIDA +
                    //     " viene con valor de la base de datos el trabajo " +
                    //     job.costo_equipo +
                    //     " esto da del codigo de la partida " +
                    //     departure.id +
                    //     " de multiplicar el metrado " +
                    //     data.METRADO +
                    //     " por la costo equipo de bbdd " +
                    //     departure.equipo_unitario +
                    //     " el siguiente resultado " +
                    //     resultado +
                    //     " para el id del trabajo " +
                    //     job.id
                    // );
                    suma = resultado + job.costo_partida;
                    yield prisma_job_repository_1.prismaJobRepository.updateJobEquipment(suma, job.id);
                }
                if (departure.subcontrata_varios) {
                    let suma = 0;
                    const resultado = data.METRADO * departure.subcontrata_varios;
                    // console.log(
                    //   "la partida " +
                    //     data.PARTIDA +
                    //     " viene con valor de la base de datos el costo varios " +
                    //     job.costo_varios +
                    //     " esto da del codigo de la partida " +
                    //     departure.id +
                    //     " de multiplicar el metrado " +
                    //     data.METRADO +
                    //     " por la mano de obra de bb " +
                    //     departure.subcontrata_varios +
                    //     " el siguiente resultado " +
                    //     resultado +
                    //     " para el id del trabajo " +
                    //     job.id
                    // );
                    suma = resultado + job.costo_partida;
                    yield prisma_job_repository_1.prismaJobRepository.updateJobSeveral(suma, job.id);
                }
                return http_response_1.httpResponse.SuccessResponse("Los Trabajos de las Partidas modificada correctamente");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar los Trabajos de las Partidas", error);
            }
        });
    }
    createDetailDepartureJob(data, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobResponse = yield job_validation_1.jobValidation.findByCodeValidation(data["ID-TRABAJO"], project_id);
                const job = jobResponse.payload;
                const departureWithComa = data.PARTIDA.split(" "); // Divide por espacios
                const codeDeparture = departureWithComa[0];
                const departureResponse = yield departure_validation_1.departureValidation.findByCodeValidation(String(codeDeparture), project_id);
                const departure = departureResponse.payload;
                const detail = yield prisma_departure_job_repository_1.prismaDepartureJobRepository.createDetailDepartureJob(job.id, departure.id, +data.METRADO);
                return http_response_1.httpResponse.SuccessResponse("El Detalle Trabajo-Partida fue creado correctamente", detail);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar los Trabajos de las Partidas", error);
            }
        });
    }
}
exports.departureJobValidation = new DepartureJobValidation();
