import {
  DetalleSemanaProyecto,
  E_Etapa_Parte_Diario,
  ParteDiario,
  ParteDiarioRecurso,
  Recurso,
  ReporteAvanceTren,
} from "@prisma/client";
import { httpResponse, T_HttpResponse } from "../../common/http.response";
import prisma from "../../config/prisma.config";
import { projectValidation } from "../../project/project.validation";
import { resourceValidation } from "../../resources/resources.validation";
import { dailyPartReportValidation } from "../dailyPart.validation";
import { dailyPartResourceValidation } from "./dailyPartResources.validation";
import { T_FindAllDailyPartResource } from "./models/dailyPartResource.types";
import {
  I_CreateDailyPartResourceBody,
  I_DailyPartResource,
  I_UpdateDailyPartResourceBody,
} from "./models/dailyPartResources.interface";
import { prismaDailyPartResourceRepository } from "./prisma-dailyPartRepository.repository";
import { detailWeekProjectValidation } from "../../week/detailWeekProject/detailWeekProject.validation";
import { trainReportValidation } from "../../train/trainReport/trainReport.validation";
import { obtenerCampoPorDia } from "../../common/utils/day";
import { priceHourWorkforceValidation } from "../../workforce/priceHourWorkforce/priceHourWorkforce.valdation";
import { I_Resources } from "../../resources/models/resources.interface";

class DailyPartResourceService {
  async createDailyPart(
    data: I_CreateDailyPartResourceBody,
    project_id: number,
    daily_part_id: number
  ): Promise<T_HttpResponse> {
    try {
      const resultIdProject = await projectValidation.findById(project_id);
      if (!resultIdProject.success) {
        return httpResponse.BadRequestException(
          "No se puede crear el Parte Diario con el id del Proyecto proporcionado"
        );
      }

      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);

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

      const resourcesIdsResponse = await resourceValidation.findManyId(
        data.resources_id,
        project_id
      );
      if (!resourcesIdsResponse.success) {
        return resourcesIdsResponse;
      }

      await prismaDailyPartResourceRepository.createDailyPartResources(
        data.resources_id,
        project_id,
        daily_part_id
      );

      return httpResponse.CreatedResponse(
        "Parte Diario del Recurso creados correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al crear el Parte Diario del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async updateDailyPartResource(
    data: I_UpdateDailyPartResourceBody,
    project_id: number,
    daily_part_resource_id: number
  ): Promise<T_HttpResponse> {
    try {
      // const resultIdProject = await projectValidation.findById(project_id);
      // if (!resultIdProject.success) {
      //   return httpResponse.BadRequestException(
      //     "No se puede crear el Parte Diario con el id del Proyecto proporcionado"
      //   );
      // }

      const dailyPartResourceResponse =
        await dailyPartResourceValidation.findById(daily_part_resource_id);

      if (!dailyPartResourceResponse.success) {
        return dailyPartResourceResponse;
      }

      const dailyPartResource =
        dailyPartResourceResponse.payload as I_DailyPartResource;

      if (
        dailyPartResource.ParteDiario.etapa ===
          E_Etapa_Parte_Diario.TERMINADO ||
        dailyPartResource.ParteDiario.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

      if(dailyPartResource.proyecto_id != project_id){
        return httpResponse.BadRequestException("El id ingresado del Proyecto no pertenece al Part")
      }

      const resourceResponse = await resourceValidation.findById(
        data.resource_id
      );

      if (!resourceResponse.success) {
        return resourceResponse;
      }

      const resource= resourceResponse.payload as I_Resources;

      const dailyPartResouceFormat = {
        parte_diario_id: dailyPartResource.parte_diario_id,
        recurso_id: data.resource_id,
        cantidad: data.amount,
        proyecto_id: project_id,
      };

      const dailyPartResourceUpdate =
        await prismaDailyPartResourceRepository.updateDailyPartResources(
          dailyPartResouceFormat,
          daily_part_resource_id
        );

      // const date=new Date();
      // date.setUTCHours(0,0,0,0);
      // const detailWeekProjectResponse =
      //   await detailWeekProjectValidation.findByDateAndProject(
      //     date,
      //     dailyPartResource.proyecto_id
      //   );

      // if(detailWeekProjectResponse){
      //   const detailWeekReponse =
      //   detailWeekProjectResponse.payload as DetalleSemanaProyecto;
      // const reportTrainResponse =
      //   await trainReportValidation.findByIdTrainAndWeek(
      //     dailyPartResource.Proyecto.Trabajo.tren_id,
      //     detailWeekReponse.semana_id
      //   );
      //   if(reportTrainResponse.success){
      //     if(dailyPartResource.ParteDiario.fecha){
      //       const day = obtenerCampoPorDia(dailyPartResource.ParteDiario?.fecha);
      //       const reportTrain = reportTrainResponse.payload as ReporteAvanceTren;
      //       if(resource.CategoriaRecurso.nombre.toUpperCase()==="MATERIALES"){
      //        const price= dailyPartResource.
      //       }else if(resource.CategoriaRecurso.nombre.toUpperCase()==="EQUIPOS"){

      //       }else if(resource.CategoriaRecurso.nombre.toUpperCase()==="MANO DE OBRA"){

      //       }else if(resource.CategoriaRecurso.nombre.toUpperCase()==="SUB-CONTRATAS"){

      //       }else if(resource.CategoriaRecurso.nombre.toUpperCase()==="MATERIALES"){

      //       }
      //     }
      //   }
      // }

      return httpResponse.CreatedResponse(
        "Parte Diario del Recurso actualizado correctamente",
        dailyPartResourceUpdate
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al actualizar el Parte Diario del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async findAll(
    data: T_FindAllDailyPartResource,
    project_id: string,
    daily_part_id: number
  ) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }
      if (!data.queryParams.category) {
        return httpResponse.BadRequestException("Debe pasar una Categoria");
      }
      const dailyPartResponse =
        await dailyPartReportValidation.findByIdValidation(daily_part_id);
      if (!dailyPartResponse.success) {
        return dailyPartResponse;
      }
      const result = await prismaDailyPartResourceRepository.findAll(
        skip,
        data,
        +project_id,
        daily_part_id
      );

      const { dailyPartsResources, total } = result;
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: dailyPartsResources,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Partes Diarios de Recursos",
        formData
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los los Partes Diarios de Recursos",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteDailyPartResource(
    daily_part_resource_id: number
  ): Promise<T_HttpResponse> {
    try {
      const dailyPartResourceResponse =
        await dailyPartResourceValidation.findById(daily_part_resource_id);

      if (!dailyPartResourceResponse.success) {
        return dailyPartResourceResponse;
      }

      const dailyPartResource =
        dailyPartResourceResponse.payload as I_DailyPartResource;

      if (
        dailyPartResource.ParteDiario.etapa ===
          E_Etapa_Parte_Diario.TERMINADO ||
        dailyPartResource.ParteDiario.etapa === E_Etapa_Parte_Diario.INGRESADO
      ) {
        return httpResponse.BadRequestException(
          "Por la etapa del Parte Diario, no se puede modificar"
        );
      }

      await prismaDailyPartResourceRepository.delete(daily_part_resource_id);
      return httpResponse.SuccessResponse(
        "Elemento del Parte Diario del Recurso eliminado correctamente"
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al querer eliminar el elemento del Parte Diario del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
  async findById(daily_part_resource_id: number): Promise<T_HttpResponse> {
    try {
      const dailyPartResourceResponse =
        await dailyPartResourceValidation.findById(daily_part_resource_id);

      if (!dailyPartResourceResponse.success) {
        return dailyPartResourceResponse;
      }

      const dailyPartResource =
        await prismaDailyPartResourceRepository.findById(
          daily_part_resource_id
        );
      return httpResponse.SuccessResponse(
        "Elemento del Parte Diario del Recurso encontrado correctamente",
        dailyPartResource
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al querer buscar el elemento del Parte Diario del Recurso",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}

export const dailyPartResourceService = new DailyPartResourceService();
