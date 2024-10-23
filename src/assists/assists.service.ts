import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { E_Asistencia_BD, E_Estado_BD, ManoObra } from "@prisma/client";
import { workforceValidation } from "@/workforce/workforce.validation";
import { projectValidation } from "@/project/project.validation";
import { prismaAssistsRepository } from "./prisma-assists.repository";
import { assistsWorkforceValidation } from "./assists.validation";
import { T_FindAllAssists } from "./models/assists.types";
import { jwtService } from "@/auth/jwt.service";
import { I_Usuario } from "@/user/models/user.interface";
import { weekValidation } from "@/week/week.validation";
// import { Rol } from "@/common/enums/role.enum";

class AssistsService {
  async findAll(
    data: T_FindAllAssists,
    project_id: string,
    token: string
  ): Promise<T_HttpResponse> {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as I_Usuario;
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Asistencia con el id del Proyecto proporcionado"
        );
      }
      const array = Array.from({ length: 52 }, (v, i) =>
        String(i + 1).padStart(2, "0")
      );
      console.log(array);
      const workforcesManyResponse =
        await workforceValidation.findAllWithPagination(+project_id);

      if (!workforcesManyResponse || workforcesManyResponse.length === 0) {
        return httpResponse.BadRequestException(
          "No se entontraron registros en la Mano de Obra en el Proyecto para crear la asistencia",
          []
        );
      }
      // if(data.queryParams.week){
      //   const week= await weekValidation.findByCode(data.queryParams.week)
      // }
      if (
        userResponse.Rol?.rol === "ADMIN" ||
        userResponse.Rol?.rol === "USER" ||
        userResponse.Rol?.rol === "CONTROL_COSTOS"
      ) {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id
        );

        return this.createSuccessResponse(result, data.queryParams);
      } else if (userResponse.Rol?.rol === "INGENIERO_PRODUCCION") {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id,
          userResponse.id
        );
        return this.createSuccessResponse(result, data.queryParams);
      } else if (userResponse.Rol?.rol === "INGENIERO_SSOMMA") {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id,
          userResponse.id
        );
        return this.createSuccessResponse(result, data.queryParams);
      } else if (userResponse.Rol?.rol === "MAESTRO_OBRA") {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id,
          userResponse.id
        );
        return this.createSuccessResponse(result, data.queryParams);
      } else if (userResponse.Rol?.rol === "CAPATAZ") {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id,
          userResponse.id
        );
        return this.createSuccessResponse(result, data.queryParams);
      } else if (userResponse.Rol?.rol === "JEFE_GRUPO") {
        const result = await prismaAssistsRepository.findAll(
          skip,
          data,
          +project_id,
          userResponse.id
        );
        return this.createSuccessResponse(result, data.queryParams);
      } else {
        return httpResponse.BadRequestException(
          "No tiene acceso para ver esta sección"
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async create(project_id: string, token: string): Promise<T_HttpResponse> {
    try {
      const userTokenResponse = await jwtService.getUserFromToken(token);
      if (!userTokenResponse) return userTokenResponse;
      const userResponse = userTokenResponse.payload as I_Usuario;

      if (
        userResponse.Rol?.rol === "ADMIN" ||
        userResponse.Rol?.rol === "USER" ||
        userResponse.Rol?.rol === "CONTROL_COSTOS"
      ) {
        const resultIdProject = await projectValidation.findById(+project_id);
        if (!resultIdProject.success) {
          return httpResponse.BadRequestException(
            "No se puede crear la Asistencia con el id del Proyecto proporcionado"
          );
        }

        const date = new Date();
        const verifyDate = await assistsWorkforceValidation.findByDate(date);
        const workforcesManyResponse =
          await workforceValidation.findAllWithPagination(+project_id);

        if (!workforcesManyResponse || workforcesManyResponse.length === 0) {
          return httpResponse.BadRequestException(
            "No se entontraron registros en la Mano de Obra en el Proyecto para crear la asistencia",
            []
          );
        }

        if (verifyDate.success) {
          return httpResponse.BadRequestException(
            "Ya se realizó la asistencia para este día"
          );
        }

        const assistsResponse = await this.processWorkforceAssists(
          workforcesManyResponse,
          date,
          +project_id
        );
        if (!assistsResponse.success) {
          return httpResponse.BadRequestException(
            "Hubo un problema en crear las asistencias de la Mano de Obra"
          );
        }

        return httpResponse.CreatedResponse(
          "Asistencias creadas correctamente"
        );
      } else {
        return httpResponse.BadRequestException(
          "Usted no tiene acceso para realizar esta acción"
        );
      }
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear la asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(assists_id: number): Promise<T_HttpResponse> {
    try {
      const assistsResponse = await prismaAssistsRepository.findById(
        assists_id
      );
      if (!assistsResponse) {
        return httpResponse.NotFoundException(
          "El id de la Asistencia no fue encontrado"
        );
      }
      return httpResponse.SuccessResponse(
        "Asistencia encontrada",
        assistsResponse
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar la Asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async processWorkforceAssists(
    workforcesManyResponse: any[],
    date: Date,
    project_id: number
  ): Promise<{ success: boolean }> {
    for (let index = 0; index < workforcesManyResponse.length; index++) {
      let value;
      const valueIsBetweenWeek = 8.5;
      const valueIsEndWeek = 5.5;

      value = this.isBetweenWeek(date) ? valueIsBetweenWeek : valueIsEndWeek;

      const assistsFormat = {
        fecha: date,
        horas: value,
        horas_60: 0,
        horas_100: 0,
        asistencia: E_Asistencia_BD.F,
        horas_extras_estado: E_Estado_BD.n,
        mano_obra_id: workforcesManyResponse[index].id,
        proyecto_id: project_id,
      };

      const assistsResponse = await prismaAssistsRepository.createAssists(
        assistsFormat
      );
      if (!assistsResponse) {
        return { success: false };
      }
    }

    return { success: true };
  }
  createSuccessResponse(result: any, queryParams: any): T_HttpResponse {
    const { assistsConverter, total } = result;
    const pageCount = Math.ceil(total / queryParams.limit);
    const formData = {
      total,
      page: queryParams.page,
      limit: queryParams.limit,
      pageCount,
      data: assistsConverter,
    };
    return httpResponse.SuccessResponse(
      "Éxito al traer todas las Asistencias ya que existen",
      formData
    );
  }
  isBetweenWeek(date: Date): boolean {
    const dayWeek = date.getDay(); // Obtiene el día de la semana (0 para domingo, 1 para lunes, etc.)
    return dayWeek >= 1 && dayWeek <= 5; // Lunes (1) a viernes (5)
  }

  // isFinDeSemana(date: Date): boolean {
  //   const dayWeek = date.getDay();
  //   return dayWeek === 0 || dayWeek === 6; // Domingo (0) o sábado (6)
  // }
}

export const assistsService = new AssistsService();
