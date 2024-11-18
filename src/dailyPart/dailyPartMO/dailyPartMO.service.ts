import {
  Asistencia,
  E_Asistencia_BD,
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

      if (idsMOInStateAssigned.length > 0) {
        await assistsWorkforceValidation.updateManyAsignedX2(
          idsMOInStateAssigned,
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

      await this.updateAssistsIfValid(dailyPart, dailyPartMO, data);

      return httpResponse.SuccessResponse(
        "Parte Diario con Mano fue modificado correctamente",
        updateDailyPartMO
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al modificar el Parte Diario MO",
        error
      );
    }
  }

  async updateAssistsIfValid(
    dailyPart: ParteDiario,
    dailyPartMO: ParteDiarioMO,
    data: I_UpdateDailyPartBody
  ) {
    if (
      dailyPart.fecha === null ||
      dailyPartMO.hora_parcial === null ||
      dailyPartMO.hora_normal === null ||
      dailyPartMO.hora_60 === null ||
      dailyPartMO.hora_100 === null
    ) {
      return;
    }
    const date = dailyPart.fecha;
    date.setUTCHours(0, 0, 0, 0);
    const assistsResponse =
      await assistsWorkforceValidation.findByDateAndWorkforce(
        date,
        dailyPartMO.mano_obra_id
      );
    if (!assistsResponse.success) {
      return assistsResponse;
    }
    const assists = assistsResponse.payload as Asistencia;
    console.log(data);
    console.log(
      "resutado 0 de hacer  asistencia hora parcial " +
        (assists.hora_parcial || 0) +
        "DATA HORA PARCIAL " +
        data.hora_parcial +
        " parte diario mo " +
        dailyPartMO.hora_parcial
    );
    let hp = 0;
    if (
      assists.hora_parcial !== undefined &&
      assists.hora_parcial !== null &&
      dailyPartMO.hora_parcial !== undefined &&
      dailyPartMO.hora_parcial !== null
    ) {
      hp = assists.hora_parcial + data.hora_parcial - dailyPartMO.hora_parcial;
    }
    let hn = 0;
    if (
      assists.hora_normal !== undefined &&
      assists.hora_normal !== null &&
      dailyPartMO.hora_normal !== undefined &&
      dailyPartMO.hora_normal !== null
    ) {
      hn = assists.hora_normal + data.hora_normal - dailyPartMO.hora_normal;
    }
    let h60 = 0;
    if (
      assists.horas_60 !== undefined &&
      assists.horas_60 !== null &&
      dailyPartMO.hora_60 !== undefined &&
      dailyPartMO.hora_60 !== null
    ) {
      h60 = assists.horas_60 + data.hora_60 - dailyPartMO.hora_60;
    }
    let h100 = 0;
    if (
      assists.horas_100 !== undefined &&
      assists.horas_100 !== null &&
      dailyPartMO.hora_100 !== undefined &&
      dailyPartMO.hora_100 !== null
    ) {
      h100 = assists.horas_100 + data.hora_100 - dailyPartMO.hora_100;
    }

    const horas_trabajadas = hp + hn + h60 + h100;
    const assistsFormat = {
      fecha: assists.fecha,
      horas: assists.horas,
      horas_trabajadas,
      hora_parcial: hp,
      hora_normal: hn,
      horas_60: h60,
      horas_100: h100,
      estado_asignacion: assists.estado_asignacion,
      asistencia: assists.asistencia,
      horas_extras_estado: assists.horas_extras_estado,
      mano_obra_id: assists.mano_obra_id,
      proyecto_id: assists.proyecto_id,
    };

    await assistsWorkforceValidation.updateAssists(
      assistsFormat,
      assists.id,
      dailyPartMO.mano_obra_id
    );
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
      const dailyPartMO = dailyPartMOResponse.payload as ParteDiarioMO;

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(
          dailyPartMO.parte_diario_id
        );
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }

      const dailyPart = dailyPartResponse.payload as ParteDiario;

      if (dailyPart.fecha) {
        const date = dailyPart.fecha;
        date?.setUTCHours(0, 0, 0, 0);
        const assistsResponse =
          await assistsWorkforceValidation.findByDateAndWorkforce(
            date,
            dailyPartMO.mano_obra_id
          );

        if (!assistsResponse.success) {
          return httpResponse.BadRequestException(
            "No se encontró la asistencia del día "
          );
        }
        const assists = assistsResponse.payload as Asistencia;
        let hp = 0;
        if (
          dailyPartMO.hora_parcial &&
          dailyPartMO.hora_parcial != null &&
          assists.hora_parcial
        ) {
          hp = assists.hora_parcial - dailyPartMO.hora_parcial;
        }
        let hn = 0;
        if (
          dailyPartMO.hora_normal &&
          dailyPartMO.hora_normal != null &&
          assists.hora_normal
        ) {
          hn = assists.hora_normal - dailyPartMO.hora_normal;
        }
        let h60 = 0;
        if (
          dailyPartMO.hora_60 &&
          dailyPartMO.hora_60 != null &&
          assists.horas_60
        ) {
          h60 = assists.horas_60 - dailyPartMO.hora_60;
        }
        let h100 = 0;
        if (
          dailyPartMO.hora_100 &&
          dailyPartMO.hora_100 != null &&
          assists.horas_100
        ) {
          h100 = assists.horas_100 - dailyPartMO.hora_100;
        }
        const horas_trabajadas = hp + hn + h60 + h100;

        let assistsFormat = {
          fecha: assists.fecha,
          horas: assists.horas,
          horas_trabajadas: horas_trabajadas,
          hora_parcial: hp,
          hora_normal: hn,
          horas_60: h60,
          horas_100: h100,
          estado_asignacion: assists.estado_asignacion,
          asistencia: assists.asistencia,
          horas_extras_estado: assists.horas_extras_estado,
          mano_obra_id: assists.mano_obra_id,
          proyecto_id: assists.proyecto_id,
        };

        const dailyPartsResponseMO =
          await dailyPartMOValidation.findAllForWorkforceIdAndDate(
            dailyPartMO.mano_obra_id,
            dailyPart.fecha
          );

        const dailyPartsMO = dailyPartsResponseMO.payload as ParteDiarioMO[];
        const cuantity = dailyPartsMO.length - 1;
        if (cuantity == 1) {
          assistsFormat.estado_asignacion = E_Estado_Asistencia_BD.ASIGNADO;
        } else if (cuantity == 0) {
          assistsFormat.estado_asignacion = E_Estado_Asistencia_BD.NO_ASIGNADO;
          assistsFormat.asistencia = E_Asistencia_BD.A;
        }

        await assistsWorkforceValidation.updateAssists(
          assistsFormat,
          assists.id,
          dailyPartMO.mano_obra_id
        );
      }

      await prismaDailyPartMORepository.delete(daily_part_mo_id);

      return httpResponse.SuccessResponse(
        "El Parte Diario de la Mano de Obra fue eliminado con éxito"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al eliminar Mano de Obra del Parte Diario",
        error
      );
    }
  }
}
export const dailyPartMOService = new DailyPartMOService();
