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
exports.trainValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_train_repository_1 = require("./prisma-train.repository");
class TrainValidation {
    updateTrain(data, idProductionUnit, idProjectID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = {
                    codigo: String(data["ID-TREN"]),
                    nombre: data.TREN,
                    nota: data.NOTA,
                    cuadrilla: data.TREN + "-" + data["ID-TREN"],
                    proyecto_id: Number(idProjectID),
                };
                const responseTrain = yield prisma_train_repository_1.prismaTrainRepository.updateTrain(train, idProductionUnit);
                return http_response_1.httpResponse.SuccessResponse("Tren modificado correctamente", responseTrain);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar el Tren", error);
            }
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_train_repository_1.prismaTrainRepository.findByCode(code, project_id);
                if (train) {
                    return http_response_1.httpResponse.NotFoundException("Codigo del Tren encontrado", train);
                }
                return http_response_1.httpResponse.SuccessResponse("Tren encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar código del Tren", error);
            }
        });
    }
    findById(idTrain) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_train_repository_1.prismaTrainRepository.findById(idTrain);
                if (!train) {
                    return http_response_1.httpResponse.NotFoundException("Id del Tren no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Tren encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_train_repository_1.prismaTrainRepository.existsName(name, project_id);
                if (train) {
                    return http_response_1.httpResponse.NotFoundException("El nombre del Tren ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("Tren encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_train_repository_1.prismaTrainRepository.codeMoreHigh(project_id);
                if (!train) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", 0);
                }
                return http_response_1.httpResponse.SuccessResponse("Tren encontrado", train);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Tren", error);
            }
        });
    }
}
exports.trainValidation = new TrainValidation();
