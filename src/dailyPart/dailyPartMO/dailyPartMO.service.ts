import {
  Asistencia,
  DetallePrecioHoraMO,
  DetalleSemanaProyecto,
  E_Asistencia_BD,
  E_Estado_Asistencia_BD,
  E_Etapa_Parte_Diario,
  ParteDiario,
  ParteDiarioMO,
  PrecioHoraMO,
  ReporteAvanceTren,
  Semana,
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
  I_DailyPartWorkforceId,
  I_DailyPartWorkforcePdf,
  I_UpdateDailyPartBody,
} from "./models/dailyPartMO.interface";
import { detailWeekProjectValidation } from "../../week/detailWeekProject/detailWeekProject.validation";
import { trainReportValidation } from "../../train/trainReport/trainReport.validation";
import { calculateTotalNew, obtenerCampoPorDia } from "../../common/utils/day";
import { priceHourWorkforceValidation } from "../../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { detailPriceHourWorkforceValidation } from "../../workforce/detailPriceHourWorkforce/detailPriceHourWorkforce.validation";
import { weekValidation } from "../../week/week.validation";
import { envConfig } from "../../config/env.config";
import path from "path";
import { fork } from "child_process";
import { I_ParteDiarioId } from "../models/dailyPart.interface";

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

      if (
        dailyPart.etapa === E_Etapa_Parte_Diario.TERMINADO ||
        dailyPart.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

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
            assist.estado_asignacion === E_Estado_Asistencia_BD.ASIGNADO &&
            assist.fecha.getTime() === dailyPart.fecha?.getTime()
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
        project_id,
        dailyPart.fecha
      );

      if (idsMOInStateAssigned.length > 0) {
        await assistsWorkforceValidation.updateManyAsignedX2(
          idsMOInStateAssigned,
          project_id,
          dailyPart.fecha
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
      // const projectResponse = await projectValidation.findById(project_id);

      // if (!projectResponse.success) {
      //   return projectResponse;
      // }

      // const dailyPartResponse =
      //   await dailyPartReportValidation.findByIdValidation(daily_part_id);
      // if (!dailyPartResponse.success) {
      //   return dailyPartResponse;
      // }

      const dailyPartMOResponse = await dailyPartMOValidation.findById(
        daily_part_mo_id
      );
      if (!dailyPartMOResponse.success) {
        return dailyPartMOResponse;
      }

      const dailyPartMO = dailyPartMOResponse.payload as I_DailyPartWorkforceId;

      // const dailyPart = dailyPartResponse.payload as ParteDiario;

      if (dailyPartMO.ParteDiario.proyecto_id != project_id) {
        return httpResponse.BadRequestException(
          "El id ingresado del Proyecto no es igual al del Parte Diario"
        );
      }
      if (dailyPartMO.ParteDiario.id != daily_part_id) {
        return httpResponse.BadRequestException(
          "El id ingresado del Parte Diario no es igual al del Parte Diario MO"
        );
      }

      if (
        dailyPartMO.ParteDiario.etapa === E_Etapa_Parte_Diario.TERMINADO ||
        dailyPartMO.ParteDiario.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

      const updateDailyPartMOFormat = {
        hora_parcial: data.hora_parcial,
        hora_normal: data.hora_normal,
        hora_60: data.hora_60,
        hora_100: data.hora_100,
        parte_diario_id: dailyPartMO.ParteDiario.id,
        mano_obra_id: dailyPartMO.mano_obra_id,
        proyecto_id: project_id,
      };

      const updateDailyPartMO =
        await prismaDailyPartMORepository.updateDailyPartMO(
          updateDailyPartMOFormat,
          daily_part_mo_id
        );

      await this.updateAssistsIfValid(
        dailyPartMO.ParteDiario,
        dailyPartMO,
        data,
        dailyPartMO.ParteDiario.Trabajo.tren_id
      );

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

  async updateAssistsIfValid(
    dailyPart: ParteDiario,
    dailyPartMO: I_DailyPartWorkforceId,
    data: I_UpdateDailyPartBody,
    train_id: number
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
        dailyPartMO.mano_obra_id,
        dailyPart.proyecto_id
      );
    if (!assistsResponse.success) {
      return assistsResponse;
    }
    const assists = assistsResponse.payload as Asistencia;
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

    const route = envConfig.DEV
      ? path.join(__dirname, "../../scripts/dailyPartMO.ts")
      : path.join(__dirname, "../../scripts/dailyPartMO.js");
    const scriptPath = route;

    const day = obtenerCampoPorDia(dailyPart.fecha);
    const child = fork(scriptPath, [
      String(date),
      String(train_id),
      JSON.stringify(dailyPart),
      JSON.stringify(dailyPartMO),
      JSON.stringify(assists),
      String(hn),
      String(h60),
      String(h100),
      day,
    ]);

    child.on("exit", (code) => {
      console.log(`El proceso hijo terminó con el código ${code}`);
    });

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
      const dailyPartMO = dailyPartMOResponse.payload as I_DailyPartWorkforceId;

      if (
        dailyPartMO.ParteDiario.etapa === E_Etapa_Parte_Diario.TERMINADO ||
        dailyPartMO.ParteDiario.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

      if (dailyPartMO.ParteDiario.fecha) {
        const date = dailyPartMO.ParteDiario.fecha;
        date?.setUTCHours(0, 0, 0, 0);
        const assistsResponse =
          await assistsWorkforceValidation.findByDateAndWorkforce(
            date,
            dailyPartMO.mano_obra_id,
            dailyPartMO.ParteDiario.proyecto_id
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
            dailyPartMO.ParteDiario.fecha
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

        const weekResponse = await weekValidation.findByDate(
          dailyPartMO.ParteDiario.fecha
        );
        if (weekResponse.success) {
          const week = weekResponse.payload as Semana;

          const reportTrainResponse =
            await trainReportValidation.findByIdTrainAndWeek(
              dailyPartMO.ParteDiario.Trabajo.tren_id,
              week.id
            );

          if (reportTrainResponse.success) {
            const day = obtenerCampoPorDia(dailyPartMO.ParteDiario?.fecha);
            const reportTrain =
              reportTrainResponse.payload as ReporteAvanceTren;

            const priceHourResponse =
              await priceHourWorkforceValidation.findByDate(
                dailyPartMO.ParteDiario.fecha
              );
            if (priceHourResponse.success) {
              const priceHourMO = priceHourResponse.payload as PrecioHoraMO;
              const detailsPriceHourMOResponse =
                await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
                  priceHourMO.id
                );
              const detailsPriceHourMO =
                detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];
              if (dailyPartMO.ManoObra.CategoriaObrero?.id != null) {
                const detail = detailsPriceHourMO.find(
                  (element) =>
                    element.categoria_obrero_id ===
                    dailyPartMO.ManoObra.CategoriaObrero?.id
                );
                if (
                  detail?.hora_normal != null &&
                  detail?.hora_extra_60 != null &&
                  detail?.hora_extra_100 != null &&
                  dailyPartMO.hora_normal != null &&
                  dailyPartMO.hora_60 != null &&
                  dailyPartMO.hora_100 != null
                ) {
                  const subtract =
                    detail?.hora_normal * dailyPartMO.hora_normal +
                    detail?.hora_extra_60 * dailyPartMO.hora_60 +
                    detail?.hora_extra_100 * dailyPartMO.hora_100;

                  const totalAdd = reportTrain[day] - subtract;
                  const totalDay = reportTrain[day] - subtract;
                  let current_executed = 0;
                  current_executed = calculateTotalNew(
                    day,
                    reportTrain,
                    totalDay
                  );
                  const total =
                    current_executed - reportTrain.ejecutado_anterior;
                  await trainReportValidation.update(
                    reportTrain.id,
                    totalAdd,
                    day,
                    current_executed,
                    total
                  );
                }
              }
            }
          }
        }
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

  async deleteAllMOForDailyPart(
    daily_part: I_ParteDiarioId
  ): Promise<number> {
    let sumaSubtract = 0;

    if (daily_part.fecha) {
      console.log("entramos a eliminar la mano de obra")
      //acá me traigo todos los partes diarios de MO
      const result =
        await prismaDailyPartMORepository.findAllWithOutPaginationForIdDailysPart(
          daily_part.id
        );

      if (result != null && result.length > 0) {
        const priceHourResponse = await priceHourWorkforceValidation.findByDate(
          daily_part.fecha
        );
        if (priceHourResponse.success) {
          const priceHourMO =
            priceHourResponse.payload as I_DailyPartWorkforcePdf;
          const detailsPriceHourMOResponse =
            await detailPriceHourWorkforceValidation.findAllByIdPriceHour(
              priceHourMO.id
            );
          const detailsPriceHourMO =
            detailsPriceHourMOResponse.payload as DetallePrecioHoraMO[];

          if(detailsPriceHourMO.length >0){
            console.log("ya pase detalle ")
            result.forEach((element) => {
              const categoriaId = element.ManoObra?.CategoriaObrero?.id;
              if (categoriaId != null) {
                const detail = detailsPriceHourMO.find(
                  (detail) => detail.categoria_obrero_id === categoriaId
                );
  
                if (
                  detail &&
                  element.hora_normal != null &&
                  element.hora_60 != null &&
                  element.hora_100 != null
                ) {
                   sumaSubtract +=
                    detail?.hora_normal * element.hora_normal +
                    detail?.hora_extra_60 * element.hora_60 +
                    detail?.hora_extra_100 * element.hora_100;
                }
              }
            });
          }
          
        }

        //acá hago para desccontar la asistencia
        const assistsReponse =
          await assistsWorkforceValidation.findAllWithOutPaginationByDateAndProject(
            daily_part.fecha,
            daily_part.proyecto_id
          );
        const assists= assistsReponse.payload as Asistencia[]
        const actualizaciones: { id: number; data: any }[] = [];

        if (assistsReponse.success && assists.length>0) {
          
          for (const workforceOfTheDailyMO of result) {
            
          const assistWorkforce= assists.find(
            (assist) => assist.mano_obra_id === workforceOfTheDailyMO.mano_obra_id
          );

          if(assistWorkforce && assistWorkforce != null && assistWorkforce.hora_normal != null && workforceOfTheDailyMO.hora_normal && 
            assistWorkforce.horas_60 != null && workforceOfTheDailyMO.hora_60 && 
            assistWorkforce.horas_100 != null && workforceOfTheDailyMO.hora_100 &&
            assistWorkforce.hora_parcial != null && workforceOfTheDailyMO.hora_parcial 
          ){
            let hP = assistWorkforce.hora_parcial - workforceOfTheDailyMO.hora_parcial;
            let hn = assistWorkforce.hora_normal - workforceOfTheDailyMO.hora_normal;
            let h60 = assistWorkforce.horas_60 - workforceOfTheDailyMO.hora_60;
            let h100 = assistWorkforce.horas_100 - workforceOfTheDailyMO.hora_100;
            let estado_asignacion:E_Estado_Asistencia_BD= assistWorkforce.estado_asignacion;
            let asistencia:E_Asistencia_BD= assistWorkforce.asistencia;
            let horas_trabajadas= hP + hn+ h60 + h100;
            if(assistWorkforce.estado_asignacion === E_Estado_Asistencia_BD.DOBLEMENTE_ASIGNADO){
              estado_asignacion= E_Estado_Asistencia_BD.ASIGNADO
            }else if(assistWorkforce.estado_asignacion === E_Estado_Asistencia_BD.ASIGNADO){
              estado_asignacion= E_Estado_Asistencia_BD.NO_ASIGNADO
            }
            actualizaciones.push({
              id: assistWorkforce.id,
              data: {
                horas_trabajadas   :horas_trabajadas,
                hora_parcial       : hP,
                hora_normal        : hn,
                horas_60           : h60,
                horas_100          : h100,
                estado_asignacion  : estado_asignacion,
                asistencia         : asistencia,
              },
            });
          }
          }

        }

        if (actualizaciones.length > 0) {
          await Promise.all(
            actualizaciones.map((asists) =>
              prisma.asistencia.update({
                where: { id: asists.id },
                data: asists.data,
              })
            )
          );
        }
      }

      return sumaSubtract;
    }
    return sumaSubtract;

  }
}
export const dailyPartMOService = new DailyPartMOService();
