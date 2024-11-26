import { httpResponse, T_HttpResponse } from "../common/http.response";
import { I_CreateAssistsWorkforceBD, I_UpdateAssitsBD } from "./models/assists.interface";
import { prismaAssistsRepository } from "./prisma-assists.repository";

class AssistsWorkforceValidation {
  async findById(id: number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findById(id);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia con ese id"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
  async findByDate(date: Date,project_id:number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByDate(date,project_id);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
  async findAllWithOutPaginationByDate(date: Date): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findAllWithOutPaginationByDate(date);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
  async findAllWithOutPaginationByDateAndProject(date: Date,project_id:number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findAllWithOutPaginationByDateAndProject(date,project_id);
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
  async findByDateAndWorkforce(
    date: Date,
    workforce_id: number,
    project_id:number
  ): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByDateAndWorkforce(
        date,
        workforce_id,
        project_id
      );
      if (!assists) {
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha con ese trabajador"
        );
      }

      return httpResponse.SuccessResponse(
        "Asistencia con ese trabajador encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia con ese trabajador",
        error
      );
    }
  }

  async findByDateAndMO(mano_obra_id: number,project_id:number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findByIdMoAndDate(
        mano_obra_id,project_id
      );
      if (!assists)
        return httpResponse.NotFoundException(
          "No se encontró Asistencia para esa fecha y mano de obra"
        );
      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }

  async findAllWithPagination(project_id: number): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.findAllWithOutPagination(
        project_id
      );

      return httpResponse.SuccessResponse(
        "Asistencia encontrada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    }
  }
  async updateAssists(
    data: I_UpdateAssitsBD,
    assists_id: number,
    workforce_id: number
  ): Promise<T_HttpResponse> {
    try {
      const assistsUpdate = await prismaAssistsRepository.updateAssists(
        data,
        assists_id,
        workforce_id
      );

      return httpResponse.SuccessResponse(
        "Asistencia actualizada correctamente",
        assistsUpdate
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Asistencia ",
        error
      );
    }
  }
  async updateManyAsigned(
    ids: number[],
    project_id: number,
    date: Date | null
  ): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.updateManyStatusAsigned(
        ids,
        project_id,
        date
      );

      return httpResponse.SuccessResponse(
        "Asistencia ahora con estado Asignado modfificada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Asistencia con estado Asignado",
        error
      );
    }
  }
  async updateManyAsignedX2(
    ids: number[],
    project_id: number,
    date: Date | null
  ): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.updateManyStatusAsignedX2(
        ids,
        project_id,
        date
      );

      return httpResponse.SuccessResponse(
        "Asistenciaa ahora con estado Doblemente Asignado fueron modificadas con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Asistencia con estado Doblemente Asignado",
        error
      );
    }
  }
  async updateManyNotAsigned(
    ids: number[],
    project_id: number,
    date: Date | null
  ): Promise<T_HttpResponse> {
    try {
      const assists = await prismaAssistsRepository.updateManyStatusNotAsigned(
        ids,
        project_id,
        date
      );

      return httpResponse.SuccessResponse(
        "Asistencia con estado No Asignado modfificada con éxito",
        assists
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar la Asistencia con estado Asignado",
        error
      );
    }
  }
  
}

export const assistsWorkforceValidation = new AssistsWorkforceValidation();
