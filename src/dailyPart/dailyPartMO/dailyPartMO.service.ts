import {
  Asistencia,
  E_Estado_Asistencia_BD,
  ParteDiario,
} from "@prisma/client";
import { projectValidation } from "../../project/project.validation";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { I_DailyPartMO } from "../models/dailyPart.interface";
import { workforceValidation } from "../../workforce/workforce.validation";
import { assistsWorkforceValidation } from "../../assists/assists.validation";
import { httpResponse } from "../../common/http.response";
import { dailyPartMOValidation } from "./dailyPartMO.validation";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.types";
import { prismaDailyPartMORepository } from "./prisma-dailyPartMO.repository";
import prisma from "../../config/prisma.config";

class DailyPartMOService {
  async createDailyPartMO(data: I_DailyPartMO, project_id: number) {
    try {
      const projectResponse = await projectValidation.findById(project_id);

      if (!projectResponse.success) {
        return projectResponse;
      }

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(data.daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      const workforcesResponse = await workforceValidation.findManyId(
        data.workforces_id
      );
      if (!workforcesResponse.success) {
        return workforcesResponse;
      }

      const assistsResponse =
        await assistsWorkforceValidation.findAllWithPagination(project_id);

      const assists = assistsResponse.payload as Asistencia[];

      if (assists.length === 0) {
        return httpResponse.BadRequestException(
          "No se ha realizado la asistencia o no tiene mano de obra para realizar este Parte Diario de Trabajadores"
        );
      }

      const idsMOAsigned = assists
        .filter(
          (assist) =>
            assist.estado_asignacion === E_Estado_Asistencia_BD.ASIGNADO
        )
        .map((assist) => assist.mano_obra_id);

      const idsMOInStateAssigned: number[] = [];

      data.workforces_id.forEach((workforce_id) => {
        if (idsMOAsigned.includes(workforce_id)) {
          idsMOInStateAssigned.push(workforce_id);
        }
      });

      await dailyPartMOValidation.createMany(
        data.workforces_id,
        project_id,
        dailyPart.id
      );
      await assistsWorkforceValidation.updateManyAsigned(
        data.workforces_id,
        project_id
      );

      if (idsMOAsigned.length > 0) {
        await assistsWorkforceValidation.updateManyAsignedX2(
          idsMOAsigned,
          project_id
        );
      }

      return httpResponse.CreatedResponse(
        "Parte Diario con Mano fue creado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Parte Diario MO",
        error
      );
    }
  }

  async findAll(data: T_FindAllDailyPartMO, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const result = await prismaDailyPartMORepository.findAll(
        skip,
        data,
        +project_id
      );

      const { dailyPartsMO, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: dailyPartsMO,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Partes Diarios de la Mano de Obra",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los los Partes Diarios de la Mano de Obra",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
export const dailyPartMOService = new DailyPartMOService();
