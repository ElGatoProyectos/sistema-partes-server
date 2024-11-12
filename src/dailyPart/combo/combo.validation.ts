import { httpResponse } from "../../common/http.response";
import { prismaComboRepository } from "./prisma-combo.respository";

class ComboValidation {
  async findById(combo_id: number) {
    try {
      const combo = await prismaComboRepository.findById(combo_id);
      if (!combo) {
        return httpResponse.NotFoundException(
          "No se encontrado el combo con el id proporcionado",
          combo
        );
      }
      return httpResponse.SuccessResponse(
        "Se encontró con éxito el combo",
        combo
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar el combo",
        error
      );
    }
  }
  async findManyWithOutPagination(project_id: number) {
    try {
      const combos = await prismaComboRepository.findAllWithOutPagination(
        project_id
      );

      return httpResponse.SuccessResponse(
        "Se encontró con éxito todos los combos",
        combos
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar todos los trabajadores del combo",
        error
      );
    }
  }
  async findManyWithOutPaginationOfDetail(combo_id: number) {
    try {
      const combo =
        await prismaComboRepository.findAllWithOutPaginationOfDetail(combo_id);

      return httpResponse.SuccessResponse(
        "Se encontró con éxito todos los trabajadores del combo",
        combo
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar todos los trabajadores del combo",
        error
      );
    }
  }
}

export const comboValidation = new ComboValidation();
