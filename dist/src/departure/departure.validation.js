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
exports.departureValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_departure_repository_1 = require("./prisma-departure.repository");
const unit_validation_1 = require("@/unit/unit.validation");
class DepartureValidation {
    updateDeparture(departure_id, data, usuario_id, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let departureFormat = {
                    id_interno: data["ID-PARTIDA"] ? String(data["ID-PARTIDA"].trim()) : "",
                    item: data.ITEM || "",
                    partida: data.PARTIDA || "",
                    metrado_inicial: data.METRADO,
                    metrado_total: data.METRADO,
                    precio: +data.PRECIO,
                    parcial: data.PARCIAL,
                    mano_de_obra_unitaria: 0,
                    material_unitario: 0,
                    equipo_unitario: 0,
                    subcontrata_varios: 0,
                    usuario_id: usuario_id,
                    proyecto_id: project_id,
                };
                if (data.UNI) {
                    const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(data.UNI.trim(), project_id);
                    const unit = unitResponse.payload;
                    departureFormat.unidad_id = unit.id;
                }
                const responseUnifiedIndex = yield prisma_departure_repository_1.prismaDepartureRepository.updateDeparture(departureFormat, departure_id);
                return http_response_1.httpResponse.SuccessResponse("Unidad modificada correctamente", responseUnifiedIndex);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Unidad", error);
            }
        });
    }
    codeMoreHigh(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departure = yield prisma_departure_repository_1.prismaDepartureRepository.codeMoreHigh(project_id);
                if (!departure) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", []);
                }
                return http_response_1.httpResponse.SuccessResponse("Partida encontrada", departure);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar Partida", error);
            }
        });
    }
    findByCodeValidation(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departure = yield prisma_departure_repository_1.prismaDepartureRepository.findByCode(code, project_id);
                if (!departure) {
                    return http_response_1.httpResponse.NotFoundException("Partida no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("La Partida fue encontrada", departure);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Partida ", error);
            }
        });
    }
    findById(departure_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departureResponse = yield prisma_departure_repository_1.prismaDepartureRepository.findById(departure_id);
                if (!departureResponse) {
                    return http_response_1.httpResponse.NotFoundException("La Partida no fue encontrada");
                }
                return http_response_1.httpResponse.SuccessResponse("La Partida fue encontrada", departureResponse);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Partida ", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nameExists = yield prisma_departure_repository_1.prismaDepartureRepository.existsName(name, project_id);
                if (nameExists) {
                    return http_response_1.httpResponse.NotFoundException("El nombre ingresado de la Partida ya existe en la base de datos");
                }
                return http_response_1.httpResponse.SuccessResponse("El nombre no existe, puede proceguir");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException(" Error al buscar el nombre de la Partida en la base de datos", error);
            }
        });
    }
}
exports.departureValidation = new DepartureValidation();
