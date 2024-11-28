import { TrainReportRepository } from "./trainReport.repository";
import prisma from "../../config/prisma.config";
import { I_CreateReportTrainBD, I_UpdateReportTrainBD } from "./models/trainReport.interface";
import { ReporteAvanceTren, Semana } from "@prisma/client";
import { T_FindAllTrainReport } from "./models/trainReport.types";
import { weekValidation } from "../../week/week.validation";

class PrismaTrainReportRepository implements TrainReportRepository {
  async updateReportsForEjecutedPrevious(report_train_id: number, executed_previous: number):Promise<ReporteAvanceTren | null >{
    const report= await prisma.reporteAvanceTren.update({
      where:{
        id: report_train_id
      },
      data:{
        ejecutado_anterior:executed_previous
      }
    })
    return report;
  }
  async findAll(skip: number, data: T_FindAllTrainReport, project_id: number): Promise<{ reportsTrains: ReporteAvanceTren[]; total: number,week:Semana }> {
    let filters: any = {};
    let week:Semana;
    if (data.queryParams.week) {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      week = weekResponse.payload as Semana;
      filters.semana_id=week.id;
    }else{
      const date= new Date()
      date.setUTCHours(0,0,0,0);
      const weekResponse=await weekValidation.findByDate(date);
      week= weekResponse.payload as Semana
      filters.semana_id=week.id
    }
    const [reportsTrains, total]: [ReporteAvanceTren[], number] = await prisma.$transaction([
      prisma.reporteAvanceTren.findMany({
        where: {
          ...filters,
          Tren:{
            proyecto_id:project_id
          }
        },
        skip,
        take: data.queryParams.limit,
      }),
      prisma.reporteAvanceTren.count({
        where: {
          ...filters,
          Tren:{
            proyecto_id:project_id
          }
        },
      }),
    ]);
    return { reportsTrains, total,week };
  }
  async updateReportsForTrain(report_train_id:number,value: number,day:string,current_executed:number,total:number): Promise<ReporteAvanceTren | null>  {
    const report= await prisma.reporteAvanceTren.update({
      where:{
        id:report_train_id
      },
      data:{
        costo_total:total,
        ejecutado_actual:current_executed,
        parcial:current_executed,
       [day]:value
      }
    })
    return report
  }
  async findByIdTrainAndWeek(train_id: number, week_id: number): Promise<ReporteAvanceTren | null> {
    const train = await prisma.reporteAvanceTren.findFirst({
      where: {
        tren_id: train_id,
        semana_id: week_id
      },
    });
    return train;
  }
  async createReportsForTrain(data: I_CreateReportTrainBD):Promise<ReporteAvanceTren | null>  {
    const report= await prisma.reporteAvanceTren.create({
      data:data
    })
    return report
  }
  async findByIdTrain(train_id: number): Promise<ReporteAvanceTren | null> {
    const train = await prisma.reporteAvanceTren.findFirst({
      where: {
        tren_id: train_id,
      },
    });
    return train;
  }
}

export const prismaTrainReportRepository = new PrismaTrainReportRepository();
