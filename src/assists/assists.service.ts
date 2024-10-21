import { httpResponse, T_HttpResponse } from "@/common/http.response";
import prisma from "@/config/prisma.config";
import { I_AssistsBody } from "./models/assists.interface";
import { converToDate } from "@/common/utils/date";
import { E_Asistencia_BD, E_Estado_BD, ManoObra } from "@prisma/client";
import { workforceValidation } from "@/workforce/workforce.validation";
import { projectValidation } from "@/project/project.validation";
import { prismaAssistsRepository } from "./prisma-assists.repository";

class AssistsService {
  async create(
    data: I_AssistsBody,
    project_id: string
  ): Promise<T_HttpResponse> {
    try {
      const workforceResponse = await workforceValidation.findById(
        data.mano_obra_id
      );
      if (!workforceResponse.success) {
        return workforceResponse;
      }
      const workforce = workforceResponse.payload as ManoObra;
      const resultIdProject = await projectValidation.findById(+project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear la Asistencia con el id del Proyecto proporcionado"
        );
      }
      const date = converToDate(data.fecha);
      let flag;
      const valueIsBetweenWeek = 8.5;
      const valueIsEndWeek = 5.5;
      flag = this.isBetweenWeek(date) ? valueIsBetweenWeek : valueIsEndWeek;
      const assists =
        data.asistencia === "A" ? E_Asistencia_BD.A : E_Asistencia_BD.F;
      const state_hours_extras =
        data.horas_extras_estado === "y" ? E_Estado_BD.y : E_Estado_BD.n;
      const assistsFormat = {
        fecha: date,
        horas: flag,
        horas_60: data.horas_60,
        horas_100: data.horas_100,
        asistencia: assists,
        horas_extras_estado: state_hours_extras,
        mano_obra_id: +workforce.id,
        proyecto_id: +project_id,
      };
      const assistsResponse = await prismaAssistsRepository.createAssists(
        assistsFormat
      );
      return httpResponse.CreatedResponse(
        "Asistencia creada correctamente",
        assistsResponse
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al crear la asistencia",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
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
