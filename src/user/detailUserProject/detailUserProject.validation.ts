import { httpResponse, T_HttpResponse } from "@/common/http.response";
import { I_CreateDetailUserProject } from "./models/detailUserProject.interface";
import { prismaDetailUserProjectRepository } from "./prismaUserProject.repository";

class DetailProjectValidation {
  async createDetailUserProject(
    data: I_CreateDetailUserProject
  ): Promise<T_HttpResponse> {
    try {
      const responseDetailUserProject =
        await prismaDetailUserProjectRepository.createUserProject(data);
      return httpResponse.CreatedResponse(
        "Detalle Usuario-Proyecto creado correctamente",
        responseDetailUserProject
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear Detalle Usuario-Proyecto",
        error
      );
    }
  }
}

export const detailProjectValidation = new DetailProjectValidation();