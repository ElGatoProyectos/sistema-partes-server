import { httpResponse, T_HttpResponse } from "../../common/http.response";
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
  async findByIdUser(
    user_id: number,
    project_id: number
  ): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailUserProjectRepository.findByUser(
        user_id,
        project_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Usuario con el id del Proyecto no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Id Usuario del proyecto fue encontrado",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Id Usuario en Empresa",
        error
      );
    }
  }
  async existsUser(user_id: number): Promise<T_HttpResponse> {
    try {
      const detail = await prismaDetailUserProjectRepository.existsUser(
        user_id
      );
      if (!detail) {
        return httpResponse.NotFoundException(
          "Id del Usuario no fue encontrado en ningún proyecto"
        );
      }
      return httpResponse.SuccessResponse(
        "Id Usuario fue encontrado en algún Proyecto",
        detail
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar id Usuario en detalle Usuario-Proyecto",
        error
      );
    }
  }
}

export const detailProjectValidation = new DetailProjectValidation();
