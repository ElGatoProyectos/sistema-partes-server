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
exports.specialtyWorkforceService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_specialtyWorkforce_1 = require("./prisma-specialtyWorkforce");
class SpecialtyWorkforceService {
    createMasive(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [];
                data.push({ nombre: "Administrador", proyecto_id: project_id });
                data.push({ nombre: "Albañil", proyecto_id: project_id });
                data.push({ nombre: "Apoyo", proyecto_id: project_id });
                data.push({ nombre: "Apoyo-Ayudante", proyecto_id: project_id });
                data.push({ nombre: "Asistente Logística", proyecto_id: project_id });
                data.push({ nombre: "Asistente SSOMMA", proyecto_id: project_id });
                data.push({ nombre: "Carpintero", proyecto_id: project_id });
                data.push({ nombre: "Control de Costos", proyecto_id: project_id });
                data.push({ nombre: "Electricista", proyecto_id: project_id });
                data.push({ nombre: "Fierrero", proyecto_id: project_id });
                data.push({ nombre: "Gasfitero", proyecto_id: project_id });
                data.push({
                    nombre: "Ingeniera de Planificación y Control",
                    proyecto_id: project_id,
                });
                data.push({
                    nombre: "Ingeniero Medio Ambiente",
                    proyecto_id: project_id,
                });
                data.push({ nombre: "Ingeniero SSOMMA", proyecto_id: project_id });
                data.push({ nombre: "Operaciones", proyecto_id: project_id });
                data.push({ nombre: "Logística", proyecto_id: project_id });
                data.push({ nombre: "Maestro de obra", proyecto_id: project_id });
                data.push({ nombre: "Producción", proyecto_id: project_id });
                data.push({ nombre: "Representante Legal", proyecto_id: project_id });
                data.push({ nombre: "Residencia de Obra", proyecto_id: project_id });
                data.push({ nombre: "Topografo", proyecto_id: project_id });
                data.push({ nombre: "Vigilancia", proyecto_id: project_id });
                const specialtyWorkforce = yield prisma_specialtyWorkforce_1.prismaSpecialtyWorkforceRepository.createSpecialtyWorkforceMasive(data);
                if (specialtyWorkforce.count === 0) {
                    return http_response_1.httpResponse.SuccessResponse("Hubo problemas para crear las Especialidades de la Mano de Obra");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva las Especialidades de la Mano de Obra");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear forma masiva las Especialidades de la Mano de Obra", error);
            }
        });
    }
}
exports.specialtyWorkforceService = new SpecialtyWorkforceService();
