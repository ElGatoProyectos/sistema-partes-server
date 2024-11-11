import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateCategoryWorkforceBD } from "./models/categoryWorkforce.interface";
import { prismaCategoryWorkforceRepository } from "./prisma-categoryWorkfoce.repository";

class CategoryWorkforceValidation {
  async findById(bank_id: number): Promise<T_HttpResponse> {
    try {
      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.findById(bank_id);
      if (!categoryWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró la Categoria de la Mano de Obra solicitado"
        );
      return httpResponse.SuccessResponse(
        "Categoria de la Mano de Obra encontrado con éxito",
        categoryWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria de la Mano de Obra",
        error
      );
    }
  }
  async findByName(name: string, project_id: number): Promise<T_HttpResponse> {
    try {
      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.findByName(name, project_id);
      if (!categoryWorkforce)
        return httpResponse.NotFoundException(
          "No se encontró la Categoria de la Mano de Obra con el nombre que desea buscar"
        );
      return httpResponse.SuccessResponse(
        "Categoria de la Mano de Obra encontrado con éxito",
        categoryWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria de la Mano de Obra",
        error
      );
    }
  }
  async findAllWithPagination(project_id: number): Promise<T_HttpResponse> {
    try {
      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.findAllWithOutPagination(
          project_id
        );
      return httpResponse.SuccessResponse(
        "Categoria de la Mano de Obra del Proyecto fue encontrado con éxito",
        categoryWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Categoria de la Mano de Obra del Proyecto",
        error
      );
    }
  }
  async createBank(data: I_CreateCategoryWorkforceBD): Promise<T_HttpResponse> {
    try {
      const categoryWorkforce =
        await prismaCategoryWorkforceRepository.createCategoryWorkforce(data);
      if (!categoryWorkforce)
        return httpResponse.NotFoundException(
          "No se pudo crear la Categoria de la Mano de Obra"
        );
      return httpResponse.SuccessResponse(
        "Se pudo crear la Categoria de la Mano de Obra",
        categoryWorkforce
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la Categoria de la Mano de Obra",
        error
      );
    }
  }
}

export const categoryWorkforceValidation = new CategoryWorkforceValidation();
