import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { prismaSpecialtyWorkforceRepository } from "./prisma-specialtyWorkforce";

class SpecialtyWorkforceService {
  async createMasive(project_id: number): Promise<T_HttpResponse> {
    try {
      const data: any = [];
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
        nombre: "Ingeniera de Planificación Control",
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
      data.push({ nombre: "Topógrado", proyecto_id: project_id });
      data.push({ nombre: "Vigilancia", proyecto_id: project_id });

      const specialtyWorkforce =
        await prismaSpecialtyWorkforceRepository.createSpecialtyWorkforceMasive(
          data
        );

      if (specialtyWorkforce.count === 0) {
        return httpResponse.SuccessResponse(
          "Hubo problemas para crear las Especialidades de la Mano de Obra"
        );
      }

      return httpResponse.SuccessResponse(
        "Éxito al crear de forma masiva las Especialidades de la Mano de Obra"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear forma masiva las Especialidades de la Mano de Obra",
        error
      );
    }
  }
}

export const specialtyWorkforceService = new SpecialtyWorkforceService();
