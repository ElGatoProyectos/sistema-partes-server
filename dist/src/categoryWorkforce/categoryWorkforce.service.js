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
exports.categoryWorkforceService = void 0;
const http_response_1 = require("@/common/http.response");
const prisma_categoryWorkfoce_repository_1 = require("./prisma-categoryWorkfoce.repository");
class CategoryWorkforceService {
    createMasive(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = [];
                data.push({ nombre: "Administración", proyecto_id: project_id });
                data.push({ nombre: "Apoyo", proyecto_id: project_id });
                data.push({ nombre: "Asistente", proyecto_id: project_id });
                data.push({ nombre: "Ing. Residencia", proyecto_id: project_id });
                data.push({ nombre: "Ing. Producción", proyecto_id: project_id });
                data.push({ nombre: "Ing. de Costos", proyecto_id: project_id });
                data.push({ nombre: "Ing. Medio Ambiente", proyecto_id: project_id });
                data.push({ nombre: "Ing. SSOMMA", proyecto_id: project_id });
                data.push({ nombre: "Ing. Valorizaciones", proyecto_id: project_id });
                data.push({ nombre: "Logística", proyecto_id: project_id });
                data.push({ nombre: "Oficial", proyecto_id: project_id });
                data.push({ nombre: "Operario", proyecto_id: project_id });
                data.push({ nombre: "Peon", proyecto_id: project_id });
                data.push({ nombre: "Representante Legal", proyecto_id: project_id });
                data.push({ nombre: "Vigilancia", proyecto_id: project_id });
                const categoryWorkforce = yield prisma_categoryWorkfoce_repository_1.prismaCategoryWorkforceRepository.createCategoryWorkforceMasive(data);
                if (categoryWorkforce.count === 0) {
                    return http_response_1.httpResponse.SuccessResponse("Hubo problemas para crear las Categorias de la Mano de Obra");
                }
                return http_response_1.httpResponse.SuccessResponse("Éxito al crear de forma masiva la Categoria de la Mano de Obra");
            }
            catch (error) {
                return http_response_1.httpResponse.InternalServerErrorException("Error al crear forma masiva la Categoria de la Mano de Obra", error);
            }
        });
    }
}
exports.categoryWorkforceService = new CategoryWorkforceService();
