import { TrainReportRepository } from "./trainReport.repository";
import prisma from "../../config/prisma.config";
import {
  I_CreateReportTrainBD,
  I_ReportTrain,
  I_UpdateReportTrainBD,
} from "./models/trainReport.interface";
import { ReporteAvanceTren, Semana } from "@prisma/client";
import { T_FindAllTrainReport } from "./models/trainReport.types";
import { weekValidation } from "../../week/week.validation";

class PrismaTrainReportRepository implements TrainReportRepository {
  async getInformationForWeekAndProject(
    week_id: number,
    project_id: number
  ): Promise<ReporteAvanceTren[] | null> {
    const reportTrainNow = await prisma.reporteAvanceTren.findMany({
      where: {
        semana_id: week_id,
        Tren: {
          proyecto_id: project_id,
        },
      },
    });
    return reportTrainNow;
  }
  async updateReportsForEjecutedPrevious(
    report_train_id: number,
    executed_previous: number
  ): Promise<ReporteAvanceTren | null> {
    const report = await prisma.reporteAvanceTren.update({
      where: {
        id: report_train_id,
      },
      data: {
        ejecutado_anterior: executed_previous,
      },
    });
    return report;
  }
  async findAll(
    skip: number,
    data: T_FindAllTrainReport,
    project_id: number
  ): Promise<{
    reportTrainsFix: I_ReportTrain[];
    total: number;
    week: Semana;
    reportsTrainsSecondOption: I_ReportTrain[],
    totalSecondOption:number
  }> {
    let filters: any = {};
    let week: Semana;
    if (data.queryParams.week) {
      const weekResponse = await weekValidation.findByCode(
        data.queryParams.week
      );
      week = weekResponse.payload as Semana;
      filters.semana_id = week.id;
    } else {
      const date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      const weekResponse = await weekValidation.findByDate(date);
      week = weekResponse.payload as Semana;
      filters.semana_id = week.id;
    }
    const reportsTrains =await prisma.reporteAvanceTren.findMany({
          where: {
            ...filters,
            Tren: {
              proyecto_id: project_id,
            },
          },
          include:{
            Tren:true
          },
          skip,
          take: data.queryParams.limit,
          orderBy:{
            Tren:{
              codigo:"asc"
            }
          }
        })
   const total= await prisma.reporteAvanceTren.count({
          where: {
            ...filters,
            Tren: {
              proyecto_id: project_id,
            },
          },
        })

 
      const reportTrainsFix = reportsTrains.map((report) => ({
        id_tren: report.Tren?.codigo, 
        tren: report.Tren?.nombre,
        costo_total: report.costo_total,
        ejecutado_anterior: report.ejecutado_anterior,
        ejecutado_actual: report.ejecutado_actual,
        saldo: report.ejecutado_anterior + report.ejecutado_actual - report.costo_total, 
        lunes: report.lunes,
        martes: report.martes,
        miercoles: report.miercoles,
        jueves: report.jueves,
        viernes: report.viernes,
        sabado: report.sabado,
        domingo: report.domingo,
        parcial: report.parcial,
      }));


    let reportsTrainsSecondOption: any[] = [];
    let totalSecondOption:number=0
    if (reportsTrains.length === 0) {
      const trains = await prisma.tren.findMany({
        where: {
          proyecto_id: project_id,
        },
        skip,
        take: data.queryParams.limit,
        orderBy:{
          codigo:"asc"
        }
      });

      totalSecondOption= await prisma.tren.count({
        where: {
            proyecto_id: project_id,
        },
      })

      reportsTrainsSecondOption = trains.map((train) => ({
        id_tren: train.codigo, 
        tren: train.nombre,
        costo_total: 0,
        ejecutado_anterior: 0,
        ejecutado_actual: 0,
        saldo: 0,
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
        domingo: 0,
        parcial: 0,
        semana_id: week.codigo,
      }));
    }

    return { reportTrainsFix, total, week,reportsTrainsSecondOption,totalSecondOption};
  }
  async updateReportsForTrain(
    report_train_id: number,
    value: number,
    day: string,
    current_executed: number,
    total: number
  ): Promise<ReporteAvanceTren | null> {
    const report = await prisma.reporteAvanceTren.update({
      where: {
        id: report_train_id,
      },
      data: {
        costo_total: total,
        ejecutado_actual: current_executed,
        parcial: current_executed,
        [day]: value,
      },
    });
    return report;
  }
  async findByIdTrainAndWeek(
    train_id: number,
    week_id: number
  ): Promise<ReporteAvanceTren | null> {
    const train = await prisma.reporteAvanceTren.findFirst({
      where: {
        tren_id: train_id,
        semana_id: week_id,
      },
    });
    return train;
  }
  async createReportsForTrain(
    data: I_CreateReportTrainBD
  ): Promise<ReporteAvanceTren | null> {
    const report = await prisma.reporteAvanceTren.create({
      data: data,
    });
    return report;
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
