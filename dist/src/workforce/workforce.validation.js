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
exports.workforceValidation = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_workforce_repository_1 = require("./prisma-workforce.repository");
const typeWorkforce_validation_1 = require("@/typeWorkforce/typeWorkforce.validation");
const client_1 = require("@prisma/client");
const originWorkforce_validation_1 = require("@/originWorkforce/originWorkforce.validation");
const categoryWorkforce_validation_1 = require("@/categoryWorkforce/categoryWorkforce.validation");
const specialtyWorkfoce_validation_1 = require("@/specialtyWorkforce/specialtyWorkfoce.validation");
const unit_validation_1 = require("@/unit/unit.validation");
const bankWorkforce_validation_1 = require("@/bankWorkforce/bankWorkforce.validation");
class WorkforceValidation {
    updateWorkforce(data, project_id, workforce_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const typeResponse = yield typeWorkforce_validation_1.typeWorkforceValidation.findByName(data.TIPO.trim(), project_id);
                const type = typeResponse.payload;
                const originResponse = yield originWorkforce_validation_1.originWorkforceValidation.findByName(data.ORIGEN.trim(), project_id);
                const origin = originResponse.payload;
                const categoryResponse = yield categoryWorkforce_validation_1.categoryWorkforceValidation.findByName(data.CATEGORIA.trim(), project_id);
                const category = categoryResponse.payload;
                const specialtyResponse = yield specialtyWorkfoce_validation_1.specialtyWorkforceValidation.findByName(data.ESPECIALIDAD.trim(), project_id);
                const specialty = specialtyResponse.payload;
                const unitResponse = yield unit_validation_1.unitValidation.findBySymbol(data.UNIDAD.trim(), project_id);
                const unit = unitResponse.payload;
                let bank;
                if (data.BANCO) {
                    const bankResponse = yield bankWorkforce_validation_1.bankWorkforceValidation.findByName(data.BANCO.trim(), project_id);
                    bank = bankResponse.payload;
                }
                const excelEpoch = new Date(1899, 11, 30);
                let inicioDate;
                if (data.INGRESO) {
                    inicioDate = new Date(excelEpoch.getTime() + data.INGRESO * 86400000);
                    inicioDate.setUTCHours(0, 0, 0, 0);
                }
                let endDate;
                if (data.CESE) {
                    endDate = new Date(excelEpoch.getTime() + data.CESE * 86400000);
                    endDate.setUTCHours(0, 0, 0, 0);
                }
                let dateOfBirth;
                if (data["FECHA DE NACIMIENTO"]) {
                    dateOfBirth = new Date(excelEpoch.getTime() + data["FECHA DE NACIMIENTO"] * 86400000);
                    dateOfBirth.setUTCHours(0, 0, 0, 0);
                }
                const workForceFormat = {
                    documento_identidad: data.DNI.toString(),
                    nombre_completo: data["APELLIDO Y NOMBRE COMPLETO"],
                    tipo_obrero_id: type.id,
                    origen_obrero_id: origin.id,
                    categoria_obrero_id: category.id,
                    especialidad_obrero_id: specialty.id,
                    unidad_id: unit.id,
                    banco_id: data.BANCO ? bank.id : null,
                    fecha_inicio: data.INGRESO ? inicioDate : null,
                    fecha_cese: data.CESE ? endDate : null,
                    fecha_nacimiento: data["FECHA DE NACIMIENTO"] ? dateOfBirth : null,
                    estado: data.ESTADO == client_1.E_Estado_MO_BD.ACTIVO
                        ? client_1.E_Estado_MO_BD.ACTIVO
                        : client_1.E_Estado_MO_BD.INACTIVO,
                    escolaridad: data.ESCOLARIDAD ? String(data.ESCOLARIDAD) : null,
                    cuenta: data.CUENTA,
                    telefono: data.CELULAR ? String(data.CELULAR) : null,
                    email_personal: data.CORREO,
                    observacion: data.OBSERVACION,
                    proyecto_id: project_id,
                    usuario_id: user_id,
                };
                const workforceUpdate = yield prisma_workforce_repository_1.prismaWorkforceRepository.updateWorkforce(workForceFormat, workforce_id);
                return http_response_1.httpResponse.SuccessResponse("Mano de Obra modificado correctamente", workforceUpdate);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al modificar la Mano de Obra", error);
            }
        });
    }
    findByDni(dni, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workforce = yield prisma_workforce_repository_1.prismaWorkforceRepository.findByDNI(dni, project_id);
                if (!workforce) {
                    return http_response_1.httpResponse.NotFoundException("Dni de la Mano de no fue encontrado", workforce);
                }
                return http_response_1.httpResponse.SuccessResponse("Dni de la Mano de Obra encontrado", workforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el DNI de la Mano de Obra", error);
            }
        });
    }
    findByCode(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workforce = yield prisma_workforce_repository_1.prismaWorkforceRepository.findByCode(code, project_id);
                if (workforce) {
                    return http_response_1.httpResponse.NotFoundException("Codigo de la Mano de Obra encontrado", workforce);
                }
                return http_response_1.httpResponse.SuccessResponse("Mano de Obra no encontrado", workforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar código de la Mano de Obra", error);
            }
        });
    }
    findByCodeValidation(code, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workforce = yield prisma_workforce_repository_1.prismaWorkforceRepository.findByCode(code, project_id);
                if (!workforce) {
                    return http_response_1.httpResponse.NotFoundException("Codigo de la Mano de Obra no encontrado", workforce);
                }
                return http_response_1.httpResponse.SuccessResponse("Código de la Mano de Obra encontrado", workforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar código de la Mano de Obra", error);
            }
        });
    }
    findById(workforce_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workforce = yield prisma_workforce_repository_1.prismaWorkforceRepository.findById(workforce_id);
                if (!workforce) {
                    return http_response_1.httpResponse.NotFoundException("Id de la Mano de Obra no encontrado");
                }
                return http_response_1.httpResponse.SuccessResponse("Mano de Obra encontrado", workforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar la Mano de Obra", error);
            }
        });
    }
    findByName(name, project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const train = yield prisma_workforce_repository_1.prismaWorkforceRepository.existsName(name, project_id);
                if (train) {
                    return http_response_1.httpResponse.NotFoundException("El nombre del empleado ya existe en la base de datos");
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
                const workforce = yield prisma_workforce_repository_1.prismaWorkforceRepository.codeMoreHigh(project_id);
                if (!workforce) {
                    return http_response_1.httpResponse.SuccessResponse("No se encontraron resultados", 0);
                }
                return http_response_1.httpResponse.SuccessResponse("Código de la Mano de Obra encontrado", workforce);
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al buscar el código de la Mano de Obra", error);
            }
        });
    }
}
exports.workforceValidation = new WorkforceValidation();
