import { httpResponse } from "../../common/http.response";
import { projectValidation } from "../../project/project.validation";
import { T_FindAllTrainReport } from "./models/trainReport.types";
import { prismaTrainReportRepository } from "./prisma-trainReport.repository";
import { I_ProjectForID } from "../../project/models/project.interface";
import prisma from "../../config/prisma.config";
import { weekValidation } from "../../week/week.validation";
import { Semana } from "@prisma/client";
import { obtenerCampoPorDia } from "../../common/utils/day";

class TrainReportService {
  async findAll(data: T_FindAllTrainReport, project_id: string) {
    try {
      const skip = (data.queryParams.page - 1) * data.queryParams.limit;
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const project = projectResponse.payload as I_ProjectForID;
      if (data.queryParams.week) {
        const weekOfTheYear = Array.from({ length: 52 }, (v, i) =>
          String(i + 1).padStart(2, "0")
        );
        const week = data.queryParams.week as string;
        const result = week.split(".");
        const dayWeek = result[1];
        if (!weekOfTheYear.includes(dayWeek)) {
          return httpResponse.BadRequestException(
            "No existe la semana que ha pasado"
          );
        }
      }
      const result = await prismaTrainReportRepository.findAll(
        skip,
        data,
        project.id
      );

      const { reportTrainsFix, total, week,reportsTrainsSecondOption,totalSecondOption } = result;
      if (reportTrainsFix.length === 0) {
        const pageCount = Math.ceil(totalSecondOption / data.queryParams.limit);
        const formData = {
          total:totalSecondOption,
          page: data.queryParams.page,
          // x ejemplo 20
          limit: data.queryParams.limit,
          //cantidad de paginas que hay
          pageCount,
          data: reportsTrainsSecondOption,
        };
        return httpResponse.SuccessResponse(
          "Éxito al traer todos los Reporte de los Trenes",
          formData
        );
      }
      const pageCount = Math.ceil(total / data.queryParams.limit);
      const formData = {
        total,
        page: data.queryParams.page,
        // x ejemplo 20
        limit: data.queryParams.limit,
        //cantidad de paginas que hay
        pageCount,
        data: reportTrainsFix,
      };
      return httpResponse.SuccessResponse(
        "Éxito al traer todos los Reporte de los Trenes",
        formData
      );
    } catch (error) {
      console.log(error);
      return httpResponse.InternalServerErrorException(
        "Error al traer todas los Reporte de los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

  async getInformation(project_id: number) {
    try {
      const projectResponse = await projectValidation.findById(+project_id);
      if (!projectResponse.success) {
        return projectResponse;
      }

      const date= new Date();
      date.setUTCHours(0,0,0,0);
      const weekResponse = await weekValidation.findByDate(date);
      let sumToday=0;
      let sumPrevious=0;
      let sumTotal=0;
      let sumWeek=0;
      const day = obtenerCampoPorDia(date);
      if(weekResponse.success){
        const week= weekResponse.payload as Semana;
        const informationReportTrainResponse= await prismaTrainReportRepository.getInformationForWeekAndProject(week.id,project_id)
        if(informationReportTrainResponse != null && informationReportTrainResponse?.length>0){
          informationReportTrainResponse.forEach((element)=>{
            if (element[day] != null) {
              sumToday += element[day]; 
            }
            sumWeek +=
            element.lunes +
            element.martes +
            element.miercoles +
            element.jueves +
            element.viernes +
            element.sabado +
            element.domingo;
            sumPrevious += element.ejecutado_anterior
            console.log("el costo total q se suma es "+element.costo_total)
            sumTotal += element.costo_total
          })
        }
      }
      const dataFormat= {
        ejecutado_anterior_total:sumPrevious,
        ejecutado_actual_total:sumToday,
        ejecutado_total:sumTotal,
        ejecutado_produccion_semana:sumWeek,
      }  

  
      return httpResponse.SuccessResponse(
        "Éxito al traer la información de todos los Reporte de los Trenes",
        dataFormat
      );
    } catch (error) {
      return httpResponse.InternalServerErrorException(
        "Error al traer la información de todos los Reporte de los Trenes",
        error
      );
    } finally {
      await prisma.$disconnect();
    }
  }

}

export const trainReportService = new TrainReportService();
