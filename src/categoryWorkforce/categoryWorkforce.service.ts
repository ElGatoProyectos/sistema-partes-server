import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaCategoryWorkforceRepository } from "./prisma-categoryWorkfoce.repository";

class CategoryWorkforceService {
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];

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

      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.createCategoryWorkforceMasive(
          data
        );

      if (categoryWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear las Categorias de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva la Categoria de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva la Categoria de la Mano de Obra",
        error
      );
    }
  }
}

export const categoryWorkforceService = new CategoryWorkforceService();
