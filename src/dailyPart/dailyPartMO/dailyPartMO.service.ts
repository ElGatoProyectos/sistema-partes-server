import {
  Asistencia,
  E_Estado_Asistencia_BD,
  ParteDiario,
  ParteDiarioMO,
} from "@prisma/client";
import { projectValidation } from "../../project/project.validation";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { workforceValidation } from "../../workforce/workforce.validation";
import { assistsWorkforceValidation } from "../../assists/assists.validation";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import { dailyPartMOValidation } from "./dailyPartMO.validation";
import { T_FindAllDailyPartMO } from "./models/dailyPartMO.types";
import { prismaDailyPartMORepository } from "./prisma-dailyPartMO.repository";
import prisma from "../../config/prisma.config";
import {
  I_DailyPartMO,
  I_UpdateDailyPartBody,
} from "./models/dailyPartMO.interface";

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
        data.workforces_id,
        project_id
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
  async updateDailyPartMO(
    data: I_UpdateDailyPartBody,
    daily_part_id: number,
    project_id: number,
    daily_part_mo_id: number
  ) {
    try {
      const projectResponse = await projectValidation.findById(project_id);

      if (!projectResponse.success) {
        return projectResponse;
      }

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      const dailyPartMOResponse = await dailyPartMOValidation.findById(
        daily_part_mo_id
      );
      if (!dailyPartMOResponse.success) {
        return dailyPartMOResponse;
      }

      const dailyPartMO = dailyPartMOResponse.payload as ParteDiarioMO;

      const updateDailyPartMOFormat = {
        hora_parcial: data.hora_parcial,
        hora_normal: data.hora_normal,
        hora_60: data.hora_60,
        hora_100: data.hora_100,
        parte_diario_id: dailyPart.id,
        mano_obra_id: dailyPartMO.mano_obra_id,
        proyecto_id: project_id,
      };

      const updateDailyPartMO =
        await prismaDailyPartMORepository.updateDailyPartMO(
          updateDailyPartMOFormat,
          daily_part_mo_id
        );

      if (dailyPart.fecha) {
        const date = dailyPart.fecha;
        date?.setUTCHours(0, 0, 0, 0);
        const assistsResponse = await assistsWorkforceValidation.findByDate(
          date
        );
        const assists = assistsResponse.payload as Asistencia;

        //  const assistsFormat={
        //   fecha               :  dailyPart.fecha
        //   horas               Float
        //   horas_trabajadas    Float?                 @default(0)
        //   hora_parcial        Float?                 @default(0)
        //   hora_normal         Float?                 @default(0)
        //   horas_60            Float?                 @default(0)
        //   horas_100           Float?                 @default(0)
        //   estado_asignacion   E_Estado_Asistencia_BD @default(FALTA)
        //   asistencia          E_Asistencia_BD        @default(F)
        //   horas_extras_estado E_Estado_BD?           @default(n)
        //   fecha_creacion      DateTime               @default(now())
        //   eliminado           E_Estado_BD            @default(n)
        //   mano_obra_id        Int
        //   proyecto_id         Int
        //  }
      }

      return httpResponse.SuccessResponse(
        "Parte Diario con Mano fue modificado correctamente",
        updateDailyPartMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Parte Diario MO",
        error
      );
    }
  }

  async findAll(
    data: T_FindAllDailyPartMO,
    project_id: string,
    daily_part_id: number
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const result = await prismaDailyPartMORepository.findAll(
        skip,
        data,
        +project_id,
        daily_part_id
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

  async findById(daily_part_mo_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartMO = await prismaDailyPartMORepository.findById(
        daily_part_mo_id
      );
      if (!dailyPartMO) {
        return httpResponse.NotFoundException(
          "El Parte Diario de la Mano de Obra no fue encontrado",
          dailyPartMO
        );
      }
      return httpResponse.SuccessResponse(
        "El Parte Diario de la Mano de Obra fue encontrado",
        dailyPartMO
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al buscar Parte Diario de la Mano de Obra",
        error
      );
    }
  }
  async delete(daily_part_mo_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartMOResponse = await dailyPartMOValidation.findById(
        daily_part_mo_id
      );
      if (!dailyPartMOResponse.success) {
        return dailyPartMOResponse;
      }
      await prismaDailyPartMORepository.delete(daily_part_mo_id);

      return httpResponse.SuccessResponse(
        "El Parte Diario de la Mano de Obra fue eliminado con éxito"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar Parte Diario de la Mano de Obra",
        error
      );
    }
  }
}
export const dailyPartMOService = new DailyPartMOService();
